# co-reserv

coaching room reservation board project

1. 회원 관리 (User)
   1. [x] 로그인, 로그아웃, 회원가입
   2. [] (optional) 이메일 인증, Oauth나 api 로그인
   3. [] (optional) 나의 정보 페이지
2. 게시판 관리 (Board)
   1. [x] 게시판 등록, 수정, 삭제, 조회
3. 코칭실 예약 관리 (Reservation)
   1. [x] 달력 기능, 예약 신청, 예약 수정, 예약 취소
   2. [x] 동시성 처리 기능

## 프로젝트 기능 설명

### 1. 메인 페이지

- 달력, 게시판, 예약 현황을 한 화면에서 확인 가능
- 달력에서 날짜를 선택하면 해당 날짜의 게시글과 예약 현황이 표시됨

### 2. 게시판 기능

- 게시글 작성, 조회, 수정, 삭제 기능
- 날짜별 게시글 필터링 기능
- 게시글 상세 보기 모달

### 3. 예약 기능

- 날짜 및 시간 선택을 통한 예약 생성
- 예약 가능한 시간대 조회
- 예약 취소 기능
- 내 예약 목록 조회 (예정된 예약 / 지난 예약)

## 동시성 처리 방법

코칭실 예약 시스템에서 동시에 여러 사용자가 같은 시간대에 예약을 시도할 경우 발생할 수 있는 동시성 문제를 다음과 같은 방법으로 해결했습니다:

### 1. 낙관적 동시성 제어 (Optimistic Concurrency Control)

예약 생성 시 다음과 같은 단계로 동시성을 제어합니다:

1. **중복 예약 확인**: 예약 생성 전에 해당 날짜와 시간에 이미 예약이 있는지 확인합니다.

   ```typescript
   // 동일한 날짜와 시간에 이미 예약이 있는지 확인
   const existingReservation = await this.reservationRepository.findOne({
     where: {
       date: new Date(date),
       time,
       isCancelled: false,
     },
   });

   if (existingReservation) {
     throw new ConflictException("이미 예약된 시간입니다.");
   }
   ```

2. **데이터베이스 제약 조건 활용**: 데이터베이스 레벨에서 날짜와 시간에 대한 유니크 인덱스를 설정하여 동시에 같은 시간대에 예약이 생성되는 것을 방지합니다.

3. **예외 처리**: 동시에 같은 시간대에 예약 요청이 들어와 데이터베이스 제약 조건에 위배될 경우, 적절한 예외 처리를 통해 사용자에게 알립니다.
   ```typescript
   try {
     await this.reservationRepository.save(reservation);
     return reservation;
   } catch (error) {
     if (error.code === "23505") {
       // PostgreSQL 중복 키 에러 코드
       throw new ConflictException("이미 예약된 시간입니다.");
     }
     throw error;
   }
   ```

### 2. 프론트엔드 동시성 처리

프론트엔드에서도 다음과 같은 방법으로 동시성 문제를 최소화합니다:

1. **실시간 가용성 확인**: 예약 페이지에서 사용자가 날짜를 선택할 때마다 서버에서 최신 예약 가능 시간을 조회합니다.

   ```typescript
   useEffect(() => {
     fetchAvailableTimeSlots(selectedDate);
   }, [selectedDate]);
   ```

2. **예약 성공 후 갱신**: 예약 성공 후 예약 가능 시간 목록을 다시 조회하여 UI를 갱신합니다.

   ```typescript
   // 예약 성공 후 시간 슬롯 다시 불러오기
   fetchAvailableTimeSlots(selectedDate);
   ```

3. **오류 처리 및 피드백**: 동시성 문제로 예약에 실패할 경우 사용자에게 명확한 오류 메시지를 제공합니다.
   ```typescript
   setError(error instanceof Error ? error.message : "예약에 실패했습니다.");
   ```

이러한 방법을 통해 여러 사용자가 동시에 같은 시간대에 예약을 시도하더라도 한 명의 사용자만 예약에 성공하고 나머지 사용자에게는 적절한 오류 메시지가 표시되도록 구현했습니다.

## 트러블슈팅

### 로그인 후 홈페이지로 이동했다가 다시 로그인 페이지로 돌아오는 문제

#### 문제 상황

- 사용자가 로그인에 성공하면 홈페이지('/')로 이동하지만, 바로 다시 로그인 페이지('/login')로 리디렉션되는 현상이 발생

#### 원인 분석

