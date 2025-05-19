import React from 'react';
import { GoAlertFill } from "react-icons/go";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
      <p className="flex flex-center text-red-600 text-xs mt-1 font-medium gap-1">
          <GoAlertFill className="text-lg" />
          {message}
    </p>
  );
};

export default ErrorMessage;