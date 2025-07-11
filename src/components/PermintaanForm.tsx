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
  fetchAllKegiatan,
  fetchAllKomponen,
  fetchAllKRO,
  fetchAllProgram,
  fetchAllRO,
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
    .number()
    .positive({ message: "Jumlah permintaan harus lebih dari 0." }),
  kd_program: z.string().optional(),
  kd_kegiatan: z.string().optional(),
  kd_kro: z.string().optional(),
  kd_ro: z.string().optional(),
  kd_komponen: z.string().optional(),
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
          <Button
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
          </Button>
        </>
      ) : (
        <>
          <FormField
            control={form.control}
            name="nama_barang"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Nama Barang Baru" {...field} />
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
    }>
  >([]);

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

  const {
    data: dataProgram,
    isLoading: loadingProgram,
    error: errorProgram,
  } = useQuery({
    queryKey: ["program"],
    queryFn: async () => {
      return fetchAllProgram().then((res) => {
        return res.data
          ? res.data.map((item: { kd_program: string; nama: string }) => ({
              value: item.kd_program,
              label: item.nama,
            }))
          : [];
      });
      // fetchAllProgram();
    },
  });

  // const programOptions = dataProgram
  //   ? dataProgram.map((item: { kd_program: string; nama: string }) => ({
  //       value: item.kd_program,
  //       label: item.nama,
  //     }))
  //   : [];

  console.log("programOptions", programOptions);

  // const {
  //   data: dataKegiatan,
  //   isLoading: loadingKegiatan,
  //   error: errorKegiatan,
  // } = useQuery({
  //   queryKey: ["kegiatan"],
  //   queryFn: fetchAllKegiatan,
  // });

  // const {
  //   data: dataKRO,
  //   isLoading: loadingKRO,
  //   error: errorKRO,
  // } = useQuery({
  //   queryKey: ["kro"],
  //   queryFn: fetchAllKRO,
  // });

  // const {
  //   data: dataRO,
  //   isLoading: loadingRO,
  //   error: errorRO,
  // } = useQuery({
  //   queryKey: ["ro"],
  //   queryFn: fetchAllRO,
  // });

  // const {
  //   data: dataKomponen,
  //   isLoading: loadingKomponen,
  //   error: errorKomponen,
  // } = useQuery({
  //   queryKey: ["komponen"],
  //   queryFn: fetchAllKomponen,
  // });

  const loadingStates = [
    loadingProgram,
    // loadingKegiatan,
    // loadingKRO,
    // loadingRO,
    // loadingKomponen,
  ];

  const hasError = errorProgram;
  // || errorKegiatan || errorKRO || errorRO || errorKomponen;

  const isLoadingAll = loadingStates.some(Boolean);

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

  // console.log("ruanganOptions", ruanganOptions);

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
    };

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
      queryClient.invalidateQueries({ queryKey: "data-permintaan-user" });
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

  if (isLoading) return <LoadingSpinner className="mx-auto" size={24} />;
  if (isLoadingAll) return <LoadingSpinner className="mx-auto" size={24} />;
  if (error) return <div>An error has occurred: {error.message}</div>;
  if (hasError) return <div>An error has occurred: {hasError.message}</div>;

  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedKegiatan, setSelectedKegiatan] = useState("");
  const [selectedKRO, setSelectedKRO] = useState("");
  const [selectedRO, setSelectedRO] = useState("");

  const [kegiatanOptions, setKegiatanOptions] = useState([]);
  const [kroOptions, setKroOptions] = useState([]);
  const [roOptions, setRoOptions] = useState([]);
  const [komponenOptions, setKomponenOptions] = useState([]);

  useEffect(() => {
    if (selectedProgram) {
      fetchAllKegiatan(selectedProgram).then((data) => {
        setKegiatanOptions(
          data.map((item) => ({
            value: item.kd_kegiatan,
            label: item.nama,
          }))
        );
      });
    } else {
      setKegiatanOptions([]);
    }
    setSelectedKegiatan("");
    setSelectedKRO("");
    setSelectedRO("");
  }, [selectedProgram]);

  // useEffect(() => {
  //   if (selectedKegiatan) {
  //     fetchAllKRO(selectedKegiatan).then((data) => {
  //       setKroOptions(
  //         data.map((item) => ({
  //           value: item.kd_kro,
  //           label: item.nama,
  //         }))
  //       );
  //     });
  //   } else {
  //     setKroOptions([]);
  //   }
  //   setSelectedKRO("");
  //   setSelectedRO("");
  // }, [selectedKegiatan]);

  // useEffect(() => {
  //   if (selectedKRO) {
  //     fetchAllRO(selectedKRO).then((data) => {
  //       setRoOptions(
  //         data.map((item) => ({
  //           value: item.kd_ro,
  //           label: item.nama,
  //         }))
  //       );
  //     });
  //   } else {
  //     setRoOptions([]);
  //   }
  //   setSelectedRO("");
  // }, [selectedKRO]);

  // useEffect(() => {
  //   if (selectedRO) {
  //     fetchAllKomponen(selectedRO).then((data) => {
  //       setKomponenOptions(
  //         data.map((item) => ({
  //           value: item.kd_komponen,
  //           label: item.nama,
  //         }))
  //       );
  //     });
  //   } else {
  //     setKomponenOptions([]);
  //   }
  // }, [selectedRO]);

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
            <FormField
              control={form.control}
              name="kd_program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <FormControl>
                    <Select
                      options={programOptions}
                      value={programOptions.find(
                        (item) => item.value === field.value
                      )}
                      onChange={(selectedOption) => {
                        const value = selectedOption
                          ? selectedOption.value
                          : "";
                        field.onChange(value);
                        form.setValue("kd_program", value);
                        setSelectedProgram(value); // ✅ ini dia yang kurang
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input disabled placeholder="Kategori Barang" {...field} />
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
                      type="number"
                      placeholder="Jumlah Permintaan"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
