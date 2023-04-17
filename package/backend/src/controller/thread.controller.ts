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
import { ThreadUpdateDTO } from "../dto/thread/Request/thread.update.dto";
import { ResponseDTO } from "../dto/general/response.dto";


@Route("/api/v1/threads")
@Tags("Thread")
export class ThreadController extends Controller {

    private threadService: ThreadService;

    constructor() {
        super();
        this.threadService = new ThreadService(sequelize);
        
    }


    @Get()
    @Response("200", "Success")
    @Response(HttpStatus.NOT_FOUND, "No threads found")
    public async getAll(@Query() page?: number, @Query() limit?: number, @Query() category?:string, @Query() author?:string, ): Promise<ThreadPaginatedDTO> {
        const threads = await this.threadService.getThreadsByActivityAndFilters(page,limit,{category,author});
        const threadsDto = plainToInstance(ThreadPaginatedDTO, threads, {enableImplicitConversion:true, excludeExtraneousValues: true});
        return threadsDto;
    }

    @Post()
    @Response(HttpStatus.CREATED, "Success")
    @Response(HttpStatus.BAD_REQUEST, "Validation Error")
    @Response(HttpStatus.UNPROCCESSABLE_ENTITY, "Validation Failed")
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


    @Get("/{id}")
    @Response(HttpStatus.OK, "Success")
    public async getOne(@Path() id: number): Promise<ThreadDTO> {
        const thread = await this.threadService.getThreadById(id);
        const threadDto = plainToInstance(ThreadDTO, thread, { excludeExtraneousValues: true });
        return threadDto;
    }


    @Put("/{id}")
    @Response(HttpStatus.OK, "Success")
    @Response(HttpStatus.FORBIDDEN, "Thread not owner error")
    @Response(HttpStatus.NOT_FOUND, "Thread not found error")
    @Security("jwt")
    public async update(@Path() id: number, @Body() body, @Request() req:ExpressRequest): Promise<ResponseDTO> {
        const thread = plainToInstance(ThreadUpdateDTO, body, { excludeExtraneousValues: true });
        //Validate body
        await validateOrReject(thread,{ validationError: { target: false } })
        const response = await this.threadService.updateThread(id, thread, req.user.sub);
        return response;
    }

    

    @Delete("/{id}")
    @Response(HttpStatus.OK, "Success")
    @Response(HttpStatus.FORBIDDEN, "Thread not owner error")
    @Security("jwt")
    public async delete(@Path() id: number, @Request() req:ExpressRequest): Promise<ResponseDTO> {
        const response = await this.threadService.deleteThread(id, req.user);
        return response;
    }




}