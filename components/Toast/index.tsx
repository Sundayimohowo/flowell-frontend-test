import { useState } from "react";

const Toast = ({
  message,
  type,
  time = 3000,
}: {
  message: string;
  type: string;
  time?: number;
}) => {
  const [show, setShow] = useState(true);

  // close after 3s by default
  setTimeout(() => {
    setShow(false);
  }, time);

  const toastClasses = `fixed top-4 right-4 p-4 w-80 rounded-md z-50 transform transition duration-300 ease-in-out ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "info"
      ? "bg-blue-300 text-white"
      : "bg-red-500 text-white"
  }`;

  const handleCloseToast = () => {
    setShow(false);
  };

  if (!message) return null;

  return show ? (
    <div className={toastClasses}>
      <div className="flex items-center">
        {type === "success" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        )}
        <span>{message}</span>
      </div>
      <button
        onClick={handleCloseToast}
        className="absolute top-4 right-4 text-gray-100 hover:text-gray-300 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  ) : null;
};

export default Toast;
