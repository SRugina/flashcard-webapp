import { ChangeEvent } from "react";

type Props = {
  type: "text" | "password";
  id: string;
  noLabel?: boolean;
  label?: string;
  labelError?: string;
  value: string | number | null;
  placeholder?: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void;
  required?: boolean;
  extraLabelClass?: string;
  extraInputClass?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  title?: string;
};

const Input = ({
  type,
  id,
  noLabel = false,
  label,
  labelError,
  value,
  placeholder,
  onChange,
  required = false,
  extraLabelClass = "",
  extraInputClass = "",
  minLength,
  maxLength,
  pattern,
  title,
}: Props) => {
  return (
    <>
      {noLabel === false ? (
        <label
          className={`block text-sm font-bold mb-2 ${extraLabelClass}`}
          htmlFor={id}
        >
          {label} <span className="text-nord11">{labelError}</span>
        </label>
      ) : (
        <></>
      )}
      <input
        className={`bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 leading-tight ${extraInputClass}`}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value !== null ? value : undefined}
        onChange={onChange}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        title={title}
      />
    </>
  );
};

export default Input;
