import { Injectable } from '@nestjs/common';
import { PrismaClient, Users, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {

  constructor(private readonly prisma: PrismaClient) {
  }

  async create(users: Users): Promise<Users> {
    return this.prisma.users.create({ data: users });
  }

  async search(
    searchString: string,
    skip = 0,
    take = 10,
  ): Promise<[number, Users[]]> {
    const searchId = isNaN(Number(searchString))
      ? undefined
      : Number(searchString);

    const whereClause: Prisma.UsersWhereInput = {
      OR: [
        { id: searchId },
        { name: { contains: searchString } },
        { email: { contains: searchString } },
        { body: { contains: searchString } },
      ],
    };

    return this.prisma.$transaction([
      this.prisma.users.count(),
      this.prisma.users.findMany({
        where: whereClause,
        skip: skip,
        take: take,
      }),
    ]);
  }
}
