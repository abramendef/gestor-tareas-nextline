import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Prisma v7 requiere que el cliente se construya con un objeto válido obligatoriamente
    super({
      log: ['error'], 
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
