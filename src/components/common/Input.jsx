import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      name,
      placeholder = '',
      error = '',
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className='mb-4'>
        {label && (
          <label htmlFor={name} className='block mb-1 text-sm font-medium text-gray-700'>
            {label} {required && <span className='text-red-500'>*</span>}
          </label>
        )}
        <input
          type={type}
          id={name}
          name={name}
          ref={ref}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