1. 로그인 성공 시 토큰과 사용자 정보가 localStorage에 저장됨
2. 홈페이지로 이동 후 `App.tsx`의 `useEffect`에서 `checkAuth` 함수를 호출하여 인증 상태를 확인
3. `checkAuth` 함수에서 서버로부터 받은 응답을 제대로 처리하지 못하여 인증 실패로 판단
4. `ProtectedRoute` 컴포넌트에서 인증 실패 시 로그인 페이지로 리디렉션

#### 해결 방법

인증 관련 코드를 완전히 새로 작성하여 문제를 해결했습니다.

1. **`auth.ts` 파일 전체 재작성:**

   - 명확한 타입 정의와 함수 분리로 코드 가독성 향상
   - 토큰 및 사용자 정보 관리 로직 개선

   ```typescript
   // 사용자 타입 정의
   interface User {
     userId: string;
     name?: string;
     email?: string;
   }

   // 토큰 관리
   const TOKEN_KEY = "token";
   const USER_KEY = "user";

   // 로그인 함수
   export const login = async (
     userId: string,
     password: string
   ): Promise<User> => {
     const response = await fetch("http://localhost:8000/auth/login", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ userId, password }),
     });

     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.message || "로그인에 실패했습니다.");
     }

     const data = await response.json();

     if (!data.token || !data.user) {
       throw new Error("서버 응답에 필요한 데이터가 없습니다.");
     }

     // 토큰과 사용자 정보 저장
     localStorage.setItem(TOKEN_KEY, data.token);
     localStorage.setItem(USER_KEY, JSON.stringify(data.user));

     return data.user;
   };

   // 인증 상태 확인 함수
   export const checkAuth = async (): Promise<User | null> => {
     const token = localStorage.getItem(TOKEN_KEY);

     if (!token) {
       return null;
     }

     try {
       const response = await fetch("http://localhost:8000/auth/check", {
         method: "GET",
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });

       if (!response.ok) {
         if (response.status === 401) {
           // 인증 실패 시 토큰 제거
           localStorage.removeItem(TOKEN_KEY);
           localStorage.removeItem(USER_KEY);
         }
         return null;
       }

       const data = await response.json();

       if (data.success && data.user) {
         // 사용자 정보 업데이트
         localStorage.setItem(USER_KEY, JSON.stringify(data.user));
         return data.user;
       }

       return null;
     } catch (error) {
       console.error("인증 확인 중 오류 발생:", error);
       return null;
     }
   };
   ```

2. **`Login.tsx` 컴포넌트 개선:**

   - 새로 작성한 `login` 함수 사용
   - 로딩 상태 및 성공 메시지 추가

   ```typescript
   const handleSubmit = async (e: FormEvent) => {
     e.preventDefault();
     setError("");
     setSuccess("");
     setIsLoading(true);

     try {
       const user = await login(userId, password);

       // 상태 업데이트
       setIsLoggedIn(true);
       setUserInfo(user);
       setSuccess("로그인되었습니다.");

       // 홈페이지로 이동
       setTimeout(() => {
         navigate("/", { replace: true });
       }, 1000);
     } catch (error) {
       const errorMessage =
         error instanceof Error ? error.message : "로그인에 실패했습니다.";
       setError(errorMessage);
     } finally {
       setIsLoading(false);
     }
   };
   ```

3. **`App.tsx`의 인증 초기화 로직 간소화:**

   - 불필요한 로그 제거
   - 인증 상태 확인 로직 명확화

   ```typescript
   useEffect(() => {
     const initializeAuth = async () => {
       try {
         // 먼저 로컬 스토리지에서 사용자 정보 가져오기
         const storedUser = getUser();

         if (storedUser) {
           // 로컬 스토리지에 사용자 정보가 있으면 일단 로그인 상태로 설정
           setIsLoggedIn(true);
           setUserInfo(storedUser);
         }

         // 서버에 인증 확인 요청
         const user = await checkAuth();

         if (user) {
           // 서버 인증 성공
           setIsLoggedIn(true);
           setUserInfo(user);
         } else {
           // 서버 인증 실패
           setIsLoggedIn(false);
           setUserInfo(null);
         }
       } catch (error) {
         console.error("인증 초기화 중 오류:", error);
         setIsLoggedIn(false);
         setUserInfo(null);
       } finally {
         setIsLoading(false);
       }
     };

     initializeAuth();

     // 15분마다 인증 상태 확인
     const intervalId = setInterval(async () => {
       const user = await checkAuth();
       if (user) {
         setIsLoggedIn(true);
         setUserInfo(user);
       } else {
         setIsLoggedIn(false);
         setUserInfo(null);
       }
     }, 15 * 60 * 1000);

     return () => clearInterval(intervalId);
   }, []);
   ```

