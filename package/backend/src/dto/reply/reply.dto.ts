import { Expose } from "class-transformer";

export class ReplyDTO {
  @Expose()
  id: number;
  @Expose()
  content: string;
  @Expose()
  userId: number;
  @Expose()
  threadId: number;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}