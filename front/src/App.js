import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link, Route } from 'react-router-dom';
import Authorization from './pages/authorization.js';
import Directory from './pages/directory.js';


function App() {
  return (
      <div className="App">
        <Route exact path="/" render={(props) => <div><Link to="/asdf">go /asdf</Link><br/><Link to="/asdf/auth">go /asdf/auth</Link></div>} />
        <Route exact path="/:path" render={(props) => <Directory {...props} />} />
        <Route path="/:path/auth" render={(props) => <Authorization {...props} />} />
      </div>
  );
}

export default App;