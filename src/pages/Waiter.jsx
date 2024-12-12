import { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  ButtonGroup,
  Col,
  Container,
  Modal,
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { SeatView } from "../components/SeatView";
import {
  useGetEntitiesByDepth2Query,
  useGetEntitiesQuery,
} from "../services/lastmeal";
import { EmptySeat } from "../components/EmptySeat";
import styles from "./pageStyles/Waiter.module.css";
import { current } from "@reduxjs/toolkit";
import { useParams } from "react-router";
import AllOrders from "../components/AllOrders";
import { refetchTime } from "../constants";
import "./pageStyles/customBootstrapStyles.css";

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
    fontSize: "2rem",
  };
  const squareButtonStyle = {
    width: "60px",
    height: "60px",
  };
  const containerStyle = {
    width: "600px",
  };
  const buttonGroupStyle = {
    marginTop: "70px",
    height: "180px",
  };
  const { data: tables, refetch: tRefetch } = useGetEntitiesQuery({
    name: "table",
    populate: true,
  });
  const { data: seats, refetch: sRefetch } = useGetEntitiesQuery({
    name: "seat",
    populate: true,
  });
  const { data: seatsWithOrders, refetch: soRefetch } =
    useGetEntitiesByDepth2Query({
      name: "seat",
      populate: true,
      depthField1: "teacher",
      depthField2: "orders",
    });
  console.log(seats);
  const [show, setShow] = useState(false);
  const [currentSeat, setCurrentSeat] = useState({});
  const id = useParams().id;
  const [seatsAreNew, setSeatsAreNew] = useState(true);

  const openSeatView = () => {
    setShow(true);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("refetch");
      tRefetch();
      sRefetch();
      soRefetch();
      console.log(tables);
      console.log(seats);
      console.log(seatsWithOrders);
    }, refetchTime);

    return () => clearInterval(interval);
  }, [tRefetch, sRefetch, soRefetch]);

  const getSeatStyle = (seat) => {
    if (
      !seat.attributes.teacher.data ||
      (seatsWithOrders &&
        !seatsWithOrders.data.filter((seatOrder) => seatOrder.id === seat.id)[0]
          .attributes.teacher.data)
    ) {
      return {
        border: "2px solid #5E5E5E",
      };
    } else if (
      seatsWithOrders &&
      seatsWithOrders.data &&
      seatsWithOrders.data[0] &&
      seatsWithOrders.data.filter((seatOrder) => seatOrder.id === seat.id)[0] &&
      seatsWithOrders.data.filter((seatOrder) => seatOrder.id === seat.id)[0]
        .attributes.teacher.data.attributes.orders &&
      seatsWithOrders.data
        .filter((seatOrder) => seatOrder.id === seat.id)[0]
        .attributes.teacher.data.attributes.orders.data.filter(
          (order) => order.attributes.status === "PREPARED"
        ).length > 0
    ) {
      return { color: "white", backgroundColor: "#FF564A" };
    } else if (
      seatsWithOrders &&
      seatsWithOrders.data &&
      seatsWithOrders.data[0] &&
      seat.id &&
      seatsWithOrders.data.filter((seatOrder) => seatOrder.id === seat.id)[0] &&
      seatsWithOrders.data.filter((seatOrder) => seatOrder.id === seat.id)[0]
        .attributes.teacher.data.attributes.orders &&
      seatsWithOrders.data
        .filter((seatOrder) => seatOrder.id === seat.id)[0]
        .attributes.teacher.data.attributes.orders.data.filter(
          (order) => order.attributes.status === "UNFINISHED"
        ).length > 0
    ) {
      return { color: "black", backgroundColor: "#FFD400" };
    } else if (seatsWithOrders) {
      return { color: "white", backgroundColor: "#4CB61A" };
    }
    return {
      border: "2px solid #5E5E5E",
    };
  };

  useEffect(() => {
    if (seats && seatsAreNew) {
      console.log(seats.data[0]);
      setCurrentSeat(seats.data[0]);
      setSeatsAreNew(false);
    }
  }, [seats]);

  const handleClose = () => {
    setShow(false);
    sRefetch();
    tRefetch();
    soRefetch();
  };

  const [activeItems, setActiveItems] = useState([]);

  const handleShow = () => {
    setShow(true);
  };

  const defaultActiveItems = tables && tables.data.map((table) => table.id);
  return (
    <div>
      {/*Table views*/}
      <Tabs>
        {tables &&
          tables.data
            .filter((t) => !id || parseInt(id) === t.attributes.number)
            .map((table) => (
              <Tab
                style={{
                  display: "flex",
                  height: "calc(100vh - 40px)",
                }}
                eventKey={table.id}
                title={"Table " + table.attributes.number}
              >
                <div className={styles.wb} id="wb">
                  <div className={styles.leftContainer} id="container">
                    <div className={styles.tableContainer}>
                      <div className={styles.seats}>
                        {seats &&
                          seats.data
                            .filter(
                              (seat) =>
                                seat.attributes.table.data.id === table.id
                            )
                            .slice(0, 6)
                            .map((seat, index) => (
                              <div
                                type="button"
                                className={styles.seat}
                                style={getSeatStyle(seat)}
                                onClick={() => {
                                  handleShow();
                                  setCurrentSeat(seat);
                                }}
                              >
                                Seat {seat && seat.attributes.number}
                              </div>
                            ))}
                      </div>
                      <div className={styles.table}>
                        {" "}
                        Table: {table.attributes.number}
                      </div>
                      <div className={styles.seats}>
                        {seats &&
                          seats.data
                            .filter(
                              (seat) =>
                                seat.attributes.table.data.id === table.id
                            )
                            .slice(6, 12)
                            .sort(
                              (a, b) =>
                                b.attributes.number - a.attributes.number
                            )
                            .map((seat, index) => (
                              <div
                                type="button"
                                className={styles.seatUpsideDown}
                                style={getSeatStyle(seat)}
                                onClick={() => {
                                  handleShow();
                                  setCurrentSeat(seat);
                                }}
                              >
                                Seat {seat && seat.attributes.number}
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.rightContainer}>
                    <div className={styles.listContainer}>
                      <div className={styles.listHeader}>
                        <div className={styles.bar} />
                        Items Up!
                      </div>
                      <div className={styles.listBody} id="listbody">
                        <div
                          className={styles[`order-list-container`]}
                          id="orderlist"
                        >
                          <AllOrders
                            type="PREPARED"
                            tableId={table.id}
                          ></AllOrders>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
            ))}
      </Tabs>

      {/*Modal*/}
      {tables && seats && currentSeat.attributes && (
        <Modal
          show={show}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          size={!currentSeat.attributes.teacher.data && "sm"}
        >
          <Modal.Header closeButton>
            {console.log(currentSeat)}
            <Modal.Title>
              Seat {currentSeat.attributes.number} - Table{" "}
              {
                tables.data.filter(
                  (t) => t.id === currentSeat.attributes.table.data.id
                )[0].attributes.number
              }{" "}
            </Modal.Title>
          </Modal.Header>
          {currentSeat.attributes.teacher.data && (
            <SeatView seat={currentSeat} updateView={setCurrentSeat} />
          )}
          {!currentSeat.attributes.teacher.data && (
            <Modal.Body>
              <EmptySeat
                seat={currentSeat}
                open={setShow}
                updateView={setCurrentSeat}
              />
            </Modal.Body>
          )}
          <Modal.Footer>
            <Button className={styles[`close-button`]} onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Waiter;
