import { combineReducers } from "@reduxjs/toolkit";
import staffsReducer from "./staffReducer";
import { staffApi } from "../RTK/staffsService";

const rootReducer = combineReducers({
 staffs: staffsReducer,
 [staffApi.reducerPath]: staffApi.reducer,
});

export default rootReducer;