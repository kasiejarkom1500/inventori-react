import {UserTable} from '@/components/UserTable';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {adminColumns} from '@/lib/columns/admin-column';
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import AdminForm from '@/components/AdminForm';

export default function DataAdmin() {
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
                      <PlusCircle /> Tambah Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className='text-xl font-semibold'>
                      Tambah Admin
                    </DialogHeader>
                    <AdminForm type='add' />
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>Tambah Admin</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <UserTable data={dataAdmin} columns={adminColumns} />
      </Card>
    </>
  );
}
