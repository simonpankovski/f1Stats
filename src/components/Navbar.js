import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../navbar.css";
import { logout } from "../actions/securityActions";
import { connect } from "react-redux";
import logo from "../formula-1-logo-7.png";
class Navbar extends Component {
  logout() {
    this.props.logout();
    window.location.href = "http://localhost:3000/login";
  }
  render() {
    const { validToken, user } = this.props.security;
    const userIsNotAuthenticated = (
      <div className="collapse navbar-collapse" id="navbarNav">
        
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Log in
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </li>
        </ul>
      </div>
    );
    const userIsAuthenticated = (
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
            {user.fullName}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login" onClick={this.logout.bind(this)}>
              Log out
            </Link>
          </li>
        </ul>
      </div>
    );
    let headerLinks;

    if (validToken && user) {
      headerLinks = userIsAuthenticated;
    } else {
      headerLinks = userIsNotAuthenticated;
    }
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
            {headerLinks}
          </div>
        </nav>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  security: state.securityReducer
});
export default connect(mapStateToProps, { logout })(Navbar);
