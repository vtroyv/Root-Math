import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            
            [apiSlice.reducerPath] : apiSlice.reducer,

        },
        middleware: (getDefaultMiddileware) => 
            getDefaultMiddileware().concat(apiSlice.middleware)
    });
};

