import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {PlusCircle} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {RuanganTable} from '@/components/RuanganTable';
import {dataRuangan} from '@/lib/data/ruangan-dummy';
import {ruanganColumns} from '@/lib/columns/ruangan-column';
import RuanganForm from '@/components/RuanganForm';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function DataRuangan() {
  return (
    <>
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between'>
          <h1
            className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Data Admin
          </h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='mr-auto lg:mr-0'>
                <Dialog>
                  <DialogTrigger>
                    <Button>
                      <PlusCircle /> Tambah Ruangan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle className='text-xl font-semibold'>
                      Tambah Ruangan
                    </DialogTitle>
                    <RuanganForm type='add' />
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>Tambah Ruangan</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <RuanganTable data={dataRuangan} columns={ruanganColumns} />
      </Card>
    </>
  );
}
