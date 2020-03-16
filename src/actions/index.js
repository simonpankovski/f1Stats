import axios from "axios";
import { dispatch } from "d3";
export const increment = num => {
  return {
    type: "INCREMENT",
    payload: num
  };
};
export const getCircuits = () => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });

  const res = await axios.get("http://localhost:9090/circuits", {
    headers: { Authorization: login.data.token }
  });
  dispatch({
    type: "CIRCUITS",
    payload: res.data
  });
};
export const getDrivers = () => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });

  const res = await axios.get("http://localhost:9090/drivers/", {
    headers: { Authorization: login.data.token }
  });
  dispatch({
    type: "DRIVERS",
    payload: res.data
  });
};
export const getConstructors= () => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });

  const res = await axios.get("http://localhost:9090/constructors/all", {
    headers: { Authorization: login.data.token }
  });
  dispatch({
    type: "CONSTRUCTORS",
    payload: res.data
  });
};
export const getResultsByCircuit = id => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });

  const res = await axios.get("http://localhost:9090/results/circuit?circuitId=" + id, {
    headers: { Authorization: login.data.token }
  });
  const finished = await axios.get("http://localhost:9090/results/circuit/" + id+"/finished", {
    headers: { Authorization: login.data.token }
  });
  const all = await axios.get("http://localhost:9090/results/circuit/count_all/" + id, {
    headers: { Authorization: login.data.token }
  });
  
  dispatch({
    type: "CIRCUIT_RESULTS",
    payload: {res:res.data,finished:finished.data,all:all.data}
  });

};
export const getResultsByDriver = id => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });

  const res = await axios.get("http://localhost:9090/results/drivers?driverId=" + id, {
    headers: { Authorization: login.data.token }
  });
  
  dispatch({
    type: "DRIVER_RESULTS",
    payload: {res:res.data}
  });

};
export const getResultsByConstructor = id => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });

  const res = await axios.get("http://localhost:9090/results/constructors?constructorId=" + id, {
    headers: { Authorization: login.data.token }
  });
  
  dispatch({
    type: "CONSTRUCTOR_RESULTS",
    payload: {res:res.data}
  });

};
export const getSeasonResults = year => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });
  const res = await axios.get("http://localhost:9090/results/races/all", {
    headers: { Authorization: login.data.token }
  });
  
  dispatch({
    type: "SEASON_RESULTS",
    payload: res.data

  });
};
export const getSeasonResultsByYear= year => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });
  const res = await axios.get("http://localhost:9090/results/year/"+year, {
    headers: { Authorization: login.data.token }
  });
  
  dispatch({
    type: "SEASON_RESULTS_YEAR",
    payload: res.data

  });
};
export const getDriverWins =() => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });
  const res = await axios.get("http://localhost:9090/results/group", {
    headers: { Authorization: login.data.token }
  });
  
  dispatch({
    type: "DRIVER_WINS",
    payload: res.data

  });
};
export const getFantasySelections =() => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });
  const res = await axios.get("http://localhost:9090/users/drivers", {
    headers: { Authorization: login.data.token }
  });
  const res1 = await axios.get("http://localhost:9090/users/constructor", {
    headers: { Authorization: login.data.token }
  });
  dispatch({
    type: "FANTASY",
    payload: {drivers:res.data,constructor:res1.data}

  });
};
export const saveFantasySelection = (drivers,constructor)=> async dispatch =>{
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test1@gmail.com",
    password: "password"
  });
  await axios.post("http://localhost:9090/users/fantasy",drivers, { 
    headers: { Authorization: login.data.token }
  });
  await axios.post("http://localhost:9090/users/constructor",constructor, { 
    headers: { Authorization: login.data.token }
  });
}