import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Get()
  getAllReservations(@Query('date') date?: string): Promise<Reservation[]> {
    if (date) {
      return this.reservationsService.getReservationsByDate(new Date(date));
    }
    return this.reservationsService.getAllReservations();
  }

  @Get('/my')
  getMyReservations(@Request() req): Promise<Reservation[]> {
    console.log('내 예약 조회 - JWT 사용자 정보:', req.user);
    const userId = Number(req.user.sub);
    console.log('내 예약 조회 - 변환된 userId:', userId);

    if (isNaN(userId)) {
      throw new Error('유효하지 않은 사용자 ID입니다.');
    }

    return this.reservationsService.getReservationsByUser(userId);
  }

  @Get('/available')
  getAvailableTimeSlots(@Query('date') date: string): Promise<string[]> {
    return this.reservationsService.getAvailableTimeSlots(new Date(date));
  }

  @Post()
  createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req,
  ): Promise<Reservation> {
    console.log('백엔드 - JWT 사용자 정보:', req.user);
    console.log('백엔드 - JWT sub 값:', req.user.sub);
    console.log('백엔드 - 요청 데이터:', createReservationDto);

    // JWT의 sub 필드에서 사용자 ID 가져오기
    const userId = Number(req.user.sub);
    console.log('백엔드 - 변환된 userId:', userId);

    if (isNaN(userId)) {
      console.log('백엔드 - userId 변환 실패:', req.user.sub);
      throw new Error('유효하지 않은 사용자 ID입니다.');
    }
    createReservationDto.userId = userId;

    console.log('백엔드 - 최종 예약 데이터:', createReservationDto);

    return this.reservationsService.createReservation(createReservationDto);
  }

  @Delete('/:id')
  cancelReservation(
    @Param('id') id: number,
    @Request() req,
  ): Promise<Reservation> {
    console.log('예약 취소 - JWT 사용자 정보:', req.user);
    const userId = Number(req.user.sub);
    console.log('예약 취소 - 변환된 userId:', userId);

    if (isNaN(userId)) {
      throw new Error('유효하지 않은 사용자 ID입니다.');
    }

    return this.reservationsService.cancelReservation(id, userId);
  }
}
