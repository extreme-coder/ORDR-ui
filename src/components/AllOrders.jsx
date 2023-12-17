import React from 'react'
import styles from './styles/AllOrders.module.css'
import { useGetEntitiesByFieldQuery, useGetEntitiesQuery, useGetEntityQuery } from '../services/lastmeal'

const AllOrders = ({type}) => {
  const { data: teacher } = useGetEntitiesQuery({ name: "teacher", populate: true })
  const { data: orders } = useGetEntitiesQuery({ name: "order", populate: true })

  return (
    <div className={styles[`ao-container`]}>
        <div className={styles[`item`]}>
            
        </div>
    </div>
  )
}

export default AllOrders