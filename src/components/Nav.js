import React from 'react';
import Avatar from '../assets/user.svg';

const Nav = () => (
  <div className="flex justify-between px-12 py-4 mb-4">
    <p className="font-bold text-2xl text-white py-1 px-4 bg-blue-800">DIN</p>
    <img style={{ width: '30px', height: '30px' }} src={Avatar} alt="user-icon" className=" cursor-pointer" />
  </div>
);

export default Nav;
