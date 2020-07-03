import React from 'react';
import { Link } from 'react-router-dom';

class page404 extends React.Component{
    render(){
        return(
            <div className="container">
                <h3 className="text-center my-5">Page not found.</h3>
                <div className="text-center"><Link to="/">トップページへ</Link></div>
            </div>
        );
    }
}

export default page404;