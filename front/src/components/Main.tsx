import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from './Calendar';
import ReservationList from './Reservation/ReservationList';
import Board from './Board/Board';

const MainContainer = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-areas: 'calendar board reservation';
  gap: 20px;
  min-height: calc(100vh - 100px);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'calendar reservation'
      'board board';
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'calendar'
      'reservation'
      'board';
  }
`;

const Section = styled.div<{ area?: string }>`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  grid-area: ${props => props.area};
  min-height: 300px;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const CalendarSection = styled(Section)`
  min-width: 350px;
`;

const BoardSection = styled(Section)`
  min-width: 400px;
`;

const ReservationSection = styled(Section)`
  min-width: 300px;
`;

function Main() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <MainContainer>
      <Title>코칭실 예약 시스템</Title>
      <ContentWrapper>
        <CalendarSection area="calendar">
          <Calendar onDateSelect={handleDateSelect} />
        </CalendarSection>

        <BoardSection area="board">
          <Board selectedDate={selectedDate} />
        </BoardSection>

        <ReservationSection area="reservation">
          <ReservationList selectedDate={selectedDate} />
        </ReservationSection>
      </ContentWrapper>
    </MainContainer>
  );
}

export default Main;
