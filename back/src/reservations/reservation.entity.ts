import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Unique(['date', 'time', 'isCancelled'])
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  time: string;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isCancelled: boolean;

  @Column({ nullable: true })
  cancelledAt: Date;
}
