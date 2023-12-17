import React from 'react'
import { useGetEntitiesQuery } from '../services/lastmeal';
import styles from "./pageStyles/ShoppingRef.module.css"

const ShoppingRef = () => {
    const { data: orders } = useGetEntitiesQuery({ name: "order", populate: true });
    const preOrders = [];
    const buggyStyle = {
        margin: "-20px",
        transform: "scale(0.001)",
        color: "#1b1b1b"
    }

  return (
    <div className={styles.ShoppingRef}>
        <h1 className={styles.heading}>Shoppping Reference - Preorders :</h1>
            {orders && orders.data.filter(o => o.attributes.status === "PRE-EVENT" && o.attributes.type === "KITCHEN").map(order => <div style={buggyStyle}>{order.attributes.items.split(",").map(item => preOrders.push(item))}</div>)}
            <h3  className={styles.title}>Pancakes :{preOrders.filter(item => item.toLowerCase().includes("pancake")).length}</h3>
                <div className={styles.wrapper}>
                    <h5 className={styles.sub}>S: {preOrders.filter(item => item.toLowerCase().includes("pancake") && item.toLowerCase().includes("strawberry")).length}</h5>
                    <h5 className={styles.sub}>CCC: {preOrders.filter(item => item.toLowerCase().includes("pancake") && item.toLowerCase().includes("cinnamon")).length}</h5>
                    <h5 className={styles.sub}>BF: {preOrders.filter(item => item.toLowerCase().includes("pancake") && item.toLowerCase().includes("banana")).length}</h5>
                    <h5 className={styles.sub}>MC: {preOrders.filter(item => item.toLowerCase().includes("pancake") && item.toLowerCase().includes("ol'")).length}</h5>
                </div>
            <h3  className={styles.title}>Crepes :{preOrders.filter(item => item.toLowerCase().includes("crepe")).length}</h3>
            <div className={styles.wrapper}>
                <h5 className={styles.sub}>S: {preOrders.filter(item => item.toLowerCase().includes("crepe") && item.toLowerCase().includes("strawberry")).length}</h5>
                <h5 className={styles.sub}>BF: {preOrders.filter(item => item.toLowerCase().includes("crepe") && item.toLowerCase().includes("banana")).length}</h5>
                <h5 className={styles.sub}>HC: {preOrders.filter(item => item.toLowerCase().includes("crepe") && item.toLowerCase().includes("savoury")).length}</h5>
                </div>
            <h3  className={styles.title}>Omelettes :{preOrders.filter(item => item.toLowerCase().includes("omelette")).length}</h3>
            <div className={styles.wrapper}>   
                <h5 className={styles.sub}>Spinach: {preOrders.filter(item => item.toLowerCase().includes("omelette") && item.toLowerCase().includes("spinach")).length}</h5>
                <h5 className={styles.sub}>Green Onions: {preOrders.filter(item => item.toLowerCase().includes("omelette") && item.toLowerCase().includes("green")).length}</h5>
                <h5 className={styles.sub}>Red Peppers: {preOrders.filter(item => item.toLowerCase().includes("omelette") && item.toLowerCase().includes("pepper")).length}</h5>
                <h5 className={styles.sub}>Cheese: {preOrders.filter(item => item.toLowerCase().includes("omelette") && item.toLowerCase().includes("cheese")).length}</h5>
                <h5 className={styles.sub}>Ham: {preOrders.filter(item => item.toLowerCase().includes("omelette") && item.toLowerCase().includes("ham")).length}</h5>
             </div>
    </div>
  )
}

export default ShoppingRef