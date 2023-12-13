import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { toast } from "react-toastify"
import { useAddEntityMutation, useGetEntitiesByFieldQuery, useGetEntitiesQuery, useGetEntityQuery, useUpdateEntityMutation } from "../services/lastmeal"
import SingleOrder from "./SingleOrder"
import styles from '../pages/pageStyles/Preorder.module.css'
import ItemCard from "./ItemCard"

export const SeatView = ({ seat, updateView }) => {
  const { data: teacher } = useGetEntityQuery({ name: "teacher", id: seat.attributes.teacher.data.id, populate: true })

  const { data: allItems } = useGetEntitiesQuery({ name: "item", populate: true })

  const { data: orders } = useGetEntitiesByFieldQuery({ name: "order", field: "teacher", value: seat.attributes.teacher.data.id, relation: 'id', populate: true })

  const [items, setItems] = useState([])

  const [addEntity] = useAddEntityMutation();
  const [updateEntity] = useUpdateEntityMutation();

  const [submitted, setSubmitted] = useState(false)

  const addItem = (item, type="FOOD") => {
    setItems([...items, {name: item, type: type}])
  }

  const removeItem = (name) => {
    setItems(items.filter(item => item.name !== name))
  }

  const leaveTeacher = async () => {
    console.log(teacher)
    teacher.data.attributes.orders.data.map(o => {
      updateEntity({ name: "order", id: o.id, body: { data: { status: "SERVED" } } })
    })
    updateEntity({ name: "teacher", id: teacher.data.id, body: { data: { teacher_status: "LEFT" } } })
    const newSeat = await updateEntity({ name: "seat", id: seat.id, body: { data: { teacher: null } } })
    toast.success("Teacher marked as left!")
    updateView(newSeat.data.data)
  }

  const submitOrder = () => {
    const foodItems = items.filter(item => item.type === "FOOD")
    const drinkItems = items.filter(item => item.type === "DRINK")
    if (foodItems.length > 0) {
      addEntity({ name: "order", body: { data: { status: "UNFINISHED", items: foodItems.map(i=>i.name).join(", "), teacher: seat.attributes.teacher.data.id, type: "KITCHEN" } } })
    }
    if (drinkItems.length > 0) {
      addEntity({ name: "order", body: { data: { status: "UNFINISHED", items: drinkItems.map(i=>i.name).join(", "), teacher: seat.attributes.teacher.data.id, type: "BAR" } } })
    }
    setSubmitted(true)
    toast.success("Order submitted!")
  }

  /*useEffect(() => {
    if (allItems) {
      setItems([allItems.data[0]])
    }
  }, [allItems])*/

  return teacher && allItems && orders && <Modal.Body>
    <div>
      <h4>{teacher.data.attributes.name}</h4>
      <h5>Status: {teacher.data.attributes.teacher_status}</h5>
      {teacher.data.attributes.teacher_status === "ARRIVED" && <>
        {/*mark as left button*/}
        <Button variant="danger" onClick={leaveTeacher}>Mark as Left</Button>
        <h5>{orders.data.filter(o => o.attributes.status !== "SERVED").length} orders in progress</h5>
        <h5>{orders.data.filter(o => o.attributes.status === "SERVED").length} orders completed</h5>
        {!submitted && <> <h5>Create New Order:</h5>
          <div className={styles[`cards-container`]}>
            {allItems && allItems.data.filter(item => item.attributes.type === "FOOD").map((item, index) => <ItemCard className="card" item={item} addItem={addItem} small ></ItemCard>)}
          </div>
          {items.map((item) => (<SingleOrder itemName={item.name} removeItem={() => removeItem(item.name)}></SingleOrder>))}
          <Button onClick={submitOrder}>Submit Order</Button>
        </>}
        {submitted && <h5>Order Submitted!</h5>}
      </>}
    </div>
  </Modal.Body>
}