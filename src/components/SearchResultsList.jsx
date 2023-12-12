import React from 'react'
import "./styles/SearchResultsList.css"
import SearchResult from './SearchResult'

const SearchResultsList = ({results, setSelectedTeacher}) => {
  return (
    <div className='results-list'>
        {results.map((teacher, id) => {
            return < SearchResult result={teacher} key={teacher} setSelectedTeacher={setSelectedTeacher}/> 
        })}
    </div>
  )
}

export default SearchResultsList