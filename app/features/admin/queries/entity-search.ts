import { db } from "db";
import { InferResult, sql } from "kysely";

export const entityQuery = (query?: string) =>
  db
    .selectFrom("flow")

    .select([
      "flow_id as entity_id",
      "title",
      "description",
      "created_at",
      "updated_at",
    ])
    .orderBy("updated_at", "desc")
    .unionAll(
      db
        .selectFrom("page")
        .select([
          "page_id as entity_id",
          "title",
          "description",
          "created_at",
          "updated_at",
        ])
        .$if(!!query, (qb) =>
          qb.where(sql`LOWER(title)`, "like", `%${query?.toLowerCase()}%`),
        ),
    )
    .unionAll(
      db
        .selectFrom("question")
        .select([
          "question_id as entity_id",
          "title",
          "description",
          "created_at",
          "updated_at",
        ])
        .$if(!!query, (qb) =>
          qb.where(sql`LOWER(title)`, "like", `%${query?.toLowerCase()}%`),
        ),
    )
    .$if(!!query, (qb) =>
      qb.where(sql`LOWER(title)`, "like", `%${query?.toLowerCase()}%`),
    );

export type EntityQuery = InferResult<ReturnType<typeof entityQuery>>;
