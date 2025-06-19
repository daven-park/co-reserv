import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async getAllReservations(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { isCancelled: false },
      relations: ['user'], // 사용자 정보를 함께 가져옴
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  async getReservationsByDate(date: Date): Promise<Reservation[]> {
    // 날짜 범위 설정 (해당 날짜의 00:00:00부터 23:59:59까지)
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const reservations = await this.reservationRepository.find({
      where: {
        date: Between(startDate, endDate),
        isCancelled: false,
      },
      relations: ['user'], // 사용자 정보를 함께 가져옴
      order: { time: 'ASC' },
    });

    // 사용자 정보가 제대로 포함되어 있는지 확인
    console.log(
      '예약 정보와 사용자 정보:',
      reservations.map((r) => ({
        id: r.id,
        userId: r.userId,
        userName: r.user?.name,
      })),
    );

    return reservations;
  }

  async getReservationsByUser(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { userId, isCancelled: false },
      relations: ['user'], // 사용자 정보를 함께 가져옴
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  async createReservation(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { date, time, userId } = createReservationDto;

    // 동일한 날짜와 시간에 이미 예약이 있는지 확인
    const existingReservation = await this.reservationRepository.findOne({
      where: {
        date: new Date(date),
        time,
        isCancelled: false,
      },
    });

    if (existingReservation) {
      throw new ConflictException('이미 예약된 시간입니다.');
    }

    const reservation = this.reservationRepository.create({
      date: new Date(date),
      time,
      userId: Number(userId),
    });

    try {
      await this.reservationRepository.save(reservation);
      return reservation;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이미 예약된 시간입니다.');
      }
      throw error;
    }
  }

  async cancelReservation(id: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id, userId, isCancelled: false },
    });

    if (!reservation) {
      throw new NotFoundException('예약을 찾을 수 없거나 이미 취소되었습니다.');
    }

    reservation.isCancelled = true;
    reservation.cancelledAt = new Date();

    await this.reservationRepository.save(reservation);
    return reservation;
  }

  async getAvailableTimeSlots(date: Date): Promise<string[]> {
    // 예약 가능한 시간대 (9시부터 18시까지, 1시간 단위)
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
    ];

    // 해당 날짜의 예약된 시간대 조회
    const reservations = await this.getReservationsByDate(date);
    const reservedTimes = reservations.map((r) => r.time);

    // 예약 가능한 시간대만 필터링
    return allTimeSlots.filter((time) => !reservedTimes.includes(time));
  }

  async findAll() {
    return this.reservationRepository.find({
      relations: ['user'],
    });
  }
}
