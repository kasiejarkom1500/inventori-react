import DataTable from '@/components/DataTable';
import { LoadingSpinner } from '@/components/ui/loading';
import { detailPembelianColumns } from '@/lib/columns/detail-pembelian-column';
import { adjustBarangMasuk, deleteBarangMasuk, updateBarangMasuk } from '@/lib/services/fetch';
import { fetchDetailPembelian } from '@/lib/services/pembelianService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function DetailPembelian({
  id_pembelian
}: {
  id_pembelian: number;
}) {


  const {data, isLoading, error} = useQuery({
    queryKey: ['detail-pembelian', id_pembelian],
    queryFn: () => fetchDetailPembelian(id_pembelian),
  });
  const queryClient = useQueryClient();
  const toast = useToast();

  const [dialogState, setDialogState] = useState<{ mode: 'edit' | 'adjust' | null; row: any | null }>({ mode: null, row: null });
  const [formData, setFormData] = useState({
    jumlah: '',
    harga: '',
    tgl_masuk: '',
    catatan: '',
    jumlah_delta: '',
  });

  const closeDialog = () => setDialogState({ mode: null, row: null });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => updateBarangMasuk(id, payload),
    onSuccess: (res) => {
      toast.toast({ title: 'Sukses', description: res?.message || 'Data diperbarui' });
      queryClient.invalidateQueries({ queryKey: ['detail-pembelian', id_pembelian] });
      queryClient.invalidateQueries({ queryKey: ['barang-masuk'] });
      closeDialog();
    },
    onError: () => toast.toast({ variant: 'destructive', title: 'Gagal', description: 'Update gagal' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBarangMasuk(id),
    onSuccess: (res) => {
      toast.toast({ title: 'Sukses', description: res?.message || 'Data dihapus' });
      queryClient.invalidateQueries({ queryKey: ['detail-pembelian', id_pembelian] });
      queryClient.invalidateQueries({ queryKey: ['barang-masuk'] });
    },
    onError: () => toast.toast({ variant: 'destructive', title: 'Gagal', description: 'Hapus gagal' }),
  });

  const adjustMutation = useMutation({
    mutationFn: (payload: { id_barang_masuk: number; jumlah_delta: number; catatan?: string; catatan_penyesuaian?: string }) => adjustBarangMasuk(payload),
    onSuccess: (res) => {
      toast.toast({ title: 'Sukses', description: res?.message || 'Penyesuaian berhasil' });
      queryClient.invalidateQueries({ queryKey: ['detail-pembelian', id_pembelian] });
      queryClient.invalidateQueries({ queryKey: ['barang-masuk'] });
      closeDialog();
    },
    onError: () => toast.toast({ variant: 'destructive', title: 'Gagal', description: 'Penyesuaian gagal' }),
  });

  const handleOpenEdit = (row: any) => {
    setDialogState({ mode: 'edit', row });
    setFormData({
      jumlah: String(row.jumlah ?? ''),
      harga: String(row.harga ?? ''),
      tgl_masuk: row.tgl_masuk ?? '',
      catatan: row.catatan ?? '',
      jumlah_delta: '',
    });
  };

  const handleOpenAdjust = (row: any) => {
    setDialogState({ mode: 'adjust', row });
    setFormData({
      jumlah: '',
      harga: '',
      tgl_masuk: '',
      catatan: '',
      jumlah_delta: '',
    });
  };

  const handleDelete = (row: any) => {
    if (!row?.id_barang_masuk) return;
    deleteMutation.mutate(row.id_barang_masuk);
  };

  const handleSubmitEdit = () => {
    if (!dialogState.row?.id_barang_masuk) return;
    editMutation.mutate({
      id: dialogState.row.id_barang_masuk,
      payload: {
        jumlah: formData.jumlah ? Number(formData.jumlah) : undefined,
        harga: formData.harga ? Number(formData.harga) : undefined,
        tgl_masuk: formData.tgl_masuk || undefined,
        catatan: formData.catatan,
      },
    });
  };

  const handleSubmitAdjust = () => {
    if (!dialogState.row?.id_barang_masuk) return;
    adjustMutation.mutate({
      id_barang_masuk: dialogState.row.id_barang_masuk,
      jumlah_delta: Number(formData.jumlah_delta),
      catatan_penyesuaian: formData.catatan,
    });
  };

 

  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
  const dataPembelianBarang = data?.data ?? [];

  return (
    <>
      <DataTable
        columns={detailPembelianColumns({
          onEdit: handleOpenEdit,
          onDelete: handleDelete,
          onAdjust: handleOpenAdjust,
        })}
        data={dataPembelianBarang}
        column_name='nama_barang'
      />

      <Dialog open={!!dialogState.mode} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className='max-w-lg'>
          <DialogTitle className='text-xl font-semibold'>
            {dialogState.mode === 'edit' ? 'Edit Barang Masuk' : 'Penyesuaian Stok'}
          </DialogTitle>
          {dialogState.mode === 'edit' && (
            <div className='space-y-3'>
              <div className='space-y-1'>
                <Label>Jumlah</Label>
                <Input
                  type='number'
                  value={formData.jumlah}
                  onChange={(e) => setFormData((p) => ({ ...p, jumlah: e.target.value }))}
                />
              </div>
              <div className='space-y-1'>
                <Label>Harga</Label>
                <Input
                  type='number'
                  value={formData.harga}
                  onChange={(e) => setFormData((p) => ({ ...p, harga: e.target.value }))}
                />
              </div>
              <div className='space-y-1'>
                <Label>Tanggal Masuk</Label>
                <Input
                  type='date'
                  value={formData.tgl_masuk}
                  onChange={(e) => setFormData((p) => ({ ...p, tgl_masuk: e.target.value }))}
                />
              </div>
              <div className='space-y-1'>
                <Label>Catatan</Label>
                <textarea
                  className='border rounded-md w-full px-3 py-2 text-sm'
                  value={formData.catatan}
                  onChange={(e) => setFormData((p) => ({ ...p, catatan: e.target.value }))}
                />
              </div>
              <div className='flex justify-end gap-2'>
                <Button variant='outline' onClick={closeDialog}>Batal</Button>
                <Button onClick={handleSubmitEdit} disabled={editMutation.isPending}>Simpan</Button>
              </div>
            </div>
          )}

          {dialogState.mode === 'adjust' && (
            <div className='space-y-3'>
              <div className='space-y-1'>
                <Label>Jumlah Penyesuaian (gunakan minus untuk mengurangi)</Label>
                <Input
                  type='number'
                  value={formData.jumlah_delta}
                  onChange={(e) => setFormData((p) => ({ ...p, jumlah_delta: e.target.value }))}
                />
              </div>
              <div className='space-y-1'>
                <Label>Catatan</Label>
                <textarea
                  className='border rounded-md w-full px-3 py-2 text-sm'
                  value={formData.catatan}
                  onChange={(e) => setFormData((p) => ({ ...p, catatan: e.target.value }))}
                />
              </div>
              <div className='flex justify-end gap-2'>
                <Button variant='outline' onClick={closeDialog}>Batal</Button>
                <Button onClick={handleSubmitAdjust} disabled={adjustMutation.isPending}>Kirim Penyesuaian</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
