import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '@/type';

interface ProductState {
    productList: ProductType[]
    // productDetail: ProductType
}

const initialState: ProductState = {
    productList: [],
    // productDetail: {
    //     product_id: "",
    //     product_name: "",
    //     barcode: "",
    //     selling_price: 0,
    //     purchase_price: 0,
    //     img: "",
    //     date: "",
    //     user_id: "",
    //     category_id: ""
    // }
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProductList: (state, action: PayloadAction<ProductType[]>) => {
            state.productList = action.payload
        },
    },
});

export const { setProductList } = productSlice.actions;
export default productSlice.reducer;