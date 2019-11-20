import React from 'react';
import { Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Directory from './pages/directory.js';
import Authorization from './pages/authorization.js';

function App() {
  const [cookies, setCookie] = useCookies(['biopipe']);
  return (
      <div className="App">
        <Route exact path="/:path" render={(props) => <Directory {...props} cookie={cookies} />} />
        <Route path="/:path/auth" render={(props) => <Authorization {...props} setCookie={setCookie} />} />
      </div>
  );
}

export default App;