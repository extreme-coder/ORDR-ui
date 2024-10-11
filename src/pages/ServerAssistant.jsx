import React from 'react'
import AllOrders from '../components/AllOrders'

const ServerAssistant = () => {
    const headingStyle = {
        padding: "1.3rem",
        fontFamily: "rial, Helvetica, sans-serif",
        fontWeight: "500"
    }
  return (
    
    <div>
        
        <div style={{display:"flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
            <h1 style={headingStyle}>All Prepared Orders</h1>
        </div>
        <AllOrders type="PREPARED"></AllOrders>
    </div>
  )
}

export default ServerAssistant