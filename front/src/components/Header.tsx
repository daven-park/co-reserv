import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #333;
  font-weight: 500;
`;

const UserName = styled.span`
  color: #007bff;
`;

interface HeaderProps {
  isLoggedIn: boolean;
  userInfo: { userId: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, userInfo, onLogout }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo>코칭실 예약</Logo>
        <NavLinks>
          <NavLink to="/">홈</NavLink>
          <NavLink to="/reservation">예약하기</NavLink>
          {isLoggedIn && <NavLink to="/my-reservations">내 예약</NavLink>}
        </NavLinks>
        <AuthButtons>
          {!isLoggedIn ? (
            <Button className="login" onClick={handleLogin}>
              로그인
            </Button>
          ) : (
            <UserInfo>
              <NavLink to="/my-page">
                <UserName>{userInfo?.userId}님</UserName>
              </NavLink>
              <Button className="logout" onClick={handleLogout}>
                로그아웃
              </Button>
            </UserInfo>
          )}
        </AuthButtons>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
