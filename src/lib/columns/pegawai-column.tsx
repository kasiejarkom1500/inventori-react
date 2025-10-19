import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Warehouse,UserCog } from "lucide-react";
import { User } from "@/lib/types/user";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/UserForm";
import AssignRuanganForm from "@/components/AssignRuanganForm";
import { useState } from "react";
export const operatorColumns: ColumnDef<User>[] = [
  {
    header: "No",
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: "nama",
    header: "Nama",
  },
  {
    accessorKey: "id_satker",
    header: "Satker",
  },
  {
    accessorKey: "jabatan",
    header: "Jabatan",
  },
  // {
  //   accessorKey: 'ruangan',
  //   header: 'Ruangan',
  // },
  // {
  //   accessorKey: 'username',
  //   header: 'Username',
  // },
  {
    header: "Action",
    cell: (row) => {
      const detail = row.row.original.id_user; // id_user
      const ruangan = row.row.original.ruangan; // ruangan
      const [open, setOpen] = useState(false);

      return (
        <div className="flex space-x-3 justify-center items-center">
          {/* Edit */}
          <Dialog>
            <DialogTrigger className="bg-yellow-500 p-1 rounded-md hover:bg-yellow-900/90">
              <Pencil size={18} color="white" />
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-xl font-semibold">
                Edit Operator
              </DialogTitle>
              <UserForm id={detail} type="edit" />
            </DialogContent>
          </Dialog>

          {/* Assign Ruangan */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 p-1 h-fit rounded-md hover:bg-blue-900/90">
                <Warehouse size={18} color="white"/>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-xl font-semibold">
                Assign Ruangan
              </DialogTitle>
              <AssignRuanganForm idUser={detail} ruanganUser={ruangan} onSuccess={() => setOpen(false)}/>
            </DialogContent>
          </Dialog>

           {/* Assign Role */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 p-1 h-fit rounded-md hover:bg-blue-900/90">
                <UserCog size={18} color="white"/>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-xl font-semibold">
                Assign Role
              </DialogTitle>
              {/* <AssignRuanganForm idUser={detail, ruangan} /> */}
            </DialogContent>
          </Dialog>

          {/* Delete */}
          <Button className="bg-red-500 p-1 h-fit rounded-md hover:bg-red-900/90">
            <Trash2 size={18} color="white" />
          </Button>
        </div>
      );
    },
  },
];
