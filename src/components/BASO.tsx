import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import { format } from "date-fns";
import { id } from "date-fns/locale";

// Daftarkan font Times New Roman
Font.register({
  family: "Times New Roman",
  fonts: [
    {
      src: "/assets/font/times-new-roman.ttf",
      fontStyle: "normal",
      fontWeight: "normal",
    },
    {
      src: "/assets/font/Times-New-Roman-Bold.ttf",
      fontStyle: "normal",
      fontWeight: "bold",
    },
  ],
});

// Gaya dokumen
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Times New Roman",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid", // tambahkan ini!
    padding: 4,
    textAlign: "center",
    borderWidth: 1,
  },
  tableColSpanRow: {
    borderStyle: "solid", // tambahkan ini!
    padding: 4,
    textAlign: "center",
    borderWidth: 1,
    borderTopWidth: 0,
  },
  tableColSpanRowAtas: {
    borderStyle: "solid", // tambahkan ini!
    padding: 4,
    textAlign: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  boldText: {
    fontWeight: "bold",
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureColumn: {
    alignItems: "center",
  },
  signatureText: {
    marginTop: 60,
  },
});

// Komponen PDF
export interface BASOProps {
  rows: Array<{
    nama_barang: string;
    satuan: string;
    total_persediaan: number;
    harga_satuan: number;
    total_harga: number;
  }>;
}

function tahunKeTerbilang(tahun: number): string {
  const satuan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
  ];

  const belasan = [
    "Sepuluh",
    "Sebelas",
    "Dua Belas",
    "Tiga Belas",
    "Empat Belas",
    "Lima Belas",
    "Enam Belas",
    "Tujuh Belas",
    "Delapan Belas",
    "Sembilan Belas",
  ];

  const puluhan = [
    "",
    "",
    "Dua Puluh",
    "Tiga Puluh",
    "Empat Puluh",
    "Lima Puluh",
    "Enam Puluh",
    "Tujuh Puluh",
    "Delapan Puluh",
    "Sembilan Puluh",
  ];

  const ribuan = Math.floor(tahun / 1000); // 2
  const ratusan = Math.floor((tahun % 1000) / 100); // 0
  const duaDigitTerakhir = tahun % 100; // 25

  let hasil = "";

  // Ribuan
  hasil += satuan[ribuan] + " Ribu ";

  // Ratusan
  if (ratusan > 0) {
    hasil += satuan[ratusan] + " Ratus ";
  }

  // Puluhan dan satuan
  if (duaDigitTerakhir >= 10 && duaDigitTerakhir < 20) {
    hasil += belasan[duaDigitTerakhir - 10];
  } else {
    const puluh = Math.floor(duaDigitTerakhir / 10);
    const satu = duaDigitTerakhir % 10;
    if (puluh > 0) hasil += puluhan[puluh] + " ";
    if (satu > 0) hasil += satuan[satu];
  }

  return hasil.trim();
}

export const formatTanggalLengkap = (tanggal = new Date()): string => {
  const hari = format(tanggal, "eeee", { locale: id }); // Selasa
  const tanggalAngka = format(tanggal, "dd", { locale: id }); // 08
  const bulan = format(tanggal, "LLLL", { locale: id }); // Juli
  const tahun = parseInt(format(tanggal, "yyyy")); // 2025

  return `Pada hari ini ${hari} Tanggal ${tanggalAngka} Bulan ${bulan} Tahun ${tahunKeTerbilang(
    tahun
  )}, kami telah melaksanakan opname fisik barang persediaan dengan hasil rincian sebagai berikut :`;
};


