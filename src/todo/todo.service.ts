import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodoDto } from './todo.dto';

@Injectable()
export class TodoService {
    constructor(private prisma : PrismaService) {}

    async getTodo(): Promise<TodoDto[]>{
        return this.prisma.todo.findMany();
    }

    async getTodoById(id: string): Promise<TodoDto | null> { 
        return this.prisma.todo.findUnique({ where: { id } });
    }

    async getCompletedTask(): Promise<TodoDto[] | null> {
        return this.prisma.todo.findMany({ where: { isCompleted: true } });
    }

    async insertTodo(todo:TodoDto): Promise<TodoDto | null> {
        return this.prisma.todo.create({
            data: todo
        });
    }

    async markComplete(id: string): Promise<TodoDto | null> {
        return this.prisma.todo.update({
            where: { id },
            data: { isCompleted: true }
        })
    }

    async delete(id: string): Promise<TodoDto | null> {
        return this.prisma.todo.delete({
            where: { id }
        });
    }
}
