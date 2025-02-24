import { ApiProperty } from "@nestjs/swagger";
import { TodoDto } from "./todo.dto"


export class TodoResponse {
    @ApiProperty({example: 200})
    statusCode: number;

    @ApiProperty({example: "success"})
    message: string;

    @ApiProperty({example: []})
    data?: TodoDto | TodoDto[] | null
}