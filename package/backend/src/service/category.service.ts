import { Repository, Sequelize } from "sequelize-typescript";
import { Category } from "../db/models/category.model"
import { CategoryError } from "../error/Category.error";
import { CategoryCreateDTO } from "../dto/category/Request/category.create.dto"
import { ResponseDTO } from "../dto/general/response.dto";

export class CategoryService {

    private readonly repo: Repository<Category>;
    private readonly sequelize: Sequelize;

    constructor(sequelize: Sequelize) {
        this.repo = sequelize.getRepository(Category);
        this.sequelize = sequelize;
    }

    public async getAll(): Promise<Category[]> {
        const categories = await this.repo.findAll();
        if (categories.length == 0) {
            throw new CategoryError("NO_CATEGORIES_FOUND", "There are no categories");
        }
        return categories;
    }

    public async getById(id: number): Promise<Category> {
        const existsCategory = await this.repo.findOne({ where: { id } });
        if (!existsCategory) {
            throw new CategoryError("CATEGORY_NOT_FOUND", "Category not found");
        }
        return existsCategory;
    }

    public async create(category: CategoryCreateDTO): Promise<Category> {
        const transactionResult = await this.sequelize.transaction(async (t) => {

            const [newCategory, created] = await this.repo.findOrCreate({
                where: {
                    name: category.name
                },
                defaults: {
                    name: category.name

                },
                transaction: t

            });

            if (!created) {
                throw new CategoryError("CATEGORY_ALREADY_EXISTS", "Category already exists");
            }

            return newCategory;
        });
        return transactionResult;
    }


    public async update(id: number, category: CategoryCreateDTO): Promise<ResponseDTO> {
        const transactionResult = await this.sequelize.transaction(async (t) => {
            try {
                const existsCategory = await this.repo.findOne({ where: { id }, transaction: t });
                if (!existsCategory) {
                    throw new CategoryError("CATEGORY_NOT_FOUND", "Category not found");
                }

                await this.repo.update(category, { where: { id }, transaction: t });

                return new ResponseDTO("Category Updated.");
            } catch (err: any) {
                if (err.name == "SequelizeUniqueConstraintError") {
                    throw new CategoryError("CATEGORY_ALREADY_EXISTS", `Category with name ${category.name} already exists`);
                }
                throw err;
            }
        });
        return transactionResult;

    }


    public async delete(id: number): Promise<ResponseDTO> {
        const transactionResult = await this.sequelize.transaction(async (t) => {
            const existsCategory = await this.repo.findOne({ where: { id }, transaction: t });
            if (!existsCategory) {
                throw new CategoryError("CATEGORY_NOT_FOUND", "Category not found");
            }
            await this.repo.destroy({ where: { id }, transaction: t });
            return new ResponseDTO("Category deleted");
        });
        return transactionResult;
    }





}