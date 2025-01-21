import {toTitleCase} from '@/lib/utils';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

Font.register({
  family: 'Times New Roman',
  src: '/src/assets/font/times new roman.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Times New Roman',
  },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottom: '1.5px solid #000',
  },
  logo: {
    width: 50,
    height: 40,
    marginRight: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    border: '1px solid #000',
  },
  centeredText: {
    textAlign: 'center',
  },
  table: {
    width: 'auto',
    marginVertical: 5,
    border: '1px solid #000',
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    padding: 5,
    borderLeft: '1px solid #000',
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureColumn: {
    alignItems: 'center',
  },
  signatureText: {
    marginTop: 60,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
  },
  underline: {
    textDecoration: 'underline',
  },
});

export interface Desc {
  noSurat: string;
  ruangan: string;
  tanggal: string;
}

export interface DataItem {
  id_permintaan: string;
  jumlah: number;
  satuan: string;
  nama_barang: string;
  keterangan: string;
}

export interface BlankoProps {
  data: DataItem[];
  desc: Desc;
}

export const Blanko = ({data, desc}: BlankoProps) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.header}>
        <Image src='/logo-bps.png' style={styles.logo} />
        <View>
          <Text>BADAN PUSAT STATISTIK PROVINSI JAMBI</Text>
          <Text>
            Jl. A. Yani No. 4 Telanaipura - Jambi 36122 Telp. (0741) 60497
          </Text>
          <Text>Fax (0741) 60802 E-mail: BPS1500@mailhost.bps.go.id</Text>
        </View>
      </View>

      <View>
        <Text style={[styles.centeredText, styles.underline]}>
          Badan Pusat Statistik Provinsi Jambi
        </Text>
        <Text style={styles.centeredText}>Permintaan ATK/ARK</Text>
        <Text>No Bukti: {desc.noSurat}</Text>
        <Text style={{marginTop: 10}}>Dari Bidang/Bagian: {desc.ruangan}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <Text style={[styles.tableCol, styles.tableHeader, {width: '5%'}]}>
            No
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, {width: '20%'}]}>
            Banyaknya
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, {width: '37.5%'}]}>
            Jenis Barang
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, {width: '37.5%'}]}>
            Keterangan
          </Text>
        </View>
        {data.map((item) => (
          <View style={styles.tableRow} key={item.id_permintaan}>
            <Text style={[styles.tableCol, {width: '5%'}]}>
              {data.indexOf(item) + 1}
            </Text>
            <Text style={[styles.tableCol, {width: '20%'}]}>
              {item.jumlah} {item.satuan}
            </Text>
            <Text style={[styles.tableCol, {width: '37.5%'}]}>
              {toTitleCase(item.nama_barang)}
            </Text>
            <Text style={[styles.tableCol, {width: '37.5%'}]}>
              {item.keterangan}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureColumn}>
          <Text>Yang menerima</Text>
          <Text>ATK</Text>
          <Text style={styles.signatureText}>----------------------</Text>
        </View>
        <View style={styles.signatureColumn}>
          <Text>Jambi, {desc.tanggal}</Text>
          <Text>Yang menyerahkan ATK</Text>
          <Text>Bagian Umum</Text>
          <Text style={styles.signatureText}>Asni Junita S.E.</Text>
          <Text>198606292005022001</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Diketahui oleh:</Text>
        <Text>Kepala Bagian Umum,</Text>
        <Text style={[styles.underline, {marginTop: 60}]}>
          Eko Libri Ardi, S.E., M.M., CA.
        </Text>
        <Text>197309251994031002</Text>
      </View>
    </Page>
  </Document>
);
