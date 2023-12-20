import { useEffect, useState } from "react";
import { Accordion, Button, ButtonGroup, Col, Container, Modal, Row, Tab, Table, Tabs } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SeatView } from "../components/SeatView";
import { useGetEntitiesByDepth2Query, useGetEntitiesQuery } from "../services/lastmeal";
import { EmptySeat } from "../components/EmptySeat";
import styles from "./pageStyles/Waiter.module.css"
import { current } from "@reduxjs/toolkit";
import { useParams } from "react-router";
import AllOrders from "../components/AllOrders";
import { refetchTime } from "../constants";

function Waiter() {
  const Regtangle = {
    display: "flex",
    width: "600px",
    height: "200px",
    background: "darkslategrey",
    borderRadius: "10px",
    color: "snow",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2rem"
  }
  const squareButtonStyle = {
    width: '60px',
    height: '60px'
  };
  const containerStyle = {
    width: '600px',
  };
  const buttonGroupStyle = {
    marginTop: '70px',
    height: '180px'
  };
  const { data: tables, refetch: tRefetch } = useGetEntitiesQuery({ name: "table", populate: true });
  const { data: seats, refetch: sRefetch } = useGetEntitiesQuery({ name: "seat", populate: true });
  const { data: seatsWithOrders, refetch: soRefetch } = useGetEntitiesByDepth2Query({ name: "seat", populate: true, depthField1: "teacher", depthField2: "orders" });
  console.log(seats)
  const [show, setShow] = useState(false);
  const [currentSeat, setCurrentSeat] = useState({});
  const id = useParams().id;
  const [seatsAreNew, setSeatsAreNew] = useState(true)

  const openSeatView = () => {
    setShow(true)
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("refetch")
      tRefetch()
      sRefetch()
      soRefetch()
      console.log(tables)
      console.log(seats)
      console.log(seatsWithOrders)
    }, refetchTime);

    return () => clearInterval(interval);
  }, [tRefetch, sRefetch, soRefetch])

  const getSeatColor = (seat) => {
    if (!seat.attributes.teacher.data || (seatsWithOrders && !seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0].attributes.teacher.data)) {
      return 'outline-secondary'
    } else if (seatsWithOrders && seatsWithOrders.data && seatsWithOrders.data[0]
      && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0]
      && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0].attributes.teacher.data.attributes.orders
      && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0].attributes.teacher.data.attributes.orders.data.filter(
        order => order.attributes.status === "PREPARED").length > 0) {
      return 'danger'
    } else if (seatsWithOrders && seatsWithOrders.data && seatsWithOrders.data[0] && seat.id
      && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0]
      && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0].attributes.teacher.data.attributes.orders
      && seatsWithOrders.data.filter(seatOrder => seatOrder.id === seat.id)[0].attributes.teacher.data.attributes.orders.data.filter(
        order => order.attributes.status === "UNFINISHED").length > 0) {
      return 'warning'
    } else  if (seatsWithOrders) {
      return 'success'
    }
    return 'outline-secondary'
  }


  useEffect(() => {
    if (seats && seatsAreNew) {
      window.location.reload();
      console.log(seats.data[0])
      setCurrentSeat(seats.data[0])
      setSeatsAreNew(false)
    }
  }, [seats])

  const handleClose = () => {
    setShow(false)
    sRefetch()
    tRefetch()
    soRefetch()
  }

  const [activeItems, setActiveItems] = useState([]);
  const handleShow = () => setShow(true);

  const defaultActiveItems = tables && tables.data.map(table => table.id)
  return (

    <div>
      {/*Table views*/}
      <Tabs >
        {tables && tables.data.filter(t => !id || parseInt(id) === t.attributes.number).map(table => <Tab eventKey={table.id} title={"Table " + table.attributes.number}>
          <div className={styles.wb}>
            <div className={styles.table}>


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
                <div style={Regtangle}> Table: {table.attributes.number}</div>
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
 
                <div class="btn-group-vertical" style={buttonGroupStyle}>
                  {seats && seats.data.filter(seat => seat.attributes.table.data.id === table.id &&  seat.attributes.number === 0).map((seat) => <button type="button" class={"btn btn-" + (getSeatColor(seat))} style={squareButtonStyle} dataToggle="button" ariaPressed="false" autocomplete="off" onClick={() => { handleShow(); setCurrentSeat(seat) }}>
                    Extra
                  </button>)}
                </div>

            </div>
            <div className={styles[`order-list-container`]}>
              <AllOrders type="PREPARED" tableId={table.id}></AllOrders>
            </div>
          </div>
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