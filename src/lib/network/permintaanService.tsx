import { base } from "./base";

export const fetchPermintaanBulanan = async (periodeBulan: string) => {
  const response = await base.get(`/dashboard_permintaan/${periodeBulan}`);
  return response.data;
};

export const fetchPermintaanBulananPending = async (periodeBulan: string) => {
  const response = await base.get(`/dashboard_permintaan/${periodeBulan}`);
  // console.log("data pending", response.data);
  const filteredData = response.data.data.filter(
    (item: { Pending: string }) => item.Pending != "0"
  );
  return { ...response, data: filteredData };
};
