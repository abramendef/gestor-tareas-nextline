import { Controller, Get, Post, Body, Put, Param, Delete, Headers, UnauthorizedException } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Valida la existencia del header de autorización requerido
  private getUserId(headers: Record<string, string>): string {
    const userId = headers['x-user-id'];
    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }
    return userId;
  }

  // Endpoints CRUD delegados al servicio con inyección del contexto de usuario

  @Post()
  create(@Headers() headers: Record<string, string>, @Body() createTaskDto: any) {
    const userId = this.getUserId(headers);
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll(@Headers() headers: Record<string, string>) {
    const userId = this.getUserId(headers);
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  findOne(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const userId = this.getUserId(headers);
    return this.tasksService.findOne(+id, userId);
  }

  @Put(':id')
  update(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() updateTaskDto: any) {
    const userId = this.getUserId(headers);
    return this.tasksService.update(+id, updateTaskDto, userId);
  }

  @Delete(':id')
  remove(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const userId = this.getUserId(headers);
    return this.tasksService.remove(+id, userId);
  }
}
