import { combineReducers } from "redux";
import holdersReducer from "./holdersReducer";

export const rootReducer = combineReducers({
    //add other reducers here
    holdersReducer
});