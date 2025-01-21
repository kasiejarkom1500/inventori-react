import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {getUser, getUserRole} from '@/lib/network/authServices';
import {normalizeRole} from '@/lib/utils';

export default function RequireAuth() {
  const user = getUser();
  const role = getUserRole();
  const location = useLocation();

  const normalizedRole = role ? normalizeRole(role) : '';

  if (!user) {
    return <Navigate to='/login' />;
  }
  if (location.pathname === '/') {
    return <Navigate to={`/${normalizedRole}/dashboard`} />;
  }
  if (
    location.pathname === `/${normalizedRole}` ||
    location.pathname === `/${normalizedRole}/`
  ) {
    return <Navigate to={`/${normalizedRole}/dashboard`} />;
  }

  return <Outlet />;
}
