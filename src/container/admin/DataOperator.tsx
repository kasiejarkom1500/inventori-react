import {UserTable} from '@/components/UserTable';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {operatorColumns} from '@/lib/columns/pegawai-column';
import {dataAdmin} from '@/lib/data/admin-dummy';
import {Download, PlusCircle, Upload} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import UserForm from '@/components/UserForm';
import useExcel from '@/hooks/use-excel';

export default function DataOperator() {
  const {handleExcel} = useExcel();

  return (
    <>
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between'>
          <h1
            className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Data Operator Ruangan
          </h1>
          <div className='flex items-start flex-col lg:flex-row gap-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant={'green'}>
                    <Upload /> Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import Excel</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() => handleExcel(dataAdmin, 'data_pegawai')}
                    variant={'blue'}
                  >
                    <Download /> Download
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Format Excel</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Dialog>
                    <DialogTrigger>
                      <Button>
                        <PlusCircle /> Tambah Operator
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className='text-xl font-semibold'>
                        Tambah Operator
                      </DialogHeader>
                      <UserForm type='add' />
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>Tambah Operator</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <UserTable data={dataAdmin} columns={operatorColumns} />
      </Card>
    </>
  );
}
