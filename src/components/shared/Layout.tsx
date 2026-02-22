import { Outlet } from 'react-router-dom';
import Nav from './Nav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
