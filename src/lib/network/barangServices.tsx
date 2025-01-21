import { base } from "./base";

export const fetchBarangARK = async()=>{
  const response = await base.get('/get_barang_ark');
  return response.data
}

export const fetchBarangATK = async()=>{
  const response = await base.get('/get_barang_atk');
  return response.data
}