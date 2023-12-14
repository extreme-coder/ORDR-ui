import { useEffect, useState } from "react";
import { Accordion, Button, ButtonGroup, Col, Container, Modal, Row, Tab, Table, Tabs } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SeatView } from "../components/SeatView";
import { useGetEntitiesByDepth2Query, useGetEntitiesQuery } from "../services/lastmeal";
import { EmptySeat } from "../components/EmptySeat";
import styles from "./pageStyles/Waiter.module.css"
import { current } from "@reduxjs/toolkit";

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
  const { data: seats } = useGetEntitiesQuery({ name: "seat", populate: true});
  const { data: seatsWithOrders } = useGetEntitiesByDepth2Query({ name: "seat", populate: true, depthField1:"teacher", depthField2:"orders"});
  console.log(seats)
  const [show, setShow] = useState(false);
  const [currentSeat, setCurrentSeat] = useState({});

  const openSeatView = ()=> {
    setShow(true)
  }

  const getSeatColor = (seat) => {
      if (!seat.attributes.teacher.data){
        return 'outline-secondary' 
      } else if(seatsWithOrders 
        && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0]
        && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0].attributes.teacher.data.attributes.orders 
        && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0].attributes.teacher.data.attributes.orders.data.filter(
        order => order.attributes.status === "PREPARED").length>0){
            return 'danger'
      } else if (seatsWithOrders 
        && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0]
        && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0].attributes.teacher.data.attributes.orders 
        && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0].attributes.teacher.data.attributes.orders.data.filter(
          order => order.attributes.status === "UNFINISHED").length>0){
           return 'warning'
      } else {
        return 'success'
      }    
  }

      
  useEffect(() => {
    if (seats) {
      console.log(seats.data[0])
      setCurrentSeat(seats.data[0])
    }
  }, [seats])

  const handleClose = () => {
    setShow(false)
    window.location.reload();
  };

  const [activeItems, setActiveItems] = useState([] );
  const handleShow = () => setShow(true);

  const defaultActiveItems = tables && tables.data.map(table => table.id)
  return (
    <div>
      {/*Table views*/}
      <Tabs >
        {tables && tables.data.map(table => <Tab eventKey={table.id} title={"Table " + table.attributes.number}>
          <Container className={styles.table}>
            <Row>
              <Col>
                <div class="vstack" style={containerStyle}>
                  <div class="hstack gap-5">
                    {seats && seats.data.filter(seat => seat.attributes.table.data.id === table.id).slice(0, 6).map((seat, index) => 
                    <button 
                      type="button" 
                      class={"btn btn-" + (getSeatColor(seat))} 
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
                    {seats && seats.data.filter(seat => 
                      seat.attributes.table.data.id === table.id).slice(6, 12).sort((a, b) => b.attributes.number - a.attributes.number).map((seat, index) => 
                      <button 
                      type="button" 
                      class={"btn btn-" + (getSeatColor(seat))}
                      style={squareButtonStyle} 
                      dataToggle="button" 
                      ariaPressed="false" 
                      autocomplete="off" 
                      onClick={() => { handleShow(); setCurrentSeat(seat) }}>
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
        <Modal.Header className={styles[`header`]} closeButton>
          {console.log(currentSeat)}
          <Modal.Title>Table {tables.data.filter(t => t.id === currentSeat.attributes.table.data.id)[0].attributes.number} - Seat {currentSeat.attributes.number}</Modal.Title>
        </Modal.Header>
        {currentSeat.attributes.teacher.data && <SeatView seat={currentSeat} updateView={setCurrentSeat} />}
        {!currentSeat.attributes.teacher.data && <Modal.Body>
          <EmptySeat seat={currentSeat} open={setShow} updateView={setCurrentSeat} />
        </Modal.Body>}
        <Modal.Footer>
          <Button className={styles[`close-button`]} onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>}
    </div>
  );
}

export default Waiter;