import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { toast } from "react-toastify"

export const Preorder = () => {
  const [order, setOrder] = useState({ name: "", items: [] })
  const allItems = [
    { id: 1, attributes: { name: "Pancakes", type: "FOOD" } },
    { id: 2, attributes: { name: "Burger", type: "FOOD" } },
    { id: 3, attributes: { name: "Coke", type: "DRINK" } },
    { id: 4, attributes: { name: "Sprite", type: "DRINK" } },
    { id: 5, attributes: { name: "Water", type: "DRINK" } },
    { id: 6, attributes: { name: "Coffee", type: "DRINK" } },
  ]

  const addItem = () => {
    setOrder({ ...order, items: [...order.items, allItems[0]] })
  }

  const submitOrder = () => {
    console.log(order)
    toast.success("Order submitted!")
  }

  const removeItem = (index) => {
    setOrder({ ...order, items: order.items.filter((item, i) => i !== index) })
  }

  return <div>
    <h1>Preorder</h1>
    <Form.Label>First Name:</Form.Label>
    <Form.Control placeholder="Name" onChange={(e) => setOrder({ ...order, name: e.target.value + " " + order.name.split(" ")[1] })} />
    <Form.Label>Last Name:</Form.Label>
    <Form.Control placeholder="Name" onChange={(e) => setOrder({ ...order, name: order.name.split(" ")[0] + " " + e.target.value })} />
    <Form.Label>Items:</Form.Label>
    <ul>
      {order.items.map(item => <p>
        <Form.Select value={item.id} onChange={(e) => { setOrder({ ...order, items: order.items.map((i, index) => (index === order.items.indexOf(item) ? allItems[e.target.value - 1] : i)) }) }}>
          {allItems.map((allItem, i) => <option value={allItem.id}>{allItem.attributes.name}</option>)}
        </Form.Select>
        <Button variant="danger" onClick={() => removeItem(order.items.indexOf(item))}>Remove Item</Button>
      </p>)}
      <Button onClick={addItem}>Add Item</Button>
    </ul>
    <Button onClick={submitOrder}>Submit Order</Button>
  </div>
}