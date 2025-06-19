import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Login from './components/User/Login';
import Register from './components/User/Register';
import Main from './components/Main';
import Reservation from './components/Reservation/Reservation';
import MyReservations from './components/Reservation/MyReservations';
import Footer from './components/Footer';
import { checkAuth, getUser } from './util/auth';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
`;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ userId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = getUser();

        if (!token) {
          setIsLoggedIn(false);
          setUserInfo(null);
          setIsLoading(false);
          return;
        }

        if (storedUser) {
          setIsLoggedIn(true);
          setUserInfo(storedUser);
        }

        const user = await checkAuth();

        if (user) {
          setIsLoggedIn(true);
          setUserInfo(user);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const intervalId = setInterval(
      async () => {
        const user = await checkAuth();
        if (user) {
          setIsLoggedIn(true);
          setUserInfo(user);
        } else {
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      },
      15 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <LoadingContainer>로딩 중...</LoadingContainer>;
  }

  return (
    <BrowserRouter>
      <AppContainer>
        <Header />
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isLoggedIn ? <Main /> : <Navigate to="/login" replace />} />
          <Route
            path="/reservation"
            element={isLoggedIn ? <Reservation /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/my-reservations"
            element={isLoggedIn ? <MyReservations /> : <Navigate to="/login" replace />}
          />
        </Routes>
        <Footer />
      </AppContainer>
    </BrowserRouter>
  );
};

export default App;
