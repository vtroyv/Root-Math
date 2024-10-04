import React, {useState,useEffect} from 'react'

import { useGetQuestionsQuery } from '../../../redux/learnSlice';





import { Table, Dropdown,  DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody, Input, InputGroup, } from 'reactstrap';
import "bootstrap-icons/font/bootstrap-icons.css"
import {Link, } from 'react-router-dom';

import Calendar from '../../Utilities/Calendar';






const Quizzes = () => {



  

  const [statusOpen, setStatusOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  //load and cache the data 
  useEffect(()=>{
    return ()=> console.log('component is unmounted')
  },[])

  const { data, isLoading, error, } = useGetQuestionsQuery();
  console.log('the data is:')
  console.log(data)



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
  
  
    return <div>No data available</div>;
  }






const videos = data.map((question)=>{
  return(
    <tr key={question.title}>
      <td><i className="bi bi-check-lg" style={{fontSize:'1.2rem'}}></i> </td>
      <td><Link to={`${question.title.split(' ').join('-')}`} state={question} className='quiz-link'>{question.title}</Link></td>
      <td>{question.topic}</td>
      <td>{question.difficulty}</td>

    </tr>
    
  )
})



  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  const searchIcon = inputValue
    ? <i className="bi bi-x-lg" onClick={handleClearInput}></i>
    : <i className="bi bi-search"></i>;
  
    const toggleTopic = () => setTopicOpen((prevState) => !prevState);
    const toggleStatus = () => setStatusOpen((prevState) => !prevState);
    const toggleDifficulty = () => setDifficultyOpen((prevState)=> !prevState);
    // const containerRef = useRef(null);
    
    
 
  //  const questions = data.map((quiz)=> )

  


  return (
    <div className='quiz-container'> 
    
       


        {/*By setting teh display to false were able to display our latex inline, meaning we display text and math  like this ^^ */}

        {/* <div ref={containerRef}> </div>

        <Button onClick ={updateLatex}>change latex above</Button> */}

        
        <div className='quiz-table'> 
        <Table responsive  striped>
          {/* This is hardcoded for now, but we wish to add connect typesense to the database to enable searching for questions as well as 
          having buttons to enable filtering of questions based on difficulty  */}
  <thead>
    <tr>
      <th>
        <Dropdown isOpen={statusOpen} toggle={toggleStatus} direction='down' >
          <DropdownToggle caret color='info' size='sm' style={{borderRadius:'0px', width:'fit-content',  height:'2.5rem'}} outline> Status </DropdownToggle>
          <DropdownMenu>
            <DropdownItem style={{display:"flex",  justifyContent:'space-between'}}><span>Completed</span> <i className="bi bi-check-lg" style={{fontSize:'1.2rem'}}></i></DropdownItem>
            <DropdownItem style={{display:"flex",  justifyContent:'space-between'}}><span>Todo</span> <i className="bi bi-dash-lg" style={{fontSize:'1.2rem', fontWeight:'bold'}}></i></DropdownItem>

          </DropdownMenu>

          
        </Dropdown>
      </th>
      <th>
        Title
      </th>
      <th>
        <Dropdown isOpen={topicOpen} toggle={toggleTopic} direction='down'>
          <DropdownToggle caret color='info' size='sm' style={{borderRadius:'0px', widht:'fit-content', height:'2.5rem'}} outline> Topic</DropdownToggle>
          <DropdownMenu>
          <DropdownItem style={{display:"flex",  justifyContent:'flex-start'}}><span>Proof</span> </DropdownItem>
          <DropdownItem style={{display:"flex",  justifyContent:'flex-start'}}><span>Quadratic Functions</span> </DropdownItem>
          <DropdownItem style={{display:"flex",  justifyContent:'flex-start'}}><span>Algebra</span> </DropdownItem>
          <DropdownItem style={{display:"flex",  justifyContent:'flex-start'}}><span>Differentiation</span> </DropdownItem>
          <DropdownItem style={{display:"flex",  justifyContent:'flex-start'}}><span>Integration</span> </DropdownItem>
          <DropdownItem style={{display:"flex",  justifyContent:'flex-start'}}><span>Logarithms</span> </DropdownItem>
          <DropdownItem style={{display:"flex",  justifyContent:'flex-start'}}><span>Vectors</span> </DropdownItem>

          </DropdownMenu>

        </Dropdown>
      </th>
      <th>
      <Dropdown isOpen={difficultyOpen} toggle={toggleDifficulty} direction='down' >
          <DropdownToggle caret size='sm' color='info' style={{borderRadius:'0px',width:'fit-content',height:'2.5rem'}} outline> Difficulty </DropdownToggle>
          

          <DropdownMenu>
            <DropdownItem style={{display:"flex",  justifyContent:'space-between'}}><span style={{color:'green'}}>Easy</span> <i className="bi bi-emoji-neutral" style={{fontSize:'1.2rem'}}></i></DropdownItem>
            <DropdownItem style={{display:"flex",  justifyContent:'space-between'}}><span style={{color:'orange'}}>Medium</span> <i className="bi bi-emoji-smile" style={{fontSize:'1.2rem', fontWeight:'bold'}}></i></DropdownItem>
            <DropdownItem style={{display:"flex",  justifyContent:'space-between'}}><span style={{color:'#17a2b8'}}>Exam</span> <i className="bi bi-emoji-laughing" style={{fontSize:'1.2rem', fontWeight:'bold'}}></i></DropdownItem>
            <DropdownItem style={{display:"flex",  justifyContent:'space-between'}}><span style={{color:'red'}}>Challenge</span> <i className="bi bi-emoji-dizzy" style={{fontSize:'1.2rem', fontWeight:'bold'}}></i></DropdownItem>

          </DropdownMenu>



          
        </Dropdown>
      </th>
    </tr>
  </thead>
  <tbody>
   {videos}
  </tbody>
</Table>
</div>
<div className='quiz-sidebar'>

<div className='quiz-search'>
<div>
      <InputGroup>
        <Input
          placeholder="Search by title, topic or difficulty"
          value={inputValue}
          onChange={handleInputChange}
          style={{ paddingRight: '2rem', borderRadius:'10px' }} // Adjust this value based on the icon size
        />
        <div style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          cursor: 'pointer'
        }}>
          {searchIcon}
        </div>
      </InputGroup>
    </div>
    </div>
  
  <div>
  <Card style={{}}>
    <CardBody>
      progress
    </CardBody>
  </Card>
  </div>

  <Card style={{marginTop:'3%', padding:'1%'}}>
  <Calendar />
  </Card>

  

</div>

 


        

    </div>
  )
}

export default Quizzes

 // const [latex,setLatex] = useState(String.raw` \int_0^1 x^7\ dx`)
    // const containerRef = useRef(null);
    // const mfe = useMemo(() => new MathfieldElement(), []);
    // const mfe = new MathfieldElement

    // useEffect(()=>{
       
   





    //     const container = containerRef.current;
    //     container.innerHTML = '';
    //     container.appendChild(mfe);
    //     mfe.value = '/sin x';
    //     mfe.setOptions({virtualKeyboardMode: 'onfocus'})
    // }, [])

    // const updateLatex = () => {
    //      const latex = mfe.value;
    //      setLatex(String.raw`${latex}`);

         
    // }
// right now the entire component is rerendering every time you update state, what I mayshoudl do is make our Mathlive calculator its own component
//responsible for updating the state of thsi component so its no longer part of this component and hence wont re-render every update. 
