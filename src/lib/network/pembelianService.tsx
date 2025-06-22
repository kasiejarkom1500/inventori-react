export const fetchBarangPembelianBulanan = async () => {
  // const response = await base.get('/total_pemakaian_bulanan/ATK');
  const response = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { total: 100 } });
    }, 1000);
  });
  return await response.then((res: any) => res.data);
};
