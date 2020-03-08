
const initialState = {
    driver_wins: [],
    driver_win: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "DRIVER_WINS":
        return {
          ...state,
          driver_wins: action.payload
        };
      
        
      default:
        return state;
    }
  }