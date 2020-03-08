import React, { Component } from 'react'
import { Link } from "react-router-dom";
import "../../circuit_style.css";
export default class Driver extends Component {
    constructor(props) {
        super(props);
        this.state = {
         };
      }
      componentDidMount() {
        //fetch("https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Stoffel_Vandoorne&prop=text&formatversion=2").then(res => res.json()).then(res=>console.log(res))
        
      }
      render() {
        const { driver } = this.props;
        return (
          <div>
            <div className="card mb-3 mr-4">
              <h3 className="card-header" id="header">
                {driver.forename + " " +driver.surname}
              </h3>
              <div className="card-body">
                <h5 className="card-title">
                  {driver.nationality}
                </h5>
                <img></img>
                <p className="card-text"></p>
                <Link   
                  className="btn btn-transparent "
                  id="first"
                  to={{
                    pathname: "/Driver_profile/" + driver.id,
                    state: { name:driver.forename,surname: driver.surname,url:driver.url }
                  }}
                >
                  View Profile
                </Link>
                <a href={driver.url} className="btn" id="second">
                  Driver Wiki
                </a>
              </div>
            </div>
          </div>
        );
      }
}
