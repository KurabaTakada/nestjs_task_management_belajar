import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from '../resource/task-status.enum';
import { CreateTaskDto } from '../dto/create-task.dto';
import { User } from 'src/auth/entity/user.entity';

@Entity()
export class Task extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @Column()
    userId: number;

    @ManyToOne(type => User, user => user.tasks, { eager: false })
    user: User;
}
