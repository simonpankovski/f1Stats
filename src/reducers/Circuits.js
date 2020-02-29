const initialState = {
    circuits: [],
    circuit: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "CIRCUITS":
        return {
          ...state,
          circuits: action.payload
        };
      default:
        return state;
    }
  }