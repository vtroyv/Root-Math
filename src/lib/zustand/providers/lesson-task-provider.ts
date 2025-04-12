'use client'
import { create } from "zustand"

//First we need to create types and then stores for each type of question

//MULTIPLE CHOICE IMAGES AND TEXT

export type Choice ={
    url: string;
    alt: string;
    width: number; 
    height: number;
}

export type MultipleChoiceQuestion = {
    selectedChoice: Choice | null;
    selectChoice: (choice: Choice) => void;
}

export const useMultipleChoiceStore = create<MultipleChoiceQuestion>((set, get) => ({
    selectedChoice: null,
    selectChoice: (choice: Choice) => set({ selectedChoice: choice })
}))


//I think i will need a more general store, something that can hold all the tasks of the question 

