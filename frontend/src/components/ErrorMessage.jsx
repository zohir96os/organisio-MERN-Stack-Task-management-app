const ErrorMessage = ({ message }) => {
  if (!message) return null; // Don't render if there's no error
  return <p className="text-rose-500">{message}</p>;
};

export default ErrorMessage;
