import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RatingStars from './rating-stars';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const bookCover = PlaceHolderImages.find(p => p.id === book.coverImage);

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
       <CardHeader className="p-0">
         <Link href={`/books/${book.id}`} className="block">
          <div className="relative aspect-[2/3] w-full">
            {bookCover ? (
              <Image
                src={bookCover.imageUrl}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={bookCover.imageHint}
              />
            ) : (
                <div className="flex items-center justify-center w-full h-full bg-secondary">
                    <span className="text-muted-foreground">No Image</span>
                </div>
            )}
            <Badge
                variant={book.availability === 'Available' ? 'default' : 'destructive'}
                className={`absolute top-2 right-2 ${book.availability === 'Available' ? 'bg-green-600' : ''}`}
            >
                {book.availability}
            </Badge>
          </div>
          </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg leading-tight mb-1 font-headline">
          <Link href={`/books/${book.id}`} className="hover:text-primary transition-colors">
            {book.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <RatingStars rating={book.averageRating} />
          <span className="text-sm font-bold text-foreground/80">
            {book.averageRating.toFixed(1)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
