
import { createSlice} from "@reduxjs/toolkit";



const initialState = {
    currentUser: {},
    isLoading: true,
    hasError: false,
    
};


const options ={
    name:'user',
    initialState,

    reducers: {

        getUser: (state, action) =>{
            Object.assign(state.currentUser, action.payload);

        },
       
        clearUser: (state) =>{
            
            state.currentUser.uid = null;
            state.currentUser.firstName=  null;
            state.currentUser.surname = null;
            state.currentUser.email= null;
            state.currentUser.year=  null;
            state.currentUser.examBoard=  null; 
            state.currentUser.onTrial = null;
            state.currentUser.isSubscribed = null;
            state.isLoading= true;
            
    }

},
extraReducers: {
    'user/registerUser/pending': (state) =>{
        
        state.hasError= false;
    },
    'user/registerUser/fulfilled': (state,action) =>{
        Object.assign(state.currentUser, action.payload);
        state.isLoading= false;
        state.hasError= false;

    },
    'user/registerUser/rejected': (state) =>{
        state.isLoading = false;
        state.hasError = true;
    }

}
}

const userSlice = createSlice(options);

//action creators 
export const {getUser, clearUser} = userSlice.actions; 

// async thunk


    


//selectors 
export const selectFirstName = (state) => state.user.firstName;



//exporting the usersSlice reducer 
export default userSlice.reducer;

//
