import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./favorite.css";
import $ from "jquery";
import store from "../store";
import * as actionCreators from "../actions";

import { connect } from "react-redux";
import { parse } from "@fortawesome/fontawesome-svg-core";
import Constructors from "../reducers/Constructors";
class Favorite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSideBarOpen: false,
      isSideBarConstructorOpen: false,
      drivers: {},
      constructors: {},
      current: 0,
      budget: 100.0
    };

    this.openNav = this.openNav.bind(this);
    this.submitFantasy = this.submitFantasy.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.openConstructorNav = this.openConstructorNav.bind(this);
    this.closeConstructorNav = this.closeConstructorNav.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.selectDriver = this.selectDriver.bind(this);
    this.selectConstructor = this.selectConstructor.bind(this);
    this.removeDriver = this.removeDriver.bind(this);
    this.removeConstructor = this.removeConstructor.bind(this);
  }
  openNav() {
    this.setState({ isSideBarOpen: true });
  }

  closeNav() {
    this.setState({ isSideBarOpen: false });
  }
  openConstructorNav() {
    this.setState({ isSideBarConstructorOpen: true });
  }

  closeConstructorNav() {
    this.setState({ isSideBarConstructorOpen: false });
  }
  componentDidMount() {
    window.$("#exampleModal").modal("hide");

    this.props.getSeasonResultsByYear(2019);
    this.props.getFantasySelections();
    this.unsubscribe = store.subscribe(() => {
      let res = this.processResults(
        store.getState().season_result_year.season_results
      );
     
      let data = res[0];
      let constructors = res[1];
      if(data[1]==undefined) return

      data[849] = {
        driver: "Nicholas Latifi",
        constructor: "Williams",
        constructorId: 3,
        url: "http://en.wikipedia.org/wiki/Nicholas_Latifi",
        circuits: data[1].circuits
      };
      data[839] = {
        driver: "Esteban Ocon",
        constructor: "Renault",
        constructorId: 4,
        url: "http://en.wikipedia.org/wiki/Esteban_Ocon",
        circuits: data[1].circuits
      };
      let temp = Object.keys(data).map(key => {
        let obj = this.setImagesAndPercentage(data, key);
        return obj;
      });
      let temp1 = Object.keys(constructors).map(key => {
        let obj = this.setImagesAndPercentageForConstructor(constructors, key);
        return obj;
      });
      delete data[9];
      delete data[807];
      let budget = 100;
       store.getState().fantasy.fantasys.drivers.forEach((item,i)=>{
         budget -= data[item.id].budget
         let index = i+1;
         $("." + index + " p")[0].textContent = item.forename + " " + item.surname;

         let drivers = data;
         $($("." + index + " p")[0]).attr(
           "driver",
           item.id
         );
         $($("." + index + " img")[0]).attr(
           "src",
           drivers[
             item.id
           ].thumbnail
         );
         $($("." + index + " .triangle")[0]).css({
           "border-left":
             "7vw solid " +
             this.getConstructorColor(
               drivers[
                 item.id
               ].constructorId
             )
         });
         $(
           $(
             $($("." + index + " .card-body")[0]).children()[0]
           ).children()[0]
         ).css(
           "color",
           this.getConstructorColor(
             drivers[
               item.id
             ].constructorId
           )
         );
         drivers[
           item.id
         ].selected = true;
          data[item.id].selected=true
      })
      
      let constructorId = store.getState().fantasy.fantasys.constructor.id
      
      budget -= temp1[9][constructorId].budget
      $("." + 6 + " p")[0].textContent = temp1[9][constructorId].name;

      $($("." + 6 + " p")[0]).attr(
        "constructor",
        constructorId
      );

      let constructors1 = temp1[9][constructorId];
      console.log(constructors1)
      $($("." + 6 + " img")[0]).attr(
        "src",
        constructors1.url
      );
      $($("." + 6 + " .triangle")[0]).css(
        "border-left",
        "7vw solid " +
          this.getConstructorColor(
            constructorId
          )
      );
      $(
        $(
          $($("." + 6 + " .card-body")[0]).children()[0]
        ).children()[0]
      ).css(
        "color",
        this.getConstructorColor(
          constructorId
        )
      );
      constructors1.selected = true;
      this.setState({ drivers: data, constructors, budget: Math.round((budget + Number.EPSILON) * 100) / 100  });
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  processResults(data) {
    let temp = {};
    let circuits = [];
    let c = {};
    let constructors = {};
    data.forEach(item => {
      let circuit = item.race.url.split("/").slice(-1)[0];
      c[circuit] = 0;
      constructors[item.constructor.id] = {
        name: item.constructor.name,
        url: "https://fantasy.formula1.com/images/players/list/4.png"
      };

      temp[item.driver.id] = {
        driver: item.driver.forename + " " + item.driver.surname,
        constructor: item.constructor.name,
        constructorId: item.constructor.id,
        url: item.driver.url,
        circuits,
        circuits: c
      };
    });

    return [temp, constructors];
  }
  handleClick(data) {
    if (data == 6) {
      this.setState({
        isSideBarConstructorOpen: !this.state.isSideBarConstructorOpen,
        current: data
      });
    } else
      this.setState({
        isSideBarOpen: !this.state.isSideBarOpen,
        current: data
      });
  }
  removeConstructor(e) {
    $($("." + this.state.current + " img")[0]).attr("src", "");

    if (e.target.nodeName == "path") {
      let price = $(
        $($(e.target).parent()[0]).parent()[0].children[1]
      ).children()[2].textContent;
      price = parseFloat(price.slice(2, price.length - 1));

      $(".text").each((i, item) => {
        let target = $($($($(e.target).parent()[0]).parent()[0]).children()[1]);
        if ($(item).text() == target.children()[0].textContent) {
          $(item).text("Add Constructor");
          let targetElement = $($(item).parent()).children();
          $(targetElement[0]).css("border-left", "7vw solid red");
          $($(targetElement).children()[0]).css("color", "white");
          $(targetElement[1]).attr("src", "");
        }
      });
      let constructors = this.state.constructors;
      constructors[
        $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
      ].selected = false;

      this.setState({ budget: this.state.budget + price, constructors });
    } else {
      let price = $($(e.target).parent()[0].children[1]).children()[2]
        .textContent;
      price = parseFloat(price.slice(2, price.length - 1));
      let target = $($($(e.target).parent()[0]).children()[1]);
      $(".text").each((i, item) => {
        if ($(item).text() == target.children()[0].textContent) {
          $(item).text("Add Constructor");
          let targetElement = $($(item).parent()).children();
          $(targetElement[0]).css("border-left", "7vw solid red");
          $($(targetElement).children()[0]).css("color", "white");
          $(targetElement[1]).attr("src", "");
        }
      });

      //$("." + this.state.current + " p")[0].textContent = "Add driver";
      let constructors = this.state.constructors;
      constructors[
        $($(e.target).parent()[0]).attr("identifier")
      ].selected = false;
      this.setState({ budget: this.state.budget + price, constructors });
    }
    this.setState({
      isSideBarConstructorOpen: !this.state.isSideBarConstructorOpen
    });
  }
  selectConstructor(e) {
    let tempBudget = 0;
    let constructorId = $($("." + this.state.current + " p")[0]).attr(
      "constructor"
    );
    if (
      $("." + this.state.current + " p")[0].textContent != "Add Constructor"
    ) {
      let constructors = this.state.constructors;
      constructors[constructorId].selected = false;
      let price = constructors[constructorId].budget;
      console.log(price);
      tempBudget = price;
      $($("#progressBar")[0])
        .attr("style")
        .split(";")
        .forEach((item, i) => {
          if (item.includes("width")) {
            let temp = item.split(" ").slice(-1)[0];
            let width = temp.slice(0, temp.length - 1);
            $($("#progressBar")[0]).css(
              "width",
              parseFloat(width) - 16.666666666666666666666666666667 + "%"
            );
          }
        });
    }
    if (e.target.nodeName == "path") {
      let price = $(
        $($(e.target).parent()[0]).parent()[0].children[1]
      ).children()[2].textContent;
      price = parseFloat(price.slice(2, price.length - 1));
      if (this.state.budget > price) {
        $($("#progressBar")[0])
          .attr("style")
          .split(";")
          .forEach((item, i) => {
            if (item.includes("width")) {
              let temp = item.split(" ").slice(-1)[0];
              let width = temp.slice(0, temp.length - 1);
              $($("#progressBar")[0]).css(
                "width",
                parseFloat(width) + 16.666666666666666666666666666667 + "%"
              );
              if (parseFloat(width) + 16.666666666666666666666666666667 == 100)
                $("#confirm").css({ cursor: "pointer", disabled: "false" });
            }
          });
        let targetText = $($($(e.target).parent()[0]).parent()[0].children[1])
          .children()
          .first()[0].textContent;
        if ($("." + this.state.current + " p")[0] != targetText) {
          $("." + this.state.current + " p")[0].textContent = targetText;

          let constructors = this.state.constructors;
          $($("." + this.state.current + " p")[0]).attr(
            "constructor",
            $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
          );
          $($("." + this.state.current + " img")[0]).attr(
            "src",
            constructors[
              $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
            ].url
          );
          $($("." + this.state.current + " .triangle")[0]).css({
            "border-left":
              "7vw solid " +
              this.getConstructorColor(
                constructors[
                  $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
                ].constructorId
              )
          });
          $(
            $(
              $($("." + this.state.current + " .card-body")[0]).children()[0]
            ).children()[0]
          ).css(
            "color",
            this.getConstructorColor(
              constructors[
                $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
              ].constructorId
            )
          );
          constructors[
            $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
          ].selected = true;
          this.setState({
            budget:
              Math.round(
                (this.state.budget + tempBudget - price + Number.EPSILON) * 100
              ) / 100,
            constructors
          });
        }
      } else {
        window.$("#exampleModal").modal("show");
      }
    } else {
      let price = $($(e.target).parent()[0].children[1]).children()[2]
        .textContent;
      price = parseFloat(price.slice(2, price.length - 1));
      if (this.state.budget > price) {
        $($("#progressBar")[0])
          .attr("style")
          .split(";")
          .forEach((item, i) => {
            if (item.includes("width")) {
              let temp = item.split(" ").slice(-1)[0];
              let width = temp.slice(0, temp.length - 1);
              $($("#progressBar")[0]).css(
                "width",
                parseFloat(width) + 16.666666666666666666666666666667 + "%"
              );
              if (parseFloat(width) + 16.666666666666666666666666666667 == 100)
                $("#confirm").css({ cursor: "pointer", disabled: "false" });
            }
          });
        let targetText = $($(e.target).parent()[0].children[1])
          .children()
          .first()[0].textContent;
        if ($("." + this.state.current + " p")[0].textContent != targetText) {
          $("." + this.state.current + " p")[0].textContent = targetText;

          $($("." + this.state.current + " p")[0]).attr(
            "constructor",
            $($(e.target).parent()[0]).attr("identifier")
          );

          let constructors = this.state.constructors;
          $($("." + this.state.current + " img")[0]).attr(
            "src",
            constructors[$($(e.target).parent()[0]).attr("identifier")].url
          );
          $($("." + this.state.current + " .triangle")[0]).css(
            "border-left",
            "7vw solid " +
              this.getConstructorColor(
                $($(e.target).parent()[0]).attr("identifier")
              )
          );
          $(
            $(
              $($("." + this.state.current + " .card-body")[0]).children()[0]
            ).children()[0]
          ).css(
            "color",
            this.getConstructorColor(
              $($(e.target).parent()[0]).attr("identifier")
            )
          );
          constructors[
            $($(e.target).parent()[0]).attr("identifier")
          ].selected = true;

          this.setState({
            budget:
              Math.round(
                (this.state.budget + tempBudget - price + Number.EPSILON) * 100
              ) / 100,
            constructors
          });
        }
      } else {
        window.$("#exampleModal").modal("show");
      }
    }
    this.setState({
      isSideBarConstructorOpen: !this.state.isSideBarConstructorOpen
    });
  }
  selectDriver(e) {
    let tempBudget = 0;
    let driverId = $($("." + this.state.current + " p")[0]).attr("driver");
    if ($("." + this.state.current + " p")[0].textContent != "Add Driver") {
      let drivers = this.state.drivers;
      drivers[driverId].selected = false;
      let price = drivers[driverId].budget;
      let b = this.state.budget + price;
      tempBudget = price;
      $($("#progressBar")[0])
        .attr("style")
        .split(";")
        .forEach((item, i) => {
          if (item.includes("width")) {
            let temp = item.split(" ").slice(-1)[0];
            let width = temp.slice(0, temp.length - 1);
            $($("#progressBar")[0]).css(
              "width",
              parseFloat(width) - 16.666666666666666666666666666667 + "%"
            );
          }
        });
    }
    if (e.target.nodeName == "path") {
      let price = $(
        $($(e.target).parent()[0]).parent()[0].children[1]
      ).children()[3].textContent;
      price = parseFloat(price.slice(2, price.length - 1));
      if (this.state.budget > price) {
        $($("#progressBar")[0])
          .attr("style")
          .split(";")
          .forEach((item, i) => {
            if (item.includes("width")) {
              let temp = item.split(" ").slice(-1)[0];
              let width = temp.slice(0, temp.length - 1);
              $($("#progressBar")[0]).css(
                "width",
                parseFloat(width) + 16.666666666666666666666666666667 + "%"
              );
              if (
                parseFloat(width) + 16.666666666666666666666666666667 ==
                100
              ) {
                
                $("#confirm").css({ cursor: "pointer", disabled: "false" });
              }
            }
          });
        let targetText = $($($(e.target).parent()[0]).parent()[0].children[1])
          .children()
          .first()[0].textContent;
        if ($("." + this.state.current + " p")[0] != targetText) {
          $("." + this.state.current + " p")[0].textContent = targetText;

          let drivers = this.state.drivers;
          $($("." + this.state.current + " p")[0]).attr(
            "driver",
            $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
          );
          $($("." + this.state.current + " img")[0]).attr(
            "src",
            drivers[
              $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
            ].thumbnail
          );
          $($("." + this.state.current + " .triangle")[0]).css({
            "border-left":
              "7vw solid " +
              this.getConstructorColor(
                drivers[
                  $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
                ].constructorId
              )
          });
          $(
            $(
              $($("." + this.state.current + " .card-body")[0]).children()[0]
            ).children()[0]
          ).css(
            "color",
            this.getConstructorColor(
              drivers[
                $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
              ].constructorId
            )
          );
          drivers[
            $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
          ].selected = true;
          this.setState({
            budget:
              Math.round(
                (this.state.budget + tempBudget - price + Number.EPSILON) * 100
              ) / 100,
            drivers
          });
        }
      } else {
        window.$("#exampleModal").modal("show");
      }
    } else {
      let price = $($(e.target).parent()[0].children[1]).children()[3]
        .textContent;
      price = parseFloat(price.slice(2, price.length - 1));
      if (this.state.budget > price) {
        $($("#progressBar")[0])
          .attr("style")
          .split(";")
          .forEach((item, i) => {
            if (item.includes("width")) {
              let temp = item.split(" ").slice(-1)[0];
              let width = temp.slice(0, temp.length - 1);
              $($("#progressBar")[0]).css(
                "width",
                parseFloat(width) + 16.666666666666666666666666666667 + "%"
              );
              if (
                parseFloat(width) + 16.666666666666666666666666666667 ==
                100
              ) {
                console.log("test");
                $("#confirm").css({ cursor: "pointer", disabled: "false" });
              }
            }
          });
        let targetText = $($(e.target).parent()[0].children[1])
          .children()
          .first()[0].textContent;
        if ($("." + this.state.current + " p")[0].textContent != targetText) {
          $("." + this.state.current + " p")[0].textContent = targetText;

          $($("." + this.state.current + " p")[0]).attr(
            "driver",
            $($(e.target).parent()[0]).attr("identifier")
          );

          let drivers = this.state.drivers;
          $($("." + this.state.current + " img")[0]).attr(
            "src",
            drivers[$($(e.target).parent()[0]).attr("identifier")].thumbnail
          );
          $($("." + this.state.current + " .triangle")[0]).css(
            "border-left",
            "7vw solid " +
              this.getConstructorColor(
                drivers[$($(e.target).parent()[0]).attr("identifier")]
                  .constructorId
              )
          );
          $(
            $(
              $($("." + this.state.current + " .card-body")[0]).children()[0]
            ).children()[0]
          ).css(
            "color",
            this.getConstructorColor(
              drivers[$($(e.target).parent()[0]).attr("identifier")]
                .constructorId
            )
          );
          drivers[
            $($(e.target).parent()[0]).attr("identifier")
          ].selected = true;

          this.setState({
            budget:
              Math.round(
                (this.state.budget + tempBudget - price + Number.EPSILON) * 100
              ) / 100,
            drivers
          });
        }
      } else {
        window.$("#exampleModal").modal("show");
      }
    }
    this.setState({ isSideBarOpen: !this.state.isSideBarOpen });
  }
  removeDriver(e) {
    $($("#progressBar")[0])
      .attr("style")
      .split(";")
      .forEach((item, i) => {
        if (item.includes("width")) {
          let temp = item.split(" ").slice(-1)[0];
          let width = temp.slice(0, temp.length - 1);
          $($("#progressBar")[0]).css(
            "width",
            parseFloat(width) - 16.666666666666666666666666666667 + "%"
          );
        }
      });
    $($("." + this.state.current + " img")[0]).attr("src", "");

    if (e.target.nodeName == "path") {
      let price = $(
        $($(e.target).parent()[0]).parent()[0].children[1]
      ).children()[3].textContent;
      price = parseFloat(price.slice(2, price.length - 1));

      $(".text").each((i, item) => {
        let target = $($($($(e.target).parent()[0]).parent()[0]).children()[1]);
        if ($(item).text() == target.children()[0].textContent) {
          $(item).text("Add Driver");
          let targetElement = $($(item).parent()).children();
          $(targetElement[0]).css("border-left", "7vw solid red");
          $($(targetElement).children()[0]).css("color", "white");
          $(targetElement[1]).attr("src", "");
        }
      });
      let drivers = this.state.drivers;
      drivers[
        $($($(e.target).parent()[0]).parent()[0]).attr("identifier")
      ].selected = false;

      this.setState({ budget: this.state.budget + price, drivers });
    } else {
      let price = $($(e.target).parent()[0].children[1]).children()[3]
        .textContent;
      price = parseFloat(price.slice(2, price.length - 1));
      let target = $($($(e.target).parent()[0]).children()[1]);
      $(".text").each((i, item) => {
        if ($(item).text() == target.children()[0].textContent) {
          $(item).text("Add Driver");
          let targetElement = $($(item).parent()).children();
          $(targetElement[0]).css("border-left", "7vw solid red");
          $($(targetElement).children()[0]).css("color", "white");
          $(targetElement[1]).attr("src", "");
        }
      });

      //$("." + this.state.current + " p")[0].textContent = "Add driver";
      let drivers = this.state.drivers;
      drivers[$($(e.target).parent()[0]).attr("identifier")].selected = false;
      this.setState({ budget: this.state.budget + price, drivers });
    }
    this.setState({ isSideBarOpen: !this.state.isSideBarOpen });
  }
  getConstructorColor(id) {
    if (id == 1) return "#FF8700";
    else if (id == 131) return "#00D2BE";
    else if (id == 51) return "#9B0000";
    else if (id == 3) return "#FFFFFF";
    else if (id == 6) return "#DC0000";
    else if (id == 4) return "#FFF500";
    else if (id == 5) return "#469BFF";
    else if (id == 9) return "#1E41FF";
    else if (id == 210) return "#F0D787";
    else if (id == 211) return "#F596C8";
  }
  setImagesAndPercentage(data, id) {
    if (id == 1) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/11.png";
      data[id].budget = 31.3;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/11.png";
      data[id].percent = 37.2;
      data[id].selected = false;
      return data;
    } else if (id == 830) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/15.png";
      data[id].budget = 26.1;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/15.png";
      data[id].percent = 37.2;
      data[id].selected = false;
      return data;
    } else if (id == 8) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/25.png";
      data[id].budget = 10.3;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/25.png";
      data[id].percent = 20;
      data[id].selected = false;
      return data;
    } else if (id == 849) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/30.png";
      data[id].budget = 5.8;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/30.png";
      data[id].percent = 7;
      data[id].selected = false;
      return data;
    } else if (id == 848) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/16.png";
      data[id].budget = 20.3;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/16.png";
      data[id].percent = 16;
      data[id].selected = false;
      return data;
    } else if (id == 847) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/29.png";
      data[id].budget = 5.9;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/29.png";
      data[id].percent = 31.2;
      data[id].selected = false;
      return data;
    } else if (id == 846) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/18.png";
      data[id].budget = 11.5;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/18.png";
      data[id].percent = 43;
      data[id].selected = false;
      return data;
    } else if (id == 839) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/20.png";
      data[id].budget = 12.5;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/20.png";
      data[id].percent = 17.5;
      data[id].selected = false;
      return data;
    } else if (id == 840) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/24.png";
      data[id].budget = 7.9;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/24.png";
      data[id].percent = 16.2;
      data[id].selected = false;
      return data;
    } else if (id == 841) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/26.png";
      data[id].budget = 7.7;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/26.png";
      data[id].percent = 8.2;
      data[id].selected = false;
      return data;
    } else if (id == 832) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/17.png";
      data[id].budget = 15.5;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/17.png";
      data[id].percent = 44.2;
      data[id].selected = false;
      return data;
    } else if (id == 844) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/14.png";
      data[id].budget = 24.2;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/14.png";
      data[id].percent = 31.9;
      data[id].selected = false;
      return data;
    } else if (id == 826) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/22.png";
      data[id].budget = 9.9;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/22.png";
      data[id].percent = 9.3;
      data[id].selected = false;
      return data;
    } else if (id == 822) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/12.png";
      data[id].budget = 28.4;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/12.png";
      data[id].percent = 10.4;
      data[id].selected = false;
      return data;
    } else if (id == 20) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/13.png";
      data[id].budget = 21.8;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/13.png";
      data[id].percent = 13.8;
      data[id].selected = false;
      return data;
    } else if (id == 817) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/19.png";
      data[id].budget = 14.1;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/19.png";
      data[id].percent = 37.9;
      data[id].selected = false;
      return data;
    } else if (id == 842) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/21.png";
      data[id].budget = 10.4;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/21.png";
      data[id].percent = 31.1;
      data[id].selected = false;
      return data;
    } else if (id == 815) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/23.png";
      data[id].budget = 9.3;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/23.png";
      data[id].percent = 51.6;
      data[id].selected = false;
      return data;
    } else if (id == 825) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/28.png";
      data[id].budget = 8.2;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/28.png";
      data[id].percent = 15;
      data[id].selected = false;
      return data;
    } else if (id == 154) {
      data[id].thumbnail =
        "https://fantasy.formula1.com/images/players/slot/27.png";
      data[id].budget = 6.0;
      data[id].image =
        "https://fantasy.formula1.com/images/players/list/27.png";
      data[id].percent = 16.3;
      data[id].selected = false;
      return data;
    }
  }
  setImagesAndPercentageForConstructor(data, id) {
    if (id == 1) {
      data[id].budget = 14.9;
      data[id].percent = 19.2;
      data[id].selected = false;
      return data;
    } else if (id == 3) {
      data[id].budget = 6.5;
      data[id].percent = 1.4;
      data[id].selected = false;
      return data;
    } else if (id == 4) {
      data[id].budget = 12.6;
      data[id].percent = 5.9;
      data[id].selected = false;
      return data;
    } else if (id == 5) {
      data[id].budget = 13.2;
      data[id].percent = 2.4;
      data[id].selected = false;
      return data;
    } else if (id == 6) {
      data[id].budget = 27.4;
      data[id].percent = 10;
      data[id].selected = false;
      return data;
    } else if (id == 9) {
      data[id].budget = 24.6;
      data[id].percent = 22.8;
      data[id].selected = false;
      return data;
    } else if (id == 211) {
      data[id].budget = 10.1;
      data[id].percent = 11.9;
      data[id].selected = false;
      return data;
    } else if (id == 210) {
      data[id].budget = 7.8;
      data[id].percent = 1;
      data[id].selected = false;
      return data;
    } else if (id == 51) {
      data[id].budget = 8.7;
      data[id].percent = 1.3;
      data[id].selected = false;
      return data;
    } else if (id == 131) {
      data[id].budget = 32.2;
      data[id].percent = 25.2;
      data[id].selected = false;
      return data;
    }
  }
  submitFantasy(e) {
    let ids =[]
    $($("#progressBar")[0])
      .attr("style")
      .split(";")
      .forEach((item, i) => {
        if (item.includes("width")) {
          let width = item.split(" ").slice(-1)[0];
          let temp = width.slice(0, width.length - 1);
          ids = $(".hoverCard").map((i,item) =>{
            let id = $($($($(item)[0]).children()[0]).children()[2]).attr("driver")
            return id
        });

        
        }
      });
      this.props.saveFantasySelection(ids.splice(0,5),$($($($(".hoverCard")[5]).children()[0]).children()[2]).attr("constructor"))
     
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12 col-xl-6">
            <div className="card" style={{ height: "80vh" }}>
              <div className="card-header">
                <h5
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  Budget
                  <span style={{ fontWeight: "bold" }}>
                    ${this.state.budget}m
                  </span>
                </h5>
              </div>
              <div className="card-body">
                <div className="row" style={{ marginTop: "45px" }}>
                  <div className="col-4">
                    <div
                      className="card hoverCard 1"
                      onClick={() => {
                        this.handleClick("1");
                      }}
                    >
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
                        <img
                          src=""
                          alt=""
                          style={{
                            width: "70%",
                            height: "100%",
                            position: "absolute",
                            top: "-43px",
                            left: "23px"
                          }}
                        ></img>
                        <p className="card-text" className="text">
                          Add Driver
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div
                      className="card hoverCard 2"
                      onClick={() => {
                        this.handleClick("2");
                      }}
                    >
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
                        <img
                          src=""
                          alt=""
                          style={{
                            width: "70%",
                            height: "100%",
                            position: "absolute",
                            top: "-43px",
                            left: "23px"
                          }}
                        ></img>
                        <p className="card-text" className="text">
                          Add Driver
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div
                      className="card hoverCard 3"
                      onClick={() => {
                        this.handleClick("3");
                      }}
                    >
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
                        <img
                          src=""
                          alt=""
                          style={{
                            width: "70%",
                            height: "100%",
                            position: "absolute",
                            top: "-43px",
                            left: "23px"
                          }}
                        ></img>
                        <p className="card-text" className="text">
                          Add Driver
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      marginTop: "40px"
                    }}
                  >
                    <div className="col-4">
                      <div
                        className="card hoverCard 4"
                        onClick={() => {
                          this.handleClick("4");
                        }}
                      >
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
                          <img
                            src=""
                            alt=""
                            style={{
                              width: "70%",
                              height: "100%",
                              position: "absolute",
                              top: "-43px",
                              left: "23px"
                            }}
                          ></img>
                          <p className="card-text" className="text">
                            Add Driver
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div
                        className="card hoverCard 5"
                        onClick={() => {
                          this.handleClick("5");
                        }}
                      >
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
                          <img
                            src=""
                            alt=""
                            style={{
                              width: "70%",
                              height: "100%",
                              position: "absolute",
                              top: "-43px",
                              left: "23px"
                            }}
                          ></img>
                          <p className="card-text" className="text">
                            Add Driver
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      marginTop: "45px"
                    }}
                  >
                    <div className="col-4">
                      <div
                        className="card hoverCard 6"
                        onClick={() => {
                          this.handleClick("6");
                        }}
                      >
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
                          <img
                            src=""
                            alt=""
                            style={{
                              width: "100%",
                              height: "60%",
                              position: "absolute",
                              top: "-1px",
                              left: "-3px"
                            }}
                          ></img>
                          <p className="card-text" className="text">
                            Add Constructor
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    id="mySidenav"
                    className={
                      this.state.isSideBarOpen ? "sidenavOpen" : "sidenavClose"
                    }
                  >
                    <a
                      className="closebtn"
                      onClick={() => {
                        this.setState({
                          isSideBarOpen: !this.state.isSideBarOpen
                        });
                      }}
                    >
                      &times;
                    </a>

                    {Object.entries(this.state.drivers).map(item => (
                      <div
                        key={item[0]}
                        identifier={item[0]}
                        style={{ display: "flex", padding: "0 20px" }}
                      >
                        <img
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "5px"
                          }}
                          src={item[1].image}
                          alt={item[1].driver}
                        ></img>
                        <div style={{ textAlign: "left", width: "100%" }}>
                          <a href="#" style={{ padding: "0" }} key={item[1].id}>
                            {item[1].driver}
                          </a>
                          <div
                            style={{
                              display: "inline-block",
                              width: "15px",
                              height: "15px",
                              borderRadius: "50%",
                              marginRight: "10px",
                              background: this.getConstructorColor(
                                item[1].constructorId
                              )
                            }}
                          ></div>
                          <span
                            style={{
                              borderRight: "1px solid white",
                              paddingRight: "5px",
                              fontSize: "15px",
                              color: "white"
                            }}
                          >
                            {item[1].constructor}
                          </span>
                          <span
                            style={{
                              borderRight: "1px solid white",
                              paddingRight: "5px",
                              fontSize: "15px",
                              color: "white"
                            }}
                          >
                            {" "}
                            ${item[1].budget}m
                          </span>
                          <span
                            style={{
                              borderRight: "1px solid white",
                              paddingRight: "5px",
                              fontSize: "15px",
                              color: "white"
                            }}
                          >
                            {" "}
                            Points: {Object.values(item[1].circuits)[0]}
                          </span>
                        </div>
                        {item[1].selected ? (
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={{
                              background: "white",
                              color: "red",
                              marginLeft: "auto",
                              marginTop: "10px"
                            }}
                            className="iconStyle"
                            onClick={this.removeDriver}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{
                              background: "red",
                              color: "white",
                              marginLeft: "auto",
                              marginTop: "10px"
                            }}
                            className="iconStyle"
                            onClick={this.selectDriver}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div
                    id="mySidenavConstructor"
                    className={
                      this.state.isSideBarConstructorOpen
                        ? "sidenavConstructorOpen"
                        : "sidenavConstructorClose"
                    }
                  >
                    <a
                      className="closebtn"
                      onClick={() => {
                        this.setState({
                          isSideBarConstructorOpen: !this.state
                            .isSideBarConstructorOpen
                        });
                      }}
                    >
                      &times;
                    </a>

                    {Object.entries(this.state.constructors).map(item => (
                      <div
                        key={item[0]}
                        identifier={item[0]}
                        style={{ display: "flex", padding: "0 20px" }}
                      >
                        <img
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "5px"
                          }}
                          src={item[1].url}
                          alt={item[1].name}
                        ></img>
                        <div style={{ textAlign: "left", width: "100%" }}>
                          <a href="#" style={{ padding: "0" }} key={item[1].id}>
                            {item[1].name}
                          </a>
                          <div
                            style={{
                              display: "inline-block",
                              width: "15px",
                              height: "15px",
                              borderRadius: "50%",
                              marginRight: "10px",
                              background: this.getConstructorColor(item[0])
                            }}
                          ></div>

                          <span
                            style={{
                              borderRight: "1px solid white",
                              paddingRight: "5px",
                              fontSize: "15px",
                              color: "white"
                            }}
                          >
                            {" "}
                            ${item[1].budget}m
                          </span>
                          <span
                            style={{
                              borderRight: "1px solid white",
                              paddingRight: "5px",
                              fontSize: "15px",
                              color: "white"
                            }}
                          >
                            {" "}
                            Points: 0
                          </span>
                        </div>
                        {item[1].selected ? (
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={{
                              background: "white",
                              color: "red",
                              marginLeft: "auto",
                              marginTop: "10px"
                            }}
                            className="iconStyle"
                            onClick={this.removeConstructor}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{
                              background: "red",
                              color: "white",
                              marginLeft: "auto",
                              marginTop: "10px"
                            }}
                            className="iconStyle"
                            onClick={this.selectConstructor}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card" style={{ height: "80vh" }}>
              <div className="card-body">
                <div
                  onClick={this.submitFantasy}
                  id="confirm"
                  href="#"
                  style={{
                    position: "relative",
                    height: "50px",
                    textAlign: "center",
                    width: "100%",
                    padding: "10px 0",
                    border: "1px solid black",
                    borderRadius: "10px"
                  }}
                >
                  <span
                    style={{
                      zIndex: "1",
                      position: "absolute",
                      left: "0",
                      fontWeight: "bold",
                      width: "100%"
                    }}
                  >
                    Go somewhere
                  </span>{" "}
                  <span
                    id="progressBar"
                    style={{
                      zIndex: "0",
                      position: "absolute",
                      width: "0%",
                      height: "100%",
                      borderRadius: "10px",
                      top: "0",
                      left: "0",
                      background: "red"
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h3
                  className="modal-title"
                  id="exampleModalLabel"
                  style={{ color: "red", fontWeight: "bold" }}
                >
                  Exceeded allowed budget!
                </h3>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
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

export default connect(mapStateToProps, actionCreators)(Favorite);
