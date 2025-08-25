import { google, sheets_v4 } from 'googleapis';
import type { WBWarehouseTariffDB } from '#types/types.js';

function getAuth() {
  const credsJson = Buffer.from(process.env.GOOGLE_CREDENTIALS_JSON_BASE64!, 'base64').toString(
    'utf-8',
  );

  const creds = JSON.parse(credsJson);

  return new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheetsClient(): sheets_v4.Sheets {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

async function createSheet(book: sheets_v4.Sheets, sheetId: string) {
  await book.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [{ addSheet: { properties: { title: 'stocks_coefs' } } }],
    },
  });
}

export async function saveTariffsToSheet(sheetId: string, tariffs: WBWarehouseTariffDB[]) {
  const book = getSheetsClient();

  const spreadsheet = await book.spreadsheets.get({ spreadsheetId: sheetId });

  const sheetExists = spreadsheet.data.sheets?.some((s) => s.properties?.title === 'stocks_coefs');

  if (!sheetExists) await createSheet(book, sheetId);

  const headers = [
    'request_date',
    'dtNextBox',
    'dtTillMax',
    'geoName',
    'warehouseName',
    'boxDeliveryBase',
    'boxDeliveryCoefExpr',
    'boxDeliveryLiter',
    'boxStorageBase',
    'boxStorageCoefExpr',
    'boxStorageLiter',
  ];

  const values = [
    headers,
    ...tariffs.map((t) => [
      t.request_date,
      t.dt_next_box,
      t.dt_till_max,
      t.geo_name,
      t.warehouse_name,
      t.box_delivery_base,
      t.box_delivery_coef_expr,
      t.box_delivery_liter,
      t.box_storage_base,
      t.box_storage_coef_expr,
      t.box_storage_liter,
    ]),
  ];

  await book.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'stocks_coefs!A1',
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}
