import {create} from 'zustand'

//Create something that can store current lessons,
//Create functions that can update the tasks status as their being completed, and track feedback,
//Poentially even track the current latex on the string. 

const useStore = create((set)=> ({
    tasks: [], 
    //functions go here


}))