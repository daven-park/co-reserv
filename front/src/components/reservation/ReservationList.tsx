import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchWithAuth } from '../../util/auth';

const ListContainer = styled.div`
  margin-top: 20px;
`;

const ListTitle = styled.h3`
  margin-bottom: 15px;
  color: #333;
`;

const ReservationItem = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  background: white;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const TimeSlot = styled.div`
  font-weight: bold;
  color: #007bff;
`;

const UserInfo = styled.div`
  color: #666;
  margin-top: 5px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #dc3545;
`;

interface Reservation {
  id: number;
  date: string;
  time: string;
  userId: string;
  user?: { name: string };
}

interface ReservationListProps {
  selectedDate: Date | null;
  reservations?: Reservation[];
}

function ReservationList({ selectedDate, reservations = [] }: ReservationListProps) {
  const [loadedReservations, setLoadedReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedDate) {
        setLoadedReservations([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 예약 정보 가져오기
        const response = await fetchWithAuth(
          `http://localhost:8000/reservations?date=${selectedDate.toISOString()}`
        );

        if (!response.ok) {
          throw new Error('예약 정보를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        
        // 사용자 정보를 캐시하기 위한 객체
        const userCache: Record<string, string> = {};
        
        // 각 예약에 대해 사용자 정보 가져오기
        const reservationsWithUserInfo = await Promise.all(
          data.map(async (reservation: Reservation) => {
            try {
              // 이미 캐시된 사용자 정보가 있으면 사용
              if (userCache[reservation.userId]) {
                return {
                  ...reservation,
                  user: { name: userCache[reservation.userId] }
                };
              }
              
              // 사용자 정보 가져오기
              try {
                const userResponse = await fetchWithAuth(
                  `http://localhost:8000/users/${reservation.userId}`
                );
                
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  console.log('사용자 정보 응답:', userData);
                  const userName = userData.name || userData.userName || reservation.userId;
                  
                  // 캐시에 사용자 정보 저장
                  userCache[reservation.userId] = userName;
                  
                  return {
                    ...reservation,
                    user: { name: userName }
                  };
                } else {
                  console.error(`사용자 정보 가져오기 실패 (${userResponse.status}):`, reservation.userId);
                  return {
                    ...reservation,
                    user: { name: reservation.userId }
                  };
                }
              } catch (error) {
                console.error(`사용자 정보 가져오기 오류:`, error);
                return {
                  ...reservation,
                  user: { name: reservation.userId }
                };
              }
              return reservation;
            } catch (error) {
              console.error(`사용자 정보 가져오기 실패: ${reservation.userId}`, error);
              return reservation;
            }
          })
        );
        
        setLoadedReservations(reservationsWithUserInfo);
      } catch (error) {
        setError(error instanceof Error ? error.message : '예약 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [selectedDate]);

  if (isLoading) {
    return (
      <ListContainer>
        <ListTitle>예약 현황</ListTitle>
        <LoadingMessage>로딩 중...</LoadingMessage>
      </ListContainer>
    );
  }

  if (error) {
    return (
      <ListContainer>
        <ListTitle>예약 현황</ListTitle>
        <ErrorMessage>{error}</ErrorMessage>
      </ListContainer>
    );
  }

  // 외부에서 전달받은 reservations가 있으면 사용하고, 없으면 로드한 데이터 사용
  const displayReservations =
    reservations && reservations.length > 0 ? reservations : loadedReservations;

  return (
    <ListContainer>
      <ListTitle>예약 현황</ListTitle>
      {!selectedDate ? (
        <EmptyMessage>날짜를 선택해주세요.</EmptyMessage>
      ) : displayReservations.length === 0 ? (
        <EmptyMessage>선택된 날짜의 예약이 없습니다.</EmptyMessage>
      ) : (
        displayReservations.map(reservation => (
          <ReservationItem key={reservation.id}>
            <TimeSlot>
              {new Date(reservation.date).toLocaleDateString()} {reservation.time}
            </TimeSlot>
            <UserInfo>예약자: {reservation.user?.name || reservation.userId || '알 수 없음'}</UserInfo>
          </ReservationItem>
        ))
      )}
    </ListContainer>
  );
}

export default ReservationList;