export const BASO = ({ data }: { data: BASOProps }) => {
  const date = format(new Date(), "dd MMMM yyyy", { locale: id });
  console.log(data);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>DAFTAR BARANG PERSEDIAAN</Text>

        <Text style={{ marginBottom: 15 }}>{formatTanggalLengkap()}</Text>

        <View style={styles.table}>
          {/* Baris Header */}
          {/* Baris Header 1 */}
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableColSpanRowAtas,
                styles.boldText,
                {
                  width: "5%",
                  height: 40,
                  textAlign: "center",
                  justifyContent: "center",
                },
              ]}
            >
              No
            </Text>
            <Text
              style={[
                styles.tableColSpanRowAtas,
                styles.boldText,
                { width: "35%", height: 40, textAlign: "center" },
              ]}
            >
              Uraian Barang
            </Text>
            <Text
              style={[
                styles.tableColSpanRowAtas,
                styles.boldText,
                { width: "10%", height: 40, textAlign: "center" },
              ]}
            >
              Satuan
            </Text>
            {/* <Text
              style={[
                styles.tableColSpanRowAtas,
                styles.boldText,
                { width: "15%", height: 40, textAlign: "center" },
              ]}
            >
              Harga Beli Satuan (Rupiah)
            </Text> */}
            <Text
              style={[
                styles.tableColSpanRowAtas,
                styles.boldText,
                { width: "50%", textAlign: "center" },
              ]}
            >
              Total Persediaan
            </Text>
          </View>

          {/* Baris Header 2 */}
          <View style={styles.tableRow} wrap={false}>
            {/* Kolom-kolom yang sudah rowspan tadi harus dikosongkan agar tidak dobel */}
            <Text style={[styles.tableColSpanRow, { width: "5%" }]}></Text>
            <Text style={[styles.tableColSpanRow, { width: "35%" }]}></Text>
            <Text style={[styles.tableColSpanRow, { width: "10%" }]}></Text>
            {/* <Text style={[styles.tableColSpanRow, { width: "15%" }]}></Text> */}

            {/* Subkolom dari "Total Persediaan" */}
            <Text
              style={[
                styles.tableCol,
                styles.boldText,
                { width: "20%", textAlign: "center" },
              ]}
            >
              Stok
            </Text>
            <Text
              style={[
                styles.tableCol,
                styles.boldText,
                { width: "30%", textAlign: "center" },
              ]}
            >
              Harga Total
            </Text>
          </View>
          {/* Baris Data */}
          {data.rows.map(
            (
              item: {
                nama_barang: string;
                satuan: string;
                total_persediaan: number;
                harga_satuan: number;
                total_harga: number;
              },
              idx: number
            ) => (
              <View style={styles.tableRow} key={idx} wrap={false}>
                <Text style={[styles.tableCol, { width: "5%" }]}>
                  {idx + 1}
                </Text>
                <Text style={[styles.tableCol, { width: "35%" }]}>
                  {item.nama_barang}
                </Text>
                <Text style={[styles.tableCol, { width: "10%" }]}>
                  {item.satuan}
                </Text>
                {/* <Text style={[styles.tableCol, { width: "15%" }]}> */}
                  {/* {item.harga_satuan.toLocaleString("id-ID")} */}
                {/* </Text> */}
                <Text style={[styles.tableCol, { width: "20%" }]}>
                  {item.total_persediaan}
                </Text>
                <Text style={[styles.tableCol, { width: "30%" }]}>
                  {item.total_harga}
                </Text>
              </View>
            )
          )}
          {/* Baris Total */}
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableColSpanRowAtas,
                styles.boldText,
                { width: "70%", textAlign: "center" },
              ]}
            >
              Total
            </Text>
            <Text
              style={[
                styles.tableCol,
                styles.boldText,
                { width: "30%", textAlign: "center" },
              ]}
            >
              {data.rows
                .reduce(
                  (acc, item) =>
                    acc + item.total_persediaan * item.harga_satuan,
                  0
                )
                .toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 48 }} wrap={false}>
          <View style={styles.signatureSection}>
            <View style={[styles.signatureColumn, { marginLeft: 50 }]}>
              <Text>Mengetahui</Text>
              <Text>Penanggungjawab KPB</Text>
              <Text style={styles.signatureText}>Agus Sudibyo, M.Stat</Text>
              <Text>NIP : 197412311996121001</Text>
            </View>
            <View style={[styles.signatureColumn, { marginRight: 50 }]}>
              <Text style={{ textAlign: "right"}}>
                Jambi, {date}
              </Text>
              <Text>Petugas Pengelola Persediaan</Text>
              <Text style={styles.signatureText}>Asni Junita, SE</Text>
              <Text>NIP : 198606292005022001</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
