import React from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import  {Button, Form, FormGroup, Label, Input, Alert,Container, Col,Spinner} from 'reactstrap';
import firebase from '../Firebase';
import { render } from '@testing-library/react';

export default class Login extends React.Component {

    state = {
        loading: false //spinner制御用
    }

    _isMounted = false;

    componentDidMount = () => {
        this._isMounted = true;
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    render() {
        return (
            <Formik
                initialValues={{email:"",password:""}}
                onSubmit={(values,actions) =>{
                    if (this._isMounted) this.setState({ loading: true })

                    firebase.auth().signInWithEmailAndPassword(values.email, values.password)
                    .then(res => {
                        //正常終了時
                        this.props.history.push("/List")
                        if (this._isMounted) this.setState({ loading: false });
                    })
                    .catch(error => {
                        //異常終了時
                        if (this._isMounted) this.setState({ loading: false });
                        actions.setStatus({loginFailed:true})
                        actions.setSubmitting(false)
                    });
                }}
                validationSchema = {Yup.object().shape({
                    email: Yup.string().email("Emailが正しくありません。").max(255,"Emailは長すぎます。").required("Emailは必須です。")
                    ,password: Yup.string().required("Passwordは必須です。")
                })}
                 
            >
                {
                    props => {
                        const {
                            touched,
                            errors,
                            status,
                            isSubmitting,
                            handleChange,
                            handleBlur,
                            handleSubmit
                        } = props
        
                        return (
                            <>
                                <br/>
                                <Container className="border">
                                     <br/>
                                     <h3>ログインページ</h3>
                                     <br/>
                 
                                     <Form className="form" autoComplete="off" onSubmit={handleSubmit}>
                                     
                                    
                                     <FormGroup row>
                                         <Label for="email" sm={2}>Email</Label>
                                         <Col sm={10}>
                                             <Input type="text" name="email" onChange={handleChange} onBlur={handleBlur}
                                             className={errors.email && touched.email && "is-invalid"} />
                                         </Col>
                                    </FormGroup>
        
                                    <FormGroup row>
                                         <Label for="name" sm={2}>Password</Label>
                                         <Col sm={10}>
                                             <Input type="text" name="password" onChange={handleChange} onBlur={handleBlur}
                                         className={errors.password && touched.password && "is-invalid"} />
                                         </Col>
                                     </FormGroup>
                 
                                    <FormGroup>
                                         {errors.email && touched.email && (<Alert color="danger">{errors.email}</Alert>)}
                                         {errors.password && touched.password && (<Alert color="danger">{errors.password}</Alert>)}
                                         {status && status.loginFailed && (<Alert color="danger">Login failed</Alert>)}
                                    </FormGroup>
                 
                                     <FormGroup row>
                                         <Col sm={{ size: 10, offset: 2 }}>
                                             <Button className="center" type="submit" disabled={isSubmitting}>ログイン
                                             <Spinner size="sm" color="light" style={{ marginRight: 5 }} hidden={!this.state.loading} />
                                             </Button>
                                         </Col>
                                     </FormGroup>
                 
                 
                                </Form>
                 
                                </Container>
                            </>
                        )
                    }
                }
        
            </Formik>
          )
    }
  
}
