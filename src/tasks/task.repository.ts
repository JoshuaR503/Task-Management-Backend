import { EntityRepository, Repository } from "typeorm";
import CreateTaksDTO from "./dto/create-taks.dto";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";
import { Task } from "./task.entity";
import { TaskStatus } from "./tasks.status.enum";


@EntityRepository(Task)
export  class TaskRepository extends Repository<Task> {

    async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {

        const {status, search} = filterDTO;
        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', {status});
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}`})
        }

        return await query.getMany();
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

}