import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ReservationsModule } from './reservations/reservations.module';
import { User } from './users/user.entity';
import { Board } from './boards/board.entity';
import { Reservation } from './reservations/reservation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'coaching_reservation',
      entities: [User, Board, Reservation],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    BoardsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
