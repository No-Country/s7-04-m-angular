import { Model, ModelCtor} from 'sequelize-typescript';
import { FindOptions } from 'sequelize';
import to from 'await-to-js';

export default class Paginator<T extends Model>{
    private model: ModelCtor<T>;
    
    constructor(model: ModelCtor<T>){
        this.model = model;
    }

    public async paginate(options:FindOptions, currentPage:number, limitTo:number, optionsForCalculateTotal?:FindOptions){
        const offset = (currentPage - 1) * limitTo;

        const [errorTotal, resultsTotal] = await to(this.model.findAll<T>(optionsForCalculateTotal??options));

        if(errorTotal) throw errorTotal;

        const totalRecords = resultsTotal.length;

        const [error,results] = await to(this.model.findAll<T>({...options, offset, limit: limitTo}));

        if(error) throw error;

        const lastPage = totalRecords > 0 ? Math.ceil(totalRecords / limitTo) : 0;
        const hasMorePages = currentPage < lastPage;

        return {
            data:results,lastPage,totalRecords,currentPage,hasMorePages
        }
    }
}