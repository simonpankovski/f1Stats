import React from "react";
import "./App.css";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Seasons from "./components/Seasons/Seasons";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import Home from "./components/Home";
import Favorite from "./components/Favorite";
import store from "./store";
import Circuit_race from "./components/Race/Circuit_result";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidenav from "./components/Sidenav";
import Constructors from "./components/Constructors/Constructors";
import Drivers from "./components/Drivers/Drivers";
import DriverProfile from "./components/Drivers/DriverProfile";
import ConstructorProfile from "./components/Constructors/ConstructorProfile";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <div className="row row-style">
            <div className="col-2" style={{paddingRight:"0"}}>
              <Sidenav />
            </div>
            <div className="col-10" style={{height:"100vh"}}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/Circuits" component={Content} />
                <Route path="/Drivers" component={Drivers} />
                <Route path="/Constructors" component={Constructors} />
                <Route path="/Seasons" component={Seasons} />
                <Route path="/Favorite" component={Favorite} />
                <Route path="/Circuit_race/:id" component={Circuit_race} />
                <Route path="/Driver_profile/:id" component={DriverProfile} />
                <Route path="/Constructor_profile/:id" component={ConstructorProfile} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
