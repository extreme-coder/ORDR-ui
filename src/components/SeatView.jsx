import { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

export const SeatView = ({ seat }) => {
  const [teacher, setTeacher] = useState({
    attributes: {
      name: "John Doe",
      teacher_status: "ARRIVED",
      orders: [
        { id: 1, attributes: { status: "UNFINISHED" } },
        { id: 2, attributes: { status: "COOKED" } },
        { id: 3, attributes: { status: "SERVED" } },
      ]
    }
  })

  const allItems = [
    { id: 1, attributes: { name: "Pancakes", type: "FOOD" } },
    { id: 2, attributes: { name: "Burger", type: "FOOD" } },
    { id: 3, attributes: { name: "Coke", type: "DRINK" } },
    { id: 4, attributes: { name: "Sprite", type: "DRINK" } },
    { id: 5, attributes: { name: "Water", type: "DRINK" } },
    { id: 6, attributes: { name: "Coffee", type: "DRINK" } },
  ]

  const [items, setItems] = useState([allItems[0]])

  const addItem = () => {
    console.log([...items, allItems[0]])
    setItems([...items, allItems[0]])
  }

  const submitOrder = () => {
    console.log(items)
    setItems([allItems[0]])
  }

  return <Modal.Body>
    <div>
      <h4>{teacher.attributes.name}</h4>
      <h5>Status: {teacher.attributes.teacher_status}</h5>
      {teacher.attributes.teacher_status === "ARRIVED" && <>
        <h5>{teacher.attributes.orders.filter(o => o.attributes.status !== "SERVED").length} orders in progress</h5>
        <h5>{teacher.attributes.orders.filter(o => o.attributes.status === "SERVED").length} orders completed</h5>
        <h5>Create New Order:</h5>
        <ul>
          {items.map(item => <Form.Select value={item.id} onChange={(e) => { setItems(items.map((i, index) => (index === items.indexOf(item) ? allItems[e.target.value - 1] : i))); console.log(items) }}>
            {allItems.map(allItem => <option value={allItem.id}>{allItem.attributes.name}</option>)}
          </Form.Select>)}
          <Button onClick={addItem}>Add Item</Button>
        </ul>
        <Button onClick={submitOrder}>Submit Order</Button>
      </>}
    </div>
  </Modal.Body>
}