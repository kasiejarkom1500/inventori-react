import { base } from "./base";

export const fetchPermintaanBulanan = async (periodeBulan: string) => {
  const response = await base.get(`/dashboard_permintaan/${periodeBulan}`);
  return response.data;
};
