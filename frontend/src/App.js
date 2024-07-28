
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Support from './components/Support';
import Admin from './components/Admin';
import Packages from './components/Packages';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/support" component={Support} />
          <Route path="/admin" component={Admin} />
          <Route path="/packages" component={Packages} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
