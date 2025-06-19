// 사용자 타입 정의
export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
}

// 토큰 관리
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// 토큰 검증 함수
export const validateToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
  } catch {
    return false;
  }
};

// 로그인 함수
export const login = async (userId: string, password: string): Promise<User> => {
  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '로그인에 실패했습니다.');
  }

  const data = await response.json();

  if (!data.access_token || !data.user) {
    throw new Error('서버 응답에 필요한 데이터가 없습니다.');
  }

  // 토큰과 사용자 정보 저장
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  return data.user;
};

// 로그아웃 함수
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// 토큰 가져오기
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 사용자 정보 가져오기
export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// 인증 상태 확인
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

// 인증이 필요한 fetch 요청
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();

  if (!token) {
    throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
  }

  if (!validateToken(token)) {
    logout();
    throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
};

// 인증 상태 확인 API 호출
export const checkAuth = async (): Promise<User | null> => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch('http://localhost:8000/auth/check', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    return null;
  }
};
