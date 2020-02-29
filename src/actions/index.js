import axios from "axios";
export const increment = num => {
  return {
    type: "INCREMENT",
    payload: num
  };
};
export const getCircuits = () => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test@gmail.com",
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
export const getResultsByCircuit = id => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test@gmail.com",
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
export const getSeasonResults = year => async dispatch => {
  const login = await axios.post("http://localhost:9090/users/login", {
    username: "test@gmail.com",
    password: "password"
  });
  const res = await axios.get("http://localhost:9090/results/year/" + year, {
    headers: { Authorization: login.data.token }
  });
  
  dispatch({
    type: "SEASON_RESULTS",
    payload: res.data

  });
};