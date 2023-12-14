import React from 'react'
import styles from "./styles/SingleOrderWaiter.module.css"
import { Button } from 'react-bootstrap';

const SingleOrderWaiter = ({itemName, removeItem}) => {
  return (
    <div className={styles[`so-container`]}>
        <div class="row">
            <div class="col-md-8">
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

export default SingleOrderWaiter;