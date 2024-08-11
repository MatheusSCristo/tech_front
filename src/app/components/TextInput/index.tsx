import { UseFormRegister } from "react-hook-form";
import { IconType } from "react-icons";

const TextInput = ({
  placeholder,
  icon,
  className,
  type = "text",
  register,
  registerType
}: {
  placeholder: string;
  icon?: IconType;
  className: string;
  type?: string;
  registerType?: string;
  register:UseFormRegister<any>
}) => {
  const Icon = icon;

  return (
    <div
      className={`${className} flex gap-2 rounded shadow-2xl p-2 items-center`}
    >
      {Icon && <Icon className="text-lightBlue" size={30} />}
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent border-none text-[1em] w-full focus:outline-none"
        {...register(registerType || "")}
      />
    </div>
  );
};

export default TextInput;
