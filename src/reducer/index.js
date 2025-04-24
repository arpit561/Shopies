import {combineReducers} from "@reduxjs/toolkit"
import authReducer from "../slices/authSlice"
import shopReducer from "../slices/shopSlice"
import customerReducer from "../slices/shopSlice"

const rootReducer= combineReducers({
    user: authReducer,
    shop: shopReducer,
    customer: customerReducer,
})

export default rootReducer;