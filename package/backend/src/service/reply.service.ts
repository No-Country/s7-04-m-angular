import { Repository, Sequelize } from "sequelize-typescript";
import { Reply } from "../db/models/reply.model";
import { CreateReplyDTO } from "../dto/reply/Request/create.reply.dto";
import { ResponseDTO } from "../dto/general/response.dto";
import { ReplyError } from "../error/Reply.error";
import Paginator from "../utils/paginator";
import { IPaginated } from "../interfaces/IPaginated";

export class ReplyService {

    private readonly repo: Repository<Reply>;
    private readonly paginator: Paginator<Reply>;


    constructor(sequelize: Sequelize) {
        this.repo = sequelize.getRepository(Reply);
        this.paginator = new Paginator(this.repo);
    }



    public async getReply(id: number): Promise<Reply> {
        const reply = await this.repo.findOne({ where: { id } });
        if (!reply) {
            throw new ReplyError("REPLY_NOT_FOUND", "Reply not found");
        }
        return reply;
    }

    public async getRepliesByThreadId(threadId: number, page = 1, limit = 10): Promise<IPaginated<Reply>> {
        const replies = this.paginator.paginate({ where: { threadId } }, page, limit)
        if (!replies) {
            throw new ReplyError("NO_REPLIES_FOUND", "This thread has no replies");
        }
        return replies;
    }

    public async createReply(reply: CreateReplyDTO): Promise<Reply> {
        const res = await this.repo.create(reply);
        return res;
    }


    public async updateReply(id: number, reply: CreateReplyDTO): Promise<Reply> {
        const existsReply = await this.repo.findOne({ where: { id } });
        if (!existsReply) {
            throw new ReplyError("REPLY_NOT_FOUND", "Reply not found");
        }
        const updated = await existsReply.update(reply, { where: { id } });
        return updated;

    }

    public async deleteReply(id: number): Promise<ResponseDTO> {
        const existsReply = await this.repo.findOne({ where: { id } });
        if (!existsReply) {
            throw new ReplyError("REPLY_NOT_FOUND", "Reply not found");
        }
        await this.repo.destroy({ where: { id } });
        return new ResponseDTO("Reply deleted");
    }




}