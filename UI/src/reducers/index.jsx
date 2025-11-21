import { combineReducers } from "@reduxjs/toolkit";
import staffsReducer from "./staffReducer";
import { staffApi } from "../RTK/staffsService";
import accessSlice from "./access";

const rootReducer = combineReducers({
 staffs: staffsReducer,
 access: accessSlice,
 [staffApi.reducerPath]: staffApi.reducer,
});

export default rootReducer;