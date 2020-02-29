const initialState = {
    season_results: []
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "SEASON_RESULTS":
        return {
          ...state,
          season_results: action.payload
        };
        
      default:
        return state;
    }
  }