import { combineReducers } from "@reduxjs/toolkit";
import staffsReducer from "./staffReducer";

const rootReducer = combineReducers({
 staffs: staffsReducer,
});

export default rootReducer;