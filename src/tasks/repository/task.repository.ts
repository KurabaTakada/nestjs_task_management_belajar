import { Repository, EntityRepository, QueryBuilder } from 'typeorm';
import { Task } from '../entity/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../resource/task-status.enum';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { GetTaskFilterDto } from '../dto/get-task-filter.dto';
import { User } from 'src/auth/entity/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(getTasksFilterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = getTasksFilterDto;
        const { id } = user;
        const query = this.createQueryBuilder('task');

        query.andWhere('task.userId = :userId', { userId: id });
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('task.title LIKE :search or task.description LIKE :search', { search: `%${search}%` });
        }

        const res = await query.getMany();
        return res;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task: Task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();

        delete task.user;
        return task;
    }

    async updateTaskStatus(task: Task, updateStatusDto: UpdateStatusDto) {
        const { status } = updateStatusDto;

        task.status = status;
        await task.save();

        return task;
    }
}
