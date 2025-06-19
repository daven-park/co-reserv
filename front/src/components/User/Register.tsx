import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const RegisterBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const RegisterTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #666;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ErrorText = styled.h5`
  color: #007bff;
  font-size: 0.8rem;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #0056b3;
  }
`;

interface RegisterInfo {
  userId: string;
  userName: string;
  password: string;
  passwordCheck: string;
  email: string;
}

const Register: FC = () => {
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    userId: '',
    userName: '',
    password: '',
    passwordCheck: '',
    email: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRegisterInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validation = () => {
    // userId 검증
    if (!/^[a-zA-Z0-9]{4,}$/.test(registerInfo.userId)) {
      setError('아이디는 영문자와 숫자만 사용 가능하며, 4자 이상이어야 합니다.');
      return false;
    }

    // userName 검증
    if (registerInfo.userName.trim().length < 2) {
      setError('이름은 2자 이상이어야 합니다.');
      return false;
    }

    // password 검증
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(registerInfo.password)) {
      setError('비밀번호는 영문자와 숫자를 포함하여 6자 이상이어야 합니다.');
      return false;
    }

    // email 검증
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerInfo.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return false;
    }

    if (registerInfo.password !== registerInfo.passwordCheck) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const sendRegisterInfo = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validation()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: registerInfo.userId,
          userName: registerInfo.userName,
          password: registerInfo.password,
          email: registerInfo.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      setError(errorMessage);
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <RegisterTitle>회원가입</RegisterTitle>
        <RegisterForm>
          <InputGroup>
            <Label htmlFor="userId">아이디</Label>
            <Input
              id="userId"
              type="text"
              name="userId"
              value={registerInfo.userId}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="userName">이름</Label>
            <Input
              id="userName"
              type="text"
              name="userName"
              value={registerInfo.userName}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={registerInfo.password}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password2">비밀번호 확인</Label>
            <Input
              id="password2"
              type="password"
              name="passwordCheck"
              value={registerInfo.passwordCheck}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="text"
              name="email"
              value={registerInfo.email}
              onChange={handleInputChange}
            />
          </InputGroup>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" onClick={sendRegisterInfo}>
            회원가입
          </Button>
        </RegisterForm>
      </RegisterBox>
    </RegisterContainer>
  );
};

export default Register;
