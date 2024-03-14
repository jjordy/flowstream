import { User } from "kysely-codegen";
import { baseOperations } from "../base";
import { db } from "../";

import crypto from "crypto";

export const PUBLIC_FIELDS = [
  "id",
  "user_id",
  "email",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } = baseOperations<User>(
  "user",
  PUBLIC_FIELDS,
);

export const user = {
  findById: findById,
  findAll: async () => {
    const query = db.selectFrom("user").select(PUBLIC_FIELDS);

    return await query.executeTakeFirst();
  },
  create: createItem,
  update: updateItem,
  delete: deleteItem,
};
