import React from 'react'

const ItemView = ({item}) => {
  return (
    <div>
      <h4>
        Please Select Toppings
      </h4>
      <p>{item.attributes.toppings}</p>
    </div>
  )
}

export default ItemView;