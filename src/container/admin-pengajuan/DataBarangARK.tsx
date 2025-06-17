import {Card} from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import {barangViewColumns} from '@/lib/columns/barang-column-view';
import {useQuery} from '@tanstack/react-query';
import {fetchBarangARK} from '@/lib/network/barangServices';
import {LoadingSpinner} from '@/components/ui/loading';

/**
 * Component to fetch and display ARK data in a table format.
 * Utilizes the `useQuery` hook from `react-query` to handle data fetching and loading states.
 */
export default function DataBarangARK() {
  // Fetch data using react-query
  const {data, isLoading, error} = useQuery({
    queryKey: ['data-barang-ark'],
    queryFn: fetchBarangARK,
  });

  console.log(data); // Log fetched data for debugging

  // Display loading spinner while data is being fetched
  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;

  // Display error message if there is an error fetching data
  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  // Extract data or set default to empty array if data is undefined
  const dataBarang = data?.data ?? [];

  return (
    <>
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between'>
          <h1
            className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Data Barang ARK
          </h1>
        </div>
        <DataTable 
          data={dataBarang} 
          columns={barangViewColumns}
          column_name='nama_barang'
        />
      </Card>
    </>
  );
}
