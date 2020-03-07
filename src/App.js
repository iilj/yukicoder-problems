import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { Container } from "reactstrap";

import { NavigationBar } from "./components/NavigationBar";
import { ShortRanking } from "./pages/ShortRanking";
import { TablePage } from "./pages/TablePage";
import { ListPage } from "./pages/ListPage";
import { UserPage } from "./pages/UserPage"
// import logo from './logo.svg';
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons'
library.add(faStar, faStarHalf);

function App() {
  return (
    <Router>
      <NavigationBar />
      <Container style={{ width: "100%", maxWidth: "90%" }}>
        <Switch>
          <Route exact path="/short" component={() => <ShortRanking />} />
          <Route
            path={["/table/:param(name|twitter|id)/:user([a-zA-Z0-9_-]+)", "/table/"]}
            component={TablePage}
          />
          <Route
            path={["/list/:param(name|twitter|id)/:user([a-zA-Z0-9_-]+)", "/list/"]}
            component={ListPage}
          />
          <Route
            path="/user/:param(name|twitter|id)/:user([a-zA-Z0-9_-]+)"
            component={UserPage}
          />
          <Redirect path="/" to="/table/" />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
