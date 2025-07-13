import { toTitleCase } from "@/lib/utils";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
    {
      src: "/assets/font/times-new-roman-italic.ttf",
      fontStyle: "italic",
      fontWeight: "normal",
    },
    {
      src: "/assets/font/times-new-roman-bold-italic.ttf",
      fontStyle: "italic",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 54, // Margin atas
    paddingBottom: 54, // Margin bawah
    paddingLeft: 36, // Margin kiri
    paddingRight: 36, // Margin kanan
    fontSize: 12,
    fontFamily: "Times New Roman",
  },
  header: {
    width: "auto",
    marginBottom: 5,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  headingOne: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 12, // Approx. equivalent to 1.5 in MS Word
    marginBottom: 6,
  },
  headingTwo: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 12,
  },
  footer: {
    position: "absolute",
    bottom: 30, // Jarak dari bawah halaman
    right: "50%",
    transform: "translateX(100%)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paragraph: {
    marginLeft: 18, // Indentasi paragraf
    marginVertical: 5, // Jarak atas dan bawah
    textAlign: "justify", // Rata kiri dan kanan
    fontSize: 12, // Ukuran font default
    lineHeight: 1.5, // Jarak antar baris
  },
  logo: {
    width: 200,
  },
  section: {
    margin: 10,
    padding: 10,
    border: "1px solid #000",
  },
  centeredText: {
    textAlign: "center",
  },
  table: {
    width: "auto",
    marginVertical: 5,
    borderTop: "1px solid #000",
    borderRight: "1px solid #000",
  },
  tableRowHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  tableCol: {
    padding: 5,
    borderLeft: "1px solid #000",
  },
  tableHeader: {
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
  underline: {
    textDecoration: "underline",
  },
  tableRowNoBorder: {
    padding: 5,
    flexDirection: "row",
  },
  tableColNoBorder: {
    textAlign: "left",
  },
});

export interface ListBarang {
  id_pengajuan: string;
  kd_barang: string;
  kd_subkategori: string;
  tanggal: string;
  harga_pengajuan: number;
  status: string;
  kategori: string;
  stok: string;
  stok_dasar: string;
  nama_barang: string;
  satuan: string;
  jumlah: string | number;
  harga_satuan: string;
  total_harga: string;
  temp: string;
}

export interface ListBarangLampiran1 {
  kd_barang: string;
  nama_barang: string;
  kategori: string;
  satuan: string;
  harga_satuan: number;
  stok: string;
  stok_dasar: string;
  jumlah: string;
  total_harga: number;
}
export interface KAKProps {
  // total: number;
  list_barang: ListBarang[];
}
[];

export interface KAKLampiran1Props {
  program: string;
  kegiatan: string;
  kro: string;
  ro: string;
  komponen: string;
  list_barang: ListBarangLampiran1[];
}

