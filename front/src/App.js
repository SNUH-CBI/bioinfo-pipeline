import React from 'react';
import { Route } from 'react-router-dom';

import Directory from './pages/directory.js';
import Authorization from './pages/authorization.js';

function App() {
  return (
    <div className="App">
      <Route exact path="/:path" component={Directory}/>
      <Route path="/:path/auth" component={Authorization}/>
    </div>
  );
}

export default App;
