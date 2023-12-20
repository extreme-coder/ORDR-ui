import React, { useEffect } from 'react'
import { useGetNestedEntitiesQuery } from '../services/lastmeal';
import styles from './styles/AllOrders.module.css'
import './styles/AllOrders.css'
//import socket from '../sockets/socket';
import { refetchTime } from '../constants';

const AllOrders = ({ type, tableId }) => {
  const { data: orders, refetch } = useGetNestedEntitiesQuery({ name: "order", populate: true, fields: ['teacher', 'seat', 'table'] });

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("refetch")
      refetch();
    }, refetchTime);

    return () => clearInterval(interval);
  }, [refetch])

  return (
    <div className={styles[`ao-container`]} style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      {!tableId ?
        <table class="orders">
          <tr class='ao-heading'>
            <th class='sticky'>
              <h5 className={styles[`table-heading`]}>Pickup at</h5>
            </th>
            <th class='sticky'>
              <h5 className={styles[`table-heading`]}>Teacher</h5>
            </th>
            <th class='sticky'>
              <h5 className={styles[`table-heading`]}>Table</h5>
            </th>
            <th class='sticky'>
              <h5 className={styles[`table-heading`]}>Seat</h5>
            </th>
            <th class='sticky'>
              <h5 className={styles[`table-heading`]}>Item</h5>
            </th>
          </tr>

          {orders && orders.data.filter(o => o.attributes.status === type).map(
            o =>
              <>{o.attributes.items.split(",").map(item =>

                <tr class="ao-row">
                  <td class={`ao-item-${type} first`}>
                    {o.attributes.type}
                  </td>
                  <td class={`ao-item-${type}`}>
                    {o.attributes.teacher.data.attributes.name}
                  </td>
                  <td class={`ao-item-${type}`}>
                    {o.attributes.teacher.data.attributes.seat.data ? o.attributes.teacher.data.attributes.seat.data.attributes.table.data.attributes.number : ''}
                  </td>
                  <td class={`ao-item-${type}`}>
                    {o.attributes.teacher.data.attributes.seat.data ? o.attributes.teacher.data.attributes.seat.data.attributes.number : ''}
                  </td>
                  <td class={`ao-item-${type} last`}>
                    {item}
                  </td>
                </tr>
              )}
              </>)}
        </table>
        :
        <div>
          <h3>Prepared Items</h3>
          <table class="orders">
            <tr class='ao-heading'>
              <th class='sticky'>
                <h5 className={styles[`table-heading`]}>Pickup at</h5>
              </th>
              <th class='sticky'>
                <h5 className={styles[`table-heading`]}>Teacher</h5>
              </th>
              <th class='sticky'>
                <h5 className={styles[`table-heading`]}>Seat</h5>
              </th>
              <th class='sticky'>
                <h5 className={styles[`table-heading`]}>Item</h5>
              </th>
            </tr>

            {orders && orders.data.filter(o => o.attributes.status === type && o.attributes.teacher.data.attributes.seat.data.attributes.table.data.id === tableId).map(
              o =>
                <>{o.attributes.items.split(",").map(item =>

                  <tr class="ao-row">
                    <td class={`ao-item-${type} first`}>
                      {o.attributes.type}
                    </td>
                    <td class={`ao-item-${type}`}>
                      {o.attributes.teacher.data.attributes.name}

                    </td>
                    <td class={`ao-item-${type}`}>
                      {o.attributes.teacher.data.attributes.seat.data.attributes.number}
                    </td>
                    <td class={`ao-item-${type} last`}>
                      {item}
                    </td>
                  </tr>
                )}
                </>)}
          </table>
        </div>
      }
    </div>
  )
}

export default AllOrders;