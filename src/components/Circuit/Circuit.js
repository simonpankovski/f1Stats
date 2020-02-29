import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../circuit_style.css"
export default class Circuit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Adelaide_%28short_route%29.svg/220px-Adelaide_%28short_route%29.svg.png"
    };
  }
  
  render() {
    const { circuit } = this.props;
    return (
      <div>
        <div className="card text-white mb-3">
          <h3 className="card-header" id="header">{circuit.name}</h3>
          <div className="card-body">
            <h5 className="card-title">{circuit.location} - {circuit.country}</h5>
            <img src={this.state.url}></img>
            <p className="card-text"></p>
            <Link className="btn btn-transparent text-white" id="first" to={{pathname:"/Circuit_race/"+circuit.id,state:{name:circuit.name}}}>
              View Races
            </Link>
            <a href={circuit.url} className="btn" id="second">
              Circuit Wiki
            </a>
          </div>
        </div>
      </div>
    );
  }
}
