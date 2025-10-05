import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
      <p>&copy; {currentYear} | Created and owned by Ayush Chaurasiya</p>
      <p className="text-sm text-gray-400">WEB master at IEEE student branch</p>
    </footer>
  );
};

export default Footer;