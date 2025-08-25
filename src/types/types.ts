export interface WBWarehouseTariff {
  boxDeliveryBase: string;
  boxDeliveryCoefExpr: string;
  boxDeliveryLiter: string;
  boxDeliveryMarketplaceBase: string;
  boxDeliveryMarketplaceCoefExpr: string;
  boxDeliveryMarketplaceLiter: string;
  boxStorageBase: string;
  boxStorageCoefExpr: string;
  boxStorageLiter: string;
  geoName: string;
  warehouseName: string;
}

export interface WBTariffsResponse {
  response: {
    data: {
      dtNextBox: string;
      dtTillMax: string;
      warehouseList: WBWarehouseTariff[];
    };
  };
}

export interface WBWarehouseTariffDB {
  request_date: string;
  dt_next_box: string;
  dt_till_max: string;

  geo_name: string;
  warehouse_name: string;

  box_delivery_base: string;
  box_delivery_coef_expr: string;
  box_delivery_liter: string;
  box_storage_base: string;
  box_storage_coef_expr: string;
  box_storage_liter: string;
}
