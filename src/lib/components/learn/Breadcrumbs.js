'use client'
import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Breadcrumbs() {

    const router = useRouter()
    const pathname = usePathname()

    // you'll need to change the breadcrumbs so that it's like uplearns, in other words you shou;dn't be able to navigate to re render the same page that your currently on. 

    let currentLink = '';

    const crumbs = pathname.split('/').filter(crumb => crumb !== '').map(crumb => {
        currentLink += `/${crumb}`
        return (<BreadcrumbItem  key={crumb} active={true}>
            <Link href={currentLink} className='router-link'>

            {crumb === 'edx-maths-1'? 'Edexcel Mathematics Pure Maths year 12' : crumb === 'learn' ? 'Learn': crumb.includes('-') ? crumb.split('-').map(word=> word.charAt(0).toUpperCase() + word.slice(1)).join(' '): crumb === 'quizzes' ? 'Quizzes' : crumb === 'questions' ? 'Questions' :crumb}
            
            </Link>
        
        </BreadcrumbItem>)
    })

    return (
        <div>
            <Breadcrumb>
            {crumbs}
            </Breadcrumb>
            
        </div>
    );
}

