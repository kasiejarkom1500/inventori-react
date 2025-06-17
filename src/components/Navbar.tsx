import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {SidebarTrigger} from '@/components/ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {logoutUser} from '@/lib/network/authServices';

interface User {
  nama: string;
  role: string;
  jabatan: string;
}

export default function Navbar({user}: {user: User}) {
  return (
    <header className='flex pl-4 pr-12 justify-between h-16 shrink-0 items-center gap-2 border-b bg-white'>
      <SidebarTrigger />
      <div className='flex items-center gap-6'>
        <span className='text-sm text-slate-600 font-semibold hover:text-violet-500'>
          {/* <NavLink to={`/${role}/dashboard`}>
          <Home size={24} className='hover:text-violet-500 text-slate-600' />
          </NavLink> */}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='flex gap-3 items-center'>
              <Avatar>
                <AvatarImage
                  src='https://github.com/shadcn.png'
                  alt='Profile Picture'
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className='text-start -space-y-1'>
                <h1 className='text-sm text-slate-600 font-semibold'>
                  {user.nama}
                </h1>
                <p className='text-xs text-gray-400'>{user.jabatan ? user.jabatan : user.role}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <span className='text-primary'>My Account</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={logoutUser}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
