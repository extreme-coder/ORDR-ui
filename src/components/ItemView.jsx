import React from 'react'

const ItemView = ({ item }) => {
  console.log(item.attributes.toppings)
  return (
    <div>
      <h4>
        Please Select Toppings
      </h4>
      {item.attributes.toppings.data.map(t => <p>{t.attributes.name}</p>)}
    </div>
  )
}

export default ItemView;