import { envAPI as env } from '#config/env/env.js';
import type { WBTariffsResponse } from '#types/types.js';

export const fetchTariffs = async (date: string): Promise<WBTariffsResponse> => {
  const res = await fetch(`${env.WB_TARIFFS_URL}?date=${date}`, {
    headers: { Authorization: env.WB_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`WB API error ${res.status}: ${await res.text()}`);
  }

  return (await res.json()) as WBTariffsResponse;
};
