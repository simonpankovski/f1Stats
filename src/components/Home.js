import React, { Component } from "react";
import * as actionCreators from "../actions";
import { connect } from "react-redux";
import store from "../store";
import * as d3 from "d3";
import $ from "jquery";
import "./home_style.css";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getDriverWins();

    this.unsubscribe = store.subscribe(() => {
      let wins = store.getState().driver_win.driver_wins.sort((a, b) => {
        if (a[2] < b[2]) return 1;
        else return -1;
      });
      wins = wins.slice(0, 10);
      wins = wins.map(item => {
        return { name: item[0] + " " + item[1], points: item[2] };
      });
      this.createChart(wins);
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  createChart(data) {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = $("#chart").width() - margin.left - margin.right,
      height = ($("#chart").height()>120) ? $("#chart").height() : 140 - margin.top - margin.bottom;
    console.log($("#chart").height());
    // set the ranges
    var x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // get the data

    // format the data
    data.forEach(function(d) {
      d.points = +d.points;
    });

    // Scale the range of the data in the domains
    x.domain(
      data.map(function(d) {
        return d.name.split(" ")[1].slice(0, 3);
      })
    );
    y.domain([
      0,
      d3.max(data, function(d) {
        return d.points;
      })
    ]);

    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.name.split(" ")[1].slice(0, 3));
      })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        return y(d.points);
      })
      .attr("height", function(d) {
        return height - y(d.points);
      })
      .on("mouseover", function(d) {
        console.log(d);
        d3.select(this).style("fill", "#e06969");
        div
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        div
          .html(d.name + ": " + d.points)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px")
          .style("width", "auto")
          .style("text-align", "center")
          .style("fill", "#e06969")
          //.style("color", textColor)
          .style("height", "auto");
      })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", "#ff1601c2");
        div
          .transition()
          .duration(500)
          .style("opacity", 0);
      });
    // add the x Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));
  }
  render() {
    return (
      <div style={{height:"100vh",overflowY:"auto"}}>
        <div className="card" >
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-sm-10">
                <h5
                  className="card-title"
                  style={{ textAlign: "left", fontWeight: "bold" }}
                >
                  Start of Formula 1 racing
                </h5>
                <span
                  className="card-text"
                  style={{ fontSize: "1.3rem", textAlign: "left" }}
                >
                  Since the beginning of Formula 1 racing with FIA rules in
                  1950, <b>1018</b> official Grand Prix have taken place. The
                  first F1 Grand Prix was the <b>British Grand Prix</b> at{" "}
                  <b>13 May 1950</b> at
                  <b> Silverstone</b> and won by the Italian driver{" "}
                  <b>Nino Farina</b>. The last Grand Prix was the{" "}
                  <b>Abu Dhabi Grand Prix</b> on <b>1 December 2019</b> at{" "}
                  <b>Yas Marina Circuit</b> and won by <b>Lewis Hamilton</b>.
                </span>
              </div>
              <div className="col-12 col-sm-2">
                <img
                  src="https://f1.bitmetric.nl/images/circuits/Circuit_Yas%20Marina%20Circuit.png"
                  alt="Yas Marina Circuit"
                  style={{ width: "100%" }}
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-lg-3" id="chart">
                <p>Wins by drivers</p>
              </div>
              <div className="col-12 col-lg-9">
                <h5
                  className="card-title"
                  style={{ textAlign: "left", fontWeight: "bold" }}
                >
                  Global overview
                </h5>
                <span
                  className="card-text"
                  style={{ fontSize: "1.3rem", textAlign: "left" }}
                >
                  In total <b>847</b> drivers with <b>41</b> different
                  nationalities and <b> 420 </b>
                  constructors from <b> 25 </b> countries have participated in
                  Formula 1 racing. Those drivers and constructors have raced at{" "}
                  <b>74 </b>
                  different circuits in <b>34</b> countries. Through the years
                  there are <b>32</b> different drivers who became World
                  Champions and <b>16 </b>
                  constructors that became World Champions. <b>Monza</b> has
                  host the most F1 Grand Prix with a number of <b>70</b> Grands
                  Prix.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5">
            {" "}
            <div className="card" style={{minHeight:"52vh"}}>
              <div className="card-body">
               
                    <h5
                      className="card-title"
                      style={{ textAlign: "left", fontWeight: "bold" }}
                    >
                      Driver information
                    </h5>
                    <span
                      className="card-text"
                      style={{ fontSize: "1.3rem", textAlign: "left" }}
                    >
                      <b>Rubens Barrichello</b> has drove the most Grand Prix’
                      in the history of Formula 1 with <b>326</b> Grand Prix
                      entries. Michael Schumacher has won the most Grand Prix
                      with <b>91</b> wins.<b> Lewis Hamilton</b> has won the
                      most qualifications with <b>88</b> pole positions.{" "}
                      <b>Sebastian Vettel</b> has the longest winning streak
                      with <b>9</b> consecutive Grand Prix wins in <b>2013</b>.
                      The youngest driver during a Grand Prix is{" "}
                      <b>Max Verstappen</b> with <b>17</b> years and the oldest
                      driver is <b>Louis Chiron</b> with <b>58</b> years. The
                      youngest Grand Prix winner is <b>Max Verstappen</b> with{" "}
                      <b>18</b> years and the oldest Grand Prix winner is{" "}
                      <b>Luigi Fagioli</b> with <b>53</b> years.
                    </span>
                  </div>
                
            </div>
          </div>
          <div className="col-12 col-md-7">
            {" "}
            <div className="card" style={{minHeight:"52vh"}}>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <h5
                      className="card-title"
                      style={{ textAlign: "left", fontWeight: "bold" }}
                    >
                      Most successful driver
                    </h5>
                    <span
                      className="card-text"
                      style={{ fontSize: "1.3rem", textAlign: "left" }}
                    >
                      With <b>7 world titles</b>, <b>Michael Schumacher</b> is the most
                      successful driver in the history of Formula 1. Michael
                      Schumacher was active between the years <b>1991 - 2012</b> and
                      has entered <b>308</b> Grand Prix’ and won <b>91</b> of them. He started
                      <b> 68</b> out of <b>308</b> Grand Prix’ in pole position. <b>Michael
                      Schumacher</b> has drove for <b>8</b> different constructors:
                      <b> Benetton, Ferrari, Jordan, Mercedes...</b>
                    </span>
                  </div>
                  <div className="col-12 col-sm-6">
                    <img src="https://f1.bitmetric.nl/images/Drivers/Michael%20Schumacher.jpg" alt="Micheal Schumacher" style={{width:"100%"}}></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-sm-10">
                <h5
                  className="card-title"
                  style={{ textAlign: "left", fontWeight: "bold" }}
                >
                  Start of Formula 1 racing
                </h5>
                <span
                  className="card-text"
                  style={{ fontSize: "1.3rem", textAlign: "left" }}
                >
                  Since the beginning of Formula 1 racing with FIA rules in
                  1950, <b>1018</b> official Grand Prix have taken place. The
                  first F1 Grand Prix was the <b>British Grand Prix</b> at{" "}
                  <b>13 May 1950</b> at
                  <b> Silverstone</b> and won by the Italian driver{" "}
                  <b>Nino Farina</b>. The last Grand Prix was the{" "}
                  <b>Abu Dhabi Grand Prix</b> on <b>1 December 2019</b> at{" "}
                  <b>Yas Marina Circuit</b> and won by <b>Lewis Hamilton</b>.
                </span>
              </div>
              <div className="col-12 col-sm-2">
                <img
                  src="https://f1.bitmetric.nl/images/circuits/Circuit_Yas%20Marina%20Circuit.png"
                  alt="Yas Marina Circuit"
                  style={{ width: "100%" }}
                ></img>
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

export default connect(mapStateToProps, actionCreators)(Home);
