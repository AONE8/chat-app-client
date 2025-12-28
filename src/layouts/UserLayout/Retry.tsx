import { FC } from "react";
import { RotateCw } from "lucide-react";

interface RetryProps {
  error: Error;
  onRetry: () => void;
}

const Retry: FC<RetryProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-center">Error: {error.message}</p>
      <button onClick={onRetry} className="btn btn-primary">
        <RotateCw /> <span>Retry</span>
      </button>
    </div>
  );
};

export default Retry;
