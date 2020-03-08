
const initialState = {
    constructors: [],
    constructor: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "CONSTRUCTORS":
        return {
          ...state,
          constructors: action.payload
        };
      default:
        return state;
    }
  }