import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../navbar.css";
import logo from "../formula-1-logo-7.png";
export default class Navbar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark">
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
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                     
                    STATS
                  </a>
                  
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className="dropdown-item" to="/Circuits">
                      Circuits
                    </Link>
                    <Link className="dropdown-item" to="/Seasons">
                      Seasons
                    </Link>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </div>
                </li>
                <li className="nav-item ">
                  
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Favorite">
                    FAVORITES/FANTASY LEAGUE
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
