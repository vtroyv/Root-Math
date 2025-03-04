'use client';
import React, { useState } from 'react';
import { Card, CardHeader, ListGroup, ListGroupItem, FormGroup, Label, Input } from 'reactstrap';
import Latex from 'react-latex-next';

export default function MultipleChoiceTask({ question, choices ,task}) {
  const [selectedOption, setSelectedOption] = useState('');

  function handleOptionChange(value) {
    setSelectedOption(value);
    // If you want to inform a parent component, you could call onChange(value) here.
  }

  return (
    <Card
      style={{
        border: '1px solid black',
        borderRadius: 0,                 // square corners
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '1rem',
      }}
    >
      <CardHeader
        style={{
          backgroundColor: 'lightblue',
          color: 'black',
          borderRadius: 0,
          padding: '0.75rem 1rem',
        }}
      >
        <h5 style={{ margin: 0, fontWeight: 'bold' }}>
          <Latex>{task.title}</Latex>
        </h5>
      </CardHeader>

      <ListGroup flush style={{ borderRadius: 0 }}>
        {choices.map((choice, idx) => (
          <ListGroupItem
            key={idx}
            style={{
              cursor: 'pointer',
              borderLeft: selectedOption === choice ? '6px solid #17a2b8' : '4px solid transparent',
              transition: 'border-left 0.2s ease',
              borderRadius: 0,
            }}
            onClick={() => handleOptionChange(choice)}
           
          >
            <FormGroup check>
              <Label check style={{ width: '100%', margin: 0, cursor: 'pointer' }}>
                <Input
                  type="radio"
                  name="multipleChoice"
                  value={choice}
                  checked={selectedOption === choice}
                  onChange={() => handleOptionChange(choice)}
                  style={{
                      // square radio input
                    accentColor: '#17a2b8',
                    marginRight: '0.5rem',
                  }}
                />
                <Latex>{choice}</Latex>
              </Label>
            </FormGroup>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Card>
  );
}
