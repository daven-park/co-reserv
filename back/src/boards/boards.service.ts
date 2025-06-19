import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({ where: { id } });
    
    if (!found) {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
    
    return found;
  }

  async getBoardsByDate(date: Date): Promise<Board[]> {
    try {
      // 날짜 유효성 검사
      if (isNaN(date.getTime())) {
        throw new Error('유효하지 않은 날짜 형식입니다.');
      }

      // 날짜 범위 설정 (해당 날짜의 00:00:00부터 23:59:59까지)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      return this.boardRepository.find({
        where: {
          date: Between(startDate, endDate),
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw new Error('날짜 기반 게시글 조회 중 오류가 발생했습니다: ' + error.message);
    }
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    try {
      const { title, content, author, date } = createBoardDto;
      
      // 날짜 유효성 검사
      const boardDate = new Date(date);
      if (isNaN(boardDate.getTime())) {
        throw new Error('유효하지 않은 날짜 형식입니다.');
      }
      
      const board = this.boardRepository.create({
        title,
        content,
        author,
        date: boardDate,
      });
      
      await this.boardRepository.save(board);
      return board;
    } catch (error) {
      if (error.message.includes('날짜')) {
        throw error;
      }
      throw new Error('게시글 생성 중 오류가 발생했습니다: ' + error.message);
    }
  }

  async updateBoard(id: number, title: string, content: string): Promise<Board> {
    const board = await this.getBoardById(id);
    
    board.title = title;
    board.content = content;
    
    await this.boardRepository.save(board);
    return board;
  }

  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
  }
}