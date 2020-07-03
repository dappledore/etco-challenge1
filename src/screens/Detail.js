import React from 'react';
import  {Button, Form, FormGroup, Label, Input, Alert,Container, Col, InputGroupAddon,InputGroup, InputGroupText} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import firebase, { db } from '../Firebase';

class Detail extends React.Component {

    state = {
        member: { name: '', email: '' }
    }

    //更新ボタンが押されたら
    handleOnSubmit = (values) => {
        db.collection("members").doc(this.props.match.params.uid).update({
            name: values.name,
            email: values.email,
            age: values.age,
            category: values.category,
            reason: values.reason,
            status: parseInt(values.status)
        });

        //Topに移動
        this.props.history.push("/List");

    }

    //uidで指定したメンバーの値を取得
    getMember = async (uid) => {
        const docRef = db.collection("members").doc(uid);
        const doc = await docRef.get();
        //ドキュメントの存在確認
        if (doc.exists) {
            this.setState({
                member: doc.data(),
            });
        }else{
            //なければ404ページへ
            this.props.history.push("/404");
        }
    }

    //delete
    handleDelete = (uid) => {
        if (window.confirm('削除しますか？')) {
            db.collection("members").doc(uid).delete();
            this.props.history.push("/List");
        }
    }

    //値を取得
    componentDidMount = () => {
        this.getMember(this.props.match.params.uid);
    }

    render() {
        return (
            <div className="container">
                <Formik
                enableReinitialize
                initialValues={{ name: this.state.member.name, email: this.state.member.email,age: 
                  this.state.member.age, category: this.state.member.category, 
                  reason: this.state.member.reason, status: this.state.member.status }}
                onSubmit={values => this.handleOnSubmit(values)}
         
             validationSchema = {Yup.object().shape({
                 name: Yup.string().max(50,"氏名は長すぎます。").required("氏名は必須です。")
                 ,email: Yup.string().email("Emailが正しくありません。").max(255,"Emailは長すぎます。").required("Emailは必須です。")
                 ,age: Yup.number().required("年齢は必須です。").positive().truncate()
                 ,category: Yup.string().required("希望職種は必須です。")
                 ,reason: Yup.string().max(255,"希望理由は長すぎます。").required("希望理由は必須です。")
                 ,status: Yup.number()
             })}
         
            >
             {
                 props => {
                     const {
                         touched, errors, values, isSubmitting, handleChange, handleBlur, handleSubmit
                     } = props
         
                     return (
                         <>
                         <br/>
                          <Container className="border">
                             <br/>
                             <h3>詳細・編集・削除</h3>
                             <br/>
         
                             <Form className="form" autoComplete="off" onSubmit={handleSubmit}>
                             <FormGroup row>
                                 <Label for="name" sm={2}>氏名</Label>
                                 <Col sm={10}>
                                     <Input type="text" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur}
                                 className={errors.name && touched.name && "is-invalid"} />
                                 </Col>
                             </FormGroup>
                            
                             <FormGroup row>
                                 <Label for="email" sm={2}>Email</Label>
                                 <Col sm={10}>
                                     <Input type="text" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur}
                                     className={errors.email && touched.email && "is-invalid"} />
                                 </Col>
                            </FormGroup>
         
                            <FormGroup row>
                                 <Label for="age" sm={2}>年齢</Label>
                                 <Col sm={6}>
                                     <InputGroup>
                                         <Input type="number" value={values.age} min="18" max="100" name="age" onChange={handleChange} onBlur={handleBlur}
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
                                 <Input type="select" name="category" value={values.category} onChange={handleChange} onBlur={handleBlur}
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
                                     <Input type="textarea" rows="5" name="reason" value={values.reason} onChange={handleChange} onBlur={handleBlur}
                                 className={errors.reason && touched.reason && "is-invalid"} />
                                 </Col>
                             </FormGroup>

                             <FormGroup row>
                                 <Label for="status" sm={2}>ステータス</Label>
                                 <Col sm={10}>
                                 <Input type="select" name="status" value={values.status} onChange={handleChange}  onBlur={handleBlur}>
                                     <option value="0"> 受付ない</option>
                                     <option value="1"> 受付</option>
                                 </Input>
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
                                 <Col sm={{ size: 4, offset: 2 }}>
                                     <Button className="center" type="submit" disabled={isSubmitting}>更新する</Button>
                                 </Col>
                                 <Col sm={{ size: 4, offset: 0 }}>
                                    <Button color="danger" onClick={() => this.handleDelete(this.props.match.params.uid)}>削除する</Button>
                                 </Col>
                             </FormGroup>
                            
         
                        </Form>
                        <div className="my-3"><Link to="/List">一覧へ戻る</Link></div>
         
                        </Container>
         
                         </>
                        
                         
                     )
                 }
             }
            </Formik>
                <div className="my-3">
                </div>
            </div>
        );
    }
}

export default Detail;