import React, { useState } from 'react';

import { Modal, Button, Form } from 'react-bootstrap';

function RemovePlayerModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Remove Player
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remove a player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
            <p>Which player would you like to remove from the game?</p>
            {props.allPlayers.map(player => { // using props in child component and looping
                return (
                    <>
                    <h4 name="turds">
                        {player.name}
                        <Form>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="" onClick={props.updatePlayerToDelete} name={player._id}/>
                      </Form.Group>
                    </Form>
                    </h4>
                    </>
                )
            })}
                </div>
            </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={props.removePlayer}>
            Remove selected player
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RemovePlayerModal;
