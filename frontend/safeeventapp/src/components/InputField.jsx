const InputField = ({ label, type, name, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-main ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full px-4 py-3 border border-border bg-card text-main rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder-muted/50"
          placeholder={placeholder}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};