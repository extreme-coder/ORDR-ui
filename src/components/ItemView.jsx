import React, { useState } from 'react'
import { Button, ButtonGroup, Form } from 'react-bootstrap';

const ItemView = ({ item }) => {
  const [selectedIndices, setSelectedIndices]= useState([]);
  
  const handleCheckClick = (id) => {
    if(selectedIndices.includes(id)){
      setSelectedIndices(selectedIndices.filter(index => index !== id));
      return;
    }
      setSelectedIndices([...selectedIndices, id]);
  }

  const handleMultiToppingClick = () => {

  }

  const handleSingleToppingClick = ()=> {

  }

  return (
    <div>
      <h4>
        {item.attributes.multi_topping? "Select All Desired Toppings" : "Please Select Type"}
      </h4>
      {item.attributes.multi_topping? 
      <ButtonGroup>
        {item.attributes.toppings.data.map(topping => (
          <button className={selectedIndices.includes(topping.id)? "btn btn-primary" : "btn btn-outline-dark"} key={topping.id} onClick={() => {handleCheckClick(topping.id)}}>{topping.attributes.name}</button>
        ))}
      </ButtonGroup>
      :
    <p>not multi-topping</p>}
    <br></br>
     {item.attributes.multi_topping && <button className='btn btn-success'>Confirm</button>}
    </div>
  )
}

export default ItemView;