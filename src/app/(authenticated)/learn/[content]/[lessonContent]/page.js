'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useGetLessonContentQuery } from '@/lib/redux/slices/apiSlice'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody
} from 'reactstrap'
import { useRouter, usePathname} from 'next/navigation'
// YOU NEED TO CHANGE THIS CODE SO THAT THE CARD ITSELF IS A LINK, AS WE DON"T ACTUALLY NEED
//CUSTOM LINKS FOR SUBTOPICS AT THIS POINT

export default function LessonContent() {
  const { content, lessonContent } = useParams()
  const router = useRouter()
  const pathName = usePathname()


  const navigation = (item) => {
    const url = item.toLowerCase().split(' ').join('-') //Note this is due to to the topics not containing '-' to separate words which makes the url invalid
    router.push(`${pathName}/${url}`) // Use proper string interpolation
  }

  // Example: pick the correct DB collection
  const selectCollection = (collection) => {
    if (collection === 'edx-maths-1') return 'edx-pure-y1-subsections'
    // Add more conditions if needed
    return ''
  }

  const collection = selectCollection(content)
  const apiParams = { collection, lessonContent }

  // Fetch data
  const { data, isLoading } = useGetLessonContentQuery(apiParams)

  if (isLoading) {
    return (
      <Container style={{ minHeight: '80vh' }} className="d-flex justify-content-center align-items-center">
        <h2>Loading...</h2>
      </Container>
    )
  }

  // Assume `data?.subsections` might be an object like:
  // {
  //   "Proof": ["What is Proof?", "Methods of Proof"],
  //   "Algebra & Functions": ["Algebraic Expressions", "Quadratic Functions", ... ],
  //   ...
  // }
  const lessons = data?.subsections || {}

  // Title (optional "Edexcel Mathematics – Pure Mathematics Year 12" or similar)
  const pageTitle = data?.name
    ? data.name
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Lesson Content'

  return (
    <Container fluid className="my-4" style={{ minHeight: '80vh' }}>
      {/* Page Header: e.g., "Edexcel Mathematics – Pure Mathematics Year 12" */}
      <Row className="mb-3">
        <Col>
          <h1 style={{ color: '#17a2b8',  }}>
            {pageTitle}
          </h1>
        </Col>
      </Row>

      {/* (Optional) “My Progress” or other info bar */}
      {/* 
      <Row className="mb-4">
        <Col md="6">
          <h5>My Progress</h5>
          <div className="progress" style={{ height: '20px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: '0%', backgroundColor: '#17a2b8' }}
              aria-valuenow="0"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              0%
            </div>
          </div>
        </Col>
      </Row>
      */}

      {/* Render main subsections as cards with teal “headers” */}
      <Row>
        {Object.entries(lessons).map(([sectionTitle, subItems], index) => (
          <Col key={index} sm="12" md="6" lg="4" className="mb-4">
            <Card
              style={{
                borderRadius: '8px',
                border: '2px solid #333',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.15)'
              }}
            >
              {/* “Header” bar in teal */}
              <div
                style={{
                  backgroundColor: '#17a2b8',
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                 
                }}
              >
                <h4 className="mb-0" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                  {sectionTitle} 
                </h4>
              </div>

              {/* Sub‐items in white “body” with a stylized border */}
              <CardBody style={{ backgroundColor: '#fff' }}>
                {Array.isArray(subItems) && subItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.5rem 0',
                      borderBottom: idx < subItems.length - 1 ? '1px solid #ccc' : 'none',
                      cursor: 'pointer'
                    }}
                    // If you need to navigate on click:
                    onClick={()=> navigation(item)}
                    // () => console.log(`Clicked on: ${item}`)
                  >
                    <span
                      style={{
                        fontFamily: "'Trebuchet MS', sans-serif",
                        color: '#333'
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
