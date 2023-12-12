import React from 'react'
import styles from "./styles/SingleOrder.module.css"
import { Button } from 'react-bootstrap';

const SingleOrder = ({itemName, removeItem}) => {
  return (
    <div className={styles[`so-container`]}>
        <div class="row">
            <div class="col-md-9">
                <td>
                    <div className={styles[`item-name`]}>
                        {itemName}
                    </div>
                </td>
            </div>
            <div class="col">
                <td>
                    <Button variant="danger" onClick={removeItem}>Remove</Button>
                </td>
            </div>
        </div>
    </div>
  )
}

export default SingleOrder;