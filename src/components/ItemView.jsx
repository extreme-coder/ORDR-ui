import React, { useState } from 'react'
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import './styles/ItemView.css'
import { toast } from 'react-toastify';

const ItemView = ({ item, addItem }) => {
  const [selectedIndices, setSelectedIndices]= useState([]);
  
  const handleCheckClick = (id) => {
    if(selectedIndices.includes(id)){
      setSelectedIndices(selectedIndices.filter(index => index !== id));
      return;
    }
      setSelectedIndices([...selectedIndices, id]);
  }

  const handleMultiToppingClick = () => {
    if (selectedIndices.length === 0) {
      toast.error("Please select at least one topping");
      return;
    }
    addItem(item.attributes.name + " w/ " + item.attributes.toppings.data.filter(topping => selectedIndices.includes(topping.id)).map(t => t.attributes.name).join(" & "));
  }

  const handleSingleToppingClick = (topping)=> {
    addItem(item.attributes.name + " w/ " + topping.attributes.name);
  }

  return (
    <div className='item-view'>
      <h4 className='title'>
        {item.attributes.multi_topping? "Select All Desired Toppings" : "Please Select Type"}
      </h4>
      {item.attributes.multi_topping? 
      <ButtonGroup>
        {item.attributes.toppings.data.map(topping => (
          <button className={selectedIndices.includes(topping.id)? "btn btn-primary" : "btn btn-outline-dark"} key={topping.id} onClick={() => {handleCheckClick(topping.id)}}>{topping.attributes.name}</button>
        ))}
      </ButtonGroup>
      :
      <div className='single-topping-container'>
        {item.attributes.toppings.data.map(topping => (<Button className="single-topping-btn" variant="outline-primary" key={topping.id} onClick={() => handleSingleToppingClick(topping)}>{topping.attributes.name}</Button>))}
      </div>
     }
    <br></br>
     {item.attributes.multi_topping && <button className='btn btn-success' onClick={handleMultiToppingClick}>Confirm</button>}
    </div>
  )
}

export default ItemView;