import { PipeTransform, BadRequestException } from '@nestjs/common';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { TaskStatus } from '../resource/task-status.enum';
import { ErrorMessages } from '../resource/string.resource';

export class StatusValidationPipe implements PipeTransform {

    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: UpdateStatusDto) {
        const { status } = value;
        if (!this.isStatusvalid(status)) {
            throw new BadRequestException(ErrorMessages.STATUS_NOT_IDENTIFIED);
        }

        return value;
    }

    isStatusvalid(status: TaskStatus) {
        return this.allowedStatus.includes(status);
    }

}
