const StatusContainer = ({ children, ...props }) => {
  return (
    <div
      className={`status-container text-center ${
        children
          ? children.toLowerCase() === 'active'
            ? 'bg-yellow-100'
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
