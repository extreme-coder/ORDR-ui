import React, { useState } from 'react'
import styles from "../../components/styles/EmptySeat.module.css"
import SearchBar from '../../components/SearchBar'
import SearchResultsList from '../../components/SearchResultsList'
import { Button } from 'react-bootstrap'
import './Host.css'
import { useAddEntityMutation, useGetEntitiesQuery, useUpdateEntityMutation } from '../../services/lastmeal'

const Host = () => {
  const { data: teachers } = useGetEntitiesQuery({ name: "teacher", populate: true })
  const [addingTeacher, setAddingTeacher] = useState(false)
  const [searchBarFilled, setSearchBarFilled] = useState(false)
  const [results, setResults] = useState([]);
  const [addEntity] = useAddEntityMutation();
  const [teacher, setTeacher] = useState({})
  const [teacherName, setTeacherName] = useState("")
  const [updateEntity] = useUpdateEntityMutation();

  const arriveTeacher = () => {
    console.log(teacher)
    updateEntity({ name: "teacher", id: teacher.id, body: { data: { teacher_status: "ARRIVED" } } })
    //update all teachers orders to UNFINISHED
    teacher.attributes.orders.data.map(o => {
      updateEntity({ name: "order", id: o.id, body: { data: { status: "UNFINISHED" } } })
    })
    setTeacher({});
    setSearchBarFilled(false);
  }

  const addNewTeacher = async () => {
    const newTeacher = await addEntity({ name: "teacher", body: { data: { name: teacherName, teacher_status: "ARRIVED" } } })
  }

  const updateName = (e) => {
    setTeacherName(e.target.value)
  }
  return (
    <div className="host-container">
      <h1 className="host-title">Guest Check-In</h1>
      
      <div>
        <div className={styles['search-bar-container']}>
          <div className="hstack gap-1">
            <div className="sb-container">
            <SearchBar
              dataArr={teachers && teachers.data}
              setResults={setResults}
              selectedTeacher={teacher}
              setSelectedTeacher={setTeacher}
              filled={setSearchBarFilled}
              updateName={updateName}
            />
            </div>
            {results.length === 0 && searchBarFilled && <button className="btn btn-outline-success" onClick={()=> console.log("can't add teachers from host view")}>Add Teacher</button>}
          </div>
          <SearchResultsList results={results} setSelectedTeacher={setTeacher} />
          {teacher.attributes? <Button className="check-in-btn"variant="success" onClick={arriveTeacher}>Check Guest In</Button> : <h4 className='sub-title'>Check-In successfull</h4>}
        </div>
        
      </div>
    </div>
  )
}

export default Host;