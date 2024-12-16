import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  useAddEntityMutation,
  useGetEntitiesByDepthQuery,
  useGetEntitiesQuery,
} from "../services/lastmeal";
import ItemCard from "../components/ItemCard";
import styles from "./pageStyles/Preorder.module.css";
import "./pageStyles/Preorder.css";
import { setupListeners } from "@reduxjs/toolkit/query";
import SingleOrder from "../components/SingleOrder";

export const Preorder = () => {
  const [order, setOrder] = useState({
    name: "",
    mods: "",
    status: "UNFINISHED",
    order_items: [],
  });
  const { data: allItems } = useGetEntitiesByDepthQuery({
    name: "item",
    populate: true,
    depthField: "toppings",
  });
  const { data: allOrders } = useGetEntitiesByDepthQuery({
    name: "order",
    populate: true,
    depthField: "teacher",
  });
  const [warning, setWarning] = useState(false);
  const [already, setAlready] = useState(false);

  useEffect(() => {
    console.log(allItems);
  }, [allItems]);

  const [addEntity] = useAddEntityMutation();

  const submitOrder = async () => {
    if (
      allOrders &&
      allOrders.data.filter(
        (o) => o.attributes.teacher.data.attributes.name === order.name
      ).length > 0
    ) {
      setAlready(true);
      return;
    }
    if (
      order.name
        .split(" ")
        .map((n) => n.trim())
        .filter((n) => n !== "" && n !== "undefined").length !== 2
    ) {
      setWarning(true);
      return;
    }
    const teacher = await addEntity({
      name: "teacher",
      body: { data: { name: order.name } },
    });
    addEntity({
      name: "order",
      body: {
        data: {
          ...order,
          status: "PRE-EVENT",
          teacher: teacher.data.data.id,
          type: "KITCHEN",
        },
      },
    });
    navigate("/confirmation");
  };

  const removeItem = (index) => {
    setOrder({
      ...order,
      order_items: order.order_items.filter((item, i) => i !== index),
    });
  };

  const navigate = useNavigate();

  const addItem = (id, toppings, name, type = "FOOD") => {
    setOrder({
      ...order,
      order_items: [...order.order_items, { item: id, toppings, name, type }],
    });
  };

  return (
    <div className={styles.preorder}>
      <div className={styles.header}>
        <h1>BNSS Staff Breakfast Preorder</h1>
      </div>
      <form>
        <Form.Label className={styles[`form-header`]}>First Name:</Form.Label>
        <Form.Control
          className={styles[`form-input`]}
          placeholder="Enter first name"
          onChange={(e) =>
            setOrder({
              ...order,
              name: e.target.value + " " + order.name.split(" ")[1],
            })
          }
        />
        <Form.Label className={styles[`form-header`]}>Last Name:</Form.Label>
        <Form.Control
          className={styles[`form-input`]}
          placeholder="Enter last name"
          onChange={(e) =>
            setOrder({
              ...order,
              name: order.name.split(" ")[0] + " " + e.target.value,
            })
          }
        />
        {warning && (
          <p className={styles["form-header"]} style={{ color: "red" }}>
            Please enter a valid first and last name (no spaces or special
            characters).
          </p>
        )}
        {already && (
          <p className={styles["form-header"]} style={{ color: "red" }}>
            There’s already a preorder under this name. If you’d like to change
            your order, please contact the BNSS Student Government Team.
          </p>
        )}
        <Form.Label className={styles[`form-header`]}>
          Allergies Relevant to Order:
        </Form.Label>
        <Form.Control
          className={styles[`form-input`]}
          placeholder="Allergies"
          onChange={(e) => setOrder({ ...order, mods: e.target.value })}
        />
      </form>
      <h4 className={styles.h}>Select Items to Preorder</h4>

      <div className={styles[`cards-container`]}>
        {allItems &&
          allItems.data
            .filter((item) => item.attributes.type === "FOOD")
            .map((item, index) => (
              <ItemCard
                item={item}
                addItem={addItem}
                imageAdress={require(`../../assets/${index + 1}.jpg`)}
              ></ItemCard>
            ))}
      </div>
      <h4 className={styles.h}>My Order:</h4>
      <div>
        {order.order_items.length === 0 ? (
          <p className={styles[`no-items`]}>No items selected</p>
        ) : (
          order.order_items.map((item, index) => (
            <SingleOrder
              itemName={item.name}
              removeItem={() => removeItem(index)}
            ></SingleOrder>
          ))
        )}
      </div>
      <Button className={styles[`submit-btn`]} onClick={submitOrder}>
        Submit Order
      </Button>
    </div>
  );
};

export const Confirmation = () => (
  <div className={styles.preorder}>
    <h1 className="oc">Order Confirmed</h1>
    <h4 className="oc-sub">
      Thank you for preordering. The Student Government class can't wait to
      serve you on Dec. 20th!
    </h4>
    <p className="oc-credit">developed by Aryan Singh and Ali Hosseini</p>
  </div>
);
