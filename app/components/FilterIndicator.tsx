'use client';

import { useEffect, useState } from 'react';

interface FilterIndicatorProps {
  isActive: boolean;
  delay: number;
}

export default function FilterIndicator({ isActive, delay }: FilterIndicatorProps) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCountdown(0);
      return;
    }

    setCountdown(delay / 1000);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, delay]);

  if (!isActive || countdown <= 0) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        <span className="text-sm">
          Updating filters... {countdown.toFixed(1)}s
        </span>
      </div>
    </div>
  );
}