import Image from 'next/image';
import { notFound } from 'next/navigation';
import { books, users } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import RatingStars from '@/components/rating-stars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = books.find(b => b.id === params.id);

  if (!book) {
    notFound();
  }

  const bookCover = PlaceHolderImages.find(p => p.id === book.coverImage);
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          <Card className="overflow-hidden sticky top-24">
            {bookCover && (
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={bookCover.imageUrl}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  data-ai-hint={bookCover.imageHint}
                />
              </div>
            )}
            <CardFooter className="p-4">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Badge variant="secondary" className="mb-2">{book.genre}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-headline">{book.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">by {book.author}</p>
          
          <div className="flex items-center gap-2 mt-4">
            <RatingStars rating={book.averageRating} />
            <span className="font-bold text-lg">{book.averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({book.reviews.length} reviews)</span>
          </div>
          
          <Separator className="my-6" />

          <h2 className="text-2xl font-semibold font-headline mb-2">Description</h2>
          <p className="text-foreground/80 leading-relaxed">{book.description}</p>
          
          <Separator className="my-8" />

          <h2 className="text-2xl font-semibold font-headline mb-4">Reviews</h2>
          
          {/* Add a review form */}
          <Card className="mb-8 bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <MessageCircle className="h-5 w-5"/>
                Leave a Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Button key={star} variant="ghost" size="icon" className="text-muted-foreground hover:text-amber-400">
                        <RatingStars rating={star} starClassName='h-6 w-6' />
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="message">Your Review</Label>
                  <Textarea placeholder="Share your thoughts on the book..." id="message" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Submit Review</Button>
            </CardFooter>
          </Card>


          <div className="space-y-6">
            {book.reviews.map(review => {
              const user = users.find(u => u.id === review.userId);
              const userAvatar = PlaceHolderImages.find(p => p.id === user?.profileImage);
              return (
                <div key={review.id} className="flex gap-4">
                  <Avatar>
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={user?.name} />}
                    <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <RatingStars rating={review.rating} />
                      </div>
                      <p className="text-sm text-muted-foreground">{review.createdAt}</p>
                    </div>
                    <p className="mt-2 text-foreground/90">{review.comment}</p>
                    <div className="mt-2 flex items-center gap-4">
                       <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        <span>{review.likes}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
