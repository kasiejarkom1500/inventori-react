import {Card} from '@/components/ui/card';
import {Chart} from './tes';
import {dataDashboard} from '@/lib/data/dashboard-dummy';

export default function Dashboard() {
  return (
    <>
      <div className='grid lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
        {dataDashboard.map((data, index) => (
          <Card key={index} className='flex items-center gap-4 p-3'>
            <figure className={`rounded-lg p-4 bg-${data.color}-200/40 h-fit`}>
              <data.icon
                size={18}
                className={`rounded-lg text-white bg-${data.color}-500 p-1.5 box-content`}
              />
            </figure>
            <div className=''>
              <p className='text-base text-slate-500/70 font-medium '>
                {data.title}
              </p>
              <p className='text-2xl font-semibold'>{data.value}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className='w-2/3 mt-6'>
        <Chart />
      </div>

      
    </>
  );
}
