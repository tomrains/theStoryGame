import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, Modal } from 'react-bootstrap';

class TestModalWithClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      //state here
    }
  }

  render() {
    //variables, logic and so on here
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
      return (
        <>
        <Button variant="danger" onClick={handleShow}>
            Remove Player
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Remove a plyer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                <p>Which player would you like to remove from the game?</p>
                {this.props.playersStillWorking}
                    </div>
                </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    </>
      )
    }
  }

export default TestModalWithClass;

