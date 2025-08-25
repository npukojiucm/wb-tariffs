import knex from 'knex';
import config from '#config/knex/knexfile.js';
import type { WBTariffsResponse } from '#types/types.js';
import { parseDate, parseNumber } from '#utils/utils.js';

const db = knex(config);

export async function upsertTariffs(date: string, tariffs: WBTariffsResponse) {
  const { data } = tariffs.response;

  const dt_next_box = parseDate(data.dtNextBox);
  const dt_till_max = parseDate(data.dtTillMax);


  for (const t of data.warehouseList) {
    await db('box_tariffs_daily')
      .insert({
        request_date: date,
        dt_next_box,
        dt_till_max,
        geo_name: t.geoName,
        warehouse_name: t.warehouseName,
        box_delivery_base: parseNumber(t.boxDeliveryBase),
        box_delivery_coef_expr: parseNumber(t.boxDeliveryCoefExpr),
        box_delivery_liter: parseNumber(t.boxDeliveryLiter),
        box_storage_base: parseNumber(t.boxStorageBase),
        box_storage_coef_expr: parseNumber(t.boxStorageCoefExpr),
        box_storage_liter: parseNumber(t.boxStorageLiter),
      })
      .onConflict(['request_date', 'geo_name', 'warehouse_name'])
      .merge();
  }
}

export async function getLatestTariffsFromDB(date: string) {
  return db('box_tariffs_daily')
    .select(
      'request_date',
      'dt_next_box',
      'dt_till_max',
      'geo_name',
      'warehouse_name',
      'box_delivery_base',
      'box_delivery_coef_expr',
      'box_delivery_liter',
      'box_storage_base',
      'box_storage_coef_expr',
      'box_storage_liter',
    )
    .where('request_date', date)
    .orderBy('box_delivery_coef_expr', 'asc');
}
