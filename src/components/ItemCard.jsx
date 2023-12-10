import React, { useEffect, useState } from 'react'
import { Button, Card, Modal } from 'react-bootstrap'
import ItemView from './ItemView'

const ItemCard = ({item, imageUrl}) => {
    
console.log(item.attributes.image);
    const [show, setShow] = useState(false);
    
    const handleClose = () => {
        setShow(false)
        window.location.reload()
    };

    const handleShow = () => {
        setShow(true)
        console.log("TEST")
        console.log(item)
    };

    return (
        
        <div>
            {/*cards*/}
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="/Users/alihosseini/Documents/GitHub/lastmeal-ui/assets/Pancakes.jpg" />
                <Card.Body>
                    <Card.Title>{item.attributes.name}</Card.Title>
                        <Card.Text>
                            yummmm!
                        </Card.Text>
                    <Button variant="info" onClick={handleShow}>Add Item</Button>
                </Card.Body>
            </Card>
            {/*modal*/}
            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{item.attributes.name}</Modal.Title>
                </Modal.Header>
                <ItemView item={item}></ItemView>
            </Modal>
        </div>
  )
}

export default ItemCard