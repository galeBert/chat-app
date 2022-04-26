import './Skeleton.css';

import { DotsHorizontalIcon } from '@heroicons/react/outline';
import StatusContainer from 'components/StatusContainer';

export const SkeletonText = () => (
  <div className='skeleton w-full h-3 m-auto' />
);

export const SkeletonImageRound = () => (
  <div className='skeleton w-10 h-10 m-1 rounded-md' />
);

export const SkeletonMedia = () => (
  <div className='flex gap-2 justify-center'>
    <div className='skeleton w-4 h-4 rounded-sm' />
    <div className='skeleton w-4 h-4 rounded-sm' />
    <div className='skeleton w-4 h-4 rounded-sm' />
    <div className='skeleton w-4 h-4 rounded-sm' />
    <div className='skeleton w-4 h-4 rounded-sm' />
  </div>
);

export const AllUserSkeleton = () => {
  return (
    <tr>
      <td>
        <div className='flex row-username'>
          <SkeletonImageRound />
          <SkeletonText />
        </div>
      </td>
      <td className='text-center'>
        <div className='flex-center'>
          <SkeletonText />
        </div>
      </td>
      <td className='text-center flex justify-center items-center h-full'>
        <StatusContainer loading />
      </td>
      <td className='row-action'>
        <DotsHorizontalIcon className='w-5 h-5 m-auto' />
      </td>
    </tr>
  );
};

export const AllPostSkeleton = () => {
  for (let i = 0; i < 5; i++)
    return (
      <tr className='text-center'>
        <td className='p-5 w-60'>
          <SkeletonText />
        </td>
        <td className='p-5 w-60'>
          <SkeletonText />
        </td>
        <td className='text-left p-5'>
          <div className='grid grid-cols-2'>
            <SkeletonImageRound />
            <SkeletonText />
          </div>
        </td>
        <td className='p-5 w-60'>
          <SkeletonText />
        </td>
        <td className='p-5'>
          <SkeletonMedia />
        </td>
        <td className='p-5'>0</td>
        <td className='p-5'>0</td>
        <td className='p-5'>0</td>
        <td className='p-5'>0</td>
        <td className='p-5'>
          <div className='flex justify-center items-center'>
            <StatusContainer loading={true} />
          </div>
        </td>
        <td className='p-5'>
          <DotsHorizontalIcon className='w-5 h-5 m-auto' />
        </td>
      </tr>
    );
};

export const ReportedPostSkeleton = () => {
  return (
    <tr className='text-center'>
      <td className='p-3'>
        <SkeletonText />
      </td>
      <td className='p-3'>
        <SkeletonText />
      </td>
      <td className='text-left p-3'>
        <div className='flex gap-2'>
          <SkeletonImageRound />
          <SkeletonText />
        </div>
      </td>
      <td className='p-3'>
        <SkeletonMedia />
      </td>
      <td className='p-3'>0</td>
      <td className='p-3'>
        <div className='flex justify-center items-center'>
          <StatusContainer loading={true} />
        </div>
      </td>
      <td className='p-3'>
        <DotsHorizontalIcon className='w-5 h-5 m-auto' />
      </td>
    </tr>
  );
};

export const AvailableRoomSkeleton = () => {
  return (
    <tr>
      <td className='p-5'>
        <div className='flex justify-center items-center'>
          <div className='skeleton w-20 h-20 rounded-full' />
        </div>
      </td>
      <td className='text-center'>
        <SkeletonText />
      </td>
      <td className='text-center'>
        <SkeletonText />
      </td>
      <td className='text-center'>
        <SkeletonText />
      </td>
      <td className='text-center'>
        <SkeletonText />
      </td>
      <td className='text-center'>
        <SkeletonText />
      </td>
      <td className='text-center flex justify-center items-center h-full'>
        <StatusContainer loading={true} />
      </td>
      <td className='row-action'>
        <DotsHorizontalIcon className='w-5 h-5 m-auto' />
      </td>
    </tr>
  );
};
