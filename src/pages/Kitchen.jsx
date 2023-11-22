import React from "react";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";

const Kitchen = () => {
  const buttonLeft = {
    flex: '0 0 50%',
    display: 'flex',
    justifyContent: 'flex-end'
  }
  const [orders, setOrders] = useState([
    { id: 1, attributes: { table: 1, seat: 1, teacher: { id: 1, name: 'Ms Smith' }, items: [{ id: 1, attributes: { name: 'Pancakes' } }, { id: 3, attributes: { name: 'Ommlettes' } }], status: "UNFINISHED" }, mods: '-' },
    { id: 2, attributes: { table: 1, seat: 2, teacher: { id: 2, name: 'Mr Sok' }, items: [{ id: 1, attributes: { name: 'Pancakes' } }], status: "PREPARED" }, mods: '-' },
  ])

  const handleStatus = (id, status) => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        return { ...order, attributes: { ...order.attributes, status: status } }
      }
      return order
    }))
  }

  return (
    <div>
      <Accordion>
        {/*orders into accordian headers*/}
        {orders.map(order => <Accordion.Item eventKey={order.id}>
          <Accordion.Header>
            <div>
              <h5 style={{ display: 'inline-block', marginRight: '5px' }}>#</h5>
              <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '10vw' }}>
                {order.id}
              </p>
            </div>
            <div>
              <h5 style={{ display: 'inline-block', marginRight: '5px' }}>Table: </h5>
              <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '10vw' }}>
                {order.attributes.table}
              </p>
            </div>
            <div>
              <h5 style={{ display: 'inline-block', marginRight: '5px' }}>Seat: </h5>
              <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '10vw' }}>
                {order.attributes.seat}
              </p>
            </div>
            <div>
              <h5 style={{ display: 'inline-block', marginRight: '5px' }}>Teacher:</h5>
              <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '10vw' }}>
                {order.attributes.teacher.name}
              </p>
            </div>
            <ButtonGroup styles={buttonLeft}>
              {order.attributes.status === "UNFINISHED" && <>
                <button type="button" class="btn btn-outline-primary" onClick={() => handleStatus(order.id, "PREPARED")}>Cooked</button>
              </>}
              {order.attributes.status === "PREPARED" && <>
                <button type="button" class="btn btn-secondary "nClick={() => handleStatus(order.id, "UNFINISHED")}>Undo Cook</button>
                <button type="button" class="btn btn-outline-success" onClick={() => handleStatus(order.id, "SERVED")}>Served</button>
              </>}
            </ButtonGroup>
          </Accordion.Header>
          <Accordion.Body>
            <table class="table">
              <tbody>
                {order.attributes.items.map(item =>
                  <tr>
                    <td>{item.attributes.name}</td>
                    <td>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"></input>
                      <label class="form-check-label" for="flexCheckDefault">
                        Mark
                      </label>
                    </div>
                    </td>
                  </tr>
                  
                )}
              </tbody>
            </table>
          </Accordion.Body>
        </Accordion.Item>)}
      </Accordion>
    </div>
  );
}

export default Kitchen