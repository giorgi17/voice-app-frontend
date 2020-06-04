import { SET_CURRENT_MENU } from "../actions/types";

// Set current menu icon
export const setMenu = menuName => dispatch => {
    dispatch({
        type: SET_CURRENT_MENU,
        payload: menuName
      });
  };