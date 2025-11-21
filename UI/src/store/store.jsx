import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";
import { staffApi } from "../RTK/staffsService";

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
    }).concat(staffApi.middleware),

})


export default store
