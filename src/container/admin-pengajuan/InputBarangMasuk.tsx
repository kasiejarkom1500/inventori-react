import DataTable from '@/components/DataTable';
import PembelianForm from '@/components/PembelianForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDialog } from '@/context/dialog';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/loading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { summaryInputKuitansiColumns } from '@/lib/columns/summary-input-kuitansi-column';
import { fetchPembelian } from '@/lib/services/pembelianService';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';

export default function InputBarangMasuk() {
  const { data, isLoading } = useQuery({
    queryKey: ['data-pembelian'],
    queryFn: fetchPembelian,
  });

  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  if (isLoading) {
    return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  }

  const dataSummaryPembelian = data?.data ?? [];
  console.log(dataSummaryPembelian);

  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Data Pembelian Barang
      </h1>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className='mr-auto lg:mr-0'>
            <Dialog open={isDialogOpen}
              onOpenChange={(open) => {
                if (open) openDialog();
                else closeDialog();
              }}>
              <DialogTrigger>
                <Button onClick={openDialog}>
                  <PlusCircle /> Buat Pembelian Barang
                </Button>
              </DialogTrigger>
              <DialogContent className='max-h-[80%] max-w-[90%] overflow-auto'>
                <DialogHeader className='text-xl font-semibold'>
                  Pembelian Barang
                </DialogHeader>
                <PembelianForm />
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent>Buat Pembelian Barang</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DataTable
        columns={summaryInputKuitansiColumns}
        data={dataSummaryPembelian}
        column_name='no_kuitansi'
      />
    </Card>
  );
}
