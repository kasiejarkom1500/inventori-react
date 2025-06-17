import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import RequireAuth from '@/components/auth/RequireAuth';
import RoleAuth from '@/components/auth/RoleAuth';
import LayoutDashboard from '@/pages/LayoutDashboard';
import Login from '@/pages/Login';
import Dashboard from '@/container/admin/Dashboard';
import DataAdmin from '@/container/admin/DataAdmin';
import DataPegawai from '@/container/admin/DataOperator';
import DataAdminPengajuan from '@/container/admin/DataAdminPengajuan';
import DataRuangan from '@/container/admin/DataRuangan';
import BarangMasuk from '@/container/admin/BarangMasuk';
import BarangKeluar from '@/container/admin/BarangKeluar';
import PermintaanBarang from '@/container/admin/PermintaanBarang';
import LaporanPengajuan from '@/container/admin/LaporanPengajuan';
import LaporanPermintaan from '@/container/admin/LaporanPermintaan';
import DataBarangATK from '@/container/admin/DataBarangATK';
import DataBarangARK from '@/container/admin/DataBarangARK';
import DataBarangATKView from '@/container/admin-pengajuan/DataBarangATK';
import DataBarangARKView from '@/container/admin-pengajuan/DataBarangARK';
import DataBarangATKOp from '@/container/operator-ruangan/DataBarangATK';
import DataBarangARKOp from '@/container/operator-ruangan/DataBarangARK';
import PengajuanBarang from '@/container/admin-pengajuan/PengajuanBarang';
import SummaryPermintaan from '@/container/operator-ruangan/SummaryPermintaan';
import SummaryPengajuan from '@/container/operator-ruangan/SummaryPengajuan';
import InputBarangMasuk from '@/container/admin-pengajuan/InputBarangMasuk';

const router = createBrowserRouter(
  [
    {path: '/login', element: <Login />},
    {path: '/unauthorized', element: <div>unauthorized</div>},
    {
      path: '',
      element: <RequireAuth />,
      children: [
        {
          path: 'admin',
          element: <RoleAuth requiredRole='admin' />,
          children: [
            {
              path: '',
              element: <LayoutDashboard />,
              children: [
                {path: 'dashboard', element: <Dashboard />},
                {path: 'data-admin', element: <DataAdmin />},
                {path: 'data-pegawai', element: <DataPegawai />},
                {path: 'data-admin-pengajuan', element: <DataAdminPengajuan />},
                {path: 'data-barang-atk', element: <DataBarangATK />},
                {path: 'data-barang-ark', element: <DataBarangARK />},
                {path: 'data-ruangan', element: <DataRuangan />},

                {path: 'barang-masuk', element: <BarangMasuk />},
                {path: 'barang-keluar', element: <BarangKeluar />},
                {path: 'permintaan-barang', element: <PermintaanBarang />},

                {path: 'laporan-pengajuan', element: <LaporanPengajuan />},
                {path: 'kartu-kendali', element: <LaporanPermintaan />},
              ],
            },
          ],
        },
        {
          path: 'admin-pengajuan',
          element: <RoleAuth requiredRole='admin_pengajuan' />,
          children: [
            {
              path: '',
              element: <LayoutDashboard />,
              children: [
                {path: 'dashboard', element: <Dashboard />},
                {path: 'data-barang-atk', element: <DataBarangATKView />},
                {path: 'data-barang-ark', element: <DataBarangARKView />},
                {path: 'pengajuan-barang', element: <PengajuanBarang />},
                {path: 'permintaan-barang', element: <PermintaanBarang />},
                {path: 'input-barang-masuk', element: <InputBarangMasuk />},
                {path: 'laporan-pengajuan', element: <LaporanPengajuan />},
              ],
            },
          ],
        },
        {
          path: 'operator-ruangan',
          element: <RoleAuth requiredRole='user' />,
          children: [
            {
              path: '',
              element: <LayoutDashboard />,
              children: [
                {path: 'dashboard', element: <Dashboard />},
                {path: 'data-barang-atk', element: <DataBarangATKOp />},
                {path: 'data-barang-ark', element: <DataBarangARKOp />},
                {path: 'permintaan-barang', element: <SummaryPermintaan />},
                {path: 'permintaan-barang/detail', element: <h1>detail 1</h1>},
                {path: 'pengajuan-barang', element: <SummaryPengajuan />},
                {path: 'pengajuan-barang/detail', element: <h1>detail 2</h1>},
              ],
            },
          ],
        },
        {
          path: 'admin-pembelian',
          element: <RoleAuth requiredRole='admin_pembelian' />,
          children: [
            {
              path: '',
              element: <LayoutDashboard />,
              children: [
                {path: 'dashboard', element: <Dashboard />},
                {path: 'data-barang-atk', element: <DataBarangATKView />},
                {path: 'data-barang-ark', element: <DataBarangARKView />},
                {path: 'input-barang-masuk', element: <InputBarangMasuk />},
              ],
            },
          ],
        },
      ],
    },
  ],
  {basename: import.meta.env.BASE_URL}
);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
