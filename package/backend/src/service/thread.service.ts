//Create thread service
import { Repository, Sequelize } from "sequelize-typescript";
import { Thread } from "../db/models/thread.model";
import { ThreadCreateDTO } from "../dto/thread/Request/thread.create.dto";
import { IPaginated } from "../interfaces/IPaginated";
import Paginator from "../utils/paginator";
import { ResponseDTO } from "../dto/general/response.dto";
import { Tag } from "../db/models/tag.model";
//import sequelize from '../db/config/db.config'
import { Category } from "../db/models/category.model";
import { User } from "../db/models/user.model";
import { Reply } from "../db/models/reply.model";
import { ThreadError } from "../error/Thread.error";
import { TagError } from "../error/Tag.error";
import { ThreadUpdateDTO } from "../dto/thread/Request/thread.update.dto";
import { IUserRequest } from "../Types/IUserRequest";
import { Role } from "../db/models/role.model";
import { Includeable, Op, QueryTypes } from "sequelize";
import { IFilterOptions } from "../Types/IFilterOptions";
import { ThreadPaginatedDTO } from "../dto/thread/thread.paginated.dto";



export class ThreadService {

    private readonly threadRepo: Repository<Thread>;
    private readonly tagRepo: Repository<Tag>;
    private readonly categoryRepo: Repository<Category>;
    private readonly paginator: Paginator<Thread>;
    private readonly userRepo: Repository<User>;
    private readonly replyRepo: Repository<Reply>;
    private readonly roleRepo: Repository<Role>;
    private readonly sequelize: Sequelize;

    constructor(sequelize:Sequelize) {
        this.threadRepo = sequelize.getRepository(Thread);
        this.tagRepo = sequelize.getRepository(Tag);
        this.userRepo = sequelize.getRepository(User);
        this.categoryRepo = sequelize.getRepository(Category);
        this.replyRepo = sequelize.getRepository(Reply);
        this.roleRepo = sequelize.getRepository(Role);
        this.paginator = new Paginator(this.threadRepo);
        this.sequelize = sequelize;

    }

    public async createThread(thread: ThreadCreateDTO): Promise<Thread> {

        //Create thread transaction
        const transactionResult = await this.sequelize.transaction(async (t) => {

            //Check if tag exists
            const tagsarr = thread.tags.map(tag => tag)
            const tags = await this.tagRepo.findAll({ where: { name: tagsarr }, transaction: t });

            if (tags.length !== thread.tags.length) {
                throw new TagError("TAG_NOT_FOUND", "One or more tags passed not found. If you want to create a new tag, please use tag create endpoint.");
            }

            const newThread = await this.threadRepo.create({
                title: thread.title,
                content: thread.content,
                userId: thread.userId,
                categoryId: thread.categoryId,

            }, { include: [this.tagRepo], transaction: t });
            await newThread.$set('tags', tags, { transaction: t });

            await newThread.reload({ include: [this.tagRepo, this.userRepo, this.categoryRepo], transaction: t });
            return newThread

        })

        return transactionResult;
    }

    public async getThreadById(id: number): Promise<Thread> {
        const thread = await this.threadRepo.findOne({ where: { id }, include: [this.tagRepo, { model: this.userRepo, include: [this.roleRepo] }, this.replyRepo, this.categoryRepo] });
        if (!thread) {
            throw new ThreadError("THREAD_NOT_FOUND", "Thread not found.")
        }
        return thread;
    }


    public async findByQuery(query: string, page = 1, limit = 10): Promise<IPaginated<Thread>> {
        
        const q = `%${query}%`;
        //const threads = this.sequelize.query(`SELECT id,title,content,userId,categoryId,createdAt,updatedAt FROM Threads WHERE title LIKE ${sanitizedQuery} OR content LIKE ${sanitizedQuery}`, {replacements:[sanitizedQuery, sanitizedQuery], type: QueryTypes.SELECT });
       const threads = await this.paginator.paginate({ where: {[Op.or]:[{ title: { [Op.like]: q } },{content:{[Op.like]:q}}]}, include: [this.tagRepo, { model: this.userRepo, include: [this.roleRepo] }, this.categoryRepo] }, page, limit);
        return threads;
    }



    private setFilters(options: IFilterOptions): Includeable[] {
        const filterOpt = [];
        if (options.category) {
            filterOpt[0] = { model: this.categoryRepo, where: { name: options.category } };
        } else {
            filterOpt[0] = { model: this.categoryRepo };
        }

        if (options.author) {
            filterOpt[1] = { model: this.userRepo, where: { nickname: options.author }, include: [this.roleRepo] };
        } else {
            filterOpt[1] = { model: this.userRepo, include: [this.roleRepo] };
        }


        return filterOpt;
    }

    public async getThreadsByActivityAndFilters(page = 1, limit = 10, options?: IFilterOptions): Promise<IPaginated<Thread>> {

        const filterOpt = this.setFilters(options)
        let threads: IPaginated<Thread>;
        if (Object.keys(filterOpt).length > 0) {
            threads = await this.paginator.paginate({ order: [['updatedAt', 'DESC']], include: [this.tagRepo, ...filterOpt] }, page, limit);
        } else {
            threads = await this.paginator.paginate({ order: [['updatedAt', 'DESC']], include: [this.tagRepo, { model: this.userRepo, include: [this.roleRepo] }, this.categoryRepo] }, page, limit);
        }
        return threads
    }


    public async getThreadsByActivity(page = 1, limit = 10): Promise<IPaginated<Thread>> {
        const threads = await this.paginator.paginate({ order: [['updatedAt', 'DESC']], include: [this.tagRepo, this.userRepo, this.categoryRepo] }, page, limit);
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

    public async updateThread(id: number, thread: ThreadUpdateDTO, userId: number): Promise<ResponseDTO> {

        const transactionResult = await this.sequelize.transaction(async (t) => {

            const threadToUpdate = await this.threadRepo.findOne({ where: { id }, transaction: t });
            if (!threadToUpdate) {
                throw new ThreadError("THREAD_NOT_FOUND", "Thread not found.");
            }
            if (threadToUpdate.userId !== userId) {
                throw new ThreadError("THREAD_NOT_OWNER", "You are not the owner of this thread.");
            }

            const tags = await this.tagRepo.findAll({ where: { name: thread.tags.map(tag => tag) }, transaction: t });

            if (tags.length !== thread.tags.length) {
                throw new TagError("TAG_NOT_FOUND", "One or more tags passed not found. If you want to create a new tag, please use tag create endpoint.");
            }

            await threadToUpdate.update({
                title: thread.title,
                content: thread.content,
                categoryId: thread.categoryId,

            }, { transaction: t })

            await threadToUpdate.$set("tags", tags)

            return new ResponseDTO("Thread Updated.");
        })

        return transactionResult;

    }

    public async deleteThread(id: number, user: IUserRequest): Promise<ResponseDTO> {

        const transactionResult = await this.sequelize.transaction(async (t) => {
            const threadToDelete = await this.threadRepo.findOne({ where: { id }, transaction: t });
            if (!threadToDelete) {
                throw new ThreadError("THREAD_NOT_FOUND", "Thread not found.");
            }
            if (threadToDelete.userId !== user.sub || !user.scope.includes("admin")) {
                throw new ThreadError("THREAD_NOT_OWNER", "You are not the owner of this thread.");
            }

            await threadToDelete.destroy({ transaction: t });
            return new ResponseDTO("Thread Deleted.");
        })

        return transactionResult;
    }










}
