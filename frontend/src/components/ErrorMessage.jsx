const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="text-center text-rose-500">{message}</p>;
};

export default ErrorMessage;
