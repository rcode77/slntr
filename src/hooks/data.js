const convert = (val) => {
  if (val < 1024) {
    return val + "byte";
  } else if (val > 1023 && val < 1024 ** 2) {
    return (val / 1024).toFixed(1) + "KB";
  } else if (val > 1024 ** 2 && val < 1024 ** 3) {
    return (val / 1024 ** 2).toFixed(1) + "MB";
  } else if (val > 1024 ** 3 && val < 1024 ** 4) {
    return (val / 1024 ** 3).toFixed(1) + "GB";
  } else if (val > 1024 ** 4 && val < 1024 ** 5) {
    return (val / 1024 ** 4).toFixed(1) + "TB";
  }
};

const namefile = {
  bulanan: [
    "arah-angin-bulanan",
    "arah-matahari-zenith-bulanan",
    "curah-hujan-bulanan",
    "indeks-kebeningan-bulanan",
    "kecepatan-angin-bulanan",
    "kecepatan-angin-maksimum-bulanan",
    "potensi-bulanan",
    "sunrise-bulanan",
    "sunset-bulanan",
    "temperature-bulanan",
    "temperature-maximum-bulanan",
    "tutupan-awan-menengah-bulanan",
    "tutupan-awan-rendah-bulanan",
    "tutupan-awan-tinggi-bulanan",
    "tutupan-awan-total-bulanan",
  ],
  harianPrakiraan: [
    "ghi-harian",
    "arah-angin-harian",
    "kecepatan-angin-harian",
    "kecepatan-angin-maksimum-harian",
    "temperature-harian",
    "tutupan-awan-total-harian",
    "tutupan-awan-tinggi-harian",
    "tutupan-awan-menengah-harian",
    "tutupan-awan-rendah-harian",
    "curah-hujan-harian",
    "pv-output-harian",
  ],
  bulananPrairaan: [
    "potensi-bulanan",
    "suhu-maksimum-bulanan",
    "indeks-kebeningan-bulanan",
  ],
  tahunan: [
    "arah-angin-tahunan",
    "curah-hujan-tahunan",
    "indeks-kebeningan-tahunan",
    "kecepatan-angin-maksimum-tahunan",
    "kecepatan-angin-tahunan",
    "potensi-tahunan",
    "temperature-maximum-tahunan",
    "temperature-tahunan",
    "tutupan-awan-menengah-tahunan",
    "tutupan-awan-rendah-tahunan",
    "tutupan-awan-tinggi-tahunan",
    "tutupan-awan-total-tahunan",
  ],
};

let tahun = [];
const date = new Date();
const year = date.getFullYear();
for (let i = 2020; i <= year; i++) {
  tahun.push(i);
}

const times = {
  tanggal: [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
  ],
  bulan: [
    {
      id: "01",
      name: "Januari",
    },
    {
      id: "02",
      name: "Februari",
    },
    {
      id: "03",
      name: "Maret",
    },
    {
      id: "04",
      name: "April",
    },
    {
      id: "05",
      name: "Mei",
    },
    {
      id: "06",
      name: "Juni",
    },
    {
      id: "07",
      name: "Juli",
    },
    {
      id: "08",
      name: "Agustus",
    },
    {
      id: "09",
      name: "September",
    },
    {
      id: "10",
      name: "Oktober",
    },
    {
      id: "11",
      name: "November",
    },
    {
      id: "12",
      name: "Desember",
    },
  ],
  tahun,
};

export { namefile, convert, times };
