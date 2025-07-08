import { base } from "./base";

export const fetchBarangARK = async () => {
  const response = await base.get("/get_barang_ark");
  return response.data;
};

export const fetchBarangATK = async () => {
  const response = await base.get("/get_barang_atk");
  return response.data;
};

export const fetchBarangTotal = async () => {
  const response = await base.get("/total_barang/ATK");
  return response.data;
};

export const fetchBarangStokTersedia = async () => {
  const response = await base.get("/total_stok/ATK");
  return response.data;
};

export const fetchBarangStokMinimal = async () => {
  const response = await base.get("/barang_stok_minimal");
  return response.data;
};

export const fetchBarangTerbanyak = async (periodeTahun: string) => {
  const response = await base.get(`/barang_terbanyak/${periodeTahun}`);
  return response.data;
};

export const fetchBarangPemakaianRuangan = async (periodeTahun: string) => {
  const response = await base.get(`/pemakaian_ruangan/${periodeTahun}`);
  return response.data;
};

export const fetchBarangPemakaianBulanan = async (periodeTahun: string) => {
  const response = await base.get(
    `/total_pemakaian_bulanan/${periodeTahun}/ATK`
  );
  console.log("total pemakaian bulanan", response.data);
  return response.data;
};
