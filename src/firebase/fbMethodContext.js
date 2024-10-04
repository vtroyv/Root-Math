import React,{useContext, createContext} from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut, 
 } from 'firebase/auth'

 
 import { auth } from './firebaseConfig';

const fbMethodContext = createContext();


export const FbMethodContextProvider  = ({children}) => {

   

    const signIn = (email, password) =>{
        return signInWithEmailAndPassword(auth, email, password);
    }

    const signUp = (email, password) =>{
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const logout = () =>{
        signOut(auth);
    }
  
    return (
     <fbMethodContext.Provider value={{signIn, logout, signUp}}>
        {children}
    </fbMethodContext.Provider>
    );

};

//this is what is going to make our context available throughout our application. 
export const UserAuth = () =>{
    return useContext(fbMethodContext);
}