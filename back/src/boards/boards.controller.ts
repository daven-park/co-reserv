import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  getAllBoards(@Query('date') date?: string): Promise<Board[]> {
    if (date) {
      return this.boardsService.getBoardsByDate(new Date(date));
    }
    return this.boardsService.getAllBoards();
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Post()
  createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto);
  }

  @Patch('/:id')
  updateBoard(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<Board> {
    return this.boardsService.updateBoard(id, title, content);
  }

  @Delete('/:id')
  deleteBoard(@Param('id') id: number): Promise<void> {
    return this.boardsService.deleteBoard(id);
  }
}