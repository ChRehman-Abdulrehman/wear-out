import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import TicketFooter from './TicketFooter';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-mist">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <TicketFooter />
    </div>
  );
}
