import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Reservation from './components/reservation/reservation';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/my-reservations" element={<div>내 예약 페이지</div>} />
        </Routes>
        <Footer />
      </AppContainer>
    </Router>
  );
};

export default App;
