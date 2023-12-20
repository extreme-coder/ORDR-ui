import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { toast } from "react-toastify"
import { useAddEntityMutation, useGetEntitiesByFieldQuery, useGetEntitiesQuery, useGetEntityQuery, useUpdateEntityMutation } from "../services/lastmeal"
import SingleOrder from "./SingleOrder"
import styles from '../pages/pageStyles/Preorder.module.css'
import '../pages/pageStyles/Preorder.css'
import ItemCard from "./ItemCard"
import SingleOrderWaiter from "./SingleOrderWaiter"
import { refetchTime } from "../constants"

export const SeatView = ({ seat, updateView }) => {
  const { data: teacher, refetch: tRefetch } = useGetEntityQuery({ name: "teacher", id: seat.attributes.teacher.data.id, populate: true })

  const { data: allItems, refetch: iRefetch } = useGetEntitiesQuery({ name: "item", populate: true })

  const { data: orders, refetch: oRefetch } = useGetEntitiesByFieldQuery({ name: "order", field: "teacher", value: seat.attributes.teacher.data.id, relation: 'id', populate: true })

  const [items, setItems] = useState([]);

  const[showModal, setShowModal] = useState(false);

  const [addEntity] = useAddEntityMutation();
  const [updateEntity] = useUpdateEntityMutation();

  const [submitted, setSubmitted] = useState(false)

  const addItem = (item, type="FOOD") => {
    setItems([...items, {name: item, type: type}])
  }

  const removeItem = (name) => {
    setItems(items.filter(item => item.name !== name))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("refetch")
      tRefetch()
      iRefetch()
      oRefetch()
    }, refetchTime);

    return () => clearInterval(interval);
  }, [tRefetch, iRefetch, oRefetch])

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
    test
  }, [allItems])*/

  return teacher && allItems && orders && <Modal.Body>
    <div>
      <h4>{teacher.data.attributes.name}</h4>
      {teacher.data.attributes.teacher_status === "ARRIVED" && <>
        {/*mark as left button*/}
        <Button variant="danger" onClick={leaveTeacher}>Mark as Left</Button>
        <div class="hstack gap-1">
        <p style={{marginTop:"1rem"}}>{orders.data.filter(o => o.attributes.status !== "SERVED").length} orders in progress</p>
        <Button className="view-order-btn" onClick={()=> setShowModal(true)}>View</Button>
        </div>
        <p style={{marginTop: "-1rem"}}>{orders.data.filter(o => o.attributes.status === "SERVED").length} orders completed</p>
        {!submitted && <> <h5>Create New Order:</h5>
          <div className={styles[`sv-cards-container`]}>
            {allItems && allItems.data.map((item, index) => <ItemCard item={item} addItem={addItem} small ></ItemCard>)}
          </div>
          {items.map((item) => (<SingleOrderWaiter itemName={item.name} removeItem={() => removeItem(item.name)}></SingleOrderWaiter>))}
          <Button onClick={submitOrder}>Submit Order</Button>
        </>}
        {submitted && <h5>Order Submitted!</h5>}
        <Modal show={showModal} onHide={() => setShowModal(false)} closeButton>
          <Modal.Header className={styles[`pv-header`]}>
            Orders in Progress
            <button type="button" class="btn-close btn-close-white" aria-label="Close" onClick={()=> setShowModal(false)}></button>
          </Modal.Header>
          <Modal.Body>
            <h5>{teacher.data.attributes.name}</h5>
            {orders.data.filter(o => 
              o.attributes.teacher.id === teacher.id && o.attributes.status !== "SERVED").map(o => 
              <div>{o.attributes.items.split(",").map(item => 
              <div className={styles[`pv-item-${o.attributes.status}`]}>
                {item} 
              </div>)}
            </div>)}
          </Modal.Body>
        </Modal>
      </>}
    </div>
  </Modal.Body>
}