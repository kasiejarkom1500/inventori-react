import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {LoadingSpinner} from "@/components/ui/loading";
import {base} from "@/lib/network/base";
import {useState} from "react";
import {useToast} from "@/hooks/use-toast";

async function fetchSumber() {
  const res = await base.get("/get_sumber");
  return res.data.data ?? res.data;
}

export default function DataSumber() {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{id_sumber?: number; nama_sumber: string}>({nama_sumber: ""});

  const {data, isLoading, error} = useQuery({queryKey: ["sumber"], queryFn: fetchSumber});

  const addMutation = useMutation({
    mutationFn: async (nama: string) => {
      const res = await base.post(
        "/add_sumber",
        {nama_sumber: nama},
        {headers: {"Content-Type": "application/json"}}
      );
      return res.data;
    },
    onSuccess: (res) => {
      toast({title: res?.status ? "Berhasil" : "Gagal", description: res?.message});
      queryClient.invalidateQueries({queryKey: ["sumber"]});
      setOpen(false);
      setEditing({nama_sumber: ""});
    },
    onError: () => {
      toast({variant: "destructive", title: "Gagal", description: "Gagal menyimpan sumber"});
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({id_sumber, nama_sumber}: {id_sumber: number; nama_sumber: string}) => {
      const res = await base.post(
        "/update_sumber",
        {id_sumber, nama_sumber},
        {headers: {"Content-Type": "application/json"}}
      );
      return res.data;
    },
    onSuccess: (res) => {
      toast({title: res?.status ? "Berhasil" : "Gagal", description: res?.message});
      queryClient.invalidateQueries({queryKey: ["sumber"]});
      setOpen(false);
      setEditing({nama_sumber: ""});
    },
    onError: () => {
      toast({variant: "destructive", title: "Gagal", description: "Gagal menyimpan sumber"});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id_sumber: number) => {
      const res = await base.delete(`/delete_sumber/${id_sumber}`);
      return res.data;
    },
    onSuccess: (res) => {
      toast({title: res?.status ? "Berhasil" : "Gagal", description: res?.message});
      queryClient.invalidateQueries({queryKey: ["sumber"]});
    },
    onError: () => {
      toast({variant: "destructive", title: "Gagal", description: "Gagal menghapus sumber"});
    },
  });

  const handleSubmit = () => {
    if (!editing.nama_sumber.trim()) {
      toast({variant: "destructive", title: "Gagal", description: "Nama sumber wajib diisi"});
      return;
    }
    if (editing.id_sumber) {
      updateMutation.mutate({id_sumber: editing.id_sumber, nama_sumber: editing.nama_sumber});
    } else {
      addMutation.mutate(editing.nama_sumber);
    }
  };

  if (isLoading) return <LoadingSpinner className="mx-auto" size={40} />;
  if (error) return <div>Terjadi error</div>;

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
        <h1 className="text-2xl font-semibold">Data Sumber</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Sumber</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing.id_sumber ? "Edit Sumber" : "Tambah Sumber"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nama sumber"
                value={editing.nama_sumber}
                onChange={(e) => setEditing((prev) => ({...prev, nama_sumber: e.target.value}))}
              />
              <Button onClick={handleSubmit} disabled={addMutation.isPending || updateMutation.isPending}>
                Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Sumber</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item: any, idx: number) => (
            <TableRow key={item.id_sumber}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{item.nama_sumber}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing({id_sumber: item.id_sumber, nama_sumber: item.nama_sumber});
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(item.id_sumber)}
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
