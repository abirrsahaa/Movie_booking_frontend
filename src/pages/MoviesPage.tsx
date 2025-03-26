import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Film, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Link } from 'react-router-dom';

export interface HomePageMovie {
  id: number;
  title: string;
  image: string;
  type: string;
  isNew?: boolean;
  category: 'trending' | 'new' | 'popular';
}

// Debounce utility hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Responsive grid component with pagination
const ResponsiveMovieGrid: React.FC<{ 
  movies: HomePageMovie[], 
  initialLimit?: boolean 
}> = ({ movies, initialLimit = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Determine the limit of movies to show
  const limit = initialLimit ? Math.ceil(movies.length / 3) : movies.length;
  const moviesPerPage = limit;
  
  // Calculate total pages
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  
  // Slice movies based on current page and limit
  const paginatedMovies = movies.slice(
    (currentPage - 1) * moviesPerPage, 
    currentPage * moviesPerPage
  );

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
        {paginatedMovies.map((movie) => (
          <motion.div
            key={movie.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full h-64 object-cover"
              />
              {movie.isNew && (
                <Badge variant="default" className="absolute top-2 right-2">
                  New
                </Badge>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{movie.type}</Badge>
                <Link to={`/main/moviesSpecific/${movie.id}`}><Button variant="outline" >View Details</Button></Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2" /> Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Empty State Component
const EmptyStateContent: React.FC<{ category: string }> = ({ category }) => (
  <div className="text-center py-12">
    <Film className="mx-auto h-16 w-16 text-gray-300 mb-4" />
    <p className="text-gray-500">No {category} movies available</p>
  </div>
);

const MoviesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [movies, setMovies] = useState<HomePageMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'popular'>('trending');

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:9090/getAllMovies");
        const data = await response.json();
        // If no category is set, assign a default category
        const processedData = data.map((movie: HomePageMovie, index: number) => ({
          ...movie,
          category: index % 3 === 0 ? 'trending' : 
                    index % 3 === 1 ? 'new' : 'popular'
        }));
        setMovies(processedData);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Memoized filtered movies with case-insensitive search
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => 
      (selectedType === 'All' || movie.type === selectedType) &&
      movie.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [movies, selectedType, debouncedSearchTerm]);

  // Memoized movie types
  const movieTypes = useMemo(() => 
    ['All', ...new Set(movies.map(movie => movie.type))], 
    [movies]
  );

  // Categorize movies
  const categorizedMovies = useMemo(() => {
    return {
      trending: filteredMovies.filter(movie => movie.category === 'trending'),
      new: filteredMovies.filter(movie => movie.category === 'new'),
      popular: filteredMovies.filter(movie => movie.category === 'popular')
    };
  }, [filteredMovies]);

  // Handle search input change with debounce
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'trending' | 'new' | 'popular');
  };

  if (isLoading) return <p className="text-center p-6">Loading movies...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filter Section */}
      <div className="flex justify-between items-center space-x-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search movies..." 
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <Select 
          value={selectedType} 
          onValueChange={setSelectedType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Type">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                {selectedType}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {movieTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for Movie Categories */}
      <Tabs 
        defaultValue="trending" 
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">
            <Film className="mr-2 h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new">
            <Film className="mr-2 h-4 w-4" />
            New
          </TabsTrigger>
          <TabsTrigger value="popular">
            <Film className="mr-2 h-4 w-4" />
            Popular
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending">
          {categorizedMovies.trending.length > 0 ? (
            <ResponsiveMovieGrid 
              movies={categorizedMovies.trending} 
              initialLimit={activeTab !== 'trending'} 
            />
          ) : (
            <EmptyStateContent category="trending" />
          )}
        </TabsContent>

        <TabsContent value="new">
          {categorizedMovies.new.length > 0 ? (
            <ResponsiveMovieGrid 
              movies={categorizedMovies.new} 
              initialLimit={activeTab !== 'new'} 
            />
          ) : (
            <EmptyStateContent category="new" />
          )}
        </TabsContent>

        <TabsContent value="popular">
          {categorizedMovies.popular.length > 0 ? (
            <ResponsiveMovieGrid 
              movies={categorizedMovies.popular} 
              initialLimit={activeTab !== 'popular'} 
            />
          ) : (
            <EmptyStateContent category="popular" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoviesPage;