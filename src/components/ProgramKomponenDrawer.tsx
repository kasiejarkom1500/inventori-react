import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPok } from "@/lib/services/fetch";

export default function ProgramKomponenDrawer({ currentBarang, onSave }) {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedKegiatan, setSelectedKegiatan] = useState("");
  const [selectedKro, setSelectedKro] = useState("");
  const [selectedRo, setSelectedRo] = useState("");
  const [selectedKomponen, setSelectedKomponen] = useState("");

  type PokItem = {
    kd_program: string;
    nama_program: string;
    kd_kegiatan: string;
    nama_kegiatan: string;
    kd_kro: string;
    nama_kro: string;
    kd_ro: string;
    nama_ro: string;
    kd_komponen: string;
    nama_komponen: string;
  };

  const [filteredProgramOptions, setFilteredProgramOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [filteredKegiatanOptions, setFilteredKegiatanOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [filteredRoOptions, setFilteredRoOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [filteredKroOptions, setFilteredKroOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [filteredKomponenOptions, setFilteredKomponenOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const getUniqueOptionsFromPok = (data: any[], key: string, label: string) => {
    const uniqueOptions = Array.from(new Set(data.map((item) => item[key])));
    return uniqueOptions.map((option) => ({
      value: option,
      label: data.find((item) => item[key] === option)[label],
    }));
  };

  const { data: dataPok = [], isLoading: loadingPok } = useQuery({
    queryKey: ["program"],
    queryFn: async () => {
      const res = await fetchAllPok({});
      setFilteredProgramOptions(
        getUniqueOptionsFromPok(res, "kd_program", "nama_program")
      );
      setFilteredKegiatanOptions(
        getUniqueOptionsFromPok(res, "kd_kegiatan", "nama_kegiatan")
      );
      setFilteredRoOptions(getUniqueOptionsFromPok(res, "kd_ro", "nama_ro"));
      setFilteredKroOptions(getUniqueOptionsFromPok(res, "kd_kro", "nama_kro"));
      setFilteredKomponenOptions(
        getUniqueOptionsFromPok(res, "kd_komponen", "nama_komponen")
      );
      return res as PokItem[];
    },
  });

  if (loadingPok) return <span>Loading...</span>;

  // 🔧 Fungsi bantu buat unique options
  const getUniqueOptions = (data: any[], key: string, label: string) => {
    const unique = Array.from(new Set(data.map((d) => d[key])));
    return unique.map((v) => ({
      value: v,
      label: data.find((d) => d[key] === v)?.[label] || v,
    }));
  };

  const programOptions = getUniqueOptions(
    dataPok,
    "kd_program",
    "nama_program"
  );
  const kegiatanOptions = selectedProgram
    ? getUniqueOptions(
        dataPok.filter((d) => d.kd_program === selectedProgram),
        "kd_kegiatan",
        "nama_kegiatan"
      )
    : [];
  const kroOptions = selectedKegiatan
    ? getUniqueOptions(
        dataPok.filter((d) => d.kd_kegiatan === selectedKegiatan),
        "kd_kro",
        "nama_kro"
      )
    : [];
  const roOptions = selectedKro
    ? getUniqueOptions(
        dataPok.filter((d) => d.kd_kro === selectedKro),
        "kd_ro",
        "nama_ro"
      )
    : [];
  const komponenOptions = selectedRo
    ? getUniqueOptions(
        dataPok.filter((d) => d.kd_ro === selectedRo),
        "kd_komponen",
        "nama_komponen"
      )
    : [];

  const handleSave = () => {
    const programData = {
      kd_program: selectedProgram,
      kd_kegiatan: selectedKegiatan,
      kd_kro: selectedKro,
      kd_ro: selectedRo,
      kd_komponen: selectedKomponen,
    };
    // TODO: panggil handleDataChange() kalau mau update ke newData state
    console.log("Saved Program Data:", programData);

    if (onSave) onSave(programData);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          Atur Program
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Atur Program / Komponen</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Program</label>
            <Select
              options={programOptions}
              value={programOptions.find((o) => o.value === selectedProgram)}
              onChange={(opt) => {
                setSelectedProgram(opt?.value || "");
                setSelectedKegiatan("");
                setSelectedKro("");
                setSelectedRo("");
                setSelectedKomponen("");
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Kegiatan</label>
            <Select
              options={kegiatanOptions}
              value={kegiatanOptions.find((o) => o.value === selectedKegiatan)}
              onChange={(opt) => {
                setSelectedKegiatan(opt?.value || "");
                setSelectedKro("");
                setSelectedRo("");
                setSelectedKomponen("");
              }}
              isDisabled={!selectedProgram}
            />
          </div>

          <div>
            <label className="text-sm font-medium">KRO</label>
            <Select
              options={kroOptions}
              value={kroOptions.find((o) => o.value === selectedKro)}
              onChange={(opt) => {
                setSelectedKro(opt?.value || "");
                setSelectedRo("");
                setSelectedKomponen("");
              }}
              isDisabled={!selectedKegiatan}
            />
          </div>

          <div>
            <label className="text-sm font-medium">RO</label>
            <Select
              options={roOptions}
              value={roOptions.find((o) => o.value === selectedRo)}
              onChange={(opt) => {
                setSelectedRo(opt?.value || "");
                setSelectedKomponen("");
              }}
              isDisabled={!selectedKro}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Komponen</label>
            <Select
              options={komponenOptions}
              value={komponenOptions.find((o) => o.value === selectedKomponen)}
              onChange={(opt) => setSelectedKomponen(opt?.value || "")}
              isDisabled={!selectedRo}
            />
          </div>

          <Button className="w-full mt-6" onClick={handleSave}>
            Simpan
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
