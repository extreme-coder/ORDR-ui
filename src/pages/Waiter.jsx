import { useEffect, useState } from "react";
import { Accordion, Button, ButtonGroup, Modal, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SeatView } from "../components/SeatView";
import { useGetEntitiesQuery } from "../services/lastmeal";

function Waiter() {
  const Regtangle = {
    display: "inlineBlock",
    width: "600px",
    height: "200px",
    background: "grey"
  }
  const { data: tables } = useGetEntitiesQuery({ name: "table", populate: true });

  const { data: seats } = useGetEntitiesQuery({ name: "seat", populate: true });

  const [show, setShow] = useState(false);
  const [currentSeat, setCurrentSeat] = useState({});

  useEffect(() => {
    if (seats) {
      console.log(seats.data[0])
      setCurrentSeat(seats.data[0])
    }
  }, [seats])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      {/*Table views*/}
      <Accordion>
        {tables && tables.data.map(table => <Accordion.Item eventKey={table.id}>
          <Accordion.Header>Table {table.attributes.number}</Accordion.Header>
          <Accordion.Body>
            <div className="vstack">
              <div className="hstack gap-5">
                {seats && seats.data.filter(seat => seat.attributes.table.data.id === table.id).map(seat => <button type="button" class="btn btn-outline-primary" dataToggle="button" ariaPressed="false" autocomplete="off" onClick={() => { handleShow(); setCurrentSeat(seat) }}>
                  Seat {seat && seat.attributes.number}
                </button>)}
              </div>
              <div style={Regtangle}></div>
            </div>
          </Accordion.Body>
        </Accordion.Item>)}
      </Accordion>

      {/*Modal*/}
      {tables && seats && currentSeat.attributes && <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Table {tables.data.filter(t => t.id === currentSeat.attributes.table.data.id)[0].attributes.number} - Seat {currentSeat.attributes.number}</Modal.Title>
        </Modal.Header>
        {currentSeat.attributes.teacher.data && <SeatView seat={currentSeat} />}
        {!currentSeat.attributes.teacher.data && <Modal.Body>
          <p>Seat is empty.</p>
        </Modal.Body>}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>}
    </div>
  );
}

export default Waiter;