export default function MainButton({
  inner,
  className,
  type,
  disabled,
  onClick,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={`"button|| ${type}}`}
      className={` uppercase cursor-pointer rounded-xl p-3 outline-none  
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"} 
            ${
              className ||
              "w-md bg-gradient-to-r from-slate-800 to-slate-900 text-white"
            }`}
    >
      {inner}
    </button>
  );
}
