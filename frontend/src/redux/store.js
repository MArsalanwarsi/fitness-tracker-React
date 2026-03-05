import { configureStore } from '@reduxjs/toolkit'
import authSlice from "../redux/slice/authSlice"
import forgotSlice from "../redux/slice/forgotSlice"
import excersiseSlice from "../redux/slice/excersiseSlice"
import categorySlice from './slice/categorySlice'



export const store = configureStore({
  reducer: {
    auth: authSlice,
    forgot: forgotSlice,
    excersise: excersiseSlice,
    category:categorySlice
  },
})