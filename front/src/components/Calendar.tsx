import React, { useState } from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  margin-bottom: 20px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const MonthButton = styled.button`
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
`;

const MonthTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
`;

const WeekDayHeader = styled.div`
  text-align: center;
  font-weight: bold;
  padding: 5px;
  color: #666;
  background: #f8f9fa;
  border-radius: 4px;
`;

const DayCell = styled.div<{ isSelected?: boolean; isToday?: boolean; isCurrentMonth?: boolean }>`
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  background: ${(props) => {
    if (props.isSelected) return '#007bff';
    if (props.isToday) return '#e6f3ff';
    return 'transparent';
  }};
  color: ${(props) => {
    if (props.isSelected) return 'white';
    if (!props.isCurrentMonth) return '#ccc';
    return 'inherit';
  }};

  &:hover {
    background: ${(props) => (props.isSelected ? '#0056b3' : '#f0f0f0')};
  }
`;

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const prevMonthDays = Array.from(
      { length: firstDay.getDay() },
      (_, i) => new Date(year, month, 0 - i)
    ).reverse();

    const currentMonthDays = Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(year, month, i + 1)
    );

    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDays;

    const nextMonthDays = Array.from(
      { length: remainingDays },
      (_, i) => new Date(year, month + 1, i + 1)
    );

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthButton onClick={() => changeMonth(-1)}>이전</MonthButton>
        <MonthTitle>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </MonthTitle>
        <MonthButton onClick={() => changeMonth(1)}>다음</MonthButton>
      </CalendarHeader>
      <CalendarGrid>
        {weekDays.map((day) => (
          <WeekDayHeader key={day}>{day}</WeekDayHeader>
        ))}
        {days.map((date, index) => (
          <DayCell
            key={index}
            isSelected={isSelected(date)}
            isToday={isToday(date)}
            isCurrentMonth={isCurrentMonth(date)}
            onClick={() => onDateSelect(date)}
          >
            {isCurrentMonth(date) ? date.getDate() : ''}
          </DayCell>
        ))}
      </CalendarGrid>
    </CalendarContainer>
  );
}

export default Calendar;
