// src/pages/AdminPage.tsx
import React from 'react';
import Navbar from '../../components/Navbar'; 
import AdminPanel from '../../components/AdminPanel';  

const AdminPage = () => {
  return (
    <div>
      <Navbar position="static" isTransparent={false}/>
      <AdminPanel />  
    </div>
  );
};

export default AdminPage;
