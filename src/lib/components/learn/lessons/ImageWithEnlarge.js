import React, { useState } from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import Image from 'next/image';

export default function ImageWithEnlarge({ url, alt, caption, width = 600, height = 400 }) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <>
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <Image
          src={url}
          alt={alt || 'Image'}
          width={width}
          height={height}
          style={{ maxWidth: '100%', cursor: 'pointer' }}
          onClick={toggleModal}
        />
        {caption && <p style={{ fontStyle: 'italic' }}>{caption}</p>}
        <Button color="primary" size="sm" onClick={toggleModal} style={{ marginTop: '0.5rem' }}>
          Enlarge
        </Button>
      </div>
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalBody>
          <Image
            src={url}
            alt={alt || 'Image'}
            width={width * 2.5}
            height={height * 2.5}
            style={{ width: '100%', height: 'auto' }}
          />
          {caption && (
            <p style={{ fontStyle: 'italic', textAlign: 'center', marginTop: '0.5rem' }}>
              {caption}
            </p>
          )}
          <Button
            color="secondary"
            onClick={toggleModal}
            style={{ display: 'block', margin: '1rem auto' }}
          >
            Close
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
}
