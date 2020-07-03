import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Index from './screens/Create';
import Created from './screens/Created';
import List from './screens/List';
import Login from './screens/Login';
import Detail from './screens/Detail';
import page404 from './screens/page404';

import Auth from './Auth';

function App() {

  return (
    <BrowserRouter>
     <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/Created" component={Created} />
        <Route path="/Login/" component={Login} />
        <Auth>
          <Switch>
            <Route path="/List/" component={List} />
            <Route path="/detail/:uid" component={Detail} />
            <Route render={() => <p>not found.</p>} />
          </Switch>
        </Auth>
        <Route path="/404" component={page404} />
        <Route component={page404} />
      </Switch>
    </BrowserRouter>
  );
}



export default App;
