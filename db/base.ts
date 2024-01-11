import { Insertable, SelectExpression, Updateable } from "kysely";
import { db } from "./";
import { DB } from "kysely-codegen";

export const baseOperations = <Item>(
  tableName: keyof DB,
  PUBLIC_FIELDS: readonly SelectExpression<DB, keyof DB>[]
) => {
  return {
    findById: async (id: string) =>
      await db
        .selectFrom(tableName)
        .select(PUBLIC_FIELDS)
        .where(`${tableName}_id`, "=", id)
        .executeTakeFirst(),
    updateItem: async (id: number, updateWith: Updateable<Item>) =>
      await db
        .updateTable(tableName)
        .set(updateWith)
        .where("id", "=", id)
        .returning(PUBLIC_FIELDS)
        .executeTakeFirstOrThrow(),
    createItem: async (item: Insertable<Item>) =>
      await db
        .insertInto(tableName)
        .values(item)
        .returning(PUBLIC_FIELDS)
        .executeTakeFirstOrThrow(),
    deleteItem: async (id: number) =>
      await db.deleteFrom(tableName).where("id", "=", id).execute(),
  };
};
