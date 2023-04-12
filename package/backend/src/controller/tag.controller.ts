import { Body, Controller, Get, Route, Post, Tags, Response, Path, Delete,Put, Security} from "tsoa";
import { TagService } from "../service/tag.service";
import { TagCreateDTO } from "../dto/tag/tag.create.dto";
import sequelize from '../db/config/db.config'
import { TagDTO } from "../dto/tag/tag.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { IValidateErrorJSON } from "../interfaces/IValidateErrorJSON";
import { ResponseDTO } from "../dto/general/response.dto";




@Tags("Tag")
@Route("/api/v1/tags")
export class TagController extends Controller {

    private readonly tagService : TagService;

    constructor() {
        super();
        this.tagService = new TagService(sequelize);
    }

    @Get("/")
    public async getTags():Promise<TagDTO[]> {
        const tags = await this.tagService.getAllTags();
        const tagsDto = plainToInstance(TagDTO, tags, { excludeExtraneousValues: true });
        return tagsDto;
    }

    @Response<IValidateErrorJSON>(422, "Validation Failed")
    @Response(400,"Validation Failed")
    @Post("/")
    public async createTag(@Body() body: TagCreateDTO): Promise<TagDTO> {
        
        const tagCreate = plainToInstance(TagCreateDTO, body, { excludeExtraneousValues: true });
        //Validate body
        await validateOrReject(tagCreate)
        const tagCreated = await this.tagService.createTag(tagCreate);
        const tagDto = plainToInstance(TagDTO, tagCreated, { excludeExtraneousValues: true });
        
        return tagDto;
    }

    @Response<IValidateErrorJSON>(422, "Validation Failed")
    @Response(400,"Validation Failed")
    @Response(404, "Tag not found")
    @Put("/{id}")
    @Security("jwt", ["admin"])
    public async updateTag(@Path() id: number, @Body() body: TagCreateDTO): Promise<ResponseDTO> {
        const tag = plainToInstance(TagCreateDTO, body, { excludeExtraneousValues: true });
        //Validate body
        await validateOrReject(tag)
        const response = await this.tagService.updateTag(id, tag);
        return response;
    }






    @Delete("/{id}")
    @Response(404, "Tag not found")
    @Security("jwt", ["admin"])
    public async deleteTag(@Path() id: number): Promise<ResponseDTO> {
        const response = await this.tagService.deleteTag(id);
        return response;
    }



    




}