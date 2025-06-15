import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Reservation from './components/reservation/reservation';
import Login from './components/User/Login';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ userId: string } | null>(null);

  const onLoginSuccess = (userData: { userId: string }) => {
    setIsLoggedIn(true);
    setUserInfo(userData);
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <Router>
      <AppContainer>
        <Header isLoggedIn={isLoggedIn} userInfo={userInfo} onLogout={onLogout} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/my-reservations" element={<div>내 예약 페이지</div>} />
          <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
        </Routes>
        <Footer />
      </AppContainer>
    </Router>
  );
};

export default App;
