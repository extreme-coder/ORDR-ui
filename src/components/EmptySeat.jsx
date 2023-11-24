import { Button } from "react-bootstrap"
import { useGetEntitiesQuery, useUpdateEntityMutation } from "../services/lastmeal"
import { useEffect, useState } from "react"

export const EmptySeat = ({ seat }) => {
  const { data: teachers } = useGetEntitiesQuery({ name: "teacher", populate: true })
  const [addingTeacher, setAddingTeacher] = useState(false)
  const [teacherAdded, setTeacherAdded] = useState(false)
  const [updateEntity] = useUpdateEntityMutation();
  const [teacher, setTeacher] = useState(null)

  const assignTeacherToSeat = () => {
    updateEntity({ name: "seat", id: seat.id, body: { data: { teacher: teacher } } })
    updateEntity({ name: "teacher", id: teacher, body: { data: { teacher_status: "ARRIVED" } } })
    setAddingTeacher(false)
    setTeacherAdded(true)
  }

  useEffect(() => { 
    if(teachers){
      setTeacher(teachers.data[0].id)
    }
  })

  return <div>
    <h4>Seat {seat.attributes.number}</h4>
    <h5>Status: {seat.attributes.seat_status}</h5>
    <h5>Table: {seat.attributes.table.data.attributes.number}</h5>
    {teacherAdded && <h5>Added successfully!</h5>}
    {!addingTeacher && !teacherAdded && <Button variant="primary" onClick={() => setAddingTeacher(true)}>Add Teacher</Button>}
    {addingTeacher && !teacherAdded && <>
      <select class="form-select" aria-label="Default select example" onChange={(e) => { setTeacher(e.target.value) }}>
        {teachers && teachers.data.map(teacher => <option value={teacher.id}>{teacher.attributes.name}</option>)}
      </select>
      <Button variant="success" onClick={assignTeacherToSeat}>Add</Button>
    </>}
    <h5>Teacher: None</h5>
  </div>
}