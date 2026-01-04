import { books } from '@/lib/data';
import BookCard from '@/components/book-card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from 'lucide-react';

export default function BooksPage() {
  const genres = [...new Set(books.map(book => book.genre))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Our Collection</h1>
        <p className="text-lg text-muted-foreground mt-2">Discover your next favorite book from our curated collection.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4 xl:w-1/5">
          <div className="sticky top-20 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-headline font-semibold">Filters</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search by title or author..." className="pl-10"/>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold font-headline">Genre</h4>
              {genres.map(genre => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox id={genre} />
                  <Label htmlFor={genre} className="font-normal">{genre}</Label>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold font-headline">Availability</h4>
              <RadioGroup defaultValue="all">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="r1" />
                  <Label htmlFor="r1" className="font-normal">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="available" id="r2" />
                  <Label htmlFor="r2" className="font-normal">Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="checked-out" id="r3" />
                  <Label htmlFor="r3" className="font-normal">Checked Out</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </aside>

        {/* Books Grid */}
        <main className="w-full lg:w-3/4 xl:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <p className="text-muted-foreground mb-4 sm:mb-0">Showing {books.length} results</p>
             <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="rating">Rating: High to Low</SelectItem>
                    <SelectItem value="title-asc">Title: A-Z</SelectItem>
                    <SelectItem value="title-desc">Title: Z-A</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
    </div>
  );
}
