import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from './Calendar';
import ReservationList from './Reservation/ReservationList';
import Board from './Board/Board';

const MainContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

interface Reservation {
  id: number;
  date: Date;
  time: string;
  userId: string;
}

function Main() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  return (
    <MainContainer>
      <Title>코칭실 예약 시스템</Title>
      <ContentWrapper>
        <Section>
          <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
          <ReservationList reservations={reservations} selectedDate={selectedDate} />
        </Section>
        <Section>
          <Board selectedDate={selectedDate} />
        </Section>
      </ContentWrapper>
    </MainContainer>
  );
}

export default Main;
