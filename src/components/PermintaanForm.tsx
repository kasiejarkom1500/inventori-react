import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllBarang,
  // fetchAllKegiatan,
  // fetchAllKomponen,
  // fetchAllKRO,
  fetchAllPok,
  // fetchAllProgram,
  // fetchAllRO,
} from "@/lib/services/fetch";
import Select from "react-select";
import { LoadingSpinner } from "./ui/loading";
import DataTable from "./DataTable";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { base } from "@/lib/network/base";
import { useDialog } from "@/context/dialog";

const permintaanSchema = z.object({
  id_user: z.string(),
  nama: z.string().min(1, { message: "Nama tidak boleh kosong." }),
  jabatan: z.string().min(1, { message: "Jabatan tidak boleh kosong." }),
  id_ruangan: z.string().min(1, { message: "Ruangan harus dipilih." }),
  ruangan: z.string(),
  tanggal: z.string().min(1, { message: "Tanggal harus diisi." }),
  id_barang: z
    .string()
    .min(1, { message: "Barang harus dipilih." })
    .default("0"),
  nama_barang: z.string(),
  kategori: z.string().min(1, { message: "Jenis barang tidak boleh kosong." }),
  satuan: z.string().min(1, { message: "Satuan tidak boleh kosong." }),
  stok: z.string().min(1, { message: "Stok tidak boleh kurang dari 0." }),
  jumlah: z
    .number({
      invalid_type_error: "Jumlah permintaan harus berupa bilangan bulat.",
    })
    .positive({ message: "Jumlah permintaan harus lebih dari 0." }),
  kd_program: z.string(),
  kd_kegiatan: z.string(),
  kd_kro: z.string(),
  kd_ro: z.string(),
  kd_komponen: z.string(),
});

function BarangInputSwitcher({
  isCustomBarang,
  setIsCustomBarang,
  form,
  barangOptions,
  allBarang,
}: {
  isCustomBarang: boolean;
  setIsCustomBarang: React.Dispatch<React.SetStateAction<boolean>>;
  form: ReturnType<typeof useForm<z.infer<typeof permintaanSchema>>>;
  barangOptions: { value: string; label: string }[];
  allBarang: any[];
}) {
  const handleBarangChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    const barangId = selectedOption?.value;
    const selectedBarang = allBarang.find(
      (item: { id_barang: string }) => item.id_barang === barangId
    );

    form.setValue("id_barang", selectedOption?.value || "");

    if (selectedBarang) {
      form.setValue("nama_barang", selectedBarang.nama_barang || "");
      form.setValue("kategori", selectedBarang.kategori || "");
      form.setValue("satuan", selectedBarang.satuan || "");
      form.setValue("stok", selectedBarang.stok || 0);
    } else {
      form.setValue("nama_barang", "");
      form.setValue("kategori", "");
      form.setValue("satuan", "");
      form.setValue("stok", "");
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Barang</FormLabel>
      {!isCustomBarang ? (
        <>
          <FormField
            control={form.control}
            name="id_barang"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    className="text-xs md:text-base"
                    options={barangOptions}
                    onChange={handleBarangChange}
                    value={barangOptions.find(
                      (item) => item.value === field.value
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsCustomBarang(true);
              form.setValue("id_barang", "0");
              form.setValue("nama_barang", "");
              form.setValue("kategori", "ATK");
              form.setValue("satuan", "Pcs");
              form.setValue("stok", "0");
            }}
          >
            Barang tidak ditemukan?
          </Button> */}
        </>
      ) : (
        <>
          <FormField
            control={form.control}
            name="nama_barang"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Nama Barang Baru" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsCustomBarang(false);
              form.setValue("nama_barang", "");
              form.setValue("id_barang", "");
            }}
          >
            Pilih dari daftar
          </Button>
        </>
      )}
    </div>
  );
}

