import Loader from './Loader';

const LoadingScreen = () => {
  return (
    <div className='absolute top-0 left-0 w-full h-full bg-dark-600 opacity-40 flex justify-center items-center z-50'>
      <div className='w-12 h-12'>
        <Loader />
      </div>
    </div>
  );
};

export default LoadingScreen;
