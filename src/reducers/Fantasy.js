const initialState = {
    fantasys: [],
    fantasy: {}
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case "FANTASY":
        return {
          ...state,
          fantasys: action.payload
        };
      default:
        return state;
    }
  }