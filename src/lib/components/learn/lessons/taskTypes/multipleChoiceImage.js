'use client';
import React, { useState } from 'react';
import { Card, CardHeader, ListGroup, ListGroupItem, FormGroup, Label, Input, Modal, ModalBody, Button } from 'reactstrap';
import Image from 'next/image';
import "bootstrap-icons/font/bootstrap-icons.css";

/**
 * Displays multiple choice options as images, with a "zoom" icon to enlarge in a modal.
 *
 * PROPS:
 *   task:  (object) e.g. { title: 'Pick the correct image' }
 *   imageChoices: (array) each item is { url, alt, width, height }
 *     e.g. [
 *       { url: '/images/test.png', alt: 'Test Image 1', width: 300, height: 200 },
 *       { url: '/images/test2.png', alt: 'Test Image 2', width: 300, height: 200 }
 *     ]
 */
export default function MultipleChoiceImagesTask({ task, imageChoices = [] }) {
  const [selectedOption, setSelectedOption] = useState('');
  // For enlarging images in a modal:
  const [expandedImage, setExpandedImage] = useState(null);

  function handleOptionChange(value) {
    setSelectedOption(value);
  }

  function openModal(choice) {
    setExpandedImage(choice);
  }

  function closeModal() {
    setExpandedImage(null);
  }

  return (
    <Card
      style={{
        border: '1px solid black',
        borderRadius: 0,
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
          {task.title}
        </h5>
      </CardHeader>

      <ListGroup flush style={{ borderRadius: 0 }}>
        {imageChoices.map((choice, idx) => (
          <ListGroupItem
            key={idx}
            style={{
              cursor: 'pointer',
              borderLeft: selectedOption === choice.url ? '6px solid #17a2b8' : '4px solid transparent',
              transition: 'border-left 0.2s ease',
              borderRadius: 0,
              position: 'relative', // so we can position the expand icon
            }}
            onClick={() => handleOptionChange(choice.url)}
          >
            <FormGroup check>
              <Label check style={{ width: '100%', margin: 0, cursor: 'pointer' }}>
                <Input
                  type="radio"
                  name="multipleChoiceImages"
                  value={choice.url}
                  checked={selectedOption === choice.url}
                  onChange={() => handleOptionChange(choice.url)}
                  style={{
                    accentColor: '#17a2b8',
                    marginRight: '0.5rem',
                  }}
                />
                {/* The image itself */}
                <div style={{ display: 'inline-block', position: 'relative' }}>
                  <Image
                    src={choice.url}
                    alt={choice.alt || 'Option Image'}
                    width={choice.width || 300}
                    height={choice.height || 200}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  {/* Expand icon in top-right corner */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      cursor: 'pointer',
                    }}
                    // Stop the click from selecting the radio, but open modal instead
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(choice);
                    }}
                  >
                    <i className="bi bi-arrows-angle-expand" style={{ color: '#333', fontSize: '1.2rem' }} />
                  </div>
                </div>
              </Label>
            </FormGroup>
          </ListGroupItem>
        ))}
      </ListGroup>

      {/* Modal for enlarged image */}
      <Modal
        isOpen={!!expandedImage}
        toggle={closeModal}
        centered
        size="lg"
        style={{ maxWidth: '90%' }}
      >
        <ModalBody>
          {expandedImage && (
            <>
              <Image
                src={expandedImage.url}
                alt={expandedImage.alt || 'Enlarged Image'}
                width={(expandedImage.width || 300) * 1.5}
                height={(expandedImage.height || 200) * 1.5}
                style={{ width: '100%', height: 'auto' }}
              />
              <Button
                outline
                color="primary"
                onClick={closeModal}
                style={{ display: 'block', margin: '1rem auto' }}
              >
                Close
              </Button>
            </>
          )}
        </ModalBody>
      </Modal>
    </Card>
  );
}
