import React, { useEffect } from "react";
import { useState } from "react";
import { Accordion, Tab, Tabs } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";
import {
  useGetEntitiesByShapeQuery,
  useGetEntitiesQuery,
} from "../services/lastmeal";
import { TicketCard } from "../components/TicketCard";
import { useParams } from "react-router";
import { refetchTime } from "../constants";
import OrderTicket from "../components/OrderTicket";
import "./pageStyles/customBootstrapStyles.css";

const Kitchen = () => {
  const { data: orders, refetch } = useGetEntitiesByShapeQuery({
    name: "order",
    populate: true,
    shape: [
      ["teacher", "seat", "table"],
      ["items", "item"],
      ["items", "toppings"],
    ],
  });
  const type = useParams().type;

  /*const [orders, setOrders] = useState([
    { id: 1, attributes: { table: 1, seat: 1, teacher: { id: 1, name: 'Ms Smith' }, items: [{ id: 1, attributes: { name: 'Pancakes' } }, { id: 3, attributes: { name: 'Ommlettes' } }], status: "UNFINISHED", mods: '-' } },
    { id: 2, attributes: { table: 1, seat: 2, teacher: { id: 2, name: 'Mr Sok' }, items: [{ id: 1, attributes: { name: 'Pancakes' } }], status: "PREPARED", mods: '-' }, },
    test
  ])*/

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("refetch");
      refetch();
    }, refetchTime);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (orders) {
      console.log(orders);
    }
  }, [orders]);

  /*const handleStatus = (id, status) => {
    setOrders(
      orders.map((order) => {
        if (order.id === id) {
          return {
            ...order,
            attributes: { ...order.attributes, status: status },
          };
        }
        return order;
      })
    );
  };*/

  return (
    <div>
      <Tabs
        defaultActiveKey={type ? type : "kitchen"}
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        {(!type || type === "kitchen") && (
          <Tab eventKey="kitchen" title="Kitchen" id="kitchen">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                padding: "2rem",
              }}
            >
              {orders &&
                orders.data
                  .filter(
                    (o) =>
                      o.attributes.status !== "SERVED" &&
                      o.attributes.status !== "PRE-EVENT" &&
                      o.attributes.status !== "LEFT" &&
                      o.attributes.type === "KITCHEN"
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.attributes.active_since) -
                      new Date(b.attributes.active_since)
                  ) // Sort based on active_since  .sort(o => o.attributes.active_since) // !!! sorting based on active_since
                  .map((order) => (
                    <OrderTicket order={order} refetch={refetch} />
                  ))}
            </div>
          </Tab>
        )}
        {(!type || type === "bar") && (
          <Tab eventKey="bar" title="Bar" id="bar">
            {orders &&
              orders.data
                .filter(
                  (o) =>
                    o.attributes.status !== "SERVED" &&
                    o.attributes.status !== "LEFT" &&
                    o.attributes.type === "BAR"
                )
                .map((order) => (
                  <OrderTicket order={order} refetch={refetch} />
                ))}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default Kitchen;
