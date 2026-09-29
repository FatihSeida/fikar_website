/**
 * Data geolokasi DB-IP memakai nama wilayah berbahasa Inggris. Dashboard
 * menampilkannya dalam bahasa Indonesia; nama yang tidak ada di sini dipakai
 * apa adanya.
 */
const provinsi: Record<string, string> = {
  "Aceh": "Aceh",
  "Bali": "Bali",
  "Bangka–Belitung Islands": "Kepulauan Bangka Belitung",
  "Banten": "Banten",
  "Bengkulu": "Bengkulu",
  "Central Java": "Jawa Tengah",
  "Central Kalimantan": "Kalimantan Tengah",
  "Central Papua": "Papua Tengah",
  "Central Sulawesi": "Sulawesi Tengah",
  "East Java": "Jawa Timur",
  "East Kalimantan": "Kalimantan Timur",
  "East Nusa Tenggara": "Nusa Tenggara Timur",
  "Gorontalo": "Gorontalo",
  "Highland Papua": "Papua Pegunungan",
  "Jakarta": "DKI Jakarta",
  "Jambi": "Jambi",
  "Lampung": "Lampung",
  "Maluku": "Maluku",
  "North Kalimantan": "Kalimantan Utara",
  "North Maluku": "Maluku Utara",
  "North Sulawesi": "Sulawesi Utara",
  "North Sumatra": "Sumatera Utara",
  "Papua": "Papua",
  "Riau": "Riau",
  "Riau Islands": "Kepulauan Riau",
  "South Kalimantan": "Kalimantan Selatan",
  "South Papua": "Papua Selatan",
  "South Sulawesi": "Sulawesi Selatan",
  "South Sumatra": "Sumatera Selatan",
  "Southeast Sulawesi": "Sulawesi Tenggara",
  "Southwest Papua": "Papua Barat Daya",
  "West Java": "Jawa Barat",
  "West Kalimantan": "Kalimantan Barat",
  "West Nusa Tenggara": "Nusa Tenggara Barat",
  "West Papua": "Papua Barat",
  "West Sulawesi": "Sulawesi Barat",
  "West Sumatra": "Sumatera Barat",
  "Yogyakarta": "DI Yogyakarta",
};

const kota: Record<string, string> = {
  "Ambon City": "Kota Ambon",
  "Bekasi Regency": "Kabupaten Bekasi",
  "Central Jakarta": "Jakarta Pusat",
  "East Jakarta": "Jakarta Timur",
  "Gowa Regency": "Kabupaten Gowa",
  "Jambi City": "Kota Jambi",
  "Kulon Progo Regency": "Kabupaten Kulon Progo",
  "North Jakarta": "Jakarta Utara",
  "Nusantara Capital City": "Ibu Kota Nusantara",
  "Polewali Mandar Regency": "Kabupaten Polewali Mandar",
  "South Jakarta": "Jakarta Selatan",
  "South Tangerang": "Tangerang Selatan",
  "West Jakarta": "Jakarta Barat",
};

export function namaProvinsi(nama: string | undefined | null): string | null {
  if (!nama) return null;
  return provinsi[nama] ?? nama;
}

export function namaKota(nama: string | undefined | null): string | null {
  if (!nama) return null;
  return kota[nama] ?? nama;
}
