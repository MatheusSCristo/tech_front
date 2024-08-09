import { IconType } from "react-icons";

const TextInput = ({
  placeholder,
  icon,
  className,
  type="text",
}: {
  placeholder: string;
  icon?: IconType;
  className: string;
  type?:string;
}) => {
  const Icon = icon;

  return (
    <div
      className={`${className} flex gap-2 rounded shadow-2xl p-2 items-center`}
    >
      {Icon && <Icon className="text-lightBlue" size={40} />}
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent border-none text-[1.5em] w-full focus:outline-none"
      />
    </div>
  );
};

export default TextInput;