4. **`ProtectedRoute.tsx` 컴포넌트 간소화:**

   - 불필요한 로그 제거
   - 인증 확인 로직 명확화

   ```typescript
   import React from "react";
   import { Navigate } from "react-router-dom";
   import { isAuthenticated } from "../util/auth";

   interface ProtectedRouteProps {
     isLoggedIn: boolean;
     children: React.ReactNode;
   }

   const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
     isLoggedIn,
     children,
   }) => {
     // App에서 전달받은 isLoggedIn과 localStorage의 토큰을 모두 확인
     const authenticated = isLoggedIn && isAuthenticated();

     if (!authenticated) {
       // 인증되지 않은 경우 로그인 페이지로 리디렉션
       return <Navigate to="/login" replace />;
     }

     // 인증된 경우 자식 컴포넌트 렌더링
     return <>{children}</>;
   };

   export default ProtectedRoute;
   ```

5. **`Header.tsx`의 로그아웃 처리 개선:**

   - 새로 작성한 `logout` 함수 사용
   - 오류 처리 강화

   ```typescript
   const handleLogout = async () => {
     try {
       // 서버에 로그아웃 요청
       await fetch("http://localhost:8000/auth/logout", {
         method: "POST",
       });

       // 로컬 로그아웃 처리
       logout();

       // 상태 업데이트
       setIsLoggedIn(false);
       setUserInfo(null);

       // 로그인 페이지로 이동
       navigate("/login", { replace: true });
     } catch (error) {
       console.error("로그아웃 중 오류 발생:", error);

       // 오류가 발생해도 로컬에서는 로그아웃 처리
       logout();
       setIsLoggedIn(false);
       setUserInfo(null);
       navigate("/login", { replace: true });
     }
   };
   ```

#### 결과

- 로그인 성공 후 홈페이지로 이동하여 정상적으로 유지됨
- 인증 토큰이 유효한 경우 페이지 새로고침 후에도 로그인 상태 유지
- 인증 토큰이 만료되거나 유효하지 않은 경우에만 로그인 페이지로 리디렉션
- 코드 가독성과 유지보수성 향상
- 오류 처리 강화로 예외 상황에서도 안정적으로 동작

# JWT 인증 트러블슈팅

## 문제 상황

- 로그인 후 메인 페이지로 이동 시 401 Unauthorized 에러 발생
- JWT 토큰이 있음에도 불구하고 인증 실패

## 트러블슈팅 과정

### 1. 프론트엔드 로깅 추가

- `fetchWithAuth` 함수에 상세 로깅 추가
- 토큰 존재 여부, 페이로드 내용, API 요청 상태 등을 localStorage에 저장하여 추적
- 결과: 토큰이 정상적으로 저장되어 있고, 만료되지 않았음을 확인

### 2. 백엔드 로깅 추가

- JWT 인증 가드에 상세 로깅 추가
- 토큰 검증 과정, 에러 정보 등을 로깅
- 결과: "invalid signature" 에러 발생 확인

### 3. JWT 시크릿 키 문제 해결

- 문제: 환경 변수 `JWT_SECRET_KEY`가 제대로 로드되지 않음
- 해결:
  - `@nestjs/config` 패키지 사용
  - `ConfigModule`을 전역으로 설정
  - `JwtModule`과 `JwtStrategy`에서 `ConfigService`를 통해 시크릿 키 접근

### 4. 사용자 검증 로직 문제 해결

- 문제: 토큰의 `sub` 값으로 사용자를 찾으려고 시도
- 해결:
  - `UsersService.findOne()`이 `userId`로 사용자를 찾도록 수정
  - JWT 토큰 검증 시 `userId`를 사용하도록 변경

## 주요 수정사항

1. `auth.module.ts`:

```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>("JWT_SECRET_KEY"),
    signOptions: {
      expiresIn: configService.get<string>("JWT_EXPIRES_IN", "24h"),
    },
  }),
  inject: [ConfigService],
});
```

2. `jwt.strategy.ts`:

```typescript
constructor(
  private usersService: UsersService,
  private configService: ConfigService,
) {
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
  });
}

async validate(payload: any) {
  // userId로 사용자 검증
  const user = await this.usersService.findOne(payload.userId);
  // ...
}
```

## 교훈

1. 환경 변수 관리는 `@nestjs/config`를 사용하여 체계적으로 관리
2. JWT 토큰의 페이로드 구조와 사용자 검증 로직의 일관성 유지
3. 상세한 로깅을 통한 문제 원인 파악의 중요성
4. 프론트엔드와 백엔드의 로깅을 통한 전체 흐름 파악의 필요성

## 향후 개선사항

1. 에러 메시지의 일관성 유지
2. 토큰 갱신 로직 구현
3. 보안을 위한 추가적인 검증 로직 구현
