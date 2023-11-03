import { Users } from '@prisma/client';

export interface IUserPagination {
  data: Users[];
  count: number;
}
