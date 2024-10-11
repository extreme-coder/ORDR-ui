import React from 'react'
import { useGetEntitiesQuery } from '../services/lastmeal';
import { Button } from 'react-bootstrap';
//import "./styles/ItemSelector.css"


const ItemSelector = ({items}) => {
    //const { data: allItems } = useGetEntitiesQuery({ name: "item", populate: true })


  return (
    <div className="item-selector">
        <div className="menu-container">
            {items.data.filter(allItem => allItem.attributes.type === "DRINK").map(
                allItem => 
                <Button 
                className="menu-btn" 
                variant="outline-primary" 
                key={allItem.id} 
                >
                    {allItem.attributes.name}
                </Button>)}
        </div> 
        
    </div>
  )
}

export default ItemSelector;