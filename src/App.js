import React from 'react';
import {
  HashRouter as Router, Route, Routes, Redirect,
} from 'react-router-dom';
import { Container } from 'reactstrap';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import { NavigationBar } from './components/NavigationBar';
import { ShortRanking } from './pages/ShortRanking';
import { PureShortRanking } from './pages/PureShortRanking';
import { TablePage } from './pages/TablePage';
import { ListPage } from './pages/ListPage';
import { UserPage } from './pages/UserPage';
// import logo from './logo.svg';
import './App.css';

library.add(faStar, faStarHalf);

function App() {
  return (
    <Router>
      <NavigationBar />
      <Container style={{ width: '100%', maxWidth: '90%' }}>
        <Routes>
          <Route exect path="/short" element={<ShortRanking />} />
          <Route exect path="/pureshort" element={<PureShortRanking />} />
          <Route path="/table/:param/:user" element={<TablePage />} />
          <Route path="/table/" element={<TablePage />} />
          <Route path="/list/:param/:user" element={<ListPage />} />
          <Route path="/list/" element={<ListPage />} />
          <Route path="/user/:param/:user" element={<UserPage />} />
          <Redirect path="/" to="/table/" />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
