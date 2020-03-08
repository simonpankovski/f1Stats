import { combineReducers } from "redux";

import circuit from './Circuits'
import circuit_result from './Circuit_results'
import driver_result from './Driver_results'
import season_results from './Season_results'
import constructor_result from './Constructor_results'
import driver_win from './Driver_wins'
import driver from './Drivers'
import constructor from './Constructors'

const rootReducer = combineReducers({
    season_results,
    circuit,
    circuit_result,
    driver,
    driver_result,
    constructor,
    constructor_result,
    driver_win
});
export default rootReducer;