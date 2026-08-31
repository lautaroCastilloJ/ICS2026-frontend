function Input({ label, error = '', ...restProps }) {
  return (
    <div className='flex flex-col gap-1 w-full'>
      <label>{label}:</label>
      <input
        className={`w-full ${error ? 'border-red-400' : ''}`}
        { ...restProps }
      />
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
    </div>
  );
};

export default Input;
