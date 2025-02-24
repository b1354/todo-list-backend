import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { TodoService } from './todo.service';

import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { TodoDto } from './todo.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { TodoResponse } from './todo.response';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @ApiQuery({name: "filter",required: false})
  @ApiOkResponse({ type: TodoResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })

  @Get()
  async getTodo(@Query('filter') filter?: string): Promise<TodoResponse> {
    try {
      if (filter == 'completed') {
        return {
          statusCode: HttpStatus.OK,
          message: "success",
          data: await this.todoService.getCompletedTask()
        }
      }
      return {
        statusCode: HttpStatus.OK,
        message: "success",
        data: await this.todoService.getTodo(),
      }
    } catch (e) {
      console.log(e);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error"
      }
    }
  }


  @ApiOkResponse({ type: TodoResponse })
  @ApiInternalServerErrorResponse({ description: "internal server error" })

  @Get('/:id')
  async getTodoById(@Param('id') id: string): Promise<TodoResponse> {
    try {
      const result = await this.todoService.getTodoById(id);
      return {
        statusCode: HttpStatus.OK,
        message: "success",
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
  async updateTodo(@Param('id') id: string): Promise<TodoResponse> {
    try {
      const result = await this.todoService.markComplete(id);
      const todo = await this.todoService.getTodoById(id);
      return {
        statusCode: HttpStatus.CREATED,
        message: "data marked as complete",
        data: todo
      }
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "data not found"
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

  @ApiCreatedResponse({ description: 'Data inserted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input' })

  @Post()
  async insertTodo(@Body() data: TodoDto): Promise<TodoResponse> {
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

  
  @ApiOkResponse({ description: 'Data deleted successfully' })
  @ApiNotFoundResponse({ description: 'Data not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<TodoResponse> {
    try {
      const result = await this.todoService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: "data deleted successfully"
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