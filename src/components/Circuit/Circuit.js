import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../circuit_style.css";

export default class Circuit extends Component {
  constructor(props) {
    super(props);
    this.state = {
     };
  }
  componentDidMount() {
    //fetch("https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Stoffel_Vandoorne&prop=text&formatversion=2").then(res => res.json()).then(res=>console.log(res))
    
  }
  render() {
    const { circuit } = this.props;
    return (
      <div>
        <div className="card mb-3 mr-4">
          <h3 className="card-header" id="header">
            {circuit.name}
          </h3>
          <div className="card-body">
            <h5 className="card-title">
              {circuit.location} - {circuit.country}
            </h5>
            <img></img>
            <p className="card-text"></p>
            <Link
              className="btn btn-transparent "
              id="first"
              to={{
                pathname: "/Circuit_race/" + circuit.id,
                state: { name: circuit.name }
              }}
            >
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
