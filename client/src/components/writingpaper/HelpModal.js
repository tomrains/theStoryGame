import React, { useState } from 'react';

// import { Link } from 'react-router-dom';

// import "./storyrevealed.css";

// import FullStory from './subcomponents/FullStory.js';
// import GameMasterPlayAgain from './subcomponents/GameMasterPlayAgain.js';
// import HideMyStory from './subcomponents/HideMyStory.js';
// import SaveMyStory from './subcomponents/SaveMyStory.js';

// import Button from 'react-bootstrap/Button';

import { Modal, Button } from 'react-bootstrap';

function HelpModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HelpModal;
