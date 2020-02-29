import React from "react";
import "./App.css";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Seasons from "./components/Seasons/Seasons";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {Provider} from 'react-redux';
import Home from "./components/Home";
import Favorite from "./components/Favorite";
import store from './store'
import Circuit_race from "./components/Race/Circuit_result";
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <Provider store={store}>
    <Router>
    <div className="App">
        <Navbar />
        <Switch>
        <Route exact path="/" component={Home}/>
        <Route  path="/Circuits" component={Content}/>
        <Route  path="/Seasons" component={Seasons}/>
        <Route  path="/Favorite" component={Favorite}/>
        <Route  path="/Circuit_race/:id" component={Circuit_race}/>
        </Switch>
    </div>
    </Router>
    </Provider>
  );
}

export default App;
