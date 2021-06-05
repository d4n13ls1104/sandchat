import IndexPage from "./components/IndexPage";
import Register from "./components/Register";

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route exact path="/" component={IndexPage}/>
      <Route exact path="/register" component={Register}/>
    </Router>
  );
}

export default App;
