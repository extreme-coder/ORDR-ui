import React, { useEffect } from "react";
import { useGetEntitiesByShapeQuery } from "../services/lastmeal";
import styles from "./styles/AllOrders.module.css";
import "./styles/AllOrders.css";
//import socket from '../sockets/socket';
import { refetchTime } from "../constants";

const AllOrders = ({ type, tableId }) => {
  const { data: orders, refetch } = useGetEntitiesByShapeQuery({
    name: "order",
    populate: true,
    shape: [
      ["teacher", "seat", "table"],
      ["items", "item"],
      ["items", "toppings"],
    ],
  });

  /* time status are colours */
  const urgent =
    "#F1B6B6"; /* for orders that have been sitting more than 7 mins */
  const soon =
    "#F8D8BB"; /* for orders that have been sitting more than 4 mins */
  const normal =
    "#F4F4F4"; /* for orders that have been sitting less than 4 mins */

  const getTimeStatus = (time) => {
    const currentTime = new Date();
    const cookedTime = new Date(time);
    const diff = currentTime - cookedTime;

    if (diff > 7 * 60 * 1000) {
      return urgent;
    } else if (diff > 4 * 60 * 1000) {
      return soon;
    } else {
      return normal;
    }
  };
  const filtered =
    orders &&
    orders.data &&
    orders.data
      .filter((o) => o.attributes.status === type)
      .filter((o) =>
        tableId && o.attributes.teacher.data.attributes.seat.data
          ? o.attributes.teacher.data.attributes.seat.data.attributes.table.data
              .attributes.number === tableId
          : true
      )
      .sort(
        (a, b) =>
          new Date(a.attributes.time_cooked) -
          new Date(b.attributes.time_cooked)
      );

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, refetchTime);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className={styles.allOrders}>
      {tableId ? (
        <div className={styles.heading}>
          <div className={styles.Hcell}>Location</div>
          <div className={styles.Hcell}>Seat</div>
          <div className={styles.Hcell}>Teacher</div>
          <div className={styles.Hcell}>Items</div>
        </div>
      ) : (
        <div className={styles.heading}>
          <div className={styles.Hcell2}>Location</div>
          <div className={styles.Hcell2}>Table</div>
          <div className={styles.Hcell2}>Seat</div>
          <div className={styles.Hcell2}>Teacher</div>
          <div className={styles.Hcell2}>Items</div>
        </div>
      )}

      {filtered &&
        filtered.map((order) => (
          <div
            className={styles.row}
            style={
              order.attributes.time_cooked && {
                backgroundColor: getTimeStatus(order.attributes.time_cooked),
              }
            }
          >
            <div className={tableId ? styles.cell : styles.cell2}>
              {order.attributes.type}
            </div>
            {!tableId && (
              <div className={styles.cell2}>
                {
                  order.attributes.teacher.data.attributes.seat.data.attributes
                    .table.data.attributes.number
                }
              </div>
            )}
            <div className={tableId ? styles.cell : styles.cell2}>
              {
                order.attributes.teacher.data.attributes.seat.data.attributes
                  .number
              }
            </div>
            <div className={tableId ? styles.cell : styles.cell2}>
              {order.attributes.teacher.data.attributes.name}
            </div>
            <div className={tableId ? styles.cell : styles.cell2}>
              {order.attributes &&
                order.attributes.items &&
                order.attributes.items.data.toString() &&
                order.attributes.items.data.map((item) => (
                  <div>
                    <span style={{ fontWeight: "800" }}>
                      {item &&
                        item.attributes &&
                        item.attributes.item &&
                        item.attributes.item.data &&
                        item.attributes.item.data.attributes &&
                        item.attributes.item.data.attributes.name}
                    </span>

                    {item.attributes.toppings &&
                      item.attributes.toppings.data.length > 0 && (
                        <span style={{ color: "#5394B7" }}>
                          {` w/${item.attributes.toppings.data.map(
                            (topping) => " " + topping.attributes.code
                          )}`}
                        </span>
                      )}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllOrders;

/*<div
      className={styles[`ao-container`]}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {!tableId ? (
        <table class="orders">
          <tr class="ao-heading">
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Pickup at</h5>
            </th>
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Teacher</h5>
            </th>
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Table</h5>
            </th>
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Seat</h5>
            </th>
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Item</h5>
            </th>
          </tr>

          {orders &&
            orders.data
              .filter((o) => o.attributes.status === type)
              .map((o) => (
                <>
                  {o.attributes.items.split(",").map((item) => (
                    <tr class="ao-row">
                      <td class={`ao-item-${type} first`}>
                        {o.attributes.type}
                      </td>
                      <td class={`ao-item-${type}`}>
                        {o.attributes.teacher.data.attributes.name}
                      </td>
                      <td class={`ao-item-${type}`}>
                        {o.attributes.teacher.data.attributes.seat.data
                          ? o.attributes.teacher.data.attributes.seat.data
                              .attributes.table.data.attributes.number
                          : ""}
                      </td>
                      <td class={`ao-item-${type}`}>
                        {o.attributes.teacher.data.attributes.seat.data
                          ? o.attributes.teacher.data.attributes.seat.data
                              .attributes.number
                          : ""}
                      </td>
                      <td class={`ao-item-${type} last`}>{item}</td>
                    </tr>
                  ))}
                </>
              ))}
        </table>
      ) : (
        <div>
          <h3>Prepared Items</h3>
          <table class="orders">
            <tr class="ao-heading">
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Pickup at</h5>
              </th>
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Teacher</h5>
              </th>
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Table</h5>
              </th>
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Seat</h5>
              </th>
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Item</h5>
              </th>
            </tr>

            {orders &&
              orders.data
                .filter((o) => o.attributes.status === type)
                .map((o) => (
                  <>
                    {o.attributes.items.split(",").map((item) => (
                      <tr class="ao-row">
                        <td class={`ao-item-${type} first`}>
                          {o.attributes.type}
                        </td>
                        <td class={`ao-item-${type}`}>
                          {o.attributes.teacher.data.attributes.name}
                        </td>
                        <td class={`ao-item-${type}`}>
                          {o.attributes.teacher.data.attributes.seat.data
                            ? o.attributes.teacher.data.attributes.seat.data
                                .attributes.table.data.attributes.number
                            : ""}
                        </td>
                        <td class={`ao-item-${type}`}>
                          {o.attributes.teacher.data.attributes.seat.data
                            ? o.attributes.teacher.data.attributes.seat.data
                                .attributes.number
                            : ""}
                        </td>
                        <td class={`ao-item-${type} last`}>{item}</td>
                      </tr>
                    ))}
                  </>
                ))}
          </table>
        </div>
      )}
    </div>
  );*/
