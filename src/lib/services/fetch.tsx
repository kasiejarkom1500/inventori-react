import { base } from "../network/base";

export async function fetchDetailPermintaaan(
  ruangnaID: string,
  tanggal: string,
  id_transaksi: string
) {
  const response = await base.get(
    `/get_detail_permintaan/${ruangnaID}/${tanggal}/${id_transaksi}`
  );
  return response.data;
}

export async function fetchBarangMasuk() {
  const response = await base.get("/get_barang_masuk");
  return response.data;
}

export async function fetchAllBarang() {
  const response = await base.get("/get_barang_all");
  return response.data;
}

export async function fetchAllSumber() {
  const response = await base.get("/get_sumber");
  return response.data;
}

export async function fetchDataKarken() {
  const response = await base.post("/generate");
  console.log("karken", response.data);
  return response.data;
}

export async function fetchSubkategori() {
  const response = await base.get("/get_subkategori");
  console.log("subkategori", response.data);
  return response.data;
}

export async function fetchAllPok({
  kd_program,
  kd_kegiatan,
  kd_ro,
  kd_kro,
  kd_komponen,
}: {
  kd_program?: string;
  kd_kegiatan?: string;
  kd_ro?: string;
  kd_kro?: string;
  kd_komponen?: string;
}) {
  const response = await base.post("/gabungan_pok", {
    kd_program: kd_program || "",
    kd_kegiatan: kd_kegiatan || "",
    kd_ro: kd_ro || "",
    kd_kro: kd_kro || "",
    kd_komponen: kd_komponen || "",
  });
  // console.log("program", response.data);
  return response.data.data;
}

export async function fetchAllKegiatan(kd_program: string) {
  const response = await base.get(`/kegiatan/${kd_program}`);
  console.log("kegiatan", response.data);
  return response.data.data;
}

export async function fetchAllKRO(kd_kegiatan: string) {
  const response = await base.get(`/kro/${kd_kegiatan}`);
  console.log("kro", response.data);
  return response.data.data;
}

export async function fetchAllRO(kd_kro: string) {
  const response = await base.get(`/ro/${kd_kro}`);
  console.log("ro", response.data);
  return response.data.data;
}

export async function fetchAllKomponen(kd_ro: string) {
  const response = await base.get(`/komponen/${kd_ro}`);
  console.log("komponen", response.data);
  return response.data.data;
}

export async function fetchAllBASO() {
  const response = await base.get("/get_baso");
  return response.data;
}
