import React, { Component } from "react";
import { connect } from "react-redux";
import { getSeasonResults } from "../../actions/index";
import store from "../../store";
import * as d3 from "d3";
import "../../index.css";
import "../../slider.scss";
import $ from "jquery";
import { color, interpolateRainbow, pointRadial } from "d3";
class Seasons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      races: [],
      year: 2019
    };
    this.handleChange = this.handleChange.bind(this);
  }
  getResults(year) {
    this.props.getSeasonResults(year);
  }
  componentDidMount() {
    this.getResults(this.state.year);
    this.unsubscribe = store.subscribe(() => {
      let temp = store.getState().season_results.season_results;

      this.setState({ races: temp }, this.createChart(temp));
    });
    this.createSlider();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  processResults(results) {
    let temp = {};
    let tracks = [];
    let drivers = {};

    results.forEach(item => {
      let id = item.driver.id;
      let name = item.driver.surname;

      let points = item.points;
      let circuit = "";
      if (item.race.url.includes("West")) {
        circuit = "US_West";
      } else {
        circuit = item.race.url
          .split("/")
          .slice(-1)[0]
          .split("_")[1];
      }
      if (!tracks.includes(circuit)) tracks.push(circuit);
      if (!Object.values(drivers).includes(id))
        drivers[id] = { name, constructor: item.constructor.id };
      if (temp[id] == null) {
        temp[id] = {
          name,
          constructor: item.constructor.id,
          results: [
            {
              circuit,
              points
            }
          ]
        };
      } else {
        let currentPoints = temp[id].results.slice(-1)[0].points;

        let check = temp[id].results.filter(index => index.circuit == circuit);
        if (!Object.entries(check).length != 0) {
          temp[id].results.push({
            circuit,
            points: item.points + currentPoints
          });
        }
      }
    });

    return [temp, tracks, drivers];
  }
  mapOrder(array, order, key) {
    array.sort(function(a, b) {
      var A = a[key],
        B = b[key];

      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
    });

    return array;
  }
  getConstructorColor(id) {
    if (id == 1) return "#FF8700";
    else if (id == 131) return "#00D2BE";
    else if (id == 51) return "#9B0000";
    else if (id == 3) return "#FFFFFF";
    else if (id == 6) return "#DC0000";
    else if (id == 4) return "#FFF500";
    else if (id == 5) return "#469BFF";
    else if (id == 9) return "#1E41FF";
    else if (id == 210) return "#F0D787";
    else if (id == 211) return "#F596C8";
    else
      var colorScale = d3
        .scaleSequential(interpolateRainbow) //.scaleSequential(d3.interpolateRainbow)
        .domain([1, 20]);
    return colorScale(id);
  }
  createChart(results) {
    $("#chart").empty();

    var margin = { top: 20, right: 60, bottom: 30, left: 60 },
      width = window.innerWidth * 0.8 - margin.left - margin.right,
      height = window.innerHeight - 150 - margin.top - margin.bottom;

    var x = d3.scalePoint().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // define the 1st line

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let temp = this.processResults(results);
    let data = temp[0];

    let circuits = temp[1];

    Object.values(temp[2]).forEach(element => {
      $("#driversList").append(
        "<div style='margin:5px;width:60px;display:inline-block;'><span style='margin-right:5px;background:" +
          this.getConstructorColor(element.constructor) +
          ";width:20px;height:20px;border-radius:50%;display:inline-block;'></span><li style='display:inline-block;font-size:0.8em;'>" +
          element.name.slice(0, 3) +
          "</li><br/></div>"
      );
    });
    let maxItem = [];
    Object.values(data).forEach(item => {
      let temp1 = Object.values(item.results);

      circuits.forEach(circuit => {
        let flag = false;
        for (let i = 0; i < temp1.length; i++) {
          if (temp1[i].circuit == circuit) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          item.results.push({ circuit, points: 0 });
        }
      });

      let newArr = this.mapOrder(item.results, circuits, "circuit");
      item.results = newArr;

      let temp = Object.values(item.results).map(xd => xd.points);
      maxItem.push(d3.max(temp));
    });
    Object.values(data).forEach(item => {
      item.results.forEach((res, i) => {
        if (i != 0) {
          if (res.points == 0) {
            item.results[i].points = item.results[i - 1].points;
          }
        }
      });
    });

    // Scale the range of the data
    x.domain(circuits);
    y.domain([
      0,
      d3.max(maxItem)
      // d3.max(data, function(d) {
      //   return Math.max(+d.points);
      // })
    ]);

    Object.values(data).forEach((item, i) => {
      var valueline = d3
        .line()
        .x(function(d) {
          return x(d.circuit);
        })
        .y(function(d) {
          return y(+d.points);
        });

      var colorScale = d3
        .scaleSequential(interpolateRainbow) //.scaleSequential(d3.interpolateRainbow)
        .domain([1, 20]);

      let color = this.getConstructorColor(item.constructor);
      svg
        .append("path")
        .data([item.results])
        .attr("class", "line")
        .style("stroke", color)
        .attr("d", valueline);

      var xScale = d3
        .scaleLinear()
        .domain([0, item.results.length - 1]) // input
        .range([0, width]); // output

      var div = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
      svg
        .selectAll(".dot-" + i)
        .data(item.results)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("fill", color)
        .attr("driver", item.name)
        .attr("points", function(d) {
          return d.points;
        })
        .attr("r", 5) // Assign a class for styling
        .attr("cx", function(d, i) {
          return xScale(i);
        })
        .attr("cy", function(d, i) {
          return y(d.points);
        })
        .on("mouseover", function(d) {
          let text = "";
          let tmp = [];
          $("circle").each((index, tempItem) => {
            if (
              $(tempItem).attr("cx") == $(this).attr("cx") &&
              Math.abs(
                parseInt($(tempItem).attr("cy")) - parseInt($(this).attr("cy"))
              ) < 30
            ) {
              tmp.push({
                driver: $(tempItem).attr("driver"),
                points: $(tempItem).attr("points")
              });
            }
          });
          tmp
            .sort((a, b) => (a.points < b.points ? 1 : -1))
            .forEach(el => {
              text += el.driver + ": " + el.points + "<br/>";
            });
          let textColor = "white";
          if (parseInt(color.slice(1), 16) > 15183815) {
            textColor = "black";
          }
          div
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          div
            .html(text)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px")
            .style("width", "auto")
            .style("text-align", "center")
            .style("background", color)
            .style("color", textColor)
            .style("height", "auto");
        })
        .on("mouseout", function(d) {
          div
            .transition()
            .duration(500)
            .style("opacity", 0);
        });
    });
    // Add the X Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add the Y Axis
    svg.append("g").call(d3.axisLeft(y));
  }

  createSlider() {
    var slider = $(".range-slider"),
      range = $(".range-slider__range"),
      value = $(".range-slider__value");

    slider.each(function() {
      value.each(function() {
        var value = $(this)
          .prev()
          .attr("value");
        $(this).html(value);
      });

      range.on("input", function() {
        $(this)
          .next(value)
          .html(this.value);
      });
    });
  }
  handleSubmit(year) {
    this.getResults(year);
    this.unsubscribe = store.subscribe(() => {
      let temp = store.getState().season_results.season_results;
      $(".clearThis").empty();
      this.setState({ races: temp }, this.createChart(temp));
    });
  }
  handleChange(e) {
    this.setState({ year: e.target.value }, this.handleSubmit(e.target.value));
  }
  render() {
    return (
      <div>
        <div className="row ">
          <div className="col-2">
            <ul
              id="driversList"
              style={{
                listStyleType: "none",
                columnWidth: "3em",
                width: "100%"
              }}
              className="mt-5 clearThis"
            ></ul>
          </div>
          <div className="col-10">
            <div id="chart"></div>
            <div className="range-slider">
              <div className="container">
                <input
                  className="range-slider__range"
                  type="range"
                  defaultValue="2019"
                  min="1958"
                  max="2019"
                  onChange={this.handleChange}
                />
                <span className="range-slider__value">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  season_results: state.season_results
});

export default connect(mapStateToProps, { getSeasonResults })(Seasons);
