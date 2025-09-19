import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { base } from "@/lib/network/base";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { fetchKabupaten } from "@/lib/services/fetch";

export default function AssignRuanganForm({ idUser }: { idUser: string }) {
  const { toast } = useToast();
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>("");
  const [selectedRuangan, setSelectedRuangan] = useState<string[]>([]);

  // ambil daftar kabupaten
  const { data: kabupatenData, isLoading: kabupatenLoading } = useQuery({
    queryKey: ["kabupaten"],
    queryFn: async () => {
      const result = await fetchKabupaten(); // ini tetap pakai fungsi lama
      return result.data; // <-- ambil array dari response di sini saja
    },
  });

  // ambil daftar ruangan berdasarkan kabupaten
  const { data: ruangan, isLoading: loadingRuangan } = useQuery({
    queryKey: ["ruangan", selectedKabupaten],
    queryFn: async () => {
      if (!selectedKabupaten) return [];
      const res = await base.get(`/list_ruangan/${selectedKabupaten}`);
      return res.data.data; // array {id, nama_ruangan}
    },
    enabled: !!selectedKabupaten, // hanya jalan kalau sudah pilih kabupaten
  });

  async function handleSubmit() {
    try {
      await base.post("/assign_ruangan_post", {
        id_user: idUser,
        id_ruangan: selectedRuangan,
      });

      toast({
        title: "Berhasil",
        description: "Ruangan berhasil di-assign.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Ruangan gagal di-assign.",
      });
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      {/* Pilih kabupaten */}
      <div>
        <label className="block mb-2 font-medium">Pilih Kabupaten</label>
        <Select
          value={selectedKabupaten}
          onValueChange={(val) => {
            setSelectedKabupaten(val);
            setSelectedRuangan([]); // reset pilihan ruangan kalau ganti kabupaten
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih kabupaten..." />
          </SelectTrigger>
          <SelectContent>
            {kabupatenLoading ? (
              <p className="p-2">Loading...</p>
            ) : (
              kabupatenData?.map((k: any) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.nama}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Pilih ruangan */}
      {selectedKabupaten && (
        <div>
          <label className="block mb-2 font-medium">Pilih Ruangan</label>
          {loadingRuangan ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border p-2 rounded">
              {ruangan?.map((r: any) => (
                <label key={r.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={r.id}
                    checked={selectedRuangan.includes(r.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRuangan([...selectedRuangan, r.id]);
                      } else {
                        setSelectedRuangan(
                          selectedRuangan.filter((id) => id !== r.id)
                        );
                      }
                    }}
                  />
                  {r.nama_ruangan}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={!selectedRuangan.length}>
        Simpan
      </Button>
    </div>
  );
}
