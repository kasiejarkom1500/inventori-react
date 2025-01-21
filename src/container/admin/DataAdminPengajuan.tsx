import {UserTable} from '@/components/UserTable';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {adminPengajuanColumns} from '@/lib/columns/admin-pengajuan-column';
import {dataAdmin} from '@/lib/data/admin-dummy';
import {PlusCircle} from 'lucide-react';
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

export default function DataAdminPengajuan() {
  return (
    <>
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between'>
          <h1
            className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Data Admin Pengajuan
          </h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='mr-auto lg:mr-0'>
                <Dialog>
                  <DialogTrigger>
                    <Button>
                      <PlusCircle /> Tambah Admin Pengajuan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className='text-xl font-semibold'>
                      Tambah Admin Pengajuan
                    </DialogHeader>
                    <UserForm type='add' />
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>Tambah Admin Pengajuan</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <UserTable data={dataAdmin} columns={adminPengajuanColumns} />
      </Card>
    </>
  );
}
