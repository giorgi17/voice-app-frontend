import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import menuReducer from "./menuReducers";

export default combineReducers({
  auth: authReducer,
  menu: menuReducer,
  errors: errorReducer
});