import React from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import  {Button, Form, FormGroup, Label, Input, Alert,Container, Col, InputGroupAddon,InputGroup, InputGroupText} from 'reactstrap';
import firebase, { db } from '../Firebase';
import { Link } from 'react-router-dom';

class Create extends React.Component {

    sendEmail (templateId, variables) {
        window.emailjs.send(
          'gmail', templateId,
          variables
          ).then(res => {
            console.log('Email successfully sent!')
          })
          .catch(err => console.error('Email error:', err))
    }

    render() {
        return (
            <Formik
             initialValues={{name:"",email:"",age:"",category:"",reason:""}}
             onSubmit={async (values) =>{
                 const col = db.collection("members");
                 const last = await col.orderBy("sort","desc").limit(1).get()
                 const sort = last.docs[0].data().sort
                 const docId = col.doc().id;
                 col.get().then(snap => {
                    col.doc(docId).set({
                        name: values.name ,
                        email: values.email,
                        age: values.age,
                        category: values.category,
                        reason: values.reason,
                        status: 0,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        sort: sort+1 //getting the size costs x number or reads depending on col size
                     })
                     console.log("Logging values", values)
                     this.sendEmail("created",{name: values.name, email: values.email})
                     this.props.history.push("/Created")
                 });
                 
             }}
         
             validationSchema = {Yup.object().shape({
                 name: Yup.string().max(50,"氏名は長すぎます。").required("氏名は必須です。")
                 ,email: Yup.string().email("Emailが正しくありません。").max(255,"Emailは長すぎます。").required("Emailは必須です。")
                 ,age: Yup.number().required("年齢は必須です。").positive().truncate()
                 ,category: Yup.string().required("希望職種は必須です。")
                 ,reason: Yup.string().max(255,"希望理由は長すぎます。").required("希望理由は必須です。")
             })}
         
            >
             {
                 props => {
                     const {
                         touched,
                         errors,
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
                             <h3>求人エントリーページ</h3>
                             <br/>
         
                             <Form className="form" autoComplete="off" onSubmit={handleSubmit}>
                             <FormGroup row>
                                 <Label for="name" sm={2}>氏名</Label>
                                 <Col sm={10}>
                                     <Input type="text" name="name" onChange={handleChange} onBlur={handleBlur}
                                 className={errors.name && touched.name && "is-invalid"} />
                                 </Col>
                             </FormGroup>
                            
                             <FormGroup row>
                                 <Label for="email" sm={2}>Email</Label>
                                 <Col sm={10}>
                                     <Input type="text" name="email" onChange={handleChange} onBlur={handleBlur}
                                     className={errors.email && touched.email && "is-invalid"} />
                                 </Col>
                            </FormGroup>
         
                            <FormGroup row>
                                 <Label for="age" sm={2}>年齢</Label>
                                 <Col sm={6}>
                                     <InputGroup>
                                         <Input type="number" min="18" max="100" name="age" onChange={handleChange} onBlur={handleBlur}
                                         className={errors.age && touched.age && "is-invalid"} />
                                         <InputGroupAddon addonType="append">
                                         <InputGroupText>歳</InputGroupText>
                                         </InputGroupAddon>
                                     </InputGroup>
                                 </Col>
                            </FormGroup>
         
                            <FormGroup row>
                                 <Label for="category" sm={2}>希望職種</Label>
                                 <Col sm={10}>
                                 <Input type="select" name="category" id="exampleSelect" onChange={handleChange} onBlur={handleBlur}
                                 className={errors.category && touched.category && "is-invalid"}>
                                     <option value="">選択してください</option>
                                     <option value="グラフィックデザイナー">グラフィックデザイナー</option>
                                     <option value="エンタメデザイナー">エンタメデザイナー</option>
                                     <option value="グラフィックデザイナー(インハウス)">グラフィックデザイナー(インハウス)</option>
                                     <option value="フロントエンドエンジニア">フロントエンドエンジニア</option>
                                 </Input>
                                 </Col>
                            </FormGroup>
         
                            <FormGroup row>
                                 <Label for="reason" sm={2}>希望理由</Label>
                                 <Col sm={10}>
                                     <Input type="textarea" rows="5" name="reason" onChange={handleChange} onBlur={handleBlur}
                                 className={errors.reason && touched.reason && "is-invalid"} />
                                 </Col>
                             </FormGroup>
         
                            <FormGroup>
                                 {errors.name && touched.name && (<Alert color="danger">{errors.name}</Alert>)}
                                 {errors.email && touched.email && (<Alert color="danger">{errors.email}</Alert>)}
                                 {errors.age && touched.age && (<Alert color="danger" className="error">{errors.age}</Alert>)}
                                 {errors.category && touched.category && (<Alert color="danger">{errors.category}</Alert>)}
                                 {errors.reason && touched.reason && (<Alert color="danger">{errors.reason}</Alert>)}
                            </FormGroup>
         
                             <FormGroup row>
                                 <Col sm={{ size: 10, offset: 2 }}>
                                     <Button className="center" type="submit" disabled={isSubmitting}>申込み</Button>
                                 </Col>
                             </FormGroup>
                            
         
                        </Form>
                        <div className="my-3"><Link to="/Login">管理ログイン</Link></div>
         
                        </Container>
         
                         </>
                        
                         
                     )
                 }
             }
            </Formik>
           )
    }
  
}

export default Create;
