import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class Constructor extends Component {
    constructor(props) {
        super(props);
        this.state = {
         };
      }
      componentDidMount() {
        //fetch("https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Stoffel_Vandoorne&prop=text&formatversion=2").then(res => res.json()).then(res=>console.log(res))
        
      }
      render() {
        const { constructor } = this.props;
        return (
          <div>
            <div className="card mb-3 mr-4">
              <h3 className="card-header" id="header">
                {constructor.name}
              </h3>
              <div className="card-body">
                <h5 className="card-title">
                  {constructor.nationality}
                </h5>
                <img></img>
                <p className="card-text"></p>
                <Link   
                  className="btn btn-transparent "
                  id="first"
                  to={{
                    pathname: "/Constructor_profile/" + constructor.id,
                    state: { name:constructor.name,url:constructor.url }
                  }}
                >
                  View Profile
                </Link>
                <a href={constructor.url} className="btn" id="second">
                  Constructor Wiki
                </a>
              </div>
            </div>
          </div>
        );
      }
}
