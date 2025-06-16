import styled from 'styled-components';

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

interface Reservation {
  id: number;
  date: Date;
  time: string;
  userId: string;
}

interface ReservationListProps {
  reservations: Reservation[];
  selectedDate: Date | null;
}

function ReservationList({ reservations, selectedDate }: ReservationListProps) {
  const selectedReservations = reservations.filter((reservation) => {
    if (!selectedDate) return false;
    return reservation.date.toDateString() === selectedDate.toDateString();
  });
  return (
    <ListContainer>
      <ListTitle>예약 현황</ListTitle>
      {selectedReservations.length === 0 ? (
        <div>선택된 날짜의 예약이 없습니다.</div>
      ) : (
        selectedReservations.map((reservation) => (
          <ReservationItem key={reservation.id}>
            <TimeSlot>
              {selectedDate?.toLocaleDateString()}
              {reservation.time}
            </TimeSlot>
            <UserInfo>{reservation.userId}</UserInfo>
          </ReservationItem>
        ))
      )}
    </ListContainer>
  );
}

export default ReservationList;
