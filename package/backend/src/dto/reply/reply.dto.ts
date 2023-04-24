import { Expose,Type} from "class-transformer";
import { UserSimpleDTO } from "../user/user.simple.dto";

export class ReplyDTO {
  @Expose()
  id: number;
  @Expose()
  body: string;
  @Expose()
  userId?: number;
  @Type(() => UserSimpleDTO)
  @Expose()
  user: UserSimpleDTO;
  @Expose()
  threadId: number;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}