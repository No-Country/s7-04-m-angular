import { Controller, Route, Tags, Response, Body,Get,Post, Put,Path, Delete, Security } from "tsoa";
import { CategoryService } from "../service/category.service";
import sequelize from '../db/config/db.config'
import { CategoryCreateDTO } from "../dto/category/Request/category.create.dto";
import { CategoryDTO } from "../dto/category/category.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { ResponseDTO } from "../dto/general/response.dto";



@Tags("Category")
@Route("/api/v1/category")
export class CategoryController extends Controller {

    private readonly service : CategoryService;

    constructor() {
        super();
        this.service = new CategoryService(sequelize);
    }

    @Get("/")
    @Response("404","There are no categories")
    public async getAll(): Promise<CategoryDTO[]> {
        const categories = await this.service.getAll();
        const dtos = plainToInstance(CategoryDTO, categories, { excludeExtraneousValues: true });
        return dtos;
    }

    @Post("/")
    @Response("409","The category already exists")
    @Security("jwt", ["admin"])
    public async create(@Body() body: CategoryCreateDTO): Promise<CategoryDTO> {
        const category = plainToInstance(CategoryCreateDTO, body, { excludeExtraneousValues: true });
        //Validate body
        await validateOrReject(category)
        const categoryCreated = await this.service.create(category);
        const categoryDto = plainToInstance(CategoryDTO, categoryCreated, { excludeExtraneousValues: true });
        return categoryDto;
    }

    @Put("/{id}")
    @Response("404","The category does not exist")
    @Security("jwt", ["admin"])
    public async update(@Path() id: number, @Body() body: CategoryCreateDTO): Promise<ResponseDTO> {
        const category = plainToInstance(CategoryCreateDTO, body, { excludeExtraneousValues: true });
        //Validate body
        await validateOrReject(category)
        const categoryUpdated = await this.service.update(id, category);
        return categoryUpdated;
    }


    @Delete("/{id}")
    @Response("404","The category does not exist")
    @Security("jwt", ["admin"])
    public async delete(@Path() id: number): Promise<ResponseDTO> {
        const res = await this.service.delete(id);
        return res;
    }

}