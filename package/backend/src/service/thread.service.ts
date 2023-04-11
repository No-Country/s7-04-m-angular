//Create thread service
import { Repository, Sequelize } from "sequelize-typescript";
import { Thread } from "../db/models/thread.model";

export class ThreadService {

    private readonly threadRepo: Repository<Thread>;

    constructor(sequelize:Sequelize){
        this.threadRepo = sequelize.getRepository(Thread);
    }

    public async createThread(thread:Thread):Promise<Thread>{
        return await this.threadRepo.create(thread);
    }





}
