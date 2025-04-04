import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryType } from '@/type';

interface CategoryState {
    categoryList: CategoryType[]
    // categoryDetail: CategoryType
}

const initialState: CategoryState = {
    categoryList: []
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategoryList: (state, action: PayloadAction<CategoryType[]>) => {
            state.categoryList = action.payload
        },
    },
});

export const { setCategoryList } = categorySlice.actions;
export default categorySlice.reducer;