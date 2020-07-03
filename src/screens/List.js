import React from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'

import firebase, { db } from '../Firebase';
import  {Form,Button,FormGroup,Col,Spinner,Input,Pagination, PaginationItem, PaginationLink, Table,Label} from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';
import { ExportToCsv } from 'export-to-csv';


export default class List extends React.Component {

    constructor(props) {
      super(props)

    }


    state = {
        list: [],
        currentPage: 1,
        itemsPerPage: 5,
        lastPage: 1,
        total: 0,
        loading: false,
        searchText: "",
        firstSort: 0,
        lastSort:0,
        csvData : []
    }

    


    //データ取得
    getData = async (dir) => {
      console.log("get data");
      
        const {currentPage, itemsPerPage} = this.state
        const startAt = currentPage * itemsPerPage - itemsPerPage
        this.state.loading = true
        const last = await db.collection("members").where("status","==",0).get();
        const cnt = last.size //this is expensive (counts all records) and should be repalced with lookup in production
        const colRef = db.collection("members")

        //firebase has no offset function , so have to do alot of extra work to page
        let snapshots = (dir==undefined || dir==1) ? 
          await colRef.where("status","==",0).orderBy('sort', 'asc').startAt(this.state.lastSort).limit(itemsPerPage).get() 
          : await colRef.where("status","==",0).orderBy('sort', 'desc').startAt(this.state.firstSort).limit(itemsPerPage).get() 
        const docs = (dir==0) ? snapshots.docs.reverse() : snapshots.docs
        const lastSort = docs[docs.length - 1].data().sort+1
        const firstSort = docs[0].data().sort-1
        // let data = []
        // snapshots.docs.map(doc => data.push( {id:doc.id,name:doc.data().name,email: doc.data().email}))
        // snapshots.docs.map(doc => console.log(doc));
        this.setState({
            list: docs,
            total: cnt,
            lastPage: Math.ceil(cnt/itemsPerPage),
            loading: false,
            firstSort: firstSort,
            lastSort: lastSort
            // csvData: data
        });
    }

    search = async() => {
      //NOTE: Firebase has no intext searching only exact match, also no OR where so combine arrays
      console.log("search " + this.state.searchText);
      if(this.state.searchText=="") {
        this.setState({ firstSort: 0, lastSort: 0})
        this.getData()
        return
      }
      this.state.loading = true
      const colRef = db.collection("members")

      const names = await colRef.orderBy("name").startAt(this.state.searchText).endAt(this.state.searchText+"\uf8ff").get()
      const emails = await colRef.orderBy("email").startAt(this.state.searchText).endAt(this.state.searchText+"\uf8ff").get()

      this.setState({
          list: names.docs.concat(emails.docs).filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i), //combine and remove dupes
          total: 1,
          lastPage: 1,
          currentPage: 1,
          loading: false
      });
    }

    getCSVData = async () => {
      
      let data = []
      this.state.loading = true
      
      const snapshots = await db.collection("members").orderBy('sort', 'desc').get();
      snapshots.docs.map(doc => data.push( {id:doc.id,name:doc.data().name,email: doc.data().email}))
      this.setState({
          loading: false
      });
      const options = { filename: 'member_data', fieldSeparator: ',', quoteStrings: '"', decimalSeparator: '.', showLabels: true, 
        useTextFile: false, useBom: true, useKeysAsHeaders: true
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(data);
    }

    

    // onCollectionUpdate = (querySnapshot) => {
    //   this.setState({
    //     lastPage: 1,
    //     currentPage: 1
    //   });
    //    this.getData();
    // }

    componentDidMount = async () => {
        await this.getData();
    }

    //監視解除
    // componentWillUnmount = () => {
    //     this.unsubscribe();
    // }

    next() {
      console.log("next"); 

      this.state.currentPage++
      this.getData(1)
    }

    prev() {
      console.log("prev");
      this.state.currentPage--;
      this.getData(0)
    }

    handleChange(e) {
      this.setState({ searchText: e.target.value });
    }

    render() {
        return (
         
            <div className="container">
                <h3 className="text-center my-5">エントリー一覧</h3>
                <div className="my-3"><Link to="/"></Link></div>
                <LoadingOverlay active={this.state.loading} spinner text='Loading...'
                styles={{
                  overlay: (base) => ({
                    ...base,
                    background: 'rgba(0, 0, 0, 0.2)'
                  })
                }}
                >
                <Form>
                  <FormGroup row>
                    <Col sm={4}>
                        <Input type="text" name="search" max="100" onChange={e => this.handleChange(e) } />
                    </Col>
                    <Col>
                      <Button onClick={() => this.search(this)} className="center" type="button" disabled={this.state.loading}>検索
                        <Spinner size="sm" color="light" style={{ marginRight: 5 }} hidden={!this.state.loading} />
                      </Button>
                    </Col>
                    <Col>
                      <Link onClick={() => {this.getCSVData()}}>CSVダウンロード</Link>
                    </Col>
                  </FormGroup>
                </Form>
              
                
                <Table className="table">
                  <thead>
                  <tr>
                      <th>ID</th>
                      <th>氏名</th>
                      <th>Email</th>
                      <th></th>
                  </tr>
                  </thead>
                    <tbody>
                        {
                            this.state.list.map(item => (
                                <tr key={item.id + String(new Date())}>
                                    <td scope="row">{item.id}</td>
                                    <td>{item.data().name}</td>
                                    <td>{item.data().email}</td>
                                    <td><Link to={`/Detail/${item.id}`}>詳細</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <Pagination>
                  <PaginationItem disabled={this.state.currentPage==1}>
                    <PaginationLink first href="#" onClick={() => this.prev(this)} >
                      ＜戻る
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem　disabled={this.state.currentPage>=this.state.lastPage}>
                    <PaginationLink last href="#" onClick={() => this.next(this)} >
                      次へ＞
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
                <Label>{this.state.currentPage}/{this.state.lastPage}</Label>
                <div style={{ width: '100vw' }}></div>
                
                </ LoadingOverlay>
            
            </div>  
        );
    }
}