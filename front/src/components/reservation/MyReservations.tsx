import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchWithAuth } from '../../util/auth';

const MainContainer = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ReservationsContainer = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ReservationsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ReservationCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #f8f9fa;
  position: relative;
`;

const ReservationDate = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ReservationTime = styled.div`
  font-size: 1.5rem;
  color: #007bff;
  margin-bottom: 1rem;
`;

const ReservationStatus = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #d4edda;
  color: #28a745;
  text-align: center;
`;

const CancelButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #f8d7da;
  color: #dc3545;
  border-radius: 4px;
`;

interface Reservation {
  id: number;
  date: string;
  time: string;
  userId: string;
  createdAt: string;
  isCancelled: boolean;
  cancelledAt: string | null;
}

const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyReservations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchWithAuth('http://localhost:8000/reservations/my');
      
      if (!response.ok) {
        throw new Error('예약 정보를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '예약 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const handleCancelReservation = async (id: number) => {
    if (!window.confirm('예약을 취소하시겠습니까?')) return;
    
    try {
      setError(null);
      
      const response = await fetchWithAuth(`http://localhost:8000/reservations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('예약 취소에 실패했습니다.');
      }
      
      // 예약 목록 다시 불러오기
      fetchMyReservations();
    } catch (error) {
      setError(error instanceof Error ? error.message : '예약 취소에 실패했습니다.');
    }
  };

  // 예약을 날짜순으로 정렬
  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // 현재 시간 이후의 예약만 필터링
  const now = new Date();
  const upcomingReservations = sortedReservations.filter(reservation => {
    const reservationDate = new Date(`${reservation.date}T${reservation.time}`);
    return reservationDate > now;
  });

  // 지난 예약 필터링
  const pastReservations = sortedReservations.filter(reservation => {
    const reservationDate = new Date(`${reservation.date}T${reservation.time}`);
    return reservationDate <= now;
  });

  return (
    <MainContainer>
      <h1>내 예약 목록</h1>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {isLoading ? (
        <LoadingMessage>예약 정보를 불러오는 중...</LoadingMessage>
      ) : (
        <ReservationsContainer>
          <h2>예정된 예약</h2>
          {upcomingReservations.length > 0 ? (
            <ReservationsList>
              {upcomingReservations.map((reservation) => (
                <ReservationCard key={reservation.id}>
                  <ReservationDate>
                    {new Date(reservation.date).toLocaleDateString()}
                  </ReservationDate>
                  <ReservationTime>{reservation.time}</ReservationTime>
                  <ReservationStatus>예약 확정</ReservationStatus>
                  <CancelButton onClick={() => handleCancelReservation(reservation.id)}>
                    취소
                  </CancelButton>
                </ReservationCard>
              ))}
            </ReservationsList>
          ) : (
            <EmptyMessage>예정된 예약이 없습니다.</EmptyMessage>
          )}
          
          <h2 style={{ marginTop: '2rem' }}>지난 예약</h2>
          {pastReservations.length > 0 ? (
            <ReservationsList>
              {pastReservations.map((reservation) => (
                <ReservationCard key={reservation.id}>
                  <ReservationDate>
                    {new Date(reservation.date).toLocaleDateString()}
                  </ReservationDate>
                  <ReservationTime>{reservation.time}</ReservationTime>
                  <ReservationStatus 
                    style={{ 
                      backgroundColor: '#e9ecef', 
                      color: '#495057' 
                    }}
                  >
                    완료됨
                  </ReservationStatus>
                </ReservationCard>
              ))}
            </ReservationsList>
          ) : (
            <EmptyMessage>지난 예약이 없습니다.</EmptyMessage>
          )}
        </ReservationsContainer>
      )}
    </MainContainer>
  );
};

export default MyReservations;