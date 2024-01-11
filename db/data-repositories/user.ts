import { User } from "kysely-codegen";
import { baseOperations } from "../base";
import { db } from "../";

export const PUBLIC_FIELDS = [
  "id",
  "user_id",
  "email",
  "account_type",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } = baseOperations<User>(
  "user",
  PUBLIC_FIELDS
);

export const user = {
  findById: findById,
  findBy: async (user: Partial<User>) => {
    let query = db.selectFrom("user").select(PUBLIC_FIELDS);
    if (user.email) {
      query = query.where("email", "=", user.email);
    }

    if (user.password) {
      query = query.where("password", "=", user.password);
    }

    return await query.executeTakeFirst();
  },
  create: createItem,
  update: updateItem,
  delete: deleteItem,
};
