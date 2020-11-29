import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateTaksDTO from './dto/create-taks.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.status.enum';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTasksWithFilter(data: GetTasksFilterDTO ): Task[] {
    //     const { status, search } = data;

    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     } 

    //     if (search) {
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) || 
    //             task.description.includes(search) 
    //         );
    //     }
        
    //     return tasks;
    // }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }

        return found;
    }

    async createTask(createTaskDTO: CreateTaksDTO): Promise<Task> {
        const { title, description } = createTaskDTO;
        const task = new Task();

        task.title = title,
        task.description = description,
        task.status = TaskStatus.OPEN,

        await task.save();
        return task;
    }

    // updateTask(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;

    //     return task;
    // }

    // deleteTask(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter((task) => task.id !== found.id);
    // }

}
