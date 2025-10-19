import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPok } from "@/lib/services/fetch";

export default function ProgramKomponenDrawer({ currentBarang, onSave }) {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedKegiatan, setSelectedKegiatan] = useState("");
  const [selectedKro, setSelectedKro] = useState("");
  const [selectedRo, setSelectedRo] = useState("");
  const [selectedKomponen, setSelectedKomponen] = useState("");
  const [masterPok, setMasterPok] = useState<any>([]);
  // console.log("current barang", currentBarang);
  // console.log("currentbarang", currentBarang);
  // console.log("onsave", onSave);

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
      // console.log(res);
      console.log("res", res);
      return res as PokItem[];
    },
  });
  // console.log("datapok", dataPok);
  useEffect(() => {
    if (dataPok) {
      console.log("dataPok", dataPok);
      setMasterPok(dataPok);
      setFilteredProgramOptions(
        getUniqueOptionsFromPok(dataPok, "kd_program", "nama_program")
      );
      setFilteredKegiatanOptions(
        getUniqueOptionsFromPok(dataPok, "kd_kegiatan", "nama_kegiatan")
      );
      setFilteredRoOptions(
        getUniqueOptionsFromPok(dataPok, "kd_ro", "nama_ro")
      );
      setFilteredKroOptions(
        getUniqueOptionsFromPok(dataPok, "kd_kro", "nama_kro")
      );
      setFilteredKomponenOptions(
        getUniqueOptionsFromPok(dataPok, "kd_komponen", "nama_komponen")
      );
    }
  }, [dataPok]);
  if (loadingPok) return <span>Loading...</span>;

  // 🔧 Fungsi bantu buat unique options
  const getUniqueOptions = (data: any[], key: string, label: string) => {
    const unique = Array.from(new Set(data.map((d) => d[key])));
    return unique.map((v) => ({
      value: v,
      label: data.find((d) => d[key] === v)?.[label] || v,
    }));
  };
  // useEffect(() => {
  //   if (masterPok) {
  //     setSelectedKegiatan;
  //   }
  // }, []);
  // console.log("filteredKegiatanOptions", filteredKegiatanOptions);
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
    // console.log("handle save clicked");
    const programData = {
      kd_program: selectedProgram,
      kd_kegiatan: selectedKegiatan,
      kd_kro: selectedKro,
      kd_ro: selectedRo,
      kd_komponen: selectedKomponen,
    };
    console.log("programData", programData);
    // TODO: panggil handleDataChange() kalau mau update ke newData state
    // console.log("Saved Program Data:", programData);

    if (onSave) onSave(programData);
  };
  // console.log("programData", currentBarang?.programData);
  // console.log("kegiatanOptions", kegiatanOptions);
  // console.log("filteredProgramOptions", filteredProgramOptions);
  // console.log("currentBarang", currentBarang);
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
          {/* <p>current barang {JSON.stringify(currentBarang)}</p> */}
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Program</label>

            <Select
              options={programOptions}
              value={filteredProgramOptions.find(
                (o) => o.value === selectedProgram
              )}
              defaultValue={
                currentBarang?.programData
                  ? {
                      value: currentBarang?.programData.kd_program,
                      label: filteredProgramOptions.find(
                        (item) =>
                          item.value == currentBarang.programData.kd_program
                      )?.label,
                    }
                  : null
              }
              isLoading={!filteredProgramOptions.length}
              isDisabled={!filteredProgramOptions.length}
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
              value={filteredKegiatanOptions.find(
                (o) => o.value === selectedKegiatan
              )}
              defaultValue={
                currentBarang?.programData
                  ? {
                      value: currentBarang?.programData.kd_kegiatan,
                      label: filteredKegiatanOptions.find(
                        (item) =>
                          item.value == currentBarang.programData.kd_kegiatan
                      )?.label,
                    }
                  : null
              }
              isLoading={!filteredKegiatanOptions.length}
              onChange={(opt) => {
                setSelectedKegiatan(opt?.value || "");
                setSelectedKro("");
                setSelectedRo("");
                setSelectedKomponen("");
              }}
              isDisabled={!selectedProgram || !filteredKegiatanOptions.length}
            />
          </div>

          <div>
            <label className="text-sm font-medium">KRO</label>
            <Select
              options={kroOptions}
              value={filteredKroOptions.find((o) => o.value === selectedKro)}
              defaultValue={
                currentBarang?.programData
                  ? {
                      value: currentBarang?.programData.kd_kro,
                      label: filteredKroOptions.find(
                        (item) => item.value == currentBarang.programData.kd_kro
                      )?.label,
                    }
                  : null
              }
              isLoading={!filteredKroOptions.length}
              onChange={(opt) => {
                setSelectedKro(opt?.value || "");
                setSelectedRo("");
                setSelectedKomponen("");
              }}
              isDisabled={!selectedKegiatan || !filteredKroOptions.length}
            />
          </div>

          <div>
            <label className="text-sm font-medium">RO</label>
            <Select
              options={roOptions}
              value={filteredRoOptions.find((o) => o.value === selectedRo)}
              defaultValue={
                currentBarang?.programData
                  ? {
                      value: currentBarang?.programData.kd_kro,
                      label: filteredRoOptions.find(
                        (item) => item.value == currentBarang.programData.kd_ro
                      )?.label,
                    }
                  : null
              }
              isLoading={!filteredRoOptions.length}
              onChange={(opt) => {
                setSelectedRo(opt.value || "");
                setSelectedKomponen("");
              }}
              isDisabled={!selectedKro || !filteredRoOptions.length}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Komponen</label>
            <Select
              options={komponenOptions}
              value={filteredKomponenOptions.find(
                (o) => o.value === selectedKomponen
              )}
              defaultValue={
                currentBarang?.programData
                  ? {
                      value: currentBarang?.programData.kd_komponen,
                      label: filteredKomponenOptions.find(
                        (item) =>
                          item.value == currentBarang.programData.kd_komponen
                      )?.label,
                    }
                  : null
              }
              isLoading={!filteredKomponenOptions.length}
              onChange={(opt) => setSelectedKomponen(opt?.value || "")}
              isDisabled={!selectedRo || !filteredKomponenOptions.length}
            />
          </div>

          <Button
            className="w-full mt-6"
            onClick={handleSave}
            disabled={
              !filteredProgramOptions.length ||
              !filteredKegiatanOptions.length ||
              !filteredKomponenOptions.length ||
              !filteredKroOptions.length ||
              !filteredRoOptions.length ||
              !filteredKegiatanOptions.length
            }
          >
            Simpan
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
