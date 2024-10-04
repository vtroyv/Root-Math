import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  console.log(location);

  // you'll need to change the breadcrumbs so that it's like uplearns, in other words you shouldnt be able to navigate to redner the same page that your currently on. 
  let currentLink = '';
  const crumbs = location.pathname.split('/').filter(crumb => crumb !== '').map(crumb => {
    currentLink += `/${crumb}`
    return (<BreadcrumbItem active key={crumb}>
      <Link to={currentLink} className='router-link'>
        {crumb === 'edx-maths-1'? 'Edexcel Mathematics Pure Maths year 12' : crumb === 'learn' ? 'Learn': crumb.includes('-') ? crumb.split('-').map(word=> word.charAt(0).toUpperCase() + word.slice(1)).join(' '): crumb === 'quizzes' ? 'Quizzes' : crumb }

        </Link>
      
      </BreadcrumbItem>




    )
  
  })
  //the way that we will get a array with the locations, however, if there is a /learn eg / at the start and edx-maths-1/ eg / at the end, we will get two empty strings, put into our array so we need to remove these.
  //so we need to filter it, so it removes all empty strings. 
  //now that we have just an array of words, we wanna cycle through that and return a template for each one, so we will use the map method. 
  //when using the map for each crumb we need to update the current link of that crumb and then we need to return a bit of template that chooses that link for that crumb, 
  return (
    <div>
        <Breadcrumb>
            {crumbs}
        </Breadcrumb>
    </div>
  )
}

export default Breadcrumbs