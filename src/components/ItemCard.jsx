import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import ItemView from "./ItemView";
import styles from "./styles/ItemCard.module.css";

const ItemCard = ({ item, imageAdress, addItem, small }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const customize = () => {
    if (item.attributes.toppings.data.length === 0) {
      addItem(item.id, [], item.attributes.name, "DRINK");
      return;
    }
    setShow(true);
  };

  const smallStyle = {
    width: "fit-content",
    margin: "0.2rem",
  };

  return (
    <div>
      {/*cards*/}
      {small ? (
        <div className={styles.item} onClick={customize}>
          {item.attributes.name}
        </div>
      ) : (
        <Card style={small ? smallStyle : { width: "13rem" }}>
          {imageAdress && (
            <Card.Img
              className={styles[`image-sizing`]}
              variant="top"
              src={imageAdress}
            />
          )}
          <Card.Body className={small ? styles.c : styles.ccc}>
            <Card.Title>{item.attributes.name}</Card.Title>
            <Button
              className={styles[`card-button`]}
              variant="info"
              onClick={customize}
            >
              Add Item
            </Button>
          </Card.Body>
        </Card>
      )}
      {/*modal*/}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className={styles[`modal-header`]} closeButton>
          <Modal.Title className={styles[`modal-heading`]}>
            {item.attributes.name}
          </Modal.Title>
        </Modal.Header>
        <ItemView
          item={item}
          addItem={addItem}
          closeSelf={handleClose}
        ></ItemView>
        <Modal.Footer> </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ItemCard;
