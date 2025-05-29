export const formatTanggalLengkap = (tanggal) => {
  if (!tanggal) return '-';
  
  try {
    const [tahun, bulan, hari] = tanggal.split('-');
    const date = new Date(tahun, bulan - 1, hari);
    
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Format tanggal invalid:', tanggal);
    return '-';
  }
};