import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("box_tariffs_daily", (table) => {
    table.date("request_date").notNullable();
    table.date("dt_next_box").nullable();
    table.date("dt_till_max").nullable();

    table.text("geo_name").notNullable();
    table.text("warehouse_name").notNullable();

    table.decimal("box_delivery_base", 10, 2);
    table.decimal("box_delivery_coef_expr", 10, 4);
    table.decimal("box_delivery_liter", 10, 2);

    table.decimal("box_storage_base", 10, 2);
    table.decimal("box_storage_coef_expr", 10, 4);
    table.decimal("box_storage_liter", 10, 2);

    table.primary(["request_date", "geo_name", "warehouse_name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("box_tariffs_daily");
}