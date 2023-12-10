import { useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useAddEntityMutation, useGetEntitiesByDebthQuery, useGetEntitiesQuery } from "../services/lastmeal"
import ItemCard from "../components/ItemCard"

export const Preorder = () => {
  const [order, setOrder] = useState({ name: "", mods: "", status: "UNFINISHED", items: [] })
  const { data: allItems } = useGetEntitiesByDebthQuery({ name: "item", populate: true, debthField: "toppings"});
  

  useEffect(()=> {
    console.log(allItems);
  },[allItems])

  const [addEntity] = useAddEntityMutation();

  const submitOrder = () => {
    console.log(order)
    addEntity({ name: "order", body: { data: { ...order, items: order.items.join(", "), status: "PRE-EVENT" } } })
    navigate("/confirmation")
  }

  const removeItem = (index) => {
    setOrder({ ...order, items: order.items.filter((item, i) => i !== index)})
  }

  const navigate = useNavigate()

  const addItem = (item) => {
    setOrder({ ...order, items: [...order.items, item] })
    console.log(item)
    console.log(order)
  }

  return <div>
    <h1>The Last Breakfast 2.0 - Preorder</h1>
    <Form.Label>First Name:</Form.Label>
    <Form.Control placeholder="Enter first name" onChange={(e) => setOrder({ ...order, name: e.target.value + " " + order.name.split(" ")[1] })} />
    <Form.Label>Last Name:</Form.Label>
    <Form.Control placeholder="Enter last name" onChange={(e) => setOrder({ ...order, name: order.name.split(" ")[0] + " " + e.target.value })} />
    <Form.Label>Allergies Relevant to Order:</Form.Label>
    <Form.Control placeholder="Allergies" onChange={(e) => setOrder({ ...order, mods: e.target.value })} />
    <Form.Label>Items</Form.Label>
    <div class="hstack gap-5">
      {order.items.map((item, index) => <Button variant="danger" onClick={() => removeItem(index)}>{item}</Button>)}
    </div>
    <div class="hstack gap-5">
      {allItems && allItems.data.map((item)=> <ItemCard item={item} addItem={addItem} ></ItemCard>)}
    </div>
    <Button onClick={submitOrder}>Submit Order</Button>
  </div>
}

export const Confirmation = () => (
  <div>
    <h1>Order Confirmed</h1>
    <p>Your order has been confirmed!</p>
  </div>
)