export const KAK = ({ data }: { data: KAKLampiran1Props[] }) => {
  const date = format(new Date(), "dd MMMM yyyy", { locale: id });
  const formatedPrice = (number: number) => {
    const formatedNumber = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
    return formatedNumber;
  };

  console.log("data in KAK", data);

  const uniqueBarang = new Map();

  data.forEach((item) => {
    item.list_barang.forEach((barang) => {
      if (!uniqueBarang.get(barang.kd_barang)) {
        uniqueBarang.set(barang.kd_barang, {
          kd_barang: barang.kd_barang,
          nama_barang: barang.nama_barang,
          satuan: barang.satuan,
          stok: isNaN(Number(barang.stok)) ? 0 : Number(barang.stok),
          stok_dasar: isNaN(Number(barang.stok_dasar))
            ? 0
            : Number(barang.stok_dasar),
          harga_satuan: barang.harga_satuan,
          jumlah: isNaN(Number(barang.jumlah)) ? 0 : Number(barang.jumlah),
          total_harga: barang.total_harga,
        });
      } else {
        const existingBarang = uniqueBarang.get(barang.kd_barang);
        existingBarang.stok += isNaN(Number(barang.stok))
          ? 0
          : Number(barang.stok);
        existingBarang.jumlah += isNaN(Number(barang.jumlah))
          ? 0
          : Number(barang.jumlah);
        existingBarang.total_harga += barang.total_harga;
      }
    });
  });
  console.log("unique barang", uniqueBarang);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={[styles.headingOne, { textAlign: "center", marginTop: 0 }]}
        >
          KERANGKA ACUAN KERJA
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            fontWeight: "bold",
            fontStyle: "italic",
            marginBottom: 12,
            marginTop: 6,
          }}
        >
          KEPERLUAN SEHARI-HARI PERKANTORAN
        </Text>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={{ width: "40%" }}>Kementerian Negara/Lembaga</Text>
            <Text style={{ width: "60%" }}>: BADAN PUSAT STATISTIK</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={{ width: "40%" }}>Satuan Kerja</Text>
            <Text style={{ width: "60%" }}>: BPS PROVINSI JAMBI</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={{ width: "40%" }}>Pembebanan</Text>
            <Text style={{ width: "60%" }}>
              : DIPA NOMOR: SP-DIDA 054.01.2.428145/2024
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Image src="/logo-bps-with-title.png" style={styles.logo} />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View>
          <View
            style={[styles.headingOne, styles.centeredText, { marginTop: 0 }]}
          >
            <Text>KERANGKAACUAN KERJA (TERM OF REFERENCE)</Text>
            <Text>PER KELUARAN KEGIATAN</Text>
          </View>
          <Text style={styles.headingOne}>A. Dasar Hukum</Text>
          <View style={styles.paragraph}>
            <Text>
              1. Undang-Undang Nomor 16 Tahun 1997 tentang Statistik (Lembaran
              Negara Republik Indonesia Tahun 1997 Nomor 39, Tambahan Lembaran
              Negara Republik Indonesia Nomor 3683)
            </Text>
            <Text>
              2. Undang-Undang Nomor 17 Tahun 2003 tentang Keuangan Negara; 3.
              Undang-Undang Nomor 1 Tahun 2004 tentang Perbendaharaan Negara;
            </Text>
            <Text>
              3. Undang-Undang Nomor 1 Tahun 2004 tentang Pemeriksaan
              Pengelolaan dan Tanggung Jawab Keuangan Negara
            </Text>
            <Text>
              4. Undang-Undang Nomor 15 Tahun 2004 tentang Pemeriksaan
              Pengelolaan dan Tanggung Jawab Keuangan Negara;
            </Text>
            <Text>
              5. Peraturan Presiden Republik Indonesia Nomor 16 Tahun 2018
              tentang Pengadaan Barang dan Jasa Pemerintah, sebagaimana telah
              diubah dengan Peraturan Presiden Republik Indonesia Nomor 12 Tahun
              2021 tentang Perubahan atas Peraturan Presiden Republik Indonesia
              Nomor 16 Tahun 2018 tentang Pengadaan Barang dan Jasa Pemerintah;
            </Text>
            <Text>
              6. Peraturan Menteri Keuangan Nomor 210/PMK.05/2022 Tahun 2022
              tentang Tata Cara Pembayaran dalam rangka Pelaksanaan Anggaran
              Pendapatan dan Belanja Negara;
            </Text>
            <Text>
              7. Peraturan Menteri Keuangan Republik Indonesia Nomor 49 Tahun
              2023 tentang Standar Biaya Masukan Tahun Anggaran 2024;
            </Text>
            <Text>
              8. Peraturan Menteri Keuangan Republik Indonesia Nomor 62 Tahun
              2023 tentang Perencanaan Anggaran, Pelaksanaan Anggaran, serta
              Akuntansi dan Pelaporan Keuang;
            </Text>
            <Text>
              9. Keputusan Direktur Jenderal Perbendaharaan Nomor
              KEP-331/PB/2021 tentang Kodefikasi Segmen Akun pada BaganAkun
              Standar.{" "}
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.headingOne}>B. Latar Belakang</Text>
          <Text style={styles.paragraph}>
            Belanja Keperluan Perkantoran digunakan untuk membiayai keperluan
            sehari-hari perkantoran yang secara langsung menunjang kegiatan
            operasional Kementerian/Lembaga. Belanja keperluan perkantoran
            termasuk kedalam jenis belanja barang dan jasa, yakni pengeluaran
            untuk menampung pembelian barang dan jasa yang habis pakai untuk
            memperduksi barang dan jasa yang dipasarkan maupun yang tidak
            dipasarkan serta pengadaan barang yang dimaksudkan untuk diserahkan
            atau dijual kepada masyarakat dan belanja perjalanan.
          </Text>
          <Text style={styles.paragraph}>
            Dalam rangka meningkatkan kinerja dan pelayanan ASN di lingkup Badan
            Pusat Statistik Provinsi Jambi, dibutuhkan sarana dan prasarana yang
            memadai demi kelancaran proses pelayanan internal dan eksternal.
            Maka dari itu, BPS Provinsi Jambi melaksanakan pengadaan barang yang
            habis pakai antara lain, pembelian alat-alat tulis, perlengkapan
            perkantoran, barang cetak, ARK (Alat Rumah tangga Kantor), alatalat
            kebersihan, dan biaya minum/makan kecil untuk rapat, biaya
            penerimaan tamu, dll yang mana satuan biayanya berkaitan dengan
            jumlah pegawai. Saat ini, ketersediaan barang yang habis pakai
            tersebut sudah mulai menipis (hampir habis) sehingga perlu dilakukan
            pengadaan dengan pembelian secara langsung ke penyedia.
          </Text>
        </View>

        <View>
          <Text style={styles.headingOne}>C. Maksud dan Tujuan</Text>
          <Text style={styles.headingTwo}>a. Maksud</Text>
          <Text style={[styles.paragraph, { marginLeft: 24 }]}>
            Melaksanakan pengadaan barang yang habis paka
          </Text>
          <Text style={styles.headingTwo}>b. Tujuan</Text>
          <Text style={[styles.paragraph, { marginLeft: 24 }]}>
            Tersedianya kebutuhan barang yang habis pakai secara memadai dan
            lengkap
          </Text>
        </View>

        <View>
          <Text style={styles.headingOne}>D. Manfaat</Text>
          <View style={styles.paragraph}>
            <Text>
              Manfaat yang dihasilkan dari pelaksanaan kegiatan ini adalah:
            </Text>
            <Text>
              a. Bagi Pegawai, memperoleh barang yang habis pakai sesuai
              kebutuhan sehingga pekerjaan dan proses kegiatan di BPS Provinsi
              Jambi dapat berjalan secara optimal;
            </Text>
            <Text>
              b. Bagi Satker BPS Provinsi Jambi, meningkatnya kinerja dan
              pelayanan ASN BPS Provinsi Jambi yang berpengaruh terhadap nama
              baik kantor.
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.headingOne}>
            E. Metode Pengadaan Barang/Jasa dan Ruang Lingkup
          </Text>
          <Text style={styles.paragraph}>
            Pembelian barang yang habis pakai berupa pembelian alat-alat tulis,
            perlengkapan perkantoran, barang cetak, ARK (Alat Rumah tangga
            Kantor), alat-alat kebersihan, dan biaya minum/makan kecil untuk
            rapat, biaya penerimaan tamu, dil yang dibutuhkan pegawai dilakukan
            dengan cara pembelian langsung ke pihak ketiga seperti Toko, Warung,
            Supermarket, dsb.
          </Text>
        </View>

        <View>
          <Text style={styles.headingOne}>F. Tempat dan Waktu Pelaksanaan</Text>
          <Text style={styles.paragraph}>
            Pengadaan yang berkaitan dengan keperluan sehari perkantoran
            tersebut dilaksanakan diluar BPS Provinsi Jambi dalam hal ini pihak
            ketiga atau penyedia seperti Toko, Warung, Supermarket, dsb
            sepanjang tahun 2024 mulai dari Januari sampai dengan Desember
            sesuai dengan kebutuhan.
          </Text>
        </View>
        <View>
          <Text style={styles.headingOne}>G. Biaya</Text>
          <Text style={styles.paragraph}>
            Pembiayaan akan dibebankan dalam DIPA Satuan Kerja BPS Provinsi
            Jambi Nomor SP-DIPA 054.01.2.428145/2024 yang meliputi: 1. Belanja
            Keperluan Sehari-Hari Perkantoran
          </Text>
        </View>

        <View>
          <Text style={[styles.headingTwo, { fontStyle: "italic" }]}>
            Rencana Anggaran Biaya (RAB)
          </Text>
          <Text style={[styles.headingTwo, { fontStyle: "italic" }]}>
            (Terlampir)
          </Text>
          <Text style={[styles.headingTwo, { fontStyle: "italic" }]}>
            Spesifikasi Teknis yang Diperlukan untuk Pengadaan
          </Text>
          <Text style={[styles.headingTwo, { fontStyle: "italic" }]}>
            (Terlampir)
          </Text>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 48 }}>
          <View style={styles.signatureSection}>
            <View style={styles.signatureColumn}>
              <Text>Menyetujui</Text>
              <Text>PPK BPS Provinsi Jambi</Text>
              <Text style={styles.signatureText}>Gafur, S.ST, M.Si.</Text>
            </View>
            <View style={styles.signatureColumn}>
              <Text style={{ textAlign: "right" }}>Jambi, {date}</Text>
              <Text>Yang Mengajukan</Text>
              <Text>Tim PBJ</Text>
              <Text style={styles.signatureText}>Sunandar, SE</Text>
            </View>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={{ textAlign: "right", fontWeight: "bold" }}>
          Lampiran 1
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 18,
            marginTop: 12,
          }}
        >
          RENCANA ANGGARAN BIAYA
        </Text>
        {data.map((item, index) => {
          // console.log(Object.keys(item))
          return (
            <View key={index}>
              <View style={styles.tableRowNoBorder}>
                <Text style={[styles.tableColNoBorder, { width: "30%" }]}>
                  Program
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "5%" }]}>
                  :
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "50%" }]}>
                  {item.program}
                </Text>
              </View>
              <View style={styles.tableRowNoBorder}>
                <Text style={[styles.tableColNoBorder, { width: "30%" }]}>
                  Kegiatan
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "5%" }]}>
                  :
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "50%" }]}>
                  {item.kegiatan}
                </Text>
              </View>
              <View style={styles.tableRowNoBorder}>
                <Text style={[styles.tableColNoBorder, { width: "30%" }]}>
                  Klasifikasi Rincian Output
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "5%" }]}>
                  :
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "50%" }]}>
                  {item.kro}
                </Text>
              </View>
              <View style={styles.tableRowNoBorder}>
                <Text style={[styles.tableColNoBorder, { width: "30%" }]}>
                  Rincian Output
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "5%" }]}>
                  :
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "50%" }]}>
                  {item.ro}
                </Text>
              </View>
              <View style={styles.tableRowNoBorder}>
                <Text style={[styles.tableColNoBorder, { width: "30%" }]}>
                  Komponen
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "5%" }]}>
                  :
                </Text>
                <Text style={[styles.tableColNoBorder, { width: "50%" }]}>
                  {item.komponen}
                </Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRowHeader}>
                  <Text
                    style={[
                      styles.tableCol,
                      styles.tableHeader,
                      { width: "10%" },
                    ]}
                  >
                    AKUN
                  </Text>
                  <Text
                    style={[
                      styles.tableCol,
                      styles.tableHeader,
                      { width: "30%" },
                    ]}
                  >
                    RINCIAN
                  </Text>
                  <Text
                    style={[
                      styles.tableCol,
                      styles.tableHeader,
                      { width: "15%" },
                    ]}
                  >
                    VOLUME
                  </Text>
                  <Text
                    style={[
                      styles.tableCol,
                      styles.tableHeader,
                      { width: "15%" },
                    ]}
                  >
                    SATUAN
                  </Text>
                  <Text
                    style={[
                      styles.tableCol,
                      styles.tableHeader,
                      { width: "15%" },
                    ]}
                  >
                    HARGA SATUAN
                  </Text>
                  <Text
                    style={[
                      styles.tableCol,
                      styles.tableHeader,
                      { width: "25%" },
                    ]}
                  >
                    JUMLAH (Rp)
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCol, { width: "10%" }]}>
                    521811
                  </Text>
                  <Text style={[styles.tableCol, { width: "30%" }]}>
                    Belanja barang persediaan barang konsumsi
                  </Text>
                  <Text style={[styles.tableCol, { width: "15%" }]}></Text>
                  <Text style={[styles.tableCol, { width: "15%" }]}></Text>
                  <Text style={[styles.tableCol, { width: "15%" }]}></Text>
                  <Text style={[styles.tableCol, { width: "25%" }]}></Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCol, { width: "10%" }]}></Text>
                  <Text style={[styles.tableCol, { width: "30%" }]}>
                    Alat Tulis Kantor
                  </Text>
                  <Text style={[styles.tableCol, { width: "15%" }]}></Text>
                  <Text style={[styles.tableCol, { width: "15%" }]}></Text>
                  <Text style={[styles.tableCol, { width: "15%" }]}></Text>
                  <Text style={[styles.tableCol, { width: "25%" }]}>
                    {formatedPrice(
                      item.list_barang.reduce(
                        (total, barang) => total + barang.total_harga,
                        0
                      )
                    )}
                  </Text>
                </View>
              </View>
              {/* <View style={styles.tableRowHeader}>
                <Text style={[styles.tableCol, styles.tableHeader]}>
                  {item.program}
                </Text>
                <Text style={[styles.tableCol, styles.tableHeader]}>
                  {item.kegiatan}
                </Text>
                <Text style={[styles.tableCol, styles.tableHeader]}>
                  {item.kro}
                </Text>
              </View> */}
            </View>
          );
        })}

        <Text style={{ textAlign: "right", fontWeight: "bold", marginTop: 18 }}>
          Lampiran 2
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginVertical: 18,
          }}
        >
          Spesifikasi Teknis
        </Text>
        <Text style={{ fontSize: 14, textAlign: "right", fontWeight: "bold" }}>
          {/* (
          {formatedPrice(
            data.list_barang.reduce(
              (total, barang) => total + barang.total_harga,
              0
            )
          )}
          ) */}
        </Text>
        <Text style={{ fontWeight: "bold", marginVertical: 18 }}>
          Daftar Barang dan Perlengkapan yang diperlukan:
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text
              style={[styles.tableCol, styles.tableHeader, { width: "5%" }]}
            >
              No
            </Text>
            <Text
              style={[styles.tableCol, styles.tableHeader, { width: "30%" }]}
            >
              Nama Barang
            </Text>
            <Text
              style={[styles.tableCol, styles.tableHeader, { width: "12%" }]}
            >
              Satuan
            </Text>
            <Text
              style={[styles.tableCol, styles.tableHeader, { width: "12%" }]}
            >
              Volume
            </Text>
            <Text
              style={[styles.tableCol, styles.tableHeader, { width: "20%" }]}
            >
              Harga Satuan (Rp)
            </Text>
            <Text
              style={[styles.tableCol, styles.tableHeader, { width: "20%" }]}
            >
              Total Harga (Rp)
            </Text>
          </View>
          {/* Iterate Here */}
          {uniqueBarang.size > 0 &&
            Array.from(uniqueBarang).map((item, index) => {
              console.log("item", item);
              const barang = item[1];
              return (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCol, { width: "5%" }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.tableCol, { width: "30%" }]}>
                    {toTitleCase(barang.nama_barang)}
                  </Text>
                  <Text style={[styles.tableCol, { width: "12%" }]}>
                    {toTitleCase(barang.satuan)}
                  </Text>
                  <Text style={[styles.tableCol, { width: "12%" }]}>
                    {barang.jumlah}
                  </Text>
                  <Text style={[styles.tableCol, { width: "20%" }]}>
                    {formatedPrice(barang.harga_satuan)}
                  </Text>
                  <Text style={[styles.tableCol, { width: "20%" }]}>
                    {formatedPrice(barang.total_harga)}
                  </Text>
                </View>
              );
            })}
        </View>
      </Page>
    </Document>
  );
};
