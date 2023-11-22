import { useState } from "react";
import { Accordion, Button, ButtonGroup, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SeatView } from "../components/SeatView";

function Waiter() {
  const tables = [
    { id: 1, attributes: { number: 1, seats: [1, 2] } },
    { id: 2, attributes: { number: 2, seats: [3, 4] } },
  ]
  const seats = [
    { id: 1, attributes: { number: 1, table: 1 } },
    { id: 2, attributes: { number: 2, table: 1 } },
    { id: 3, attributes: { number: 1, table: 2 } },
    { id: 4, attributes: { number: 2, table: 2 } },
  ]

  const [show, setShow] = useState(false);
  const [currentSeat, setCurrentSeat] = useState(seats[0]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      {/*Table views*/}
      <Accordion>
        {tables.map(table => <Accordion.Item eventKey={table.id}>
          <Accordion.Header>Table {table.attributes.number}</Accordion.Header>
          <Accordion.Body>
            <ButtonGroup>
              {seats.filter(seat => seat.attributes.table === table.attributes.number).map(seat => <button type="button" class="btn btn-outline-primary" dataToggle="button" ariaPressed="false" autocomplete="off" onClick={() => { handleShow();  setCurrentSeat(seat)}}>
                Seat {seat.attributes.number}
              </button>)}
            </ButtonGroup>
          </Accordion.Body>
        </Accordion.Item>)}
      </Accordion>

      {/*Modal*/}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Table {tables.filter(t => t.id === currentSeat.attributes.table)[0].attributes.number} - Seat {currentSeat.attributes.number}</Modal.Title>
        </Modal.Header>
        <SeatView seat={currentSeat} />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Waiter;