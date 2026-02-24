import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col overflow-x-hidden">
      <Nav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
