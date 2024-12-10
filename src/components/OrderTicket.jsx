import React, { useEffect, useState } from "react";
import styles from "./styles/OrderTicket.module.css";
import { useUpdateEntityMutation } from "../services/lastmeal.js";
import { refetchTime } from "../constants";

const OrderTicket = ({ order }) => {
  console.log(order);
  const [orderClone, setOrderClone] = useState(order);
  const [updateEntity] = useUpdateEntityMutation();

  const handleStatus = (status) => {
    updateEntity({
      name: "order",
      id: order.id,
      body: { data: { status: status } },
    });
    setOrderClone((prevClone) => ({
      ...prevClone,
      attributes: { ...orderClone.attributes, status: status },
    }));
  };

  useEffect(() => {
    setOrderClone(order);
  }, [order]);

  console.log("oc", orderClone);

  const getHeadingColour = (activeSince) => {
    const now = new Date();
    const activeSinceDate = new Date(activeSince);
    const diff = now - activeSinceDate;
    /* if diff is greater than 15 minutes, return #D85040 */
    /* if diff is greater than 10 minutes, return #EF9D1A */
    /* if diff is greater than 5 minutes, return #DDC655 */
    /* if diff is greater than 0 minutes, return #087A91 */
    if (diff > 900000) {
      return "#D85040";
    } else if (diff > 600000) {
      return "#EF9D1A";
    } else if (diff > 300000) {
      return "#DDC655";
    } else {
      return "#087A91";
    }
  };
  const activeSince = orderClone.attributes.active_since;

  const calculateTime = () => {
    const diff = new Date() - new Date(activeSince); // Difference in milliseconds
    const minutes = Math.floor(diff / 60000); // Convert to minutes
    const seconds = Math.floor((diff % 60000) / 1000); // Get remaining seconds
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const [timeSinceActive, setTimeSinceActive] = useState(calculateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceActive(calculateTime());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [activeSince]);

  return (
    <div className={styles.ticket} id="ticket">
      <div
        className={styles.ticketHeading}
        style={{
          backgroundColor: getHeadingColour(orderClone.attributes.active_since),
        }}
        id="heading"
      >
        <span>
          <span style={{ fontWeight: "700" }}>Table:</span>

          {orderClone &&
          orderClone.attributes.teacher.data.attributes.seat &&
          orderClone.attributes.teacher.data.attributes.seat.data &&
          orderClone.attributes.teacher.data.attributes.seat.data.attributes
            ? orderClone.attributes.teacher.data.attributes.seat.data.attributes
                .table.data.attributes.number
            : " -"}
        </span>
        <span>
          <span style={{ fontWeight: "700" }}>Seat:</span>
          {orderClone &&
          orderClone.attributes.teacher.data.attributes.seat &&
          orderClone.attributes.teacher.data.attributes.seat.data &&
          orderClone.attributes.teacher.data.attributes.seat.data.attributes
            ? orderClone.attributes.teacher.data.attributes.seat.data.attributes
                .number
            : " -"}
        </span>
        <span>
          <span style={{ fontWeight: "700" }}>Teacher:</span>
          {/* display the first five characters of the teacher's name followed by period IF shortened*/}
          {orderClone && orderClone.attributes.teacher.data.attributes.name
            ? orderClone.attributes.teacher.data.attributes.name.length > 5
              ? `${orderClone.attributes.teacher.data.attributes.name.slice(
                  0,
                  5
                )}.`
              : orderClone.attributes.teacher.data.attributes.name
            : "N/A"}
        </span>
      </div>
      {orderClone.attributes.status === "SERVED" ? (
        <div className={styles.served}>Order Succesfully Served</div>
      ) : (
        <div className={styles.body} id="body">
          {orderClone.attributes.items.data.map((item) => (
            <div className={styles.item} id="item">
              <span style={{ fontWeight: "700" }}>
                {item.attributes.item.data.attributes.name}
              </span>{" "}
              <span style={{ color: "#007DC1" }}>
                w/{" "}
                {item.attributes.toppings.data
                  .map((t) => t.attributes.name)
                  .join(", ")}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className={styles.footer} id="footer">
        <span style={{ fontWeight: "600" }}>TSO: {timeSinceActive}</span>
        {orderClone.attributes.status === "UNFINISHED" ? (
          <div
            className={styles.btnReady}
            onClick={() => handleStatus("PREPARED")}
          >
            READY
          </div>
        ) : (
          <div className={styles.btnGroup}>
            <div
              className={styles.btnGroupBtn}
              onClick={() => handleStatus("UNFINISHED")}
            >
              UN-READY
            </div>
            <div
              className={styles.btnGroupBtn}
              onClick={() => handleStatus("SERVED")}
            >
              SERVED
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTicket;
