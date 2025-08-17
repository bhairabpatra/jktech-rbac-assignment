/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
      {
        transport: Transport.TCP,
        options: {  host: '127.0.0.1', port: 3001 },
      },
    );
    await app.listen();
    
    console.log('Microservice is listening on port 3001');
  } catch (error) {
    console.error('Microservice failed to start', error);
  }
}
bootstrap();
