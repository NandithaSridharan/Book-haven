import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline mb-8">My Wishlist</h1>
       <Card>
        <CardHeader>
          <CardTitle>Feature Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <Heart className="w-16 h-16 mb-4 text-destructive/50"/>
          <p className="text-lg">The wishlist is currently under construction.</p>
          <p>Soon you'll be able to save books for later!</p>
        </CardContent>
      </Card>
    </div>
  );
}
