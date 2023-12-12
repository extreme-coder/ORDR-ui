import React, { useState } from 'react'
import {FaArrowCircleRight, FaSearch} from 'react-icons/fa'
import "./styles/SearchBar.css"


const SearchBar = ({dataArr, setResults, selectedTeacher, setSelectedTeacher, filled}) => {
    const [input, setInput] = useState("");
    
    const filterSearch = (value)=> {
        console.log(value)
        if(value){
          filled(true)
        } else {
          filled(false)
        }
        setSelectedTeacher({});
        setInput(value);
        const results = dataArr.filter((teacher) => {
            return value && teacher && teacher.attributes.name.toLowerCase().includes(value.toLowerCase())
        })
        setResults(results)
    }

    
  return (
    <div className='input-wrapper'>
        <FaSearch id="search-icon" />
        <input placeholder='Teacher Name' value={selectedTeacher.attributes? selectedTeacher.attributes.name : input} onChange={(e) => filterSearch(e.target.value)}/>
    </div>
  )
}

export default SearchBar