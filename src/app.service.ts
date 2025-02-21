import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getUser(): object {
    return {
      code: 200,
      message: "succes" 
    };
  }
}
