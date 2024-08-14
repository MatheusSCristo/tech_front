type Option = {
  name: string;
  value: string | number;
};

const SelectInput = ({
  placeholder,
  options,
  id,
  register,
  registerType,
}: {
  placeholder: string;
  options: Option[];
  id: string;
  registerType: string;
  register: any;
}) => {

  
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-white text-nowrap">
        {placeholder}
      </label>
      <select
        id={id}
        className="focus:outline-none rounded top-[100%]"
        {...register(registerType)}
      >
        {options.map((option) => (
          <option key={option.name} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
