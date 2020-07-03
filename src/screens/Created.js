import React from 'react'
import  {Button, Form, FormGroup, Label, Input, Alert,Container, Col, InputGroupAddon,InputGroup, InputGroupText} from 'reactstrap';
import { Link } from 'react-router-dom';

export default function Created() {
  return (
    <Container className="">
      <p/>
      <Alert color="success">
        申し込みしました。
      </Alert>
      <div className="my-3"><Link to="/">戻る</Link></div>
    </Container>
  )
}
