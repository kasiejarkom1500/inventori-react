import { getUser, getUserRole } from '@/lib/network/authServices';
import {Navigate, Outlet} from 'react-router-dom';

export default function RoleAuth({requiredRole} : {requiredRole: string}) {
  const user = getUser();
  const role = getUserRole();

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (role !== requiredRole){
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}
