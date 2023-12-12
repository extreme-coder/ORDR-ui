import { useEffect, useState } from "react";
import { Accordion, Button, ButtonGroup, Col, Container, Modal, Row, Tab, Table, Tabs } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SeatView } from "../components/SeatView";
import { useGetEntitiesQuery } from "../services/lastmeal";
import { EmptySeat } from "../components/EmptySeat";
import "./pageStyles/Waiter.css"

function Waiter() {
  const Regtangle = {
    display: "inlineBlock",
    width: "600px",
    height: "200px",
    background: "darkslategrey",
    borderRadius: "10px",
  }
  const squareButtonStyle = {
    width: '60px',
    height: '60px'
  };
  const containerStyle = {
    width: '600px',
  };
  const buttonGroupStyle = {
    marginTop: '70px'
  };
  const { data: tables } = useGetEntitiesQuery({ name: "table", populate: true });

  const { data: seats } = useGetEntitiesQuery({ name: "seat", populate: true });

  const [show, setShow] = useState(false);
  const [currentSeat, setCurrentSeat] = useState({});

  const openSeatView = ()=> {
    setShow(true)
  }

  useEffect(() => {
    if (seats) {
      console.log(seats.data[0])
      setCurrentSeat(seats.data[0])
    }
  }, [seats])

  const handleClose = () => {
    setShow(false)
    window.location.reload()
  };

  const [activeItems, setActiveItems] = useState([] );
  const handleShow = () => setShow(true);

  const defaultActiveItems = tables && tables.data.map(table => table.id)
  return (
    <div>
      {/*Table views*/}
      <Tabs >
        {tables && tables.data.map(table => <Tab eventKey={table.id} title={"Table " + table.attributes.number}>
          <Container>
            <Row>
              <Col>
                <div class="vstack" style={containerStyle}>
                  <div class="hstack gap-5">
                    {seats && seats.data.filter(seat => seat.attributes.table.data.id === table.id).slice(0, 6).map((seat, index) => 
                    <button 
                      type="button" 
                      class={"btn btn-" + (seat.attributes.teacher.data ? 'success' : 'outline-secondary')} 
                      style={squareButtonStyle} 
                      dataToggle="button" 
                      ariaPressed="false" 
                      autocomplete="off" 
                      onClick={() => { handleShow(); setCurrentSeat(seat) }}
                    >
                      Seat {seat && seat.attributes.number}
                    </button>)}
                  </div>
                  <div style={Regtangle}></div>
                  <div class="hstack gap-5">
                    {seats && seats.data.filter(seat => seat.attributes.table.data.id === table.id).slice(6, 12).sort((a, b) => b.attributes.number - a.attributes.number).map((seat, index) => <button type="button" class={"btn btn-" + (seat.attributes.teacher.data ? 'success' : 'outline-secondary')} style={squareButtonStyle} dataToggle="button" ariaPressed="false" autocomplete="off" onClick={() => { handleShow(); setCurrentSeat(seat) }}>
                      Seat {seat && seat.attributes.number}
                    </button>)}
                  </div>
                </div>
              </Col>
              <Col>
                <div class="btn-group-vertical" style={buttonGroupStyle}>
                  {seats && seats.data.filter(seat => seat.attributes.table.data.id === table.id).filter(seat => seat.attributes.number === 0).sort((a, b) => b.attributes.number - a.attributes.number).map((seat, index) => <button type="button" class={"btn btn-" + (seat.attributes.teacher.data ? 'success' : 'outline-secondary')} style={squareButtonStyle} dataToggle="button" ariaPressed="false" autocomplete="off" onClick={() => { handleShow(); setCurrentSeat(seat) }}>
                    Extra
                  </button>)}
                </div>
              </Col>
            </Row>
          </Container>
        </Tab>)}
      </Tabs>

      {/*Modal*/}
      {tables && seats && currentSeat.attributes && <Modal show={show} onHide={handleClose}>
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title>Table {tables.data.filter(t => t.id === currentSeat.attributes.table.data.id)[0].attributes.number} - Seat {currentSeat.attributes.number}</Modal.Title>
        </Modal.Header>
        {currentSeat.attributes.teacher.data && <SeatView seat={currentSeat} />}
        {!currentSeat.attributes.teacher.data && <Modal.Body>
          <EmptySeat seat={currentSeat} open={setShow}/>
        </Modal.Body>}
        <Modal.Footer>
          <Button className="close-button" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>}
    </div>
  );
}

export default Waiter;