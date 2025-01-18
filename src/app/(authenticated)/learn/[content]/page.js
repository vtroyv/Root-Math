'use client'
import React from 'react'
import { Card, CardTitle, CardText, CardBody,  } from 'reactstrap';
import { useRouter } from 'next/navigation';

export default function EdxPm1() {
    const router = useRouter()


    return (
        <div className='Edxpm1-container' >
     
        
             {/* <Card outline className='Edxpm1-title-card-container' color='info'  >
     
                 <CardTitle className ='Edxpm1-title-card'>
                     <h1><strong>Edexcel Mathematics </strong> - Pure Mathematics</h1>
                                  <h1>Year 12</h1>
                 </CardTitle>
     
     
                 <CardBody>
                     <Card   outline className="my-progress"> 
     
                     <CardText>
                         My Progress
                     </CardText>
                      
                 
                      
                     </Card>
                 </CardBody>
       
         </Card> */}
     
         <div className='edx-maths-1-topics'>
         <Card outline className='Edxpm1-title-card-container'  >
     
     <CardTitle className ='Edxpm1-title-card'>
         <h1><strong>Edexcel Mathematics </strong> - Pure Mathematics</h1>
                      <h1>Year 12</h1>
     </CardTitle>
     
     
     <CardBody>
         <Card   outline className="my-progress"> 
     
         <CardText>
             My Progress
         </CardText>
          
     
          
         </Card>
     </CardBody>
     
     </Card>
             
             <Card className='proof-y1'>
       
                 <CardTitle> <h2 style={{color: '#17a2b8'}}> Proof</h2></CardTitle>
     
                 <Card className='subsection' onClick={()=>navigate('what-is-proof')}>
                         <CardText>
                             What is Proof?
                         </CardText>
     
     
                 </Card>
     
                 <Card className='subsection' onClick={()=>navigate('methods-of-proof')}>
                         <CardText>
                            Methods of Proof
                         </CardText>
     
                 </Card>
                 
     
     
             </Card>
     
             <Card className='algebra-y1'>
                 <CardTitle> 
                     <h2>Algebra & Functions</h2>
     
                 </CardTitle>
     
                 <Card className='subsection' onClick={()=>navigate('algebraic-expressions')}>
                         <CardText>
                          Algebraic Expressions
                         </CardText>
                     </Card>
     
                     <Card className='subsection' onClick={()=>navigate('quadratic-functions')}>
                         <CardText>
                             Quadratic Functions
                         </CardText>
     
                     </Card>
     
                     <Card className='subsection' onClick={()=>navigate('simultaneous-equations')}>
                         <CardText>
                             Simultaneous Equations
                         </CardText>
     
                     </Card>
     
                     <Card className='subsection' onClick={()=> navigate('inequalities')}>
                         <CardText>
                             Inequalities
                         </CardText>
     
                     </Card>
     
                     <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Graphs & Transformations
                         </CardText>
     
                     </Card>
                     <Card className='subsection'onClick={()=>navigate('')}>
                         <CardText>
                             Algebraic Methods
                         </CardText>
     
                     </Card>
     
             </Card>
             
             <Card className='geometry-y1'>
                 <CardTitle> 
                     <h2>Coordinate Geometry in the (x,y) Plane</h2>
                 </CardTitle>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText >
                            {/* style={{display: 'flex', justifyContent:'space-between', alignContent:'center', alignItems:'center'}} */}
                            <div>Straight Lines</div> 
                           
                          
                             </CardText>
                        
     
                 </Card>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Circles
                         </CardText>
     
                 </Card>
     
             </Card>
     
             <Card className='sequences-series-y1'>
                 <CardTitle> 
                     <h2>Sequences & Series</h2>
                 </CardTitle>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Binomial Expansion
                         </CardText>
     
                 </Card>
     
     
             </Card>
     
             <Card className='trigonometry-y1'>
                 <CardTitle> 
                     <h2>Trigonometry</h2>
                 </CardTitle>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Sine, Cosine & Tangent
                         </CardText>
     
                 </Card>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Trigonometry & Triangles
                         </CardText>
     
                 </Card>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                            Trignometric Graphs
                         </CardText>
     
                 </Card>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                            Trignometric Angles & Ratios 
     
                         </CardText>
     
                 </Card>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                            Trignometric Identities
                            
                         </CardText>
     
                 </Card>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                            Trignometric Equations
                            
                         </CardText>
     
                 </Card>
     
     
     
             </Card>
     
             <Card className='logs-exp-y1'>
                 <CardTitle> 
                     <h2>Exponentials & Logarithms</h2>
                 </CardTitle>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Exponential Graphs 
                         </CardText>
     
                 </Card>
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Logarithms
                         </CardText>
     
                 </Card>
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Exponential Modelling
                         </CardText>
     
                 </Card>
                
     
     
             </Card>
     
             <Card className='differentiation-y1'>
                 <CardTitle> 
                     <h2>Differentiation</h2>
                 </CardTitle>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Gradients & Derivatives 
                         </CardText>
     
                 </Card>
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Differentiating Functions
                         </CardText>
     
                 </Card>
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                            Gradients, Tangents & Normals
                         </CardText>
     
                 </Card>
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Rates of Change & Modelling
                         </CardText>
     
                 </Card>
     
               
             </Card>
     
             <Card className='integration-y1'>
                 <CardTitle> 
                     <h2>Integration</h2>
                 </CardTitle>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText >
                             What Is Integration?
                         </CardText>
                 </Card>
     
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                            Definite Integrals
                         </CardText>
     
                 </Card>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                     <CardText>
                         Indefinite Integrals
                     </CardText>
                 </Card>
     
             </Card>
     
             <Card className='vectors-y1'>
                 <CardTitle> 
                     <h2>Vectors</h2>
                 </CardTitle>
     
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                            What Are Vectors?
                         </CardText>
     
                 </Card>
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                             Vectors In Geometry
                         </CardText>
     
                 </Card>
                 <Card className='subsection' onClick={()=>navigate('')}>
                         <CardText>
                         Modelling With Vectors
                         </CardText>
                 </Card>
             </Card>
         </div>
        </div>
       )
}