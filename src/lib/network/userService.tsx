import { base } from "./base";

export const fetchUser = async()=>{
  const response = await base.get('/get_users');
  return response.data
}

export const fetchPegawai = async()=>{
  const response = await base.get('/get_pegawai');
  return response.data
}
