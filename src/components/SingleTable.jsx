import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useGetEntitiesByDepth2Query, useGetEntitiesQuery } from '../services/lastmeal';
import styles from './styles/SingleTable.module.css'
import { EmptySeat } from './EmptySeat';
import { SeatView } from './SeatView';


export const SingleTable = ({table}) => {
    const Regtangle = {
        display: "flex",
        flexDirection: "row",
        width: "420px",
        height: "150px",
        background: "#d8e0ed",
        borderRadius: "10px",
        fontFamily: " 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
        fontSize: "1.5rem",
        justifyContent: "center",
        alignItems:"center"
      }
      const squareButtonStyle = {
        width: '50px',
        height: '50px',
        fontSize: '0.75rem',
        alignItems: 'center',
        justfityContent: 'center',
      };
      const containerStyle = {
        width: '600px',
      };

      const { data: tables } = useGetEntitiesQuery({ name: "table", populate: true });
      const { data: seats } = useGetEntitiesQuery({ name: "seat", populate: true});
      const { data: seatsWithOrders } = useGetEntitiesByDepth2Query({ name: "seat", populate: true, depthField1:"teacher", depthField2:"orders"});
      console.log(seats)
      const [show, setShow] = useState(false);
      const [currentSeat, setCurrentSeat] = useState({});
      const id = useParams().id;
    
      const openSeatView = ()=> {
        setShow(true)
      }
    
      const getSeatColor = (seat) => {
          if (!seat.attributes.teacher.data){
            return 'outline-light' 
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
      }
      
      const handleShow = () => setShow(true);

  return (
    <div>
                <div class="vstack" style={containerStyle}>
                    
                  <div class="hstack gap-4">
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
                  <div class="hstack">
                    <div style={Regtangle}> TABLE: {table && table.id}</div>
                    <div class="btn-group-vertical">
                    {seats && seats.data.filter(seat => seat.attributes.table.data.id === table.id && seat.attributes.number === 0).map((seat, index) => 
                    <button 
                    type="button" 
                    class={"btn btn-" + (getSeatColor(seat))} 
                    style={squareButtonStyle} 
                    dataToggle="button"
                    ariaPressed="false" 
                    autocomplete="off" 
                    onClick={() => { handleShow(); setCurrentSeat(seat) }}>
                        Extra
                    </button>)}
                  </div>
                  </div>
                  <div class="hstack gap-4">
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

                {/*Modal*/}
                {table && seats && currentSeat.attributes && <Modal show={show} onHide={handleClose}>
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
  )
}
