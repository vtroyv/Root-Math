import React, { useState } from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import Image from 'next/image';

export default function ImageWithEnlarge({ url, alt, caption, width = 600, height = 400 }) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <>
      <div style={{ textAlign: 'center', margin: '1rem 0', width: '100%' }}>
        <Image
          src={url}
          alt={alt || 'Image'}
          width={width}
          height={height}
          style={{ maxWidth: '100%', cursor: 'pointer' }}
          onClick={toggleModal}
        />
    
      </div>
      <Modal isOpen={modalOpen} toggle={toggleModal} centered size="lg" style={{ maxWidth: '90%' }}>
        <ModalBody>
          <Image
            src={url}
            alt={alt || 'Image'}
            width={width * 1.5}
            height={height * 1.5}
            style={{width:'100%', height: 'auto' }}
          />
         
          <Button
          outline
            color="primary"
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
