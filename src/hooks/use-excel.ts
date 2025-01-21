import {useCallback} from 'react';
import {downloadExcel} from '@/lib/utils';

const useExcel = () => {
  const handleExcel = useCallback((data: object[], fileName: string) => {
    downloadExcel(data, fileName);
  }, []);
  return {handleExcel};
};

export default useExcel;
