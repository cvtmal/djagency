import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastContext = React.createContext<{
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}>({
  showToast: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "p-4 rounded-md shadow-md flex items-start justify-between min-w-[300px] max-w-md",
              toast.type === 'success' && "bg-green-100 text-green-800",
              toast.type === 'error' && "bg-red-100 text-red-800",
              toast.type === 'info' && "bg-blue-100 text-blue-800"
            )}
          >
            <p className="text-sm">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
