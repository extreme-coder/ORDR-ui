import { Button } from "react-bootstrap";
import {
  useAddEntityMutation,
  useGetEntitiesQuery,
  useUpdateEntityMutation,
} from "../services/lastmeal";
import { useEffect, useState } from "react";
import styles from "./styles/EmptySeat.module.css";
import SearchBar from "./SearchBar";
import SearchResultsList from "./SearchResultsList";

export const EmptySeat = ({ seat, open, updateView }) => {
  const { data: teachers } = useGetEntitiesQuery({
    name: "teacher",
    populate: true,
  });
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [searchBarFilled, setSearchBarFilled] = useState(false);
  const [teacherAdded, setTeacherAdded] = useState(false);
  const [results, setResults] = useState([]);
  const [addEntity] = useAddEntityMutation();
  const [updateEntity] = useUpdateEntityMutation();
  const [teacher, setTeacher] = useState({});
  const [teacherName, setTeacherName] = useState("");

  const assignTeacherToSeat = async () => {
    const newSeat = await updateEntity({
      name: "seat",
      id: seat.id,
      body: { data: { teacher: teacher } },
    });
    updateEntity({
      name: "teacher",
      id: teacher.id,
      body: { data: { teacher_status: "ARRIVED" } },
    });
    teacher.attributes.orders.data.map((o) => {
      updateEntity({
        name: "order",
        id: o.id,
        body: { data: { status: "UNFINISHED" } },
      });
    });
    setAddingTeacher(false);
    setTeacherAdded(true);
    updateView(newSeat.data.data);
  };

  useEffect(() => {
    if (teachers && teachers.data.length > 0) {
      setTeacher(teachers.data[0].id);
    }
  }, [teachers]);

  const addNewTeacher = async () => {
    const newTeacher = await addEntity({
      name: "teacher",
      body: { data: { name: teacherName, teacher_status: "ARRIVED" } },
    });
    const newSeat = await updateEntity({
      name: "seat",
      id: seat.id,
      body: { data: { teacher: newTeacher.data.data.id } },
    });
    updateView(newSeat.data.data);
  };

  const updateName = (e) => {
    setTeacherName(e.target.value);
  };

  return (
    <div className={styles["empty-seat"]}>
      <h4 className={styles["title"]}>Add Guest</h4>
      <div className={styles["search-bar-container"]}>
        <div className="hstack gap-1">
          <SearchBar
            dataArr={teachers && teachers.data}
            setResults={setResults}
            selectedTeacher={teacher}
            setSelectedTeacher={setTeacher}
            filled={setSearchBarFilled}
            updateName={updateName}
          />
          {results.length === 0 && searchBarFilled && (
            <button className="btn btn-outline-success" onClick={addNewTeacher}>
              Add Teacher
            </button>
          )}
        </div>
        <SearchResultsList results={results} setSelectedTeacher={setTeacher} />
      </div>
      {teacher.attributes && (
        <Button variant="success" onClick={assignTeacherToSeat}>
          Seat Teacher
        </Button>
      )}
    </div>
  );
};
