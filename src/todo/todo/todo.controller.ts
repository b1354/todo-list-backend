import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all todo items' })
  async getTodo(): Promise<Record<string, any>> {
    return {
      statusCode: HttpStatus.OK,
      data: await this.todoService.getTodo(),
    }
  }

  @Get('/completed')
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all completed todo items' })
  async getCompleted(): Promise<Record<string, any>> {
    return {
      statusCode: HttpStatus.OK,
      data: await this.todoService.getCompletedTask()
    }
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: 'Todo item ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get a todo item by ID' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error' })
  async getTodoById(@Param('id') id: string): Promise<Record<string, any>> {
    try {
      const result = await this.todoService.getTodoById(id);
      return {
        statusCode: HttpStatus.OK,
        data: result
      }
    } catch (e) {
      console.log(e);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error"
      }
    }
  }

  @Post('mark-complete/:id')
  @ApiParam({ name: 'id', description: 'Todo item ID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Mark a todo item as complete' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error' })
  async updateTodo(@Param('id') id: string): Promise<Record<string, any>> {
    try {
      const result = await this.todoService.markComplete(id);
      return {
        statusCode: HttpStatus.CREATED,
        message: "data marked as complete"
      }
    } catch (e) {
      console.log(e);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error"
      }
    }
  }

  @Post()
  @ApiBody({description: 'Create a new todo item' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Create a new todo item' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid Input' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error' })
  async insertTodo(@Body() data: Todo): Promise<Record<string, any>> {
    try {
      const result = await this.todoService.insertTodo(data);
      return {
        statusCode: HttpStatus.CREATED,
        message: "data inserted successfully"
      }
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Invalid Input"
        }
      } else {
        console.log(e);
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Internal Server Error"
        }
      }
    }
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', description: 'Todo item ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Delete a todo item' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error' })
  async deleteTask(@Param('id') id: string): Promise<Record<string, any>> {
    try {
      const result = await this.todoService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        data: "data deleted successfully"
      }
    } catch (e) {
      console.log(e);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error"
      }
    }
  }
}