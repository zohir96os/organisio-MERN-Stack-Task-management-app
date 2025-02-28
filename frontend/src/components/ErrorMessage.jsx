const ErrorMessage = ({ message, className }) => {
  if (!message) return null;
  return (
    <p className={`text-rose-500 ${className}`}>
      {message || "Internal server error"}
    </p>
  );
};

export default ErrorMessage;
