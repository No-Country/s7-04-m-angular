import { Controller, Route, Tags, Get, Put, Delete, Post, Path, Response, Body, Request, Security } from "tsoa";
import { Request as expressReq } from "express";
import { ReplyService } from "../service/reply.service";
import sequelize from "../db/config/db.config";
import { ReplyDTO } from "../dto/reply/reply.dto";
import { RepliesPaginatedDTO } from "../dto/reply/Response/replies.paginated.dto";
import { plainToInstance } from "class-transformer";
import { CreateReplyDTO } from "../dto/reply/Request/create.reply.dto";
import { validateOrReject } from "class-validator";
import { HttpStatus } from "../utils/enum/http.status";
import { IValidateErrorJSON } from "../interfaces/IValidateErrorJSON";
import { ResponseDTO } from "../dto/general/response.dto";
import { PermissionError } from "../error/Permission.error";


@Route("api/v1/replies")
@Tags("Reply")
export class ReplyController extends Controller {

    private readonly replyService: ReplyService;

    constructor() {
        super();
        this.replyService = new ReplyService(sequelize);
    }

    @Get("/by-thread/{threadId}")
    @Response<RepliesPaginatedDTO>(HttpStatus.OK, "Success")
    @Response(HttpStatus.NOT_FOUND, "This thread has no replies")
    public async getRepliesByThread(@Path() threadId: number) {
        const replies = await this.replyService.getRepliesByThreadId(threadId);
        const repliesDTO = plainToInstance(RepliesPaginatedDTO, replies, { excludeExtraneousValues: true });
        return repliesDTO;
    }


    @Get("/by-user/{userId}")
    @Response<RepliesPaginatedDTO>(HttpStatus.OK, "Success")
    @Response(HttpStatus.NOT_FOUND, "This user has no replies")
    public async getRepliesByUser(@Path() userId: number) {
        const replies = await this.replyService.getRepliesByUser(userId);
        const repliesDTO = plainToInstance(RepliesPaginatedDTO, replies, { excludeExtraneousValues: true });
        return repliesDTO;
    }


    @Post()
    @Security("jwt")
    @Response<ReplyDTO>(HttpStatus.CREATED, "Success")
    @Response(HttpStatus.BAD_REQUEST, "Validation Error")
    @Response<IValidateErrorJSON>(HttpStatus.UNPROCCESSABLE_ENTITY, "Validation Failed")
    public async createReply(@Body() body: CreateReplyDTO, @Request() req:expressReq) {
        const reply = plainToInstance(CreateReplyDTO, body, { excludeExtraneousValues: true });
        //Validate body
        
        await validateOrReject(reply, { validationError: { target: false } });
        const createdReply = await this.replyService.createReply(reply, req.user.sub);
        const response = plainToInstance(ReplyDTO, createdReply, { excludeExtraneousValues: true });
        this.setStatus(HttpStatus.CREATED)
        return response;
    }

    @Put("/{replyId}")
    @Security("jwt")
    @Response<ReplyDTO>(HttpStatus.OK, "Success")
    @Response(HttpStatus.NOT_FOUND, "Reply not found")
    @Response(HttpStatus.BAD_REQUEST, "Validation Error")
    @Response<PermissionError>(HttpStatus.FORBIDDEN)
    @Response<IValidateErrorJSON>(HttpStatus.UNPROCCESSABLE_ENTITY, "Validation Failed: some fields is not present")
    public async updateReply(@Path() replyId: number, @Body() body: CreateReplyDTO, @Request() req:expressReq) {

        
        const reply = plainToInstance(CreateReplyDTO, body, { excludeExtraneousValues: true });
        //Validate body
        await validateOrReject(reply, { validationError: { target: false } });
        const updatedReply = await this.replyService.updateReply(replyId, reply, req.user);
        const response = plainToInstance(ReplyDTO, updatedReply, { excludeExtraneousValues: true });
        return response;
    }

    @Delete("/{replyId}")
    @Security("jwt")
    @Response<ResponseDTO>(HttpStatus.OK, "Reply deleted")
    @Response<PermissionError>(HttpStatus.FORBIDDEN)
    @Response(HttpStatus.NOT_FOUND, "Reply not found")
    public async deleteReply(@Path() replyId: number, @Request() req:expressReq) {
        const response = await this.replyService.deleteReply(replyId, req.user);
        return response;
    }






}