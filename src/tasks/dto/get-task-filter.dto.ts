import { IsOptional, IsIn } from 'class-validator';
import { TaskStatus } from '../resource/task-status.enum';

export class GetTaskFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.OPEN])
    status: TaskStatus;

    @IsOptional()
    search: string;
}
