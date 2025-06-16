import { ChangeEvent, FC, useState } from 'react';
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

const Button = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background: #0056b3;
  }
`;

interface RegisterInfo {
  userId: string;
  userName: string;
  password: string;
  email: string;
}

const Register: FC = () => {
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({
    userId: '',
    userName: '',
    password: '',
    email: '',
  });
  const [passwordCheck, setPasswordCheck] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendRegisterInfo = () => {
    // validation 체크
    if (registerInfo.password !== passwordCheck) {
      return;
    }

    try {
      // TODO : Post 회원가입 요청
    } catch (error) {
      console.error('회원가입 요청 오류', error);
    }

    // 요청 완료되었으면 정리
    setPasswordCheck('');
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <RegisterTitle>회원가입</RegisterTitle>
        <RegisterForm>
          <InputGroup>
            <Label htmlFor="userId">아이디</Label>
            <Input id="userId" type="text" value={registerInfo?.userId} onChange={handleChange} />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="userName">이름</Label>
            <Input id="userName" type="text" value={registerInfo?.userName} />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" value={registerInfo?.password} />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password2">비밀번호 확인</Label>
            <Input id="password2" type="password" value={passwordCheck} />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="text" value={registerInfo?.email} />
          </InputGroup>
          {'validation 체크 문자 표시'}
          <Button type="submit" onClick={sendRegisterInfo}>
            회원가입
          </Button>
        </RegisterForm>
      </RegisterBox>
    </RegisterContainer>
  );
};

export default Register;
