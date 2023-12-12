import { Button } from "react-bootstrap"
import { useGetEntitiesQuery, useUpdateEntityMutation } from "../services/lastmeal"
import { useEffect, useState } from "react"
import styles from "./styles/EmptySeat.module.css"
import SearchBar from "./SearchBar"
import SearchResultsList from "./SearchResultsList"


export const EmptySeat = ({seat, open}) => {
  const { data: teachers } = useGetEntitiesQuery({ name: "teacher", populate: true })
  const [addingTeacher, setAddingTeacher] = useState(false)
  const [searchBarFilled, setSearchBarFilled] = useState(false)
  const [teacherAdded, setTeacherAdded] = useState(false)
  const [results, setResults] = useState([]);
  const [updateEntity] = useUpdateEntityMutation();
  const [teacher, setTeacher] = useState({})

  const assignTeacherToSeat = () => {
    updateEntity({ name: "seat", id: seat.id, body: { data: { teacher: teacher } } })
    updateEntity({ name: "teacher", id: teacher.id, body: { data: { teacher_status: "ARRIVED" } } })
    setAddingTeacher(false)
    setTeacherAdded(true);
    // close this window by updating parent state
    window.location.reload();
  }

  useEffect(() => { 
    if(teachers){
      setTeacher(teachers.data[0].id)
    }
  }, [teachers])

  return(
    <div className={styles['empty-seat']}>
      <h4 className={styles['title']}>Add Guest</h4>   
        <div className={styles['search-bar-container']}>
          <div className="hstack gap-1">
            <SearchBar 
              dataArr={teachers && teachers.data} 
              setResults={setResults} 
              selectedTeacher={teacher} 
              setSelectedTeacher={setTeacher}
              filled={setSearchBarFilled}
            />
            {results.length === 0 && searchBarFilled && <button className="btn btn-outline-success">Add Teacher</button>}
          </div>
          <SearchResultsList results={results} setSelectedTeacher={setTeacher}/>
        </div>
      {teacher.attributes && <Button variant="success" onClick={assignTeacherToSeat}>Seat Teacher</Button>}
    </div>
)}