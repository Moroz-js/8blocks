import localFont from 'next/font/local';
import './admin.css';

// Configure Berka font
const berka = localFont({
  src: [
    {
      path: '../../public/fonts/Berka Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Berka Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-berka',
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${berka.variable} ${berka.className}`}>
      {children}
    </div>
  );
}
