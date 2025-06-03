import React from 'react';
import { cn } from '@/lib/utils';

interface RatingInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function RatingInput({ id, value, onChange, max = 5 }: RatingInputProps) {
  const handleClick = (rating: number) => {
    // Toggle off if clicking the same rating
    if (rating === value) {
      onChange(0);
    } else {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center space-x-1" role="radiogroup">
      {[...Array(max)].map((_, index) => {
        const rating = index + 1;
        return (
          <button
            key={`${id}-rating-${rating}`}
            type="button"
            aria-label={`Rating ${rating} of ${max}`}
            aria-checked={value === rating}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
              value >= rating 
                ? "bg-primary text-white" 
                : "bg-gray-200 text-gray-600"
            )}
            onClick={() => handleClick(rating)}
          >
            {rating}
          </button>
        );
      })}
    </div>
  );
}
