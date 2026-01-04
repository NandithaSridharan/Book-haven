import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  className?: string;
  starClassName?: string;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  className,
  starClassName,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0; // This can be enhanced to show half stars
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn('h-4 w-4 text-amber-400 fill-amber-400', starClassName)}
        />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn('h-4 w-4 text-gray-300', starClassName)}
        />
      ))}
    </div>
  );
}
