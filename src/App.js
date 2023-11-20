import logo from './logo.svg';
import './App.css';
import { Accordion, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function App() {
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

  const handleClose = (id) => { show[id] = false; setShow(show) };
  const handleShow = (id) => { show[id] = true; setShow(show) };

  return (
    <div className="App">
      <Accordion>
        {tables.map(table => <Accordion.Item eventKey={table.id}>
          <Accordion.Header>Table {table.attributes.number}</Accordion.Header>
          <Accordion.Body>
            {seats.filter(seat => seat.attributes.table === table.attributes.number).map(seat => <button type="button" class="btn btn-primary" dataToggle="button" ariaPressed="false" autocomplete="off" onClick={() => { handleShow(seat.id);  console.log(show)}}>
              Seat {seat.attributes.number}
            </button>)}
          </Accordion.Body>
        </Accordion.Item>)}
      </Accordion>
    </div>
  );
}

export default App;
