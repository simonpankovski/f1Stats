import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./favorite.css";
import $ from "jquery";
export default class Favorite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSideBarOpen: false
    };
    this.state = {};
    this.openNav = this.openNav.bind(this);
    this.closeNav = this.closeNav.bind(this);
  }
  openNav() {
    this.setState({ isSideBarOpen: true });
  }

  closeNav() {
    console.log("clicked")
    this.setState({ isSideBarOpen: false },()=>{console.log(this.state.isSideBarOpen)});

  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="card" onClick={() => this.openNav()}>
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <div className="row">
                  <div className="col-4">
                    <div className="card hoverCard">
                      <div
                        className="card-body"
                        style={{
                          padding: 0
                        }}
                      >
                        <div className="triangle">
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ color: "white", fontSize: "20px" }}
                          />
                        </div>
                        <p className="card-text" className="text">
                          Add Driver
                        </p>
                      </div>
                    </div>
                  </div>
                  <div id="mySidenav" className={this.state.isSideBarOpen?"sidenavOpen":"sidenavClose"}>
                    <a
                      className="closebtn"
                      onClick={() => {
                        this.closeNav();
                      }}
                    >
                      &times;
                    </a>
                    <a href="#">About</a>
                    <a href="#">Services</a>
                    <a href="#">Clients</a>
                    <a href="#">Contact</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
