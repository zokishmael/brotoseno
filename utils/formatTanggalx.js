export const formatTanggal = (tanggal) => {
  if (!tanggal) return '-';
  
  try {
    const [tahun, bulan, hari] = tanggal.split('-');
    return `${hari}-${bulan}-${tahun}`;
  } catch (error) {
    console.error('Format tanggal invalid:', tanggal);
    return '-';
  }
};