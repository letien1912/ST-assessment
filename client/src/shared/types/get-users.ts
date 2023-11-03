export type GetUsers = {
  skip: number;
  search: string;
  take: number;
};

export type IUsers = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

export type UsersResponse = {
  data: IUsers[];
  count: number;
};
