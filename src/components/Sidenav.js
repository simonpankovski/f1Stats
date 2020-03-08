import React, { Component } from "react";
import "../sidenav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoad } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
export default class Sidenav extends Component {
  render() {
    return (
      <div>
        <ul className="shadow list-group list-group-flush " id="sidenav">
          <Link className="list-group-item" to="/Circuits">
            <FontAwesomeIcon
              icon={faRoad}
              className="mr-3"
              style={{ fontSize: "30px " }}
            />
            Circuits
          </Link>
          <Link to="/Drivers" className="list-group-item">
            <FontAwesomeIcon
              icon={faUser}
              className="mr-3"
              style={{ fontSize: "30px " }}
            />
            Drivers
          </Link>
          <Link to="/Constructors" className="list-group-item">
            <FontAwesomeIcon
              icon={faCar}
              className="mr-3"
              style={{ fontSize: "30px " }}
            />
            Constructors
          </Link>
          <Link to="/Seasons" className="list-group-item">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="mr-3"
              style={{ fontSize: "30px" }}
            />
            Seasons
          </Link>
        </ul>
      </div>
    );
  }
}
