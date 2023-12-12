import React from 'react'
import "./styles/SearchResult.css"

const SearchResult = ({result, setSelectedTeacher}) => {
  
  const teacherSelected = () => {
    setSelectedTeacher(result)
  }
  return (
    <div 
      className='search-result' 
      onClick={teacherSelected}>{result.attributes.name}
    </div>
  )
}

export default SearchResult