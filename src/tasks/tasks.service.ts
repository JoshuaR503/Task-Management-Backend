import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import CreateTaksDTO from './dto/create-taks.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.status.enum';

@Injectable()
export class TasksService {

    constructor( @InjectRepository(TaskRepository) private taskRepository: TaskRepository) {}

    async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDTO, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id }});

        if (!found) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }

        return found;
    }

    async createTask(createTaskDTO: CreateTaksDTO, user: User): Promise<Task> {
        return await this.taskRepository.createTask(createTaskDTO, user);
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});

        if (result.affected === 0) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;
        
        return await task.save();
    }

}
