import React, { useState, useEffect } from 'react';

import { Modal, Button, Form } from 'react-bootstrap';

function RemovePlayerModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  
  const handleShow = () => setShow(true);

  // let counter = 0;
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    console.log("heeey");
    if (props.allPlayers.length < 3) {
      return;
    }
    if (props.allPlayers[props.allPlayers.length - 1] !== props.removablePlayers[props.removablePlayers.length - 1]) {
      props.updateRemovablePlayers();
      // counter = counter + 3;
    }
  });

  if (props.allPlayers.length > 2) {
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

    <Form>
    <fieldset>
      <Form.Group>
        <Form.Label>Which player would you like to remove from the game?</Form.Label>
    
            
            {props.removablePlayers.map(player => { // using props in child component and looping
                return (
                    <>
                    <h4>
                        {player.name}
                        
                        <Form.Check type="radio" label="" name="deleteMe" onClick={(e) => props.updatePlayerToDelete(e, player.number)} id={player._id} funtime={player.number} />
                      
                    
                    </h4>
                    </>
                )
            })}
                
            </Form.Group>
            </fieldset>  
            </Form>
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
  )}
  else {
    return (
      <Button variant="danger" onClick={handleShow} disabled>
        <em>Remove Player</em>
      </Button>
    )
  }
}

export default RemovePlayerModal;





                //what i had there previously:
                // option onSelect={(e) => props.updatePlayerToDelete(e, player.number)}



    //             <Form.Label>Which player would you like to remove from the game?</Form.Label>
    // <Form.Control as="select">
    //     {props.removablePlayers.map(player => { // using props in child component and looping
    //             return (
    //               <>
    //                 <option onSelect={console.log("i've been selected!")} id={player._id} funtime={player.number}>{player.name}</option>
    //               </>
    //             )
    //         }
    //     )}


    // const handleClose = () => 
  //   setShow(false);
  //   if (props.playerToDelete !== null) {
  //     props.updatePlayerToDelete();
  //   }