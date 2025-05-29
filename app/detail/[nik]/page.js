'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { formatTanggalLengkap } from '@/utils/formatTanggal';
import ThemeToggle from '@/components/ThemeToggle';

export default function DetailPage() {
  const { nik } = useParams();
  const [data, setData] = useState(null);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get main data
        const { data: mainData } = await supabase
          .from('ktp')
          .select('*')
          .eq('nik', nik)
          .single();

        // Get family members
        const { data: familyData } = await supabase
          .from('ktp')
          .select('nik, nama_lengkap, jenis_kelamin, tmpt_lhr, tgl_lhr, status_hub_keluarga, id_foto')
          .eq('no_kk', mainData?.no_kk || '');

        setData(mainData);
        setFamily(familyData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nik]);

const capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const capitalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

  if (loading) {
    return <div className="container mx-auto p-4">Memuat data...</div>;
  }

  if (!data) {
    return <div className="container mx-auto p-4">Data tidak ditemukan</div>;
  }

  return (
    <div className="container mx-auto p-4">
	<Link 
    href="/" 
    className="mb-4 inline-block text-blue-500 hover:text-blue-700"
  >
    &larr; Kembali ke Pencarian
  </Link>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Kolom Foto */}
        <div>
          <Image
            src={data.id_foto ? 
    `https://lh3.googleusercontent.com/d/${data.id_foto}` : 
    data.jenis_kelamin === 'LAKI-LAKI' ? 
      '/images/male-placeholder.jpg' : 
      '/images/female-placeholder.jpg'}
            alt={data.nama_lengkap}
            width={600}
            height={400}
            className="w-full rounded-lg"
            priority
          />
        </div>

        {/* Kolom Data */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold mb-6">{data.nama_lengkap}</h1>
          
          {Object.entries({
            NIK: data.nik,
            'No KK': data.no_kk,
            'Jenis Kelamin': capitalize(data.jenis_kelamin),
            'Tempat Lahir': capitalize(data.tmpt_lhr),
            'Tanggal Lahir':  capitalizeFirstLetter(formatTanggalLengkap(data.tgl_lhr)),
            Ibu: capitalize(data.ibu),
            Ayah: capitalize(data.ayah),
            'Status Hubungan Keluarga': capitalize(data.status_hub_keluarga),
            'Jenis Pekerjaan': capitalize(data.jenis_pekerjaan),
            Alamat: capitalize(data.alamat),
            Kecamatan: capitalize(data.nama_kec),
            Kelurahan: capitalize(data.nama_kel)
          }).map(([key, value]) => (
            <div key={key} className="flex border-b py-2">
              <div className="w-1/3 font-medium">{key}</div>
              <div className="w-2/3">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {family.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Anggota Keluarga Lain:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {family
              .filter(member => member.nik !== data.nik)
              .map(member => (
                <div key={member.nik} className="p-4 border rounded flex items-center gap-4">
                  <Image
                    src={member.id_foto ? 
    `https://lh3.googleusercontent.com/d/${member.id_foto}=s50` : 
    member.jenis_kelamin === 'LAKI-LAKI' ? 
      '/images/male-placeholder.jpg' : 
      '/images/female-placeholder.jpg'}
                    alt="thumbnail"
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{member.nama_lengkap}</h3>
                    <p>{formatTanggalLengkap(member.tgl_lhr)}</p>
                    <p>{member.status_hub_keluarga}  lahir di {capitalize(member.tmpt_lhr)}</p>
                  </div>
                  <Link href={`/detail/${member.nik}`} className="text-blue-500 hover:text-blue-700">
                    Detail
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}