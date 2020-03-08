

const initialState = {
    constructor_results: [],
    constructor_result: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "CONSTRUCTOR_RESULTS":
        return {
          ...state,
          constructor_results: action.payload
        };
      
        
      default:
        return state;
    }
  }