import { Accordion, ButtonGroup, Card } from "react-bootstrap";
import { useGetEntitiesByFieldQuery, useGetEntityQuery, useUpdateEntityMutation } from "../services/lastmeal";
import { useEffect, useReducer, useState } from "react";
import { refetchTime } from "../constants";

const buttonLeft = {
  flex: '0 0 50%',
  display: 'flex',
  justifyContent: 'flex-end'
}

export const TicketCard = ({ order }) => {
  const [orderClone, setOrderClone] = useState(JSON.parse(JSON.stringify(order)))
  const { data: seat, refetch } = useGetEntitiesByFieldQuery({ name: "seat", field: "teacher", value: order.attributes.teacher.data.id, relation: 'id', populate: true })

  const [updateEntity] = useUpdateEntityMutation();

  const handleStatus = (status) => {
    updateEntity({ name: "order", id: order.id, body: { data: { status: status } } })
    setOrderClone({ ...orderClone, attributes: { ...orderClone.attributes, status: status } })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("refetch")
      refetch();
    }, refetchTime);

    return () => clearInterval(interval);
  }, [refetch])

  return <Card eventKey={order.id} style={{ backgroundColor: "#f0f4fc" }}>
    {seat && <div className="hstack" style={{ marginTop: '20px' }}>
      <div>
        <h5 style={{ display: 'inline-block', marginRight: '5px', marginLeft: '15px' }}>#</h5>
        <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '10vw' }}>
          {order.id}
        </p>
      </div>
      <div>
        <h5 style={{ display: 'inline-block', marginRight: '5px' }}>Table: </h5>
        <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '10vw' }}>
          {seat.data[0] && seat.data[0].attributes.table.data.attributes.number}
        </p>
      </div>
      <div>
        <h5 style={{ display: 'inline-block', marginRight: '5px' }}>Seat: </h5>
        <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '10vw' }}>
          {seat.data[0] && seat.data[0].attributes.number}
        </p>
      </div>
      <div>
        <h5 style={{ display: 'inline-block', marginRight: '5px' }}>Teacher:</h5>
        <p style={{ display: 'inline-block', marginBottom: '0', marginRight: '10vw' }}>
          {order.attributes.teacher.data.attributes.name}
        </p>
      </div>
      {order.attributes.mods && <div>
        <h5 style={{ display: 'inline-block', marginRight: '5px' }}>Allergies:</h5>
        <b style={{ display: 'inline-block', marginBottom: '0', marginRight: '10vw', color: 'red' }}>
          {order.attributes.mods}
        </b>
      </div>}
      <ButtonGroup styles={buttonLeft}>
        {orderClone.attributes.status === "UNFINISHED" && <>
          <button type="button" class="btn btn-outline-primary" onClick={() => handleStatus("PREPARED")}>Cooked</button>
        </>}
        {orderClone.attributes.status === "PREPARED" && <>
          <button type="button" class="btn btn-secondary " onClick={() => handleStatus("UNFINISHED")}>Undo Cook</button>
          <button type="button" class="btn btn-outline-success" onClick={() => { handleStatus("SERVED"); refetch() }}>Served</button>
        </>}
        {orderClone.attributes.status === "SERVED" && <>
          <p>Successfully served! This ticket will disappear.</p>
        </>}
      </ButtonGroup>
    </div>}
    <div>
      <table class="table">
        <tbody>
          {order.attributes.items.data.map(item =>
            <tr>
              <td style={{ backgroundColor: "#f0f4fc", borderBottomColor: "#b7bbc4" }}>
                <div style={{ marginLeft: "30px" }}>
                  {item.attributes.item.data.attributes.name} w/ {item.attributes.toppings.data.map(t => t.attributes.name).join(", ")}
                </div>
              </td>
              <td style={{ backgroundColor: "#f0f4fc", borderBottomColor: "#b7bbc4" }}>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"></input>
                  <label class="form-check-label" for="flexCheckDefault">
                    Mark
                  </label>
                </div>
              </td>
            </tr>

          )}
        </tbody>
      </table>
    </div>
  </Card>
}