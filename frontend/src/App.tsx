import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "stylesheets/index.css";

import Index from "components/Index";
import Register from "components/Register";
import Login from "components/Login";
import Home from "components/Home";

const App: React.FC = () => {
  return (
    <Router>
      <Route exact path="/" component={Index}/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/home" component={Home}/>
    </Router>
  );
}

export default App;
