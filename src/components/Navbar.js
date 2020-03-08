import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../navbar.css";
import logo from "../formula-1-logo-7.png";
export default class Navbar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark shadow">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <img src={logo} style={{ width: "60px" }} alt="F1 logo"></img>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/Favorite">
                    FANTASY
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ">
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    Log in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
