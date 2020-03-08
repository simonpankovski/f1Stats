
const initialState = {
    driver_results: [],
    driver_result: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "DRIVER_RESULTS":
        return {
          ...state,
          driver_results: action.payload
        };
      
        
      default:
        return state;
    }
  }