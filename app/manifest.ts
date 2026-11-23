import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jaya Cell - Smartphone Retail & POS',
    short_name: 'Jaya Cell',
    description: 'Pusat Smartphone Resmi, Tukar Tambah & POS Konter Terpercaya',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#0066FF',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

