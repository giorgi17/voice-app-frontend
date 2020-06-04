import { SET_CURRENT_MENU } from "../actions/types";

  const initialState = {
    currentMenu: 'home' 
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CURRENT_MENU:
        return {
          ...state,
          currentMenu: action.payload
        };
      default:
        return state;
    }
  }