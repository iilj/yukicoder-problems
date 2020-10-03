import React from 'react';
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Container } from 'reactstrap';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faStar,
  faStarHalf,
  faSchool,
  faCalculator,
  faLaughBeam,
  faExclamationTriangle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { NavigationBar } from './components/NavigationBar';
import { ShortRanking } from './pages/ShortRanking';
import { PureShortRanking } from './pages/PureShortRanking';
import { FastestRanking } from './pages/FastestRanking';
import { TablePage } from './pages/TablePage';
import { ListPage } from './pages/ListPage';
import { UserPage } from './pages/UserPage';
// import logo from './logo.svg';
import './App.css';
import { ProblemDetailPage } from './pages/ProblemDetailPage';

library.add(
  faStar,
  faStarHalf,
  faSchool,
  faCalculator,
  faLaughBeam,
  faExclamationTriangle,
  faCheck
);

const App: React.FC = () => {
  return (
    <Router>
      <NavigationBar />
      <Container style={{ width: '100%', maxWidth: '90%' }}>
        <Routes>
          <Route path="/fast" element={<FastestRanking />} />
          <Route path="/short" element={<ShortRanking />} />
          <Route path="/pureshort" element={<PureShortRanking />} />
          <Route path="/table/:param/:user" element={<TablePage />} />
          <Route path="/table/" element={<TablePage />} />
          <Route path="/list/:param/:user" element={<ListPage />} />
          <Route path="/list/" element={<ListPage />} />
          <Route path="/user/:param/:user" element={<UserPage />} />
          <Route
            path="/problem-detail/:problemIdString"
            element={<ProblemDetailPage />}
          />
          <Route path="/" element={<Navigate to="/table/" />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
