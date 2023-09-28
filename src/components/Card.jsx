import React, { useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom'
import Card from 'react-bootstrap/Card';

import { useFirebase } from "../context/Firebase"

const BookCard = (props) => {
    const firebase = useFirebase();
    const navigate = useNavigate();

    const [url, setURL] = useState(null);

    useEffect(() => {
        firebase.getImageURL(props.imageURL).then((url) => setURL(url));
    }, [])

    return (
        <Card style={{ width: '18rem', margin: "25px" }}>
        <Card.Img variant="top" src={url} height="250px" />
        <Card.Body>
        <Card.Title>{props.name}</Card.Title>
          <Card.Text>
            By {props.displayName}
            <br></br>
            Rs. {props.price}
          </Card.Text>
          <Button onClick={e => navigate(props.link)} variant="primary">View</Button>
        </Card.Body>
      </Card>
    );
};

export default BookCard;