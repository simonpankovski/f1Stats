import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../actions";
import $ from "jquery";
import * as d3 from "d3";
import "./pie_chart.css";
import axios from "axios";
import cheerio from "cheerio";
import store from "../../store";
import ReactHtmlParser from "react";
class Circuit_result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      info: "",
      years: []
    };
  }
  componentDidMount() {
    this.props.getResultsByCircuit(this.props.match.params.id);

    this.unsubscribe = store.subscribe(() => {
      let temp = store.getState().circuit_result.circuit_results;
      let positions = this.countPositionsGained(temp.res);
      let tmp = this.removeNullFromResults(temp.res);
      let years = this.getYearsList(temp).sort((a, b) => {
        if (a < b) return 1;
        else return -1;
      });
      this.setState({ years });
      let driver = this.getDriverNameAndMaxSpeedAndYear(tmp[1]);
      this.createPieChart(temp, this.props.location.state.name);
      this.createSecondPieChart(positions);

      if (Object.entries(tmp[0]).length > 0) {
        let xd = `<div class="card">
        <div class="card-body" style='height: 400px;'>
          
            <span style='margin-top: 20px;'>
              ${driver[0]} with an average speed of ${driver[1]} kph
            </span>
          
          <div id="my_dataviz"></div>
        </div>
      </div>`;
        $("#appendHere").html(xd);
        this.createChart(tmp[0]);
      }
      //this.setState({ races: res }, this.createChart(res));
    });
    this.getWiki(this.props.location.state.name);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  getWiki(circuit) {
    axios
      .post("http://localhost:9090/users/login", {
        username: "test1@gmail.com",
        password: "password"
      })
      .then(login =>
        axios
          .get("http://localhost:9090/results/image/" + circuit, {
            headers: { Authorization: login.data.token }
          })
          .then(res => {
            const a = cheerio.load(res.data.parse.text);
            let images = a("div")[1];
            if (images.attribs.class == "redirectMsg") {
              let ref = a("a")[0].attribs.href.split("/").slice(-1)[0];

              axios
                .get(
                  "http://localhost:9090/results/image/" +
                    ref,
                  {
                    headers: { Authorization: login.data.token }
                  }
                )
                .then(response => {
                  const b = cheerio.load(response.data.parse.text);
                  let images = b("img")[2];
                  b("img").each((i,item)=>{if(!item.attribs.alt.includes("Logo") && item.attribs.alt.includes("Circuit"))  images = item})
                  console.log(b("img"))
                  let p = b("p")[0];
                  
                  let str = "";
                  p.children.forEach(item => {
                    if (item.type == "text") str += item.data;
                    else {
                      if (item.name == "a") str += item.children[0].data;
                      else if ((item.name = "b")) {
                        if (item.children[0].name == "a") str += "";
                        else str += "<b>" + item.children[0].data + "</b>";
                      }
                    }
                  });
                  this.setState({ url: images.attribs.src, info: str });
                  return images.attribs.src;
                });
            } else {
              const a = cheerio.load(res.data.parse.text);
              let images = a("img")[0];
             a("img").each((i,item)=>{if(!item.attribs.alt.includes("Logo") && item.attribs.alt.includes("Circuit"))  images = item})
              console.log(a("img"))
              
              let p = a("p")[1];
              let str = "";
              p.children.forEach(item => {
                if (item.type == "text") str += item.data;
                else {
                  if (item.name == "a") str += item.children[0].data;
                  else if ((item.name = "b")) {
                    if (item.children[0].name == "a") str += "";
                    else str += "<b>" + item.children[0].data + "</b>";
                  }
                }
              });

              this.setState({ url: images.attribs.src, info: str });
              return images.attribs.src;
            }
          })
      );
  }
  createChart(results, name) {
    // set the dimensions and margins of the graph

    if (
      results === undefined ||
      (Object.entries(results).length === 0 && results.constructor === Object)
    )
      return;

    let temp = {};
    let fromTo = d3.extent(Object.keys(results));
    let mean = d3.mean(Object.values(results));
    for (let i = parseInt(fromTo[0]); i <= parseInt(fromTo[1]); i++) {
      if (results[i] === undefined) {
        temp[i] = mean;
      } else temp[i] = results[i];
    }

    let data = Object.entries(temp).map(([year, speed]) => ({
      year: parseInt(year),
      speed: speed
    }));

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 40, bottom: 30, left: 50 },
      width =
        $("#my_dataviz")
          .parent()
          .css("width")
          .slice(0, -2) *
          0.96 -
        margin.left -
        margin.right,
      height =
        $("#my_dataviz")
          .parent()
          .css("height")
          .slice(0, -2) -
        100 -
        margin.top -
        margin.bottom;
    // parse the date / time
    var parseTime = d3.timeParse("%Y");
    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // define the line
    var valueline = d3
      .line()
      .defined(function(d) {
        return !isNaN(d.year);
      })
      .x(function(d) {
        return x(d.year);
      })
      .y(function(d) {
        return y(d.speed);
      })
      .curve(d3.curveCardinal);
    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    // format the data
    data.map(function(d) {
      d.speed = +d.speed;
      d.year = parseTime(d.year);
    });

    // Scale the range of the data
    let asd = Object.values(results);
    asd = asd.map(item => parseInt(item));

    x.domain(
      d3.extent(data, function(d) {
        return d.year;
      })
    );

    y.domain([
      d3.min(asd, d => d),
      d3.max(data, function(d) {
        return d.speed;
      })
    ]);

    // Add the valueline path.
    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);
    // 5. X scale will use the index of our data
    var xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1]) // input
      .range([0, width]); // output

    // 6. Y scale will use the randomly generate number
    var yScale = d3
      .scaleLinear()
      .domain([
        d3.min(asd, d => d),
        d3.max(data, function(d) {
          return d.speed;
        })
      ]) // input
      .range([height, 0]); // output
    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("fill", "#ff1601c2") // Assign a class for styling
      .attr("cx", function(d, i) {
        return xScale(i);
      })
      .attr("cy", function(d, i) {
        return yScale(d.speed);
      })
      .attr("r", 5)
      .on("mouseover", function(d) {
        div
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        div
          .html(d.speed)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px")
          .style("width", "auto")
          .style("text-align", "center")
          .style("background", "red")

          .style("height", "auto");
      })
      .on("mouseout", function(d) {
        div
          .transition()
          .duration(500)
          .style("opacity", 0);
      });
    // Add the X Axis

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(asd.length));

    // Add the Y Axis
    svg.append("g").call(d3.axisLeft(y));
  }
  createPieChart(results) {
    let xd = [
      {
        count: results.all - results.finished,
        percentage: (results.all - results.finished) / results.all,
        color: "red"
      },
      {
        count: results.finished,
        percentage: results.finished / results.all,
        color: "green"
      }
    ];
    // set the dimensions and margins of the graph
    var width =
        $("#pie_chart")
          .parent()
          .width() *
          0.9 -
        110,
      height =
        $("#pie_chart")
          .parent()
          .width() *
          0.9 -
        110,
      margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    var svg = d3
      .select("#pie_chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    var data = {
      a: (results.all - results.finished) / results.all,
      b: results.finished / results.all
    };

    // set the color scale
    var color = d3
      .scaleOrdinal()
      .domain(data)
      .range(["#bf3939", "#f58442"]);

    // Compute the position of each group on the pie:
    var pie = d3.pie().value(function(d) {
      return d.value;
    });
    var data_ready = pie(d3.entries(data));

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll("whatever")
      .data(data_ready)
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(0) // This is the size of the donut hole
          .outerRadius(radius)
      )
      .attr("fill", function(d) {
        return color(d.data.key);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);
  }
  removeNullFromResults(results) {
    if (results === undefined) return [];
    let tmp = {};
    let driver_speed = {};
    results
      .filter(item => !item.speed.includes("\\N"))
      .forEach(item => {
        tmp[parseInt(item.race.year)] = parseFloat(item.speed);
      });

    results
      .filter(item => !item.speed.includes("\\N"))
      .forEach(item => {
        if (item.speed >= tmp[item.race.year]) {
          tmp[parseInt(item.race.year)] = parseFloat(item.speed);
          driver_speed[parseInt(item.race.year)] = {
            id: item.driver.id,
            name: item.driver.forename,
            surname: item.driver.surname,
            speed: parseFloat(item.speed),
            year: item.race.year,
            fastestLap: item.fastestLap
          };
        }
      });
    return [tmp, driver_speed];
  }
  getDriverNameAndMaxSpeedAndYear(obj) {
    if (obj === undefined) return [];
    let max = 0;
    let driver = "";
    for (let [key, value] of Object.entries(obj)) {
      if (value.speed >= max) {
        max = value.speed;
        driver =
          value.name +
          " " +
          value.surname +
          " set the quickest lap time of " +
          value.fastestLap +
          " in " +
          value.year;
      }
    }
    return [driver, max];
  }
  getYearsList(results) {
    let years = results.res;
    let arr = [];
    years.forEach(item => {
      if (!arr.includes(item.race.year)) arr.push(item.race.year);
    });
    return arr;
  }
  countPositionsGained(obj) {
    if (obj === undefined) return [];
    let count = 0;
    let equal = 0;
    let less = 0;
    Object.entries(obj).forEach(item => {
      item = item[1];

      if (item.grid > parseInt(item.positionOrder)) {
        count += 1;
      } else if (item.grid === parseInt(item.positionOrder)) equal += 1;
      else less += 1;
    });
    return [count, equal, less, count + equal + less];
  }
  createSecondPieChart(results) {
    var data = [
      {
        name: "Improved",
        value: Math.round((results[0] / results[3] + Number.EPSILON) * 100)
      },
      {
        name: "Regressed",
        value: Math.round((results[2] / results[3] + Number.EPSILON) * 100)
      },
      {
        name: "Maintained position",
        value: Math.round((results[1] / results[3] + Number.EPSILON) * 100)
      }
    ];
    var text = "";

    var width =
      $("#pie2")
        .parent()
        .width() *
        0.9 -
      150;
    var height =
      $("#pie2")
        .parent()
        .width() *
        0.9 -
      150;
    var thickness = 80;
    var duration = 750;

    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3
      .select("#pie2")
      .append("svg")
      .attr("class", "pie")
      .attr("width", width)
      .attr("height", height);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arc = d3
      .arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

    var pie = d3
      .pie()
      .value(function(d) {
        return d.value;
      })
      .sort(null);

    var path = g
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("g")
      .on("mouseover", function(d) {
        let g = d3
          .select(this)
          .style("cursor", "pointer")
          .style("fill", "black")
          .append("g")
          .attr("class", "text-group");

        g.append("text")
          .attr("class", "name-text")
          .text(`${d.data.name}`)
          .attr("text-anchor", "middle")
          .attr("dy", "-1.2em");

        g.append("text")
          .attr("class", "value-text")
          .text(`${d.data.value}%`)
          .attr("text-anchor", "middle")
          .attr("dy", ".6em");
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")
          .style("fill", color(this._current))
          .select(".text-group")
          .remove();
      })
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .on("mouseover", function(d) {
        d3.select(this)
          .style("cursor", "pointer")
          .style("fill", "black");
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")
          .style("fill", color(this._current));
      })
      .each(function(d, i) {
        this._current = i;
      });

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text(text);
  }
  render() {
    //const race  = this.props.race;
    const { name } = this.props.location.state;
    const results = this.props.circuit_result.circuit_results;
    let positions = this.countPositionsGained(results.res);

    let tmp = this.removeNullFromResults(results.res);
    let driver = this.getDriverNameAndMaxSpeedAndYear(tmp[1]);
    console.log(results);
    return (
      <div
        style={{
          paddingRight: "15px",
          height: "100vh",
          overflowY: "auto",
          paddingBottom: "35px"
        }}
        className="style-1"
      >
        <div className="card">
          <h2
            className="card-header"
            style={{ color: "#ff1601c2", fontWeight: "500" }}
          >
            {name}
          </h2>
        </div>

        <div className="row" id="here">
          <div className="col-3" style={{paddingRight:"0"}}>
            <div className="card" style={{ height: "400px" }}>
              <div className="card-body p-3">
                <img
                  src={this.state.url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "60%",
                    maxHeight: "320px",
                    maxWidth: "256px"
                  }}
                ></img>
              </div>
            </div>
          </div>
          <div className="col-7" style={{paddingLeft:"6px"}}>
            <div className="card" style={{ height: "400px" }}>
              <div className="card-body">
                <h5>Info</h5>
                <p dangerouslySetInnerHTML={{ __html: this.state.info }}></p>
              </div>
            </div>
          </div>
          <div className="col-2">
            <div className="card style-1" style={{ height: "400px",overflowY:"auto" }}>
            <h5>Seasons</h5>
              <div className="card-body">
                
                {this.state.years.map((year,i)=>(
                  <span key={i}>{year}<br/></span>
                ))}
              </div>
            </div>
          </div>
          <div className="col-12" id="appendHere"></div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6">
            <div className="card">
              <h5 className="card-header">Individual races completed</h5>
              <div className="card-body">
                <div id="pie_chart"></div>
                <div
                  style={{
                    background: "#f58442",
                    width: "10px",
                    height: "10px",
                    display: "inline-block"
                  }}
                ></div>{" "}
                <span>
                  Number of race finishes by all drivers: {results.finished}
                </span>
                <br />
                <div
                  style={{
                    background: "#bf3939",
                    width: "10px",
                    height: "10px",
                    display: "inline-block"
                  }}
                ></div>{" "}
                <span>
                  Number of race DNF's: {results.all - results.finished}
                </span>
                <br />
                <span>
                  Percentage of finishes vs DNF's:{" "}
                  {Math.round(
                    (results.finished / results.all + Number.EPSILON) * 100
                  )}
                  %
                </span>
                <br />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card">
              <h5 className="card-header">Starting grid vs. final position</h5>
              <div className="card-body">
                <div id="pie2"></div>

                <span>
                  Finished above the starting position:{" "}
                  {Math.round(
                    (positions[0] / positions[3] + Number.EPSILON) * 100
                  )}
                  %{" "}
                </span>
                <br />
                <span>
                  Finished below the starting position:{" "}
                  {Math.round(
                    (positions[2] / positions[3] + Number.EPSILON) * 100
                  )}
                  %{" "}
                </span>
                <br />
                <span>
                  Position didn't change:{" "}
                  {Math.round(
                    (positions[1] / positions[3] + Number.EPSILON) * 100
                  )}
                  %{" "}
                </span>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps, actionCreators)(Circuit_result);
