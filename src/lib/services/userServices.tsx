export function getUser() {
  const user = JSON.parse(localStorage.getItem('user') || '{}') as {
    id_user: string;
    username: string;
    jabatan: string;
    data_ruangan: {id_ruangan: string; ruangan: string}[];
  };
  return user;
}
