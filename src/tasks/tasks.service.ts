import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { ErrorMessages } from './resource/string.resource';
import { TaskRepository } from './repository/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { TaskStatus } from './resource/task-status.enum';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTasks(getTaskFilterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const res = this.taskRepository.getTasks(getTaskFilterDto, user);
        return res;
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const userId: number = user.id;
        const res = await this.taskRepository.findOne({ id, userId });

        if (!res) {
            throw new NotFoundException(ErrorMessages.TASK_NOT_FOUND);
        }

        return res;
    }

    async deleteTaskById(id: number, user: User): Promise<void> {
        const userId = user.id;
        const res = await this.taskRepository.delete({ id, userId });

        if (!res.affected) {
            throw new NotFoundException(ErrorMessages.TASK_NOT_FOUND);
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async updateStatus(id: number, updateStatusDto: UpdateStatusDto, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        return await this.taskRepository.updateTaskStatus(task, updateStatusDto);
    }
}
