
import "bootswatch/dist/sketchy/bootstrap.min.css";
import "./styles/bootstrap.css";
import 'katex/dist/katex.min.css';
import Home from './components/Home'
import Signup from './components/Signup';
import Login from './components/Login'
import LandingPage from './components/LandingPage'
import Account from './components/Account/Account';
import UserDetails from './components/Account/UserDetails';
import Quizzes from './components/Learn/Quizzes/Quizzes';
import Upload from "./components/Upload";


import Lessons from './components/Lessons';
import Learn from './components/Learn/Learn';
import LearnCourses from './components/Learn/LearnCourses';
import EdxPm1 from "./components/Learn/EdxPm1";
import { EdxMath1SubsecLoader } from "./components/Learn/Edxpm1-Subsections/EdxMath1Subsec";
import EdxMath1Videos from "./components/Learn/Edxpm1-Subsections/EdxMath1Videos";
import Contact from "./components/Contact";


import Features from './components/Features'
import Subsection from "./components/Learn/Edxpm1-Subsections/EdxMath1Subsec";

import MultipleChoice from "./components/Learn/Quizzes/QuizDisplay";

import { FbMethodContextProvider } from "./firebase/fbMethodContext";


import { createBrowserRouter, RouterProvider} from 'react-router-dom';










const router = createBrowserRouter([
  {
   path: '/',
   element: <Home />,
   children: [
    {
      index: true, 
      element: <LandingPage />

    },
   

    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/login', 
      element: <Login />
    },
    {
      path:'/features',
      element: <Features />
    }, 
    {
      path:'/contact',
      element:<Contact />
    }
   ]
  },
  {
    path:'/upload/:quizTitle/:uid', 
    element: <Upload/>

  },
 

  {
    path: '/account',
    element: <Account />, 
    children:[
      {
        index: true,
        element: <UserDetails/>,
      }
    ]
  },
  
  {
    path: '/lessons',
    element: <Lessons />

  },
  {
    path: '/learn',
    element: <Learn />, 
    children:[
      {
     index: true,
      element: <LearnCourses />
      },

      {
        path: 'quizzes',
        element: <Quizzes />, 
      },
      {
        path:'quizzes/:title', 
        element: <MultipleChoice />

      },
      {
        path: 'edx-maths-1', 
        element: <EdxPm1 />,
      }, 
      
      {
        path: 'edx-maths-1/:subsection',
        loader: EdxMath1SubsecLoader, 
        element: <Subsection />,
        
      },
      {
        path: 'edx-maths-1/:subsection/:video', 
        element: <EdxMath1Videos />, 
        
      }
    
    ]
  }

]);

function App() {
 


  return (
    <>

     <FbMethodContextProvider>
       
      <RouterProvider router={router}/>
  
      </FbMethodContextProvider>
        
    </>
    
      
      
   
   
   

   
    
  );
}

export default App;
