//Create thread service
import { Repository, Sequelize } from "sequelize-typescript";
import { Thread } from "../db/models/thread.model";
import { ThreadCreateDTO } from "../dto/thread/Request/thread.create.dto";
import { IPaginated } from "../interfaces/IPaginated";
import Paginator from "../utils/paginator";
import { ResponseDTO } from "../dto/general/response.dto";
import { Tag } from "../db/models/tag.model";
import sequelize from '../db/config/db.config'
import { Category } from "../db/models/category.model";


export class ThreadService {

    private readonly threadRepo: Repository<Thread>;
    private readonly tagRepo: Repository<Tag>;
    private readonly categoryRepo: Repository<Category>;
    private readonly paginator: Paginator<Thread>;

    constructor() {
        this.threadRepo = sequelize.getRepository(Thread);
        this.tagRepo = sequelize.getRepository(Tag);
        this.categoryRepo = sequelize.getRepository(Category);
        this.paginator = new Paginator(this.threadRepo);
       
    }

    public async createThread(thread: ThreadCreateDTO): Promise<Thread> {

        //Check if tag exists
        const tags = await this.tagRepo.findAll({ where: { name: thread.tags.map(tag => tag) } });
     


        const newThread = await this.threadRepo.create({
            title: thread.title,
            content: thread.content,
            userId: thread.userId,
            categoryId: thread.categoryId,
        });

        await newThread.$set('tags', tags);

        return newThread;
    }


    public async getThreadsByActivity(page = 1, limit = 10): Promise<IPaginated<Thread>> {
        const threads = await this.paginator.paginate({ order: [['updatedAt', 'DESC']], include:[this.tagRepo]}, page, limit);
        return threads;
    }

    public async getThreadByCategory(categoryId: number, page = 1, limit = 10): Promise<IPaginated<Thread>> {
        const threads = await this.paginator.paginate({ where: { categoryId } }, page, limit);
        return threads;
    }

    public async getThreadsByTags(tags: string[], page = 1, limit = 10): Promise<IPaginated<Thread>> {
        const threads = await this.paginator.paginate({ where: { tags } }, page, limit);
        return threads;
    }

    public async getThreadById(id: number): Promise<Thread> {
        const thread = await this.threadRepo.findOne({ where: { id } });
        return thread;
    }

 /*   public async updateThread(id: number, thread: ThreadCreateDTO): Promise<ResponseDTO> {
        await this.threadRepo.update(thread, { where: { id } });
        return new ResponseDTO("Thread Updated.");
    }*/

    public async deleteThread(id: number): Promise<ResponseDTO> {
        await this.threadRepo.destroy({ where: { id } });
        return new ResponseDTO("Thread Deleted.");
    }










}
