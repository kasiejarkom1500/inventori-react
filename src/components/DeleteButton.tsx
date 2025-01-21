import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button} from '@/components/ui/button';
import {Trash2} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { base } from '@/lib/network/base';

export const DeleteButton = ({urlId, url, query_key}: {urlId: string, url:string, query_key: string}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await base.delete(`/${url}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [query_key]}); // Refresh data tabel
      toast.toast({
        title: "Berhasil",
        description: "Data berhasil dihapus",
      })
    },
    onError: (error) => {
      console.error('Gagal menghapus data:', error);
      toast.toast({
        variant: "destructive",
        title: "Gagal",
        description: "Gagal menghapus data",
      })
    },
  });

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      deleteMutation.mutate(urlId);
    }
  };

  return (
    <Button
      className='bg-red-500 p-1.5 h-fit rounded-md'
      onClick={handleDelete}
    >
      <Trash2 size={18} color='white' />
    </Button>
  );
};
