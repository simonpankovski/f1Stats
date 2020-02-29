import { combineReducers } from "redux";

import circuit from './Circuits'
import circuit_result from './Circuit_results'
import season_results from './Season_results'
const rootReducer = combineReducers({
    season_results,
    circuit,
    circuit_result
});
export default rootReducer;