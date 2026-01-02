import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Building2, ShieldPlus } from "lucide-react";
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
import AssignRoleForm from "@/components/AssignRoleForm";
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
              <UserForm
                id={detail}
                type="edit"
                initialData={{
                  nip_lama: row.row.original.nip_lama,
                  nama: row.row.original.nama,
                  id_satker: row.row.original.id_satker,
                  jabatan: row.row.original.jabatan,
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Assign Ruangan */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-500 p-2 h-fit rounded-md hover:bg-blue-900/90"
                title="Assign Ruangan"
                aria-label="Assign Ruangan"
              >
                <Building2 size={16} color="white" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-xl font-semibold">
                Assign Ruangan
              </DialogTitle>
              <AssignRuanganForm idUser={detail} />
            </DialogContent>
          </Dialog>

          {/* Assign Role */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="bg-purple-500 p-2 h-fit rounded-md hover:bg-purple-900/90"
                title="Assign Role"
                aria-label="Assign Role"
              >
                <ShieldPlus size={16} color="white" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-xl font-semibold">
                Assign Role
              </DialogTitle>
              <AssignRoleForm
                idUser={detail}
                currentRoles={row.row.original.role}
              />
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
