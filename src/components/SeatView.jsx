import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { toast } from "react-toastify"
import { useAddEntityMutation, useGetEntitiesByFieldQuery, useGetEntitiesQuery, useGetEntityQuery } from "../services/lastmeal"

export const SeatView = ({ seat }) => {
  const { data: teacher } = useGetEntityQuery({ name: "teacher", id: seat.attributes.teacher.data.id })

  const { data: allItems } = useGetEntitiesQuery({ name: "item", populate: true })

  const { data: orders } = useGetEntitiesByFieldQuery({ name: "order", field: "teacher", value: seat.attributes.teacher.data.id, relation: 'id', populate: true })

  const [items, setItems] = useState([])

  const [addEntity] = useAddEntityMutation();

  const [submitted, setSubmitted] = useState(false)

  const addItem = () => {
    console.log([...items, allItems.data[0]])
    setItems([...items, allItems.data[0]])
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const submitOrder = () => {
    const foodItems = items.filter(item => item.attributes.type === "FOOD")
    const drinkItems = items.filter(item => item.attributes.type === "DRINK")
    if (foodItems.length > 0) {
      addEntity({ name: "order", body: { data: { status: "UNFINISHED", items: foodItems.map(item => item.id), teacher: seat.attributes.teacher.data.id, type: "KITCHEN" } } })
    }
    if (drinkItems.length > 0) {
      addEntity({ name: "order", body: { data: { status: "UNFINISHED", items: drinkItems.map(item => item.id), teacher: seat.attributes.teacher.data.id, type: "BAR" } } })
    }
    setSubmitted(true)
    toast.success("Order submitted!")
  }

  useEffect(() => {
    if (allItems) {
      setItems([allItems.data[0]])
    }
  }, [allItems])

  return teacher && allItems && orders && <Modal.Body>
    <div>
      <h4>{teacher.data.attributes.name}</h4>
      <h5>Status: {teacher.data.attributes.teacher_status}</h5>
      {teacher.data.attributes.teacher_status === "ARRIVED" && <>
        <h5>{orders.data.filter(o => o.attributes.status !== "SERVED").length} orders in progress</h5>
        <h5>{orders.data.filter(o => o.attributes.status === "SERVED").length} orders completed</h5>
        {!submitted && <> <h5>Create New Order:</h5>
          <ul>
            {items.map(item => <p><Form.Select value={item.id} onChange={(e) => { setItems(items.map((i, index) => (index === items.indexOf(item) ? allItems.data[e.target.value - 1] : i))); console.log(items) }}>
              {allItems.data.map(allItem => <option value={allItem.id}>{allItem.attributes.name}</option>)}
            </Form.Select>
              <Button variant="danger" onClick={() => removeItem(item.id)}>Remove Item</Button></p>)}
            <Button onClick={addItem}>Add Item</Button>
          </ul>
          <Button onClick={submitOrder}>Submit Order</Button>
        </>}
        {submitted && <h5>Order Submitted!</h5>}
      </>}
    </div>
  </Modal.Body>
}