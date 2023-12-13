import React, { useEffect, useState } from 'react'
import { Button, Card, Modal } from 'react-bootstrap'
import ItemView from './ItemView'
import styles from './styles/ItemCard.module.css'

const ItemCard = ({item, imageAdress, addItem}) => {
    console.log(item)

    const [show, setShow] = useState(false);
    
    const handleClose = () => {
        setShow(false)
    };

    const handleShow = () => {
        setShow(true)
        console.log("TEST")
        console.log(item)
    };

    return (
        
        <div>
            {/*cards*/}
            <Card style={{ width: '13rem' }}>
                <Card.Img className={styles.image} variant="top" src={imageAdress} />
                    <Card.Body>
                        <Card.Title>{item.attributes.name}</Card.Title>
                        <Button className={styles[`card-button`]}variant="info" onClick={handleShow}>Add Item</Button>
                    </Card.Body>
                </Card>
            {/*modal*/}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header className={styles[`modal-header`]} closeButton>
                    <Modal.Title className={styles[`modal-heading`]}>{item.attributes.name}</Modal.Title>
                </Modal.Header>
                <ItemView item={item} addItem={addItem} closeSelf={handleClose}></ItemView>
            </Modal>
        </div>
  )
}

export default ItemCard