//import sequelize from '../db/config/db.config';
import { Tag } from '../db/models/tag.model';
import { TagDTO } from '../dto/tag/tag.dto';
import { TagCreateDTO } from '../dto/tag/tag.create.dto';
import { Repository, Sequelize } from 'sequelize-typescript';
import { TagError } from '../error/Tag.error';
import { ResponseDTO } from '../dto/general/response.dto';

export class TagService {
    private tagRepo: Repository<Tag>;

    constructor(sequelize: Sequelize) {
        this.tagRepo = sequelize.getRepository(Tag);
    }

    public async getAllTags(): Promise<Tag[]> {
        const tags = await this.tagRepo.findAll();
        if (tags.length == 0) {
            throw new TagError("NO_TAGS_FOUND", "There are no tags");
        }
        return tags;
    }

    public async getTagByID(id: number): Promise<Tag> {
        const existsTag = await this.tagRepo.findOne({ where: { id } });
        if (!existsTag) {
            throw new TagError("TAG_NOT_FOUND", "Tag not found");
        }
        return existsTag;
    }

    public async getTagByName(name: string): Promise<Tag> {
        const existsTag = await this.tagRepo.findOne({ where: { name } });
        if (!existsTag) {
            throw new TagError("TAG_NOT_FOUND", "Tag not found");
        }
        return existsTag;
    }


    public async createTag(tag: TagCreateDTO): Promise<Tag> {

        //Validate tag
        if (tag.name.split(' ').length > 1) {
            throw new TagError("TAG_NAME_ERROR", "Tag name cannot contain spaces");
        }
        const existsTag = await this.tagRepo.findOne({ where: { name: tag.name } });
        if (existsTag) {
            throw new TagError("TAG_ALREADY_EXISTS", "Tag already exists");
        }
        const newTag = await this.tagRepo.create(tag);
        return newTag;
    }

    public async updateTag(id: number, tag: TagCreateDTO): Promise<ResponseDTO> {

        if (tag.name.split(' ').length > 1) {
            throw new TagError("TAG_NAME_ERROR", "Tag name cannot contain spaces");
        }

        const existsTag = await this.tagRepo.findOne({ where: { id } });
        if (!existsTag) {
            throw new TagError("TAG_NOT_FOUND", "Tag not found");
        }


        await this.tagRepo.update(tag, { where: { id } });
        return new ResponseDTO("Tag Updated.");
    }

    public async deleteTag(id: number): Promise<ResponseDTO> {
        const existsTag = await this.tagRepo.findOne({ where: { id } });
        if (!existsTag) {
            throw new TagError("TAG_NOT_FOUND", "Tag not found");
        }
        await this.tagRepo.destroy({ where: { id } });
        return new ResponseDTO("Tag Deleted.");
    }

}


