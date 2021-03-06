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
        <Modal.Body>Write until the progress bar is filled. Then, submit your story. You can't write more than 150 characters.</Modal.Body>
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
