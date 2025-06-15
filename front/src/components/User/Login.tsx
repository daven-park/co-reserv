import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 300px;
  gap: 10px;
`;

const Label = styled.label`
  text-align:center;
  width: 30%; 
  padding 0 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  margin-bottom: 10px;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  background-color: #007bff;
  color: black;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  background-color: #007bff;
  color: black;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

interface LoginProps {
  onLoginSuccess: (userData: { userId: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          password,
        }),
      });
      if (response.ok) {
        const data = await response.json();

        console.log('로그인 성공', data);
        onLoginSuccess({ userId: data.userId });
        navigate('/');
      } else {
        console.error('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생 : ', error);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <LoginContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Login</Title>
        <InputContainer>
          <Label>ID </Label>
          <Input
            type="text"
            placeholder="id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Label>Password </Label>
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputContainer>
        <LoginButton type="submit">Login</LoginButton>
        <RegisterButton type="button" onClick={handleRegister}>
          Register
        </RegisterButton>
      </Form>
    </LoginContainer>
  );
};

export default Login;
