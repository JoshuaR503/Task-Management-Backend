import { InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import CreateTaksDTO from "./dto/create-taks.dto";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";
import { Task } from "./task.entity";
import { TaskStatus } from "./tasks.status.enum";

@EntityRepository(Task)
export  class TaskRepository extends Repository<Task> {

    private logger = new Logger('Task Repository');

    async getTasks( filterDTO: GetTasksFilterDTO, user: User ): Promise<Task[]> {

        const { status, search } = filterDTO;
        const query = this.createQueryBuilder('task');
        
        query.where('task.userId = :userId', {userId: user.id});

        if (status) {
            query.andWhere('task.status = :status', {status});
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
        }

        try {
            return await query.getMany();
        } catch (error) {

            this.logger.error(`Failed to get tasks:`, error.stack);
            
            throw new InternalServerErrorException();
        }

    }

    async createTask( createTaskDTO: CreateTaksDTO,  user: User ): Promise<Task> {

        const { title, description } = createTaskDTO;
        const task = new Task();

        task.title = title,
        task.description = description,
        task.status = TaskStatus.OPEN,
        task.user = user;

        try {
            await task.save();
        } catch (error) {

            this.logger.error(`Failed to create task:`, error.stack);

            throw new InternalServerErrorException();
        }

        delete task.user;
        
        return task;
    }

}