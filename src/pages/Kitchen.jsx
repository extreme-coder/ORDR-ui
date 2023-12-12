import React, { useEffect } from "react";
import { useState } from "react";
import { Accordion, Tab, Tabs } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";
import { useGetEntitiesQuery } from "../services/lastmeal";
import { Ticket } from "../components/Ticket";

const Kitchen = () => {
  const { data: orders } = useGetEntitiesQuery({ name: "order", populate: true });

  /*const [orders, setOrders] = useState([
    { id: 1, attributes: { table: 1, seat: 1, teacher: { id: 1, name: 'Ms Smith' }, items: [{ id: 1, attributes: { name: 'Pancakes' } }, { id: 3, attributes: { name: 'Ommlettes' } }], status: "UNFINISHED", mods: '-' } },
    { id: 2, attributes: { table: 1, seat: 2, teacher: { id: 2, name: 'Mr Sok' }, items: [{ id: 1, attributes: { name: 'Pancakes' } }], status: "PREPARED", mods: '-' }, },
  ])*/

  useEffect(() => {
    if (orders) {
      console.log(orders);
    }
  }, [orders])

  /*const handleStatus = (id, status) => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        return { ...order, attributes: { ...order.attributes, status: status } }
      }
      return order
    }))
  }*/

  return (
    <div>
      <Tabs defaultActiveKey="kitchen" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="kitchen" title="Kitchen">
          <Accordion>
            {orders && orders.data.filter(o => o.attributes.status !== "SERVED" && o.attributes.type === "KITCHEN").map(order => <Ticket order={order} />)}
          </Accordion>
        </Tab>
        <Tab eventKey="bar" title="Bar">
          <Accordion>
            {orders && orders.data.filter(o => o.attributes.status !== "SERVED" && o.attributes.type === "BAR").map(order => <Ticket order={order} />)}
          </Accordion>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Kitchen