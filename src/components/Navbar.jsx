import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, MessageCircle, User } from 'lucide-react';

const Navbar = () => {
  const activeClass = "text-lavender border-b-2 border-lavender";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-primary-dark py-4 shadow-xl flex justify-around items-center z-50">
      <NavLink to='/feed' className={({ isActive }) => `${isActive ? activeClass : 'text-gray-400'} flex flex-col items-center`} >
        <Home size={24} />
        <span className="text-xs mt-1">Fil Actu</span>
      </NavLink>

      <NavLink to='/jobs' className={({ isActive }) => `${isActive ? activeClass : 'text-gray-400'} flex flex-col items-center`} >
        <Briefcase size={24} />
        <span className="text-xs mt-1">Ymatch</span>
      </NavLink>

      <NavLink to='/messages' className={({ isActive }) => `${isActive ? activeClass : 'text-gray-400'} flex flex-col items-center`} >
        <MessageCircle size={24} />
        <span className="text-xs mt-1">Messages</span>
      </NavLink>

      <NavLink to='/profile' className={({ isActive }) => `${isActive ? activeClass : 'text-gray-400'} flex flex-col items-center`} >
        <User size={24} />
        <span className="text-xs mt-1">Profil</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;