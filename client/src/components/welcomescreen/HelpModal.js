import React, { useState } from 'react';

import { Modal, Button } from 'react-bootstrap';

function HelpModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Help
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Help Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>This is the Story Game.
        Together, you and your friends will write hilarious stories.</p>
        <p>Write a few lines of a story, then send it on to a friend.
        The catch is that your friends will only be able to see the last few words of the story you've written.</p>
        <p>Enter your name, select an avatar, and choose the number of rounds before starting.</p>
        <p>If you're a beginner, start with 3 rounds.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HelpModal;
