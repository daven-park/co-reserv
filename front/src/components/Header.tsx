import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;

  &:hover {
    color: #007bff;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &.login {
    background-color: transparent;
    color: #007bff;
    border: 1px solid #007bff;

    &:hover {
      background-color: #007bff;
      color: white;
    }
  }

  &.logout {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo>코칭실 예약</Logo>
        <NavLinks>
          <NavLink to="/">홈</NavLink>
          <NavLink to="/reservation">예약하기</NavLink>
          <NavLink to="/my-reservations">내 예약</NavLink>
        </NavLinks>
        <AuthButtons>
          {!isLoggedIn ? (
            <Button className="login" onClick={handleLogin}>
              로그인
            </Button>
          ) : (
            <Button className="logout" onClick={handleLogout}>
              로그아웃
            </Button>
          )}
        </AuthButtons>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
