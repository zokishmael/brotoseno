'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Pagination from 'react-paginate';
import Link from 'next/link';
import Image from "next/image";
import { formatTanggalLengkap } from '@/utils/formatTanggal';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [searchType, setSearchType] = useState('nama');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 10;

  const handleSearch = async (page = 0) => {
    if (!searchTerm) return;
    
    let query = supabase
      .from('ktp')
      .select('*', { count: 'exact' });

    if (searchType === 'nama') {
      query = query.ilike('nama_lengkap', `%${searchTerm}%`);
    } else {
      if (searchTerm.length !== 16 || isNaN(searchTerm)) return;
      query = query.eq('no_kk', searchTerm);
    }

    const { data, error, count } = await query
      .range(page * resultsPerPage, (page + 1) * resultsPerPage - 1);

    if (!error) {
      setResults(data);
      setTotalResults(count);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

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

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    handleSearch(selected);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Mobile */}
      <div className="md:hidden mb-6 text-center">
        <h1 className="text-2xl font-bold">Cari Data KTP</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Desktop: Side by side */}
        <div className="hidden md:flex items-center gap-4">
          <h1 className="text-2xl font-bold">Cari Data KTP</h1>
          <ThemeToggle />
        </div>

        {/* Mobile: Vertical layout */}
        <div className="md:hidden flex flex-col gap-4">
          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="nama">Cari Nama</option>
            <option value="nokk">Cari No KK</option>
          </select>
          
          <input
            type={searchType === 'nokk' ? 'number' : 'text'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={searchType === 'nokk' ? 'Masukkan 16 digit No KK' : 'Ketik untuk cari nama...'}
            className="flex-1 p-2 border rounded w-full"
            maxLength={searchType === 'nokk' ? 16 : undefined}
          />
          
          <button 
            onClick={() => handleSearch()}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Cari
          </button>
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden md:flex gap-4 flex-1">
          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="nama">Cari Nama</option>
            <option value="nokk">Cari No KK</option>
          </select>
          
          <input
            type={searchType === 'nokk' ? 'number' : 'text'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={searchType === 'nokk' ? 'Masukkan 16 digit No KK' : 'Ketik  untuk Cari nama...'}
            className="flex-1 p-2 border rounded"
            maxLength={searchType === 'nokk' ? 16 : undefined}
          />
          
          <button 
            onClick={() => handleSearch()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Cari
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((item) => (
          <div key={item.nik} className="p-4 border rounded-lg flex items-center gap-4">
<Image
  src={item.id_foto ? 
    `https://lh3.googleusercontent.com/d/${item.id_foto}=s50` : 
    item.jenis_kelamin === 'LAKI-LAKI' ? 
      '/images/male-placeholder.jpg' : 
      '/images/female-placeholder.jpg'}
  alt="thumbnail"
  width={50}
  height={50}
  className="w-12 h-12 rounded"
/>
            <div className="flex-1">
              <h3 className="font-semibold">{item.nama_lengkap}</h3>
              {searchType === 'nama' ? (
                <>
                 <p>{capitalize(item.tmpt_lhr)}<br></br>{formatTanggalLengkap(item.tgl_lhr)} </p>
                </>
              ) : (
                <>
			 <p>{formatTanggalLengkap(item.tgl_lhr)} </p>
			 <p>{capitalize(item.status_hub_keluarga)}</p>
                </>
              )}
            </div>
            <Link href={`/detail/${item.nik}`}>
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded hover:bg-blue-200 transition-colors cursor-pointer border border-blue-200">
                Detail
              </div>
            </Link>
          </div>
        ))}
      </div>

      {totalResults > resultsPerPage && (
        <Pagination
          pageCount={Math.ceil(totalResults / resultsPerPage)}
          onPageChange={handlePageChange}
          containerClassName="flex gap-2 justify-center mt-6"
          activeClassName="font-bold text-blue-500"
        />
      )}
    </div>
  );
}