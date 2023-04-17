import { Repository, Sequelize } from "sequelize-typescript";
import { Reply } from "../db/models/reply.model";
import { CreateReplyDTO } from "../dto/reply/Request/create.reply.dto";
import { ResponseDTO } from "../dto/general/response.dto";
import { ReplyError } from "../error/Reply.error";
import Paginator from "../utils/paginator";
import { IPaginated } from "../interfaces/IPaginated";
import { IUserRequest } from "../Types/IUserRequest";
import { PermissionError } from "../error/Permission.error";
import { User } from "../db/models/user.model";

export class ReplyService {

    private readonly repo: Repository<Reply>;
    private readonly paginator: Paginator<Reply>;
    private readonly userRepo: Repository<User>;
    private readonly sequelize: Sequelize;


    constructor(sequelize: Sequelize) {
        this.repo = sequelize.getRepository(Reply);
        this.paginator = new Paginator(this.repo);
        this.userRepo = sequelize.getRepository(User);
        this.sequelize = sequelize;
    }



    public async getReply(id: number): Promise<Reply> {
        const reply = await this.repo.findOne({ where: { id } });
        if (!reply) {
            throw new ReplyError("REPLY_NOT_FOUND", "Reply not found");
        }
        return reply;
    }

    public async getRepliesByThreadId(threadId: number, page = 1, limit = 10): Promise<IPaginated<Reply>> {
        const replies = this.paginator.paginate({ where: { threadId }, attributes: ["id", "body", "threadId", "createdAt", "updatedAt"], include: [this.userRepo] }, page, limit)
        if ((await replies).totalRecords === 0) {
            throw new ReplyError("NO_REPLIES_FOUND", "This thread doesn't exist or has no replies yet");
        }
        return replies;
    }

    public async getRepliesByUser(userId: number, page = 1, limit = 10): Promise<IPaginated<Reply>> {
        const replies = this.paginator.paginate({ where: { userId }, attributes: ["id", "body", "threadId", "createdAt", "updatedAt"], include: [this.userRepo] }, page, limit)
        if ((await replies).totalRecords === 0) {
            throw new ReplyError("NO_REPLIES_FOUND", "This user doesn't exist or has no replies yet");
        }
        return replies;
    }

    public async createReply(reply: CreateReplyDTO, userId: number): Promise<Reply> {
        const transactionResult = await this.sequelize.transaction(async (t) => {
            const rep = { ...reply, userId: userId }
            const res = await this.repo.create(rep, { transaction: t });
            return res;
        });

        return transactionResult;
    }


    public async updateReply(id: number, reply: CreateReplyDTO, user: IUserRequest): Promise<Reply> {
        const transactionResult = await this.sequelize.transaction(async (t) => {
            const existsReply = await this.repo.findOne({ where: { id }, transaction: t });
            if (!existsReply) {
                throw new ReplyError("REPLY_NOT_FOUND", "Reply not found");
            }
            //Verify if user is the owner of the reply or is an admin
            if (user.sub !== existsReply.userId || !user.scope.includes("admin")) {
                throw new PermissionError("ONLY_OWNER_OR_ADMIN", "You don't have permission to update this reply");
            }
            const updated = await existsReply.update(reply, { where: { id }, transaction: t });
            return updated;
        });
        return transactionResult;

    }

    public async deleteReply(id: number, user: IUserRequest): Promise<ResponseDTO> {
        const transactionResult = await this.sequelize.transaction(async (t) => {
            const existsReply = await this.repo.findOne({ where: { id }, transaction: t });
            if (!existsReply) {
                throw new ReplyError("REPLY_NOT_FOUND", "Reply not found");
            }

            //Verify if user is the owner of the reply or is an admin
            if (user.sub !== existsReply.userId || !user.scope.includes("admin")) {
                throw new PermissionError("ONLY_OWNER_OR_ADMIN", "You don't have permission to delete this reply");
            }
            await this.repo.destroy({ where: { id }, transaction: t });
            return new ResponseDTO("Reply deleted");
        });
        return transactionResult;
    }




}