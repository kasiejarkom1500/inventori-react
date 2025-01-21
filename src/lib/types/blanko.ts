interface TableDataItem {
  no: number;
  jumlah: number;
  satuan: string;
  jenisBarang: string;
  keterangan: string;
}

export interface BlankoProps {
  blankoData: TableDataItem[];
}