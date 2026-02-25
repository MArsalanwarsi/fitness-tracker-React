import { configureStore } from '@reduxjs/toolkit'
import authSlice from "../redux/slice/authSlice"
import forgotSlice from "../redux/slice/forgotSlice"



export const store = configureStore({
  reducer: {
    auth: authSlice,
    forgot: forgotSlice
  },
})