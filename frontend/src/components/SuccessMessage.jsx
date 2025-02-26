const SuccessMessage = ({ message }) => {
  if (!message) return null;
  return <p className="text-green-500">{message}</p>;
};

export default SuccessMessage;
