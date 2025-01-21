// import {baseInstance} from '@/lib/network/base/base';
// import {normalizeRole} from '@/lib/utils';

import { base } from "./base";

// interface LoginResponse {
//   data: {
//     id: string;
//     name: string;
//     email: string;
//     email_verified_at: string | null;
//     role: string;
//     created_at: string;
//     updated_at: string;
//   };
//   token: string;
// }

export const login = async (
  email: string,
  password: string
) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const data = await base.post('/login', formData);
  console.log(data);
  return data;
};

interface User {
  email: string;
  name: string;
  password: string;
  role: string;
}

export const loginUser = (email: string, password: string): User | null => {
  const fakeUsers = [
    { email: 'admin1@test.com', name:'Rihan Meja' ,password: '12341234', role: 'Admin' },
    { email: 'admin2@test.com', name:'Naufal Kenalpot' ,password: '12341234', role: 'Admin Pengajuan' },
    { email: 'admin3@test.com', name:'Hanif Kulkas' ,password: '12341234', role: 'Operator Ruangan' },
  ];

  const user = fakeUsers.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem('user');
  // localStorage.removeItem('token');
  window.location.reload();
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error retrieving user from localStorage:', error);
    return null;
  }
};

export const getUserRole = () => {
  const user = localStorage.getItem('user');
  // const roleParsed = user ? JSON.parse(user) : null;
  // const role = normalizeRole(roleParsed.role);
  const role = user ? JSON.parse(user).role : null;
  return role;
};
