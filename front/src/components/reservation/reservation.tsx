import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchWithAuth } from '../../util/auth';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../util/auth';

const MainContainer = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ReservationContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarContainer = styled.div`
  .react-calendar {
    width: 100%;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 1rem;
  }

  .react-calendar__tile--active {
    background-color: #007bff;
  }

  .react-calendar__tile--now {
    background-color: #e6f3ff;
  }
`;

const TimeSlotsContainer = styled.div`
  padding: 1rem;
`;

const TimeSlot = styled.button<{ isAvailable: boolean; isSelected: boolean }>`
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${props => {
    if (props.isSelected) return '#007bff';
    if (props.isAvailable) return '#fff';
    return '#f8f9fa';
  }};
  color: ${props => {
    if (props.isSelected) return '#fff';
    if (props.isAvailable) return '#333';
    return '#999';
  }};
  cursor: ${props => (props.isAvailable ? 'pointer' : 'not-allowed')};

  &:hover {
    background-color: ${props => {
      if (props.isSelected) return '#0056b3';
      if (props.isAvailable) return '#e6f3ff';
      return '#f8f9fa';
    }};
  }
`;

const ReservationInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const ReservationButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #d4edda;
  border-radius: 4px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-left: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface TimeSlotType {
  time: string;
  isAvailable: boolean;
}

function formatDateToYMD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const Reservation: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // 선택한 날짜에 대한 예약 가능 시간 조회
  const fetchAvailableTimeSlots = async (date: Date) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchWithAuth(
        `http://localhost:8000/reservations/available?date=${formatDateToYMD(date)}`
      );

      if (!response.ok) {
        throw new Error('예약 가능 시간을 불러오는데 실패했습니다.');
      }

      const availableTimes = await response.json();

      // 모든 시간대 생성 (9시부터 18시까지, 1시간 단위)
      const allTimeSlots = [
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
      ].map(time => ({
        time,
        isAvailable: availableTimes.includes(time),
      }));

      setTimeSlots(allTimeSlots);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : '예약 가능 시간을 불러오는데 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableTimeSlots(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (value: Date | Date[]) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleReservation = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // 현재 로그인한 사용자 정보 가져오기
      const currentUser = getUser();
      console.log('프론트엔드 - 현재 사용자 정보:', currentUser);

      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      // 날짜를 YYYY-MM-DD 형식으로 변환
      const formattedDate = formatDateToYMD(selectedDate);

      const requestBody = {
        date: formattedDate,
        time: selectedTime,
        userId: currentUser.userId,
      };
      console.log('프론트엔드 - 예약 요청 데이터:', requestBody);

      const response = await fetchWithAuth('http://localhost:8000/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '예약에 실패했습니다.');
      }

      setSuccess('예약이 성공적으로 완료되었습니다.');

      // 예약 성공 후 시간 슬롯 다시 불러오기
      fetchAvailableTimeSlots(selectedDate);

      // 선택 초기화
      setSelectedTime(null);

      // 3초 후 내 예약 페이지로 이동
      setTimeout(() => {
        navigate('/my-reservations');
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : '예약에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 오늘 이전 날짜 비활성화
  const isDateDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <MainContainer>
      <h1>코칭실 예약하기</h1>
      <ReservationContainer>
        <CalendarContainer>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            tileDisabled={isDateDisabled}
          />
        </CalendarContainer>
        <TimeSlotsContainer>
          <h2>예약 가능 시간</h2>
          <p>{selectedDate.toLocaleDateString()} 선택됨</p>

          {isLoading ? (
            <div>시간 슬롯 로딩 중...</div>
          ) : (
            timeSlots.map(slot => (
              <TimeSlot
                key={slot.time}
                isAvailable={slot.isAvailable}
                isSelected={selectedTime === slot.time}
                onClick={() => slot.isAvailable && handleTimeSelect(slot.time)}
                disabled={!slot.isAvailable}
              >
                {slot.time} {!slot.isAvailable && '(예약됨)'}
              </TimeSlot>
            ))
          )}

          {selectedTime && (
            <ReservationInfo>
              <h3>예약 정보</h3>
              <p>날짜: {selectedDate.toLocaleDateString()}</p>
              <p>시간: {selectedTime}</p>

              <ReservationButton onClick={handleReservation} disabled={isLoading}>
                {isLoading ? (
                  <>
                    예약 중... <LoadingSpinner />
                  </>
                ) : (
                  '예약하기'
                )}
              </ReservationButton>

              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
            </ReservationInfo>
          )}
        </TimeSlotsContainer>
      </ReservationContainer>
    </MainContainer>
  );
};

export default Reservation;
