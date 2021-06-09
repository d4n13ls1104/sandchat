import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import IndexPage from "./components/IndexPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

import "./stylesheets/register_styles.css";
import "./stylesheets/index_styles.css";

const App: React.FC = () => {
  return (
    <Router>
      <Route exact path="/" component={IndexPage}/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/home" component={Home}/>
    </Router>
  );
}

export default App;
