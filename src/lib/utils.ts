import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToSlug(text: string){
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

export function toTitleCase(text: string): string {
  return text
    .split(' ') 
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
    )
    .join(' '); 
}


export function normalizeRole(role: string){
  if (role === 'admin') {
    return 'admin';
  } else if (role === 'admin_pengajuan') {
    return 'admin-pengajuan';
  } else{
    return 'operator-ruangan';
  }
}
export const downloadExcel = (data: object[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, fileName + '.xlsx');
};

