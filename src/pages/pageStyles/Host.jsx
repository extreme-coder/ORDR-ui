import React, { useState } from 'react'
import styles from "../../components/styles/EmptySeat.module.css"
import SearchBar from '../../components/SearchBar'
import SearchResultsList from '../../components/SearchResultsList'
import { Button } from 'react-bootstrap'
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
  }

  const addNewTeacher = async () => {
    const newTeacher = await addEntity({ name: "teacher", body: { data: { name: teacherName, teacher_status: "ARRIVED" } } })
  }

  const updateName = (e) => {
    setTeacherName(e.target.value)
  }
  return (
    <div>
      <h1>Host Ipad</h1>
      <div>
        <h4 className={styles['title']}>Guest Check-In</h4>
        <div className={styles['search-bar-container']}>
          <div className="hstack gap-1">
            <SearchBar
              dataArr={teachers && teachers.data}
              setResults={setResults}
              selectedTeacher={teacher}
              setSelectedTeacher={setTeacher}
              filled={setSearchBarFilled}
              updateName={updateName}
            />
            {results.length === 0 && searchBarFilled && <button className="btn btn-outline-success" onClick={addNewTeacher}>Add Teacher</button>}
          </div>
          <SearchResultsList results={results} setSelectedTeacher={setTeacher} />
        </div>
        {teacher.attributes && <Button variant="success" onClick={arriveTeacher}>Check Guest In</Button>}
      </div>
    </div>
  )
}

export default Host