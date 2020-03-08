const initialState = {
    drivers: [],
    driver: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "DRIVERS":
        return {
          ...state,
          drivers: action.payload
        };
      default:
        return state;
    }
  }