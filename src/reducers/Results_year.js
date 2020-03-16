
const initialState = {
    season_results: [],
    season_result: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "SEASON_RESULTS_YEAR":
        return {
          ...state,
          season_results: action.payload
        };
      
        
      default:
        return state;
    }
  }