export default function PermintaanForm() {
  const { closeDialog } = useDialog();

  const [isCustomBarang, setIsCustomBarang] = useState(false);

  const [batchData, setBatchData] = useState<
    Array<{
      id_barang: string;
      id_ruangan: string;
      nama_barang: string;
      kategori: string;
      satuan: string;
      stok: number | string;
      jumlah: number;
      ruangan: string;
    }>
  >([]);

  const [requestData, setRequestData] = useState<
    Array<{
      id_barang: string;
      id_user: string;
      id_ruangan: string;
      jumlah: number;
      nama_barang: string;
      kd_program: string;
      kd_kegiatan: string;
      kd_kro: string;
      kd_ro: string;
      kd_komponen: string;
    }>
  >([]);
  // const [selectedPok, setSelectedPok] = useState("");
  // const [allPok, setAllPok] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedKegiatan, setSelectedKegiatan] = useState("");
  const [selectedRo, setSelectedRo] = useState("");
  const [selectedKro, setSelectedKro] = useState("");
  const [selectedKomponen, setSelectedKomponen] = useState("");

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

  // const [filtered];
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: dataAllBarang,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["barang"],
    queryFn: fetchAllBarang,
  });

  const getUniqueOptionsFromPok = (data: any[], key: string, label: string) => {
    const uniqueOptions = Array.from(new Set(data.map((item) => item[key])));
    return uniqueOptions.map((option) => ({
      value: option,
      label: data.find((item) => item[key] === option)[label],
    }));
  };

  const {
    data: dataPok,
    isLoading: loadingPok,
    error: errorPok,
  } = useQuery({
    queryKey: ["program"],
    queryFn: async () => {
      return fetchAllPok({}).then((res) => {
        const programOptionsRes = getUniqueOptionsFromPok(
          res,
          "kd_program",
          "nama_program"
        );
        const kegiatanOptionsRes = getUniqueOptionsFromPok(
          res,
          "kd_kegiatan",
          "nama_kegiatan"
        );
        const roOptionsRes = getUniqueOptionsFromPok(res, "kd_ro", "nama_ro");
        const kroOptionsRes = getUniqueOptionsFromPok(
          res,
          "kd_kro",
          "nama_kro"
        );
        const komponenOptionsRes = getUniqueOptionsFromPok(
          res,
          "kd_komponen",
          "nama_komponen"
        );

        // setProgramOptions(programOptionsRes);
        // setKegiatanOptions(kegiatanOptionsRes);
        // setRoOptions(roOptionsRes);
        // setKroOptions(kroOptionsRes);
        // setKomponenOptions(komponenOptionsRes);
        // setAllPok(res);
        setFilteredProgramOptions(programOptionsRes);
        setFilteredKegiatanOptions(kegiatanOptionsRes);
        setFilteredRoOptions(roOptionsRes);
        setFilteredKroOptions(kroOptionsRes);
        setFilteredKomponenOptions(komponenOptionsRes);

        console.log("res", res);

        return res;
      });
    },
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}") as {
    id_user: string;
    username: string;
    jabatan: string;
    data_ruangan: { id_ruangan: string; ruangan: string }[];
  };
  const ruanganUser = user.data_ruangan;
  const ruanganOptions = ruanganUser.map(
    (item: { id_ruangan: string; ruangan: string }) => ({
      value: item.id_ruangan,
      label: item.ruangan,
    })
  );

  const allBarang = dataAllBarang?.data ?? [];
  const barangOptions = allBarang.map(
    (item: { id_barang: string; nama_barang: string }) => ({
      value: item.id_barang,
      label: item.nama_barang,
    })
  );

  const form = useForm<z.infer<typeof permintaanSchema>>({
    resolver: zodResolver(permintaanSchema),
    defaultValues: {
      id_user: user.id_user,
      nama: user.username,
      jabatan: user.jabatan,
      id_ruangan: "",
      ruangan: "",
      tanggal: new Date().toISOString().split("T")[0],
      id_barang: "",
      nama_barang: "",
      kategori: "",
      satuan: "",
      stok: "",
      jumlah: 0,
      kd_program: "",
      kd_kegiatan: "",
      kd_kro: "",
      kd_ro: "",
      kd_komponen: "",
    },
  });

  function onSubmit(values: z.infer<typeof permintaanSchema>) {
    // kalau barang custom, buat fake id_barang supaya tidak kosong
    const idBarangFinal = isCustomBarang
      ? `custom-${values.nama_barang}-${Date.now()}`
      : values.id_barang;

    const isDuplicate = batchData.some(
      (item) =>
        item.id_barang === idBarangFinal &&
        item.id_ruangan === values.id_ruangan
    );

    if (isDuplicate) {
      toast.toast({
        variant: "destructive",
        title: "Duplikasi Data",
        description: "Barang ini sudah ada di tabel.",
      });
      return;
    }

    const newData = {
      id_barang: idBarangFinal,
      id_user: values.id_user,
      id_ruangan: values.id_ruangan,
      jumlah: values.jumlah,
      nama_barang: values.nama_barang,
      kd_program: values.kd_program,
      kd_kegiatan: values.kd_kegiatan,
      kd_ro: values.kd_ro,
      kd_kro: values.kd_kro,
      kd_komponen: values.kd_komponen,
    };

    const newBatchData = {
      id_ruangan: values.id_ruangan,
      id_barang: idBarangFinal,
      nama_barang: values.nama_barang,
      kategori: values.kategori,
      satuan: values.satuan,
      stok: values.stok,
      jumlah: values.jumlah,
      ruangan: values.ruangan,
      kd_program: values.kd_program,
      kd_kegiatan: values.kd_kegiatan,
      kd_ro: values.kd_ro,
      kd_kro: values.kd_kro,
      kd_komponen: values.kd_komponen,
    };
    console.log(newData, newBatchData);
    setRequestData((prev) => [...prev, newData]);
    setBatchData((prev) => [...prev, newBatchData]);

    toast.toast({
      title: "Berhasil",
      description: "Data berhasil ditambahkan ke tabel",
    });
  }

  const handleDelete = (indexToDelete: number) => {
    setBatchData((prevBatchData) =>
      prevBatchData.filter((_, index) => index !== indexToDelete)
    );

    setRequestData((prevRequestData) =>
      prevRequestData.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleSubmitBatch = async () => {
    try {
      console.log("Batch Request Data:", requestData);
      const response = await base.post("/tambah_permintaan", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response.data);
      toast.toast({
        title: "Berhasil",
        description: response.data.message,
      });
      // Refresh summary list after submit so data langsung ter-update
      queryClient.invalidateQueries({ queryKey: ["data-permintaan-user"] });
      closeDialog();
    } catch (error) {
      console.error("Gagal mengupdate data:", error);
      toast.toast({
        variant: "destructive",
        title: "Gagal",
        description: "Gagal mengupdate data barang",
      });
    }
  };

  useEffect(() => {
    if (selectedProgram) {
      let tempAllPok = dataPok;
      tempAllPok = tempAllPok.filter(
        (item: any) => item.kd_program === selectedProgram
      );
      const kegiatanOptionsRes = getUniqueOptionsFromPok(
        tempAllPok,
        "kd_kegiatan",
        "nama_kegiatan"
      );
      setFilteredKegiatanOptions(kegiatanOptionsRes);
      setSelectedKegiatan("");
      setSelectedKro("");
      setSelectedRo("");
      setSelectedKomponen("");
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedKegiatan) {
      let tempAllPok = dataPok;
      tempAllPok = tempAllPok.filter(
        (item: any) => item.kd_kegiatan === selectedKegiatan
      );
      const kroOptionsRes = getUniqueOptionsFromPok(
        tempAllPok,
        "kd_kro",
        "nama_kro"
      );
      setFilteredKroOptions(kroOptionsRes);
      setSelectedRo("");
      setSelectedKomponen("");
    }
  }, [selectedKegiatan]);

  useEffect(() => {
    if (selectedKro) {
      let tempAllPok = dataPok;
      tempAllPok = tempAllPok.filter(
        (item: any) => item.kd_kro === selectedKro
      );
      const roOptionsRes = getUniqueOptionsFromPok(
        tempAllPok,
        "kd_ro",
        "nama_ro"
      );
      setFilteredRoOptions(roOptionsRes);
      setSelectedKomponen("");
    }
  }, [selectedKro]);

  useEffect(() => {
    if (selectedRo) {
      let tempAllPok = dataPok;
      tempAllPok = tempAllPok.filter((item: any) => item.kd_ro === selectedRo);
      const komponenOptionsRes = getUniqueOptionsFromPok(
        tempAllPok,
        "kd_komponen",
        "nama_komponen"
      );
      setFilteredKomponenOptions(komponenOptionsRes);
    }
  }, [selectedRo]);

  if (isLoading || loadingPok)
    return <LoadingSpinner className="mx-auto" size={24} />;
  if (errorPok) return <div>Terjadi Error: {errorPok.message}</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="flex">
      <div className="w-2/5 pr-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Nama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jabatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Jabatan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_ruangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ruangan</FormLabel>
                  <FormControl>
                    <Select
                      className="text-xs md:text-base"
                      options={ruanganOptions}
                      onChange={(selectedOption) => {
                        field.onChange(
                          selectedOption ? selectedOption.value : ""
                        );
                        form.setValue(
                          "ruangan",
                          selectedOption ? selectedOption.label : ""
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal</FormLabel>
                  <FormControl>
                    <Input disabled type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="hidden">
              <FormField
                control={form.control}
                name="kd_program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <FormControl>
                      <Select
                        className="text-xs md:text-base"
                        options={filteredProgramOptions}
                        value={filteredProgramOptions.find(
                          (item: { value: string; label: string }) =>
                            item.value === selectedProgram
                        )}
                        onChange={(selectedOption) => {
                          const value = selectedOption
                            ? selectedOption.value
                            : "";
                          field.onChange(value);
                          form.setValue("kd_program", value);
                          setSelectedProgram(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kd_kegiatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kegiatan</FormLabel>
                    <FormControl>
                      <Select
                        className="text-xs md:text-base"
                        options={
                          selectedProgram !== "" ? filteredKegiatanOptions : []
                        }
                        value={filteredKegiatanOptions.find(
                          (item: { value: string; label: string }) =>
                            item.value === selectedKegiatan
                        )}
                        onChange={(selectedOption) => {
                          const value = selectedOption
                            ? selectedOption.value
                            : "";
                          field.onChange(value);
                          form.setValue("kd_kegiatan", value);
                          setSelectedKegiatan(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kd_kro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Klasifikasi Rincian Output</FormLabel>
                    <FormControl>
                      <Select
                        className="text-xs md:text-base"
                        options={
                          selectedKegiatan !== "" ? filteredKroOptions : []
                        }
                        value={filteredKroOptions.find(
                          (item: { value: string; label: string }) =>
                            item.value === selectedKro
                        )}
                        onChange={(selectedOption) => {
                          const value = selectedOption
                            ? selectedOption.value
                            : "";
                          field.onChange(value);
                          form.setValue("kd_kro", value);

                          setSelectedKro(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kd_ro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rincian Output</FormLabel>
                    <FormControl>
                      <Select
                        className="text-xs md:text-base"
                        options={selectedKro !== "" ? filteredRoOptions : []}
                        value={filteredRoOptions.find(
                          (item: { value: string; label: string }) =>
                            item.value === selectedRo
                        )}
                        onChange={(selectedOption) => {
                          const value = selectedOption
                            ? selectedOption.value
                            : "";
                          field.onChange(value);
                          form.setValue("kd_ro", value);
                          setSelectedRo(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kd_komponen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Komponen</FormLabel>
                    <FormControl>
                      <Select
                        className="text-xs md:text-base"
                        options={
                          selectedRo !== "" ? filteredKomponenOptions : []
                        }
                        value={filteredKomponenOptions.find(
                          (item: { value: string; label: string }) =>
                            item.value === selectedKomponen
                        )}
                        onChange={(selectedOption) => {
                          const value = selectedOption
                            ? selectedOption.value
                            : "";
                          field.onChange(value);
                          form.setValue("kd_komponen", value);
                          setSelectedKomponen(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* <FormField
              control={form.control}
              name="kd_kegiatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kegiatan</FormLabel>
                  <FormControl>
                    <Select
                      options={kegiatanOptions}
                      value={kegiatanOptions.find(
                        (item) => item.value === field.value
                      )}
                      onChange={(selected) => {
                        field.onChange(selected?.value || "");
                        setSelectedKegiatan(selected?.value || "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kd_kro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KRO</FormLabel>
                  <FormControl>
                    <Select
                      options={kroOptions}
                      value={kroOptions.find(
                        (item) => item.value === field.value
                      )}
                      onChange={(selected) => {
                        field.onChange(selected?.value || "");
                        setSelectedKRO(selected?.value || "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kd_ro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RO</FormLabel>
                  <FormControl>
                    <Select
                      options={roOptions}
                      value={roOptions.find(
                        (item) => item.value === field.value
                      )}
                      onChange={(selected) => {
                        field.onChange(selected?.value || "");
                        setSelectedRO(selected?.value || "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kd_komponen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Komponen</FormLabel>
                  <FormControl>
                    <Select
                      options={komponenOptions}
                      value={komponenOptions.find(
                        (item) => item.value === field.value
                      )}
                      onChange={(selected) => {
                        field.onChange(selected?.value || "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <BarangInputSwitcher
              isCustomBarang={isCustomBarang}
              setIsCustomBarang={setIsCustomBarang}
              form={form}
              barangOptions={barangOptions}
              allBarang={allBarang}
            />
            <FormField
              control={form.control}
              name="kategori"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Barang</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Kategori Barang"
                      {...field}
                      className="text-xs md:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="satuan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satuan</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Satuan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jumlah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Permintaan</FormLabel>
                  <FormControl>
                    <Input
                      // type="number"
                      placeholder="Jumlah Permintaan"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          !isNaN(Number(e.target.value))
                            ? Number(e.target.value)
                            : 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Tambahkan</Button>
          </form>
        </Form>
      </div>
      <div className="w-3/5 pl-4 border-l">
        <DataTable
          columns={[
            { header: "Ruangan", accessorKey: "ruangan" },
            { header: "Nama Barang", accessorKey: "nama_barang" },
            { header: "Kategori", accessorKey: "kategori" },
            { header: "Satuan", accessorKey: "satuan" },
            { header: "Stok", accessorKey: "stok" },
            { header: "Jumlah", accessorKey: "jumlah" },
            {
              header: "Aksi",
              cell: ({ row }) => (
                <button
                  onClick={() => handleDelete(row.index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Hapus
                </button>
              ),
            },
          ]}
          data={batchData}
          column_name="nama_barang"
        />
        <Button className="mt-4" onClick={handleSubmitBatch}>
          Submit Batch
        </Button>
      </div>
    </div>
  );
}
