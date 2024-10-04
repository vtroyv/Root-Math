import React from 'react'
import { Button, Card, CardBody, CardText, CardTitle, CardGroup} from 'reactstrap'

import { useNavigate } from 'react-router-dom'

const Lessons = () => {
    const navigate= useNavigate()
  return (
    <div >
        <button onClick={()=> {
            navigate('/')
        }} style={{border: 'none'}}>
            <CardGroup cssModule={{display: 'flex', justifyContent: 'center'}}>
        <Card
        body
        style={{width: '14rem', backgroundColor: '#54B4d3'}}
        color="#"
        classname="my-2"
        >
            <img src="https://picsum.photos/300/200"/>
            <CardBody>
                <CardTitle tag="h5">
                    Sequences and Series
                </CardTitle>
                <CardText>
                    start your journey today
                </CardText>
                <Button> watch now</Button>
            </CardBody>

        </Card>
        <Card
        body
        style={{width: '14rem', backgroundColor: '#54B4d3'}}
        color="#"
        classname="my-2"
        >
            <img src="https://picsum.photos/300/200"/>
            <CardBody>
                <CardTitle tag="h5">
                    Sequences and Series
                </CardTitle>
                <CardText>
                    start your journey today
                </CardText>
                <Button> watch now</Button>
            </CardBody>

        </Card>
        <Card
        body
        style={{width: '14rem', backgroundColor: '#54B4d3'}}
        color="#"
        classname="my-2"
        >
            <img src="https://picsum.photos/300/200"/>
            <CardBody>
                <CardTitle tag="h5">
                    Sequences and Series
                </CardTitle>
                <CardText>
                    start your journey today
                </CardText>
                <Button> watch now</Button>
            </CardBody>

        </Card>
        </CardGroup>
        </button>
    </div>
  )
}

export default Lessons