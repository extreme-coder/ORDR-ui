import React from "react";
import { useState } from "react";
import {Accordion} from "react-bootstrap";
import { Button } from "react-bootstrap";
import {ButtonGroup} from "react-bootstrap";

const Kitchen = () => {
    const buttonLeft = {
      flex: '0 0 50%',
      display: 'flex',
      justifyContent: 'flex-end'
    }
    const orders = [
        {id: 1, attributes: {table:1, seat: 1, teacher:{id: 1, name: 'Ms Smith'}, items: [{id: 1, attributes:{name: 'Pancakes'}},{id: 3, attributes:{name: 'Ommlettes'}}]}, mods: '-'},
        {id: 2, attributes: {table:1, seat: 2, teacher:{id: 2, name: 'Mr Sok'}, items: [{id: 1, attributes:{name: 'Pancakes'}}]}, mods: '-'},
      ]
      const seats = [
        { id: 1, attributes: { number: 1, table: 1 } },
        { id: 2, attributes: { number: 2, table: 1 } },
        { id: 3, attributes: { number: 3, table: 2 } },
        { id: 4, attributes: { number: 4, table: 2 } },
      ]

    
      return (
        <div>
          <Accordion>
            {/*orders into accordian headers*/}
            {orders.map(order => <Accordion.Item eventKey={order.id}>
              <Accordion.Header>
              <div>
                <h5 style={{ display: 'inline-block', marginRight: '5px'}}>#</h5>
                <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '15vw' }}>
                  {order.id}
                </p>
              </div>
              <div>
                <h5 style={{ display: 'inline-block', marginRight: '5px'}}>Table: </h5>
                <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '15vw' }}>
                  {order.attributes.table}
                </p>
              </div>
              <div>
                <h5 style={{ display: 'inline-block', marginRight: '5px'}}>Seat: </h5>
                <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '15vw' }}>
                  {order.attributes.seat}
                </p>
              </div>
              <div>
                <h5 style={{ display: 'inline-block', marginRight: '5px'}}>Teacher:</h5>
                <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '15vw' }}>
                  {order.attributes.teacher.name}
                </p>
              </div>
              <ButtonGroup styles={buttonLeft}>
                        <Button variant="primary">Cooked</Button>
                        <Button variant="primary">Served</Button>
                      </ButtonGroup>
              </Accordion.Header>
              <Accordion.Body>
                <table class="table">
                  <tbody>
                {order.attributes.items.map(item => 
                <tr>
                  <td>{item.attributes.name}</td>
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