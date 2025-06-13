import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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

const TimeSlot = styled.button<{ isAvailable: boolean }>`
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${(props) => (props.isAvailable ? '#fff' : '#f8f9fa')};
  color: ${(props) => (props.isAvailable ? '#333' : '#999')};
  cursor: ${(props) => (props.isAvailable ? 'pointer' : 'not-allowed')};

  &:hover {
    background-color: ${(props) => (props.isAvailable ? '#007bff' : '#f8f9fa')};
    color: ${(props) => (props.isAvailable ? '#fff' : '#999')};
  }
`;

const Main: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 예시 시간대 데이터
  const timeSlots = [
    { time: '09:00', isAvailable: true },
    { time: '10:00', isAvailable: true },
    { time: '11:00', isAvailable: false },
    { time: '13:00', isAvailable: true },
    { time: '14:00', isAvailable: true },
    { time: '15:00', isAvailable: false },
    { time: '16:00', isAvailable: true },
  ];

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <MainContainer>
      <ReservationContainer>
        <CalendarContainer>
          <Calendar
            onChange={(value: any) => {
              if (value instanceof Date) {
                handleDateChange(value);
              }
            }}
            value={selectedDate}
            minDate={new Date()}
          />
        </CalendarContainer>
        <TimeSlotsContainer>
          <h2>예약 가능 시간</h2>
          <p>{selectedDate.toLocaleDateString()} 선택됨</p>
          {timeSlots.map((slot) => (
            <TimeSlot
              key={slot.time}
              isAvailable={slot.isAvailable}
              onClick={() => slot.isAvailable && handleTimeSelect(slot.time)}
            >
              {slot.time}
            </TimeSlot>
          ))}
          {selectedTime && <p>선택된 시간: {selectedTime}</p>}
        </TimeSlotsContainer>
      </ReservationContainer>
    </MainContainer>
  );
};

export default Main;
