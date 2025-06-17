import { toTitleCase } from '@/lib/utils';
import {
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image
} from '@react-pdf/renderer';

Font.register({
  family: 'Times New Roman',
  fonts: [
    {
      src: '/assets/font/times new roman.ttf',
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    {
      src: '/assets/font/Times New Roman Bold.ttf',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    {
      src: '/assets/font/times-new-roman-italic.ttf',
      fontStyle: 'italic',
      fontWeight: 'normal',
    },
    {
      src: '/assets/font/times-new-roman-bold-italic.ttf',
      fontStyle: 'italic',
      fontWeight: 'bold',
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
    fontFamily: 'Times New Roman',
  },
  header: {
    width: 'auto',
    marginBottom: 5,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  headingOne: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12, // Approx. equivalent to 1.5 in MS Word
    marginBottom: 6,
  },
  headingTwo: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30, // Jarak dari bawah halaman
    right: '50%',
    transform: 'translateX(100%)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paragraph: {
    marginLeft: 18, // Indentasi paragraf
    marginVertical: 5, // Jarak atas dan bawah
    textAlign: 'justify', // Rata kiri dan kanan
    fontSize: 12, // Ukuran font default
    lineHeight: 1.5, // Jarak antar baris
  },
  logo: {
    width: 200,
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
    borderTop: '1px solid #000',
    borderRight: '1px solid #000',
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  tableCol: {
    padding: 5,
    borderLeft: '1px solid #000',
    textAlign: 'center',
  },
  tableColSpan: {
    padding: 5,
    borderLeft: '1px solid #000',
    textAlign: 'center',
    fontWeight: 'bold',
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
  underline: {
    textDecoration: 'underline',
  },
});

export interface ListTransaksi {
  tanggal: string;
  masuk: string;
  keluar: string;
  faktur: string;
  uraian: string;
  current_stok: string;
}
export interface KarkenProps {
  id_barang: number;
  nama_barang: string;
  kd_barang: string;
  satuan: string;
  kategori: string;
  rows: ListTransaksi[];
}

export const Karken = ({ data }: { data: KarkenProps }) => {

  const totalKeluar = data.rows.reduce((sum, item) => sum + parseFloat(item.keluar || '0'), 0);
  // const totalCurrent = data.rows.reduce((sum, item) => sum + parseFloat(item.current_stok || '0'), 0);
  const totalCurrent = parseFloat(data.rows[data.rows.length - 1]?.current_stok || '0');
  const firstItem = data.rows[0] || {};
  const totalStokAwal = parseFloat(firstItem.current_stok || '0') - parseFloat(firstItem.masuk || '0') + parseFloat(firstItem.keluar || '0');
  const totalMasuk = data.rows.reduce((sum, item) => sum + parseFloat(item.masuk || '0'), 0) + totalStokAwal;


  return (
    <Page size='A4' style={styles.page}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginTop: 12 }}>
        {/* Gambar berbentuk lingkaran */}
        <Image 
          src='/logo-bps.png' 
          style={{ 
            width: 40, 
            height: 40, 
            // borderRadius: 20, // Membuat gambar menjadi lingkaran
            marginRight: 10, 
          }} 
        />
        
        {/* Teks di kanan gambar, sejajar di tengah */}
        <Text
          style={{
            textAlign: 'left', // Menjaga teks rata kiri di kanan gambar
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          {data.kategori === 'ATK' 
            ? 'KARTU PERSEDIAAN ALAT TULIS KANTOR ( 5218111 )' 
            : 'KARTU PERSEDIAAN BARANG PAKAI HABIS ( 5218111 )'}
        </Text>
      </View>

      

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={{ width: '40%' }}>Nama Barang</Text>
          <Text style={{ width: '60%' }}>
            : {data.nama_barang}
          </Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={{ width: '40%' }}>Kode Barang</Text>
          <Text style={{ width: '60%' }}>
            : {data.kd_barang}
          </Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={{ width: '40%' }}>Satuan Barang</Text>
          <Text style={{ width: '60%' }}>
            : {data.satuan}
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <Text style={[styles.tableCol, styles.tableHeader, { width: '5%' }]}>
            No
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, { width: '20%' }]}>
            No Bon/Faktur
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, { width: '15%' }]}>
            Tgl M/K
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, { width: '20%' }]}>
            Uraian Pemasukan/Pengeluaran
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, { width: '20%' }]}>
            Masuk (M)
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, { width: '20%' }]}>
            Keluar (K)
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader, { width: '20%' }]}>
            Sisa Barang
          </Text>
        </View>

        <View style={styles.tableRow}>
            <Text style={[styles.tableColSpan, { width: '60%'}]}>
              {'Stok Awal'}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {totalStokAwal}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {'-'}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {totalStokAwal}
            </Text>
          </View>

        {data.rows.map((item, index) => (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, { width: '5%' }]}>{index + 1}</Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {toTitleCase(item.faktur)}
            </Text>
            <Text style={[styles.tableCol, { width: '15%' }]}>
              {toTitleCase(item.tanggal)}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {toTitleCase(item.uraian)}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {item.masuk}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {item.keluar}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {item.current_stok}
            </Text>
          </View>
        ))}
          <View style={styles.tableRow}>
            <Text style={[styles.tableColSpan, { width: '60%'}]}>
              {'Jumlah'}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {totalMasuk}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {totalKeluar}
            </Text>
            <Text style={[styles.tableCol, { width: '20%' }]}>
              {totalCurrent}
            </Text>
          </View>
      </View>
    </Page>
  );
};
