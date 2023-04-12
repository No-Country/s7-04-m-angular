import { Controller, Route, Tags, Response, Body,Get,Post, Put,Path, Delete, Security, Query, Request } from "tsoa";
import sequelize from '../db/config/db.config'
import { ThreadService } from "../service/thread.service";
import { IPaginated } from "../interfaces/IPaginated";
import { Thread } from "../db/models/thread.model";
import { ThreadDTO } from "../dto/thread/thread.dto";
import { ThreadCreateDTO } from "../dto/thread/Request/thread.create.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { ThreadPaginatedDTO } from "../dto/thread/thread.paginated.dto";
import { HttpStatus } from "../utils/enum/http.status";
import { Request as ExpressRequest } from 'express';


@Route("/api/v1/thread")
@Tags("Thread")
export class ThreadController extends Controller {

    private threadService: ThreadService;

    constructor() {
        super();
        this.threadService = new ThreadService();
        
    }


    @Get()
    @Response("200", "Success")
    public async getAll(@Query() page?: number, @Query() limit?: number ): Promise<ThreadPaginatedDTO> {
        const threads = await this.threadService.getThreadsByActivity(page,limit);
        const threadsDto = plainToInstance(ThreadPaginatedDTO, threads, { excludeExtraneousValues: true });
        return threadsDto;
    }

    @Post()
    @Response("200", "Success")
    @Security("jwt")
    public async create(@Body() body, @Request() req:ExpressRequest): Promise<ThreadDTO> {
        const thread = plainToInstance(ThreadCreateDTO, body, { excludeExtraneousValues: true });
       
        
        //Validate body
        await validateOrReject(thread,{ validationError: { target: false } })
        thread.userId = req.user.sub;
        /*TODO: Recibir del front el id del usuario o asignarlo desde el token?
         Validar que sea el mismo user que el token?*/

        const threadCreated = await this.threadService.createThread(thread);
        const threadDto = plainToInstance(ThreadDTO, threadCreated, { excludeExtraneousValues: true });
        this.setStatus(HttpStatus.CREATED);
        return threadDto;
    }

    





}