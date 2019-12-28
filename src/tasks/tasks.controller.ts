import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { StatusValidationPipe } from './pipe/status-validation.pipe';
import { Task } from './entity/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/entity/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) getTaskFilterDto: GetTaskFilterDto,
        @GetUser() user: User,
        ): Promise<Task[]> {
        return this.taskService.getTasks(getTaskFilterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.taskService.deleteTaskById(id, user);
    }

    @Patch(':id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body(StatusValidationPipe) updateStatusDto: UpdateStatusDto,
        @GetUser() user: User) {
        return this.taskService.updateStatus(id, updateStatusDto, user);
    }
}
