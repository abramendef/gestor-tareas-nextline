import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // Retorna todas las tareas filtradas por el ID del usuario activo
  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        completed: true,
        dueDate: true,
      },
    });
  }

  // Comprueba si la tarea existe y que el usuario actual tenga permisos sobre ella
  async findOne(id: number, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }

    return task;
  }

  async create(data: Omit<Prisma.TaskCreateInput, 'userId'>, userId: string) {
    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  // Actualiza mutando sólo los campos provistos; requiere validación de acceso previa
  async update(id: number, data: Prisma.TaskUpdateInput, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
