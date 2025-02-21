import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class TodoService {
    constructor(private prisma : PrismaService) {}

    async getTodo(): Promise<Todo[]>{
        return this.prisma.todo.findMany();
    }

    async getTodoById(id: string): Promise<Todo | null> { 
        return this.prisma.todo.findUnique({ where: { id } });
    }

    async getCompletedTask(): Promise<Todo[] | null> {
        return this.prisma.todo.findMany({ where: { isCompleted: true } });
    }

    async insertTodo(todo:Todo): Promise<Todo | null> {
        return this.prisma.todo.create({
            data: todo
        });
    }

    async markComplete(id: string): Promise<Todo | null> {
        return this.prisma.todo.update({
            where: { id },
            data: { isCompleted: true }
        })
    }

    async delete(id: string): Promise<Todo | null> {
        return this.prisma.todo.delete({
            where: { id }
        });
    }
}
