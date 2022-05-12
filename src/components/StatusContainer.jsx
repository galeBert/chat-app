const StatusContainer = ({ children, ...props }) => {
  return (
    <div
      className={`rounded-2xl w-24 h-8 pt-0.5 pb-0.5 text-center ${
        children
          ? children.toLowerCase() === 'active'
            ? 'bg-status-6'
            : children !== 'Flag' || children !== 'Banned'
            ? 'bg-brand-1'
            : 'bg-red-100'
          : ''
      }`}
      id={props.id}
    >
      {props.loading ? (
        <div className='flex-center'>
          <div className='loading w-4 h-4' />
        </div>
      ) : (
        <span>{children}</span>
      )}
    </div>
  );
};

export default StatusContainer;
