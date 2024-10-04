import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title:'', 
    topic:'', 
    latex:'', 
    difficulty:'', 
    type:''//type should represent the type of question, we then should render UI of the quizDisplay component based on the type of question, e.g. selection, hand written, graph, fill in etc
}



export const questionSlice = createSlice({
    name: 'question', 
    initialState, 
    reducers: {
        selectQuestion: (state,action) => {
            state.question = action.payload
        }
    }
})

export const {selectQuestion} = questionSlice.actions

export default questionSlice.reducer