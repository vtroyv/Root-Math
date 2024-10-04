import { configureStore } from "@reduxjs/toolkit";
import questionReducer from "./slices/questionslice";
import { apiSlice } from "./slices/apiSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            question: questionReducer,
            [apiSlice.reducerPath] : apiSlice.reducer,

        },
        middleware: (getDefaultMiddileware) => 
            getDefaultMiddileware().concat(apiSlice.middleware)
    });
};

