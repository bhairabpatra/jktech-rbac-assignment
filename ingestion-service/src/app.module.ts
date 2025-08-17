import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MockIngestionModule } from './mock-Ingestion/mockingestion.module';

@Module({
  imports: [MockIngestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
