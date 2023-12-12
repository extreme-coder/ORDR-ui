import { useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useAddEntityMutation, useGetEntitiesByDepthQuery, useGetEntitiesQuery } from "../services/lastmeal"
import ItemCard from "../components/ItemCard"
import styles from './pageStyles/Preorder.module.css'
import './pageStyles/Preorder.css'
import { setupListeners } from "@reduxjs/toolkit/query"
import SingleOrder from "../components/SingleOrder"


export const Preorder = () => {
  const [order, setOrder] = useState({ name: "", mods: "", status: "UNFINISHED", items: [] })
  const { data: allItems } = useGetEntitiesByDepthQuery({ name: "item", populate: true, depthField: "toppings" });


  useEffect(() => {
    console.log(allItems);
  }, [allItems])

  const [addEntity] = useAddEntityMutation();

  const submitOrder = async () => {
    console.log(order)
    const teacher = await addEntity({ name: "teacher", body: { data: { name: order.name } } })
    addEntity({ name: "order", body: { data: { ...order, items: order.items.join(", "), status: "PRE-EVENT", teacher: teacher.data.data.addItem } } })
    navigate("/confirmation")
  }

  const removeItem = (index) => {
    setOrder({ ...order, items: order.items.filter((item, i) => i !== index) })
  }

  const navigate = useNavigate()

  const addItem = (item) => {
    setOrder({ ...order, items: [...order.items, item] })
    console.log(item)
    console.log(order)
  }

  return <div className={styles.preorder}>
    <div className={styles.header}>
      <h1>The Last Breakfast 2.0 - Preorder</h1>
    </div>
    <form>
      <Form.Label className={styles[`form-header`]}>First Name:</Form.Label>
      <Form.Control className={styles[`form-input`]} placeholder="Enter first name" onChange={(e) => setOrder({ ...order, name: e.target.value + " " + order.name.split(" ")[1] })} />
      <Form.Label className={styles[`form-header`]}>Last Name:</Form.Label>
      <Form.Control className={styles[`form-input`]} placeholder="Enter last name" onChange={(e) => setOrder({ ...order, name: order.name.split(" ")[0] + " " + e.target.value })} />
      <Form.Label className={styles[`form-header`]} >Allergies Relevant to Order:</Form.Label>
      <Form.Control className={styles[`form-input`]} placeholder="Allergies" onChange={(e) => setOrder({ ...order, mods: e.target.value })} />
    </form>
      <h4 className={styles.h}>Select Order</h4>
    <div>
      {order.items.map((item, index) => (<SingleOrder itemName={item.toString()} removeItem={() => removeItem(index)}></SingleOrder>))}
    </div>
    <div className={styles[`cards-container`]}>
      {allItems && allItems.data.filter(item => item.attributes.type === "FOOD").map((item, index) => <ItemCard className="card" item={item} addItem={addItem} imageAdress={require(`../../assets/${index+1}.jpg`)} ></ItemCard>)}
    </div>
    <Button className={styles[`submit-btn`]}onClick={submitOrder}>Submit Order</Button>
  </div>
}

export const Confirmation = () => (
  <div>
    <h1>Order Confirmed</h1>
    <p>Your order has been confirmed!</p>
  </div>
)