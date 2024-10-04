import { createSlice} from "@reduxjs/toolkit";

const initialState= {loggedIn: false};

const options = {
    name: 'auth', 
    initialState, 
    reducers: {
        login: (state) =>{
            state.loggedIn = true;
        },

        logout: (state) =>{
            state.loggedIn = false;
        }

    }


}

const authSlice = createSlice(options); 

//selectors


//actions
export const {login, logout} = authSlice.actions;

//reducer
export default authSlice.reducer;