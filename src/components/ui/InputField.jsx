import { Eye, EyeOff } from "lucide-react";

export default function InputField({
  icon,
  label,
  type,
  placeholder,
  value,
  onChange,
  showPassword,
  togglePassword,
}) {
  return (
    <div className="mt-6">

      <label className="text-sm text-gray-300">
        {label}
      </label>

      <div className="
      mt-2
      flex
      items-center
      rounded-xl
      border
      border-white/10
      bg-[#182234]
      px-4
      transition
      focus-within:border-blue-500
      ">

        <div className="mr-3 text-gray-400">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
          w-full
          bg-transparent
          py-3
          text-white
          outline-none
          "
        />

        {togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
          >
            {showPassword
              ? <EyeOff className="text-gray-400"/>
              : <Eye className="text-gray-400"/>
            }
          </button>
        )}

      </div>

    </div>
  );
}