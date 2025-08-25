import { fetchTariffs } from '#services/wb-api.js';
import { saveTariffsToSheet } from '#services/google-sheets.js';
import { getLatestTariffsFromDB, upsertTariffs } from '#services/db.js';
import { envAPI as env } from '#config/env/env.js';
import { formatDateForSheets, getTodayDate } from '#utils/utils.js';

export async function syncTariffs() {
  const today = getTodayDate();

  const tariffs = await fetchTariffs(today);

  await upsertTariffs(today, tariffs);

  const dbTariffs = (await getLatestTariffsFromDB(today)).map((t) => ({
    ...t,
    request_date: formatDateForSheets(t.request_date),
    dt_next_box: formatDateForSheets(t.dt_next_box),
    dt_till_max: formatDateForSheets(t.dt_till_max),
  }));

  const sheetIds = env.GOOGLE_SHEETS_IDS;

  for (const sheetId of sheetIds) {
    await saveTariffsToSheet(sheetId, dbTariffs);
  }
}
