import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/store/authSlice"
import productReducer from "@/store/productSlice"
import categoryReducer from "@/store/categorySlice"
const store = configureStore({
  reducer: {
    authSlice:authReducer,
    productSlice:productReducer,
    categorySlice:categoryReducer

  }
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store