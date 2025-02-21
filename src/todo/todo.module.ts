import { Module } from '@nestjs/common';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, PrismaService]
})
export class TodoModule {}
