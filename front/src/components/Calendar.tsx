import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import styled from 'styled-components';
import { fetchWithAuth } from '../util/auth';
import { getUser } from '../util/auth';
import 'react-calendar/dist/Calendar.css';

const CalendarContainer = styled.div`
  .react-calendar {
    width: 100%;
    border: none;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-family: 'Pretendard', sans-serif;
  }

  .react-calendar__tile {
    min-width: 36px;
    min-height: 36px;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 8px;
    transition: all 0.2s ease;
    position: relative;
    font-size: 14px;
    text-align: center;
    word-break: keep-all;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #f0f0f0;
    }

    &:enabled:hover,
    &:enabled:focus {
      background-color: #e6e6e6;
    }

    abbr {
      text-decoration: none;
      font-size: 14px;
      min-width: 2.5em;
      white-space: nowrap;
      display: inline-block;
    }
  }

  .react-calendar__tile--active {
    background-color: #007bff !important;
    color: white;
  }

  .react-calendar__tile--now {
    background-color: #e6f3ff;
    color: #007bff;
  }

  .react-calendar__tile--hasReservation {
    color: #28a745;
    font-weight: bold;
  }

  .react-calendar__tile--hasBoard {
    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background-color: #007bff;
      border-radius: 50%;
    }
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #ccc;
  }

  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
    font-size: 16px;
    margin-top: 8px;
    padding: 8px;
    border-radius: 8px;

    &:enabled:hover,
    &:enabled:focus {
      background-color: #f0f0f0;
    }
  }

  .react-calendar__navigation__label {
    font-weight: bold;
    font-size: 14px;
  }

  /* 날짜 표시 커스텀 */
  .react-calendar__tile abbr {
    position: relative;
    display: inline-block;
    min-width: 2.5em;
    white-space: nowrap;
  }

  .react-calendar__tile abbr::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 1px;
    background: transparent;
  }

  /* 일요일 날짜만 빨간색 */
  .react-calendar__month-view__days__day--weekend:nth-child(7n + 1) {
    color: #dc3545;
  }
  /* 요일 헤더 일요일도 빨간색 */
  .react-calendar__month-view__weekdays__weekday:first-child {
    color: #dc3545;
  }
`;

interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

// 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
function formatDateToYMD(date: Date) {
  // 로컬 시간대 기준으로 날짜 문자열 생성
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 날짜 문자열에 하루를 더하는 함수
function addOneDay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);
  return formatDateToYMD(date);
}

const CalendarComponent: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reservedDates, setReservedDates] = useState<string[]>([]);
  const [boardDates, setBoardDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8000/reservations');
        if (response.ok) {
          const data = await response.json();
          const currentUser = getUser();
          const dates = data
            .filter(
              (reservation: any) =>
                !reservation.isCanceled && reservation.userId === currentUser?.userId
            )
            .map((reservation: any) => reservation.date.slice(0, 10));
          setReservedDates(dates);
        }
      } catch (error) {
        console.error('예약 날짜를 불러오는데 실패했습니다:', error);
      }
    };

    const fetchBoardDates = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8000/boards');
        if (response.ok) {
          const data = await response.json();
          // 날짜 문자열을 가져와서 하루를 더해 시간대 문제 해결
          const dates = data.map((board: any) => {
            const dateStr = board.date.slice(0, 10);
            // 하루를 더해 시간대 문제 해결
            return addOneDay(dateStr);
          });
          console.log('게시글 날짜:', dates);
          setBoardDates(dates);
        }
      } catch (error) {
        console.error('게시판 날짜를 불러오는데 실패했습니다:', error);
      }
    };

    fetchReservedDates();
    fetchBoardDates();
  }, []);

  const handleDateChange = (value: Date | Date[]) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      onDateSelect(value);
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    // 달력의 날짜를 로컬 시간대 기준으로 변환
    const dateStr = formatDateToYMD(date);
    
    const hasReservation = reservedDates.includes(dateStr);
    const hasBoard = boardDates.includes(dateStr);

    return [
      hasReservation ? 'react-calendar__tile--hasReservation' : '',
      hasBoard ? 'react-calendar__tile--hasBoard' : '',
    ].join(' ');
  };

  return (
    <CalendarContainer>
      <Calendar onChange={handleDateChange} value={selectedDate} tileClassName={tileClassName} />
    </CalendarContainer>
  );
};

export default CalendarComponent;
