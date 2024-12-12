import { useEffect, useState } from "react";
import { Modal, Button, Tab, Tabs, TabContent } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useAddEntityMutation,
  useGetEntitiesByFieldQuery,
  useGetEntitiesQuery,
  useGetEntityQuery,
  useUpdateEntityMutation,
} from "../services/lastmeal";
import SingleOrder from "./SingleOrder";
import styles from "../pages/pageStyles/Preorder.module.css";
import "../pages/pageStyles/Preorder.css";
import ItemCard from "./ItemCard";
import SingleOrderWaiter from "./SingleOrderWaiter";
import { refetchTime } from "../constants";
import "./styles/SeatView.css";

export const SeatView = ({ seat, updateView }) => {
  const { data: teacher, refetch: tRefetch } = useGetEntityQuery({
    name: "teacher",
    id: seat.attributes.teacher.data.id,
    populate: true,
  });
  const { data: allItems, refetch: iRefetch } = useGetEntitiesQuery({
    name: "item",
    populate: true,
  });

  const teacherID = seat.attributes.teacher.data.id;
  const { data: orders, refetch: oRefetch } = useGetEntitiesByFieldQuery({
    name: "order",
    field: "teacher",
    value: seat.attributes.teacher.data.id,
    relation: "id",
    populate: "populate=items.item&populate=items.toppings&populate=teacher",
  });

  const [items, setItems] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [addEntity] = useAddEntityMutation();
  const [updateEntity] = useUpdateEntityMutation();

  const [submitted, setSubmitted] = useState(false);

  const [tab, setTab] = useState(1);
  const getItemType = (tab) => (tab === 1 ? "FOOD" : "DRINK");

  const [viewDelivered, setViewDelivered] = useState(false);
  const handleViewDelivered = () => {
    setViewDelivered(!viewDelivered);
  };

  const addItem = (id, toppings, name, type = "FOOD") => {
    setItems([...items, { item: id, toppings, name, type }]);
  };

  const removeItem = (name) => {
    setItems(items.filter((item) => item.name !== name));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("refetch");
      tRefetch();
      iRefetch();
      oRefetch();
    }, refetchTime);

    return () => clearInterval(interval);
  }, [tRefetch, iRefetch, oRefetch]);

  const leaveTeacher = async () => {
    teacher.data.attributes.orders.data.map((o) => {
      console.log(
        "entity update",
        updateEntity({
          name: "order",
          id: o.id,
          body: { data: { status: "LEFT" } },
        })
      );
    });
    updateEntity({
      name: "teacher",
      id: teacher.data.id,
      body: { data: { teacher_status: "LEFT" } },
    });
    const newSeat = await updateEntity({
      name: "seat",
      id: seat.id,
      body: { data: { teacher: null } },
    });
    toast.success("Teacher marked as left!");
    updateView(newSeat.data.data);
  };

  const submitOrder = () => {
    const foodItems = items.filter((item) => item.type === "FOOD");
    const drinkItems = items.filter((item) => item.type === "DRINK");
    console.log("food items", foodItems);
    console.log("drink items", drinkItems);
    if (foodItems.length > 0) {
      addEntity({
        name: "order",
        body: {
          data: {
            status: "UNFINISHED",
            order_items: foodItems,
            teacher: seat.attributes.teacher.data.id,
            type: "KITCHEN",
          },
        },
      });
    }
    if (drinkItems.length > 0) {
      addEntity({
        name: "order",
        body: {
          data: {
            status: "UNFINISHED",
            order_items: drinkItems,
            teacher: seat.attributes.teacher.data.id,
            type: "BAR",
          },
        },
      });
    }
    setSubmitted(true);
    toast.success("Order submitted!");
  };

  /*useEffect(() => {
    if (allItems) {
      setItems([allItems.data[0]])
    }
    test
  }, [allItems])*/

  return (
    teacher &&
    allItems &&
    orders &&
    orders.data && (
      <Modal.Body>
        <div className="seatView">
          <div className="infoContainer">
            <div className="infoHeading">
              <u>{teacher.data.attributes.name}</u>
              {teacher.data.attributes.status === "PENDING" && "...loading..."}
              <div
                className={
                  viewDelivered
                    ? "switchView toReady"
                    : "switchView toDelivered"
                }
                onClick={handleViewDelivered}
              >
                {viewDelivered
                  ? "← " +
                    orders.data
                      .filter(
                        (o) =>
                          /*what is the first cond here for??? o.attributes.teacher.id === teacher.id &&*/ o
                            .attributes.status === "PREPARED"
                      )
                      .reduce(
                        (accumulator, order) =>
                          accumulator + order.attributes.items.data.length,
                        0
                      ) +
                    " ready"
                  : orders.data
                      .filter(
                        (o) =>
                          /*what is the first cond here for??? o.attributes.teacher.id === teacher.id &&*/ o
                            .attributes.status === "SERVED"
                      )
                      .reduce(
                        (accumulator, order) =>
                          accumulator + order.attributes.items.data.length,
                        0
                      ) + " Delivered"}
              </div>
            </div>
            <div className="infoBody">
              {viewDelivered ? (
                <>
                  <span className="label">Delivered Items</span>
                  <div className="orderList">
                    {orders.data
                      .filter(
                        (o) =>
                          /*what is the first cond here for??? o.attributes.teacher.id === teacher.id &&*/ o
                            .attributes.status === "SERVED"
                      )
                      .map((o) => (
                        <>
                          {o.attributes.items.data.map((item) => (
                            <div
                              className="orderItem"
                              style={{
                                backgroundColor: "#4CB61A",
                                color: "white",
                              }}
                            >
                              {item.attributes.item.data.attributes.name} w/{" "}
                              {item.attributes.toppings.data
                                .map((t) => t.attributes.name)
                                .splice(0, 3)
                                .join(", ")}
                            </div>
                          ))}
                        </>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <span className="label">Ready Items</span>
                  <div className="orderList">
                    {orders.data
                      .filter(
                        (o) =>
                          /*what is the first cond here for??? o.attributes.teacher.id === teacher.id &&*/ o
                            .attributes.status === "PREPARED"
                      )
                      .map((o) => (
                        <>
                          {o.attributes.items.data.map((item) => (
                            <div
                              className="orderItem"
                              style={{
                                backgroundColor: "#FF564A",
                                color: "white",
                              }}
                            >
                              {item.attributes.item.data.attributes.name} w/{" "}
                              {item.attributes.toppings.data
                                .map((t) => t.attributes.name)
                                .splice(0, 3)
                                .join(", ")}
                            </div>
                          ))}
                        </>
                      ))}
                  </div>
                  <span className="label">Items in progress</span>
                  <div className="orderList">
                    {orders.data
                      .filter(
                        (o) =>
                          /*what is the first cond here for??? o.attributes.teacher.id === teacher.id &&*/ o
                            .attributes.status === "UNFINISHED"
                      )
                      .map((o) => (
                        <>
                          {o.attributes.items.data.map((item) => (
                            <div
                              className="orderItem"
                              style={{
                                backgroundColor: "#FFD400",
                                color: "black",
                              }}
                            >
                              {item.attributes.item.data.attributes.name} w/{" "}
                              {item.attributes.toppings.data
                                .map((t) => t.attributes.name)
                                .splice(0, 3)
                                .join(", ")}
                            </div>
                          ))}
                        </>
                      ))}
                  </div>
                </>
              )}
            </div>
            <div className="btnLeft" onClick={leaveTeacher}>
              Mark as Left
            </div>
          </div>
          <div
            className="orderingContainer"
            style={
              submitted
                ? {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }
                : {}
            }
          >
            {submitted ? (
              "Order Submitted!"
            ) : (
              <>
                <div className="orderingHeader">
                  <div
                    id={1}
                    className={`tabBtn${tab === 1 ? " active" : " inactive"}`}
                    onClick={() => setTab(1)}
                  >
                    FOOD
                  </div>
                  <div
                    id={2}
                    className={`tabBtn${tab === 2 ? " active" : " inactive"}`}
                    onClick={() => setTab(2)}
                  >
                    DRINKS
                  </div>
                </div>
                <div className="orderingBody">
                  <div className="itemList">
                    {allItems &&
                      allItems.data
                        .filter(
                          (item) => item.attributes.type === getItemType(tab)
                        )
                        .map((item, index) => (
                          <ItemCard
                            item={item}
                            addItem={addItem}
                            small
                          ></ItemCard>
                        ))}
                  </div>
                  <div className="currentOrderContainer">
                    <span>Current Order</span>
                    <div className="orderList">
                      {items.map((item) => (
                        <div
                          className="orderItem"
                          style={{ backgroundColor: "black", color: "white" }}
                          draggable="true"
                          onDragStart={(e) =>
                            e.dataTransfer.setData("text/plain", item.name)
                          }
                          onDragLeave={() => removeItem(item.name)}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                    {submitted ? (
                      <div
                        className="btnSubmit"
                        style={{
                          backgroundColor: "grey",
                          cursor: "not-allowed",
                        }}
                      >
                        Order Submitted!
                      </div>
                    ) : (
                      <div
                        className="btnSubmit"
                        style={
                          items.length === 0
                            ? {
                                backgroundColor: "grey",
                                cursor: "not-allowed",
                              }
                            : {}
                        }
                        onClick={submitOrder}
                      >
                        Submit Order
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    )
  );
};
