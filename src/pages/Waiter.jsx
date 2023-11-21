import { useState } from "react";
import { Accordion, Button, ButtonGroup, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function Waiter() {
  const tables = [
    { id: 1, attributes: { number: 1, seats: [1, 2] } },
    { id: 2, attributes: { number: 2, seats: [3, 4] } },
  ]
  const seats = [
    { id: 1, attributes: { number: 1, table: 1 } },
    { id: 2, attributes: { number: 2, table: 1 } },
    { id: 3, attributes: { number: 3, table: 2 } },
    { id: 4, attributes: { number: 4, table: 2 } },
  ]

  //set state variable show to false for all seats
  let tempshow = []
  seats.forEach(seat => tempshow[seat.id] = false)
  const [show, setShow] = useState(tempshow);
  console.log(show)

  const handleClose = (id) => {
    show[id] = false
    setShow(show)
  };
  const handleShow = (id) => {
    show[id] = true
    setShow(show)
  };

  return (
    <div>
      <Accordion>
        {tables.map(table => <Accordion.Item eventKey={table.id}>
          <Accordion.Header>Table {table.attributes.number}</Accordion.Header>
          <Accordion.Body>
            <ButtonGroup>
              {seats.filter(seat => seat.attributes.table === table.attributes.number).map(seat => <button type="button" class="btn btn-outline-primary" dataToggle="button" ariaPressed="false" autocomplete="off" onClick={() => { handleShow(seat.id); console.log(show) }}>
                Seat {seat.attributes.number}
              </button>)}
            </ButtonGroup>
          </Accordion.Body>
        </Accordion.Item>)}
      </Accordion>
      {seats.map(seat => <SeatPopup show={show[seat.id]} handleClose={() => { handleClose(seat.id) }} />)}
    </div>
  );
}

const SeatPopup = (show, handleClose) => <Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Modal heading</Modal.Title>
  </Modal.Header>
  <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
    <Button variant="primary" onClick={handleClose}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

export default Waiter;