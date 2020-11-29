import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import CreateTaksDTO from './dto/create-taks.dto';

@Injectable()
export class TasksService {

    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find((task) => task.id = id);
    }

    createTask(createTaskDTO: CreateTaksDTO): Task {
        const { title, description } = createTaskDTO;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task);

        return task;
    }

    updateTask(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;

        return task;
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

}
