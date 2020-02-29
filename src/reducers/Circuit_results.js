const initialState = {
    circuit_results: [],
    circuit_result: {}
   
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "CIRCUIT_RESULTS":
        return {
          ...state,
          circuit_results: action.payload
        };
        
      default:
        return state;
    }
  }