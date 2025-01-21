import { base } from '@/lib/network/base';
import { getUser } from './userServices';

export const fetchAllBarang = async () => {
  const response = await base.get('/barang');
  return response.data;
};

export const tambahPermintaan = async (data: any) => {
  const response = await base.post('/tambah_permintaan', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export async function fetchPermintaanByUser() {
  const response = await base.get('/get_transaksi_permintaan');
  console.log(response.data.data);

  const user = getUser();
  // Filter the data based on user.data_ruangan
  const userRuanganIds = user.data_ruangan.map((r) => r.id_ruangan); // Extract ruangan IDs
  const filteredData = response.data.data.filter((item: {id_ruangan: string}) =>
    userRuanganIds.includes(item.id_ruangan)
  );

  console.log(filteredData);
  return {...response, data: filteredData}; // Return filtered data
}