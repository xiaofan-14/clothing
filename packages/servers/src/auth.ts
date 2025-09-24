import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// type UserPayload = Omit<Prisma<{}>, "id">;

export async function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({
    data,
  });
}

export async function getUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getUsers() {
  return prisma.user.findMany();
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
