import React, { Component } from "react";
import store from "../../store";
import axios from "axios";
import cheerio from "cheerio";
import * as actionCreators from "../../actions";
import { connect } from "react-redux";
import "./driverStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { max } from "d3";
class DriverProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      info: "",
      seasons: [],
      nums:[]
    };
  }
  componentDidMount() {
    this.props.getSeasonResults();
    this.props.getResultsByDriver(this.props.match.params.id);
    this.unsubscribe = store.subscribe(() => {
      let results = store.getState().driver_result.driver_results;
      this.processResults(results);

      let seasons = this.getYearsList(results).sort((a, b) => {
        return a < b ? 1 : -1;
      });
      let nums =
        this.processAllResults(
          store.getState().season_results.season_results,
          seasons,
          this.props.match.params.id
        
      );
      this.setState({ seasons,nums });
    });
    this.getWiki(this.props.location.state.url.split("/").slice(-1)[0]);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  processAllResults(results, seasons,id) {
    let res = {};
    let points = 0;
    let wins = 0;
    let entries = 0;
    results.forEach(item => {
      if(item.driver.id==id && item.position==1) wins++;
      if(item.driver.id==id){ 
        points+=item.points;
        entries++;
      };
      if (res[item.race.year] == undefined) {
        res[item.race.year] = [{ id: item.driver.id, points: item.points }];
      } else {
        let flag = true;
        res[item.race.year].forEach(driver => {
          if (driver.id == item.driver.id) {
            driver.points += item.points;
            
            flag = false;
          }
        });
        if (flag) {
          res[item.race.year].push({ id: item.driver.id, points: item.points });
        }
      }
    });
    let temp = {};
    let championships = 0
    seasons.forEach(season => {
      temp[season] = res[season]
      let id = -1;
      let max = 0;
      if(res[season]){
        res[season].forEach(item=>{
          if(item.points > max){
            max=item.points;
            id=item.id
          }
        })
      
      if(id==this.props.match.params.id) championships++;
      }
    });

    return [championships,wins,points,entries];
  }
  processResults(results) {
    let res = {
      wins: 0,
      points: 0
    };

    let Championships = 0;
    results.res.forEach(item => {
      res.points += item.points;
      if (res[item.race.year] == undefined)
        res[item.race.year] = { wins: 0, all: 0 };
      if (item.position == 1) {
        res.wins++;

        res[item.race.year].wins = res[item.race.year].wins + 1;
      }
      res[item.race.year].all = res[item.race.year].all + 1;
    });
    
  }
  getWiki(circuit) {
    axios
      .post("http://localhost:9090/users/login", {
        username: "test1@gmail.com",
        password: "password"
      })
      .then(login =>
        axios
          .get("http://localhost:9090/results/image/" + circuit, {
            headers: { Authorization: login.data.token }
          })
          .then(res => {
            const a = cheerio.load(res.data.parse.text);

            let p = a("p")[3];

            let str = "";
            p.children.forEach(item => {
              if (item.type == "text") str += item.data;
              else {
                if (item.name == "a") str += item.children[0].data;
                else if ((item.name = "b")) {
                  if (item.children[0].name == "a") str += "";
                  else str += "<b>" + item.children[0].data + "</b>";
                }
              }
            });
            this.setState({ url: a("img")[0].attribs.src, info: str });
          })
      );
  }
  getYearsList(results) {
    let years = results.res;
    let arr = [];
    years.forEach(item => {
      if (!arr.includes(item.race.year)) arr.push(item.race.year);
    });
    return arr;
  }
  render() {
    return (
      <div
        className="style-1"
        style={{
          height: "100vh",
          overflowY: "auto",
          paddingRight: "15px",
          paddingBottom: "50px"
        }}
      >
        <div className="row">
          <div className="col-7 col-md-3" style={{ paddingRight: "0" }}>
            <div
              className="card shadow cardSpecial"
              style={{ padding: "20px" }}
            >
              <img
                className="card-img-top"
                src={this.state.url}
                style={{ height: "auto", maxHeight: "100%" }}
                alt="Card image cap"
              />
            </div>
          </div>

          <div className="col-12 col-md-7 a">
            <div className="card shadow cardSpecial lastCard">
              <div className="card-body">
                <h5
                  className="card-title"
                  style={{ textAlign: "initial", fontWeight: "bold" }}
                >
                  Info
                </h5>
                <p className="card-title" style={{ textAlign: "initial" }}>
                  (from Wiki)
                </p>
                <p
                  dangerouslySetInnerHTML={{ __html: this.state.info }}
                  className="card-text font"
                ></p>
                <a
                  href={this.props.location.state.url}
                  className="btn"
                  style={{ background: "#ff1601c2", color: "white" }}
                >
                  Read more
                </a>
              </div>
            </div>
          </div>
          <div className="col-5 col-md-2 b">
            <div className="card cardSpecial ">
              <div
                className="card-body"
                style={{
                  padding: "0",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <ul
                  className="shadow list-group list-group-flush style-1"
                  style={{ width: "100%", overflowY: "auto" }}
                >
                  <h5 className="card-title" style={{ fontWeight: "bold" }}>
                    Seasons
                  </h5>
                  {this.state.seasons.map((item, i) => {
                    return (
                      <li key={i} className="list-group-item">
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-12 col-lg-3 ">
            <div className="card shadow">
              <div className="card-body cardBodyStyle">
                <FontAwesomeIcon
                  icon={faTrophy}
                  style={{ background: "#be7af5" }}
                  className="iconStyle"
                />
                <span className="card-text cardTextStyle">Championships</span>
                <span className="numberStyle">
                  <b>{this.state.nums[0]}</b>
                </span>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-12 col-lg-3 paddingLeft "
            style={{ paddingLeft: "0" }}
          >
            <div className="card shadow">
              <div className="card-body cardBodyStyle ">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="iconStyle"
                  style={{ background: "#ffc163" }}
                />
                <span className="card-text cardTextStyle">GP Victories</span>
                <span className="numberStyle">
                  <b>{this.state.nums[1]}</b>
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 col-lg-3 ">
            <div className="card shadow">
              <div className="card-body cardBodyStyle">
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  style={{ background: "#73a1ff" }}
                  className="iconStyle  svg-inline--fa fa-w-18"
                />
                <span className="card-text cardTextStyle ">Points</span>
                <span className="numberStyle">
                  <b>{this.state.nums[2]}</b>
                </span>
              </div>
            </div>
          </div>
          <div
            className="col-md-6 col-12 col-lg-3 paddingLeft"
            style={{ paddingLeft: "0" }}
          >
            <div className="card shadow ">
              <div className="card-body cardBodyStyle ">
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  style={{ background: "#73a1ff" }}
                  className="iconStyle svg-inline--fa fa-w-18"
                />
                <span className="card-text cardTextStyle">Entries</span>
                <span className="numberStyle">
                  <b>{this.state.nums[3]}</b>
                </span>
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

export default connect(mapStateToProps, actionCreators)(DriverProfile);
