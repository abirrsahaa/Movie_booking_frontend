import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TheatresPage from './pages/TheatrePage';
import BookingsPage from './pages/BookingPage';
import MovieDetailsPage, { Cinema, Movie, Offer, Review } from './pages/MovieDetailsPage';

const movie: Movie = {
  title: "Oppenheimer",
  rating: "93% Fresh",
  score: "8.5/10",
  description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
  genres: ["Biography", "Drama", "History"],
  duration: "3h 0m",
  ageRating: "UA",
  language: "English",
  director: "Christopher Nolan",
  cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
  poster: "/api/placeholder/300/450",
  banner: "/api/placeholder/1600/600",
};

const dates: { day: string; date: string; month: string }[] = [
  { day: "Today", date: "15", month: "March" },
  { day: "Sat", date: "16", month: "March" },
  { day: "Sun", date: "17", month: "March" },
  { day: "Mon", date: "18", month: "March" },
  { day: "Tue", date: "19", month: "March" },
  { day: "Wed", date: "20", month: "March" },
  { day: "Thu", date: "21", month: "March" },
];

const cinemas: Cinema[] = [
  {
    name: "INOX: Prozone Mall",
    location: "Coimbatore, Tamil Nadu",
    distance: "5.2 km",
    showtimes: [
      { time: "10:15 AM", type: "Executive", price: 200 },
      { time: "1:30 PM", type: "Executive", price: 200 },
      { time: "4:45 PM", type: "Premium", price: 250 },
      { time: "8:00 PM", type: "Premium", price: 250 },
      { time: "10:30 PM", type: "Premium", price: 250 },
    ],
    available: true,
  },
  {
    name: "PVR: Cinemas",
    location: "Phoenix Mall, Velachery",
    distance: "3.8 km",
    showtimes: [
      { time: "11:30 AM", type: "Executive", price: 230 },
      { time: "2:45 PM", type: "Executive", price: 230 },
      { time: "6:00 PM", type: "Premium", price: 280 },
      { time: "9:15 PM", type: "Executive", price: 240 },
    ],
    available: true,
  },
  {
    name: "Cinepolis: Forum Mall",
    location: "Vadapalani",
    distance: "7.1 km",
    showtimes: [
      { time: "12:30 PM", type: "Executive", price: 220 },
      { time: "3:45 PM", type: "Executive", price: 220 },
      { time: "7:15 PM", type: "Premium", price: 290 },
      { time: "10:45 PM", type: "Premium", price: 290 },
    ],
    available: true,
  },
];

const reviews: Review[] = [
  {
    name: "Roger Ebert",
    publication: "Chicago Sun-Times",
    rating: 4,
    text: "Nolan's Oppenheimer is a towering achievement in biographical filmmaking, weaving together the scientific, political, and deeply personal aspects of a man whose genius forever changed the world.",
  },
  {
    name: "A.O. Scott",
    publication: "The New York Times",
    rating: 5,
    text: "A monumental film that explores the moral complexity of scientific advancement with nuance and breathtaking visual artistry.",
  },
  {
    name: "Peter Travers",
    publication: "Rolling Stone",
    rating: 4,
    text: "Oppenheimer is a gripping and thought-provoking masterpiece that delves into the life of a man torn between his scientific achievements and their devastating consequences.",
  },
];

const offers: Offer[] = [
  {
    title: "10% Off with HDFC Bank Cards",
    code: "HDFC10",
    description: "Get 10% off up to ₹150 on ticket bookings with HDFC Bank credit and debit cards.",
    expiry: "Valid till March 31, 2025",
  },
  {
    title: "Buy 1 Get 1 Free on Wednesdays",
    code: "WEDNESDAY",
    description: "Book one ticket and get another one free every Wednesday with selected partner cinemas.",
    expiry: "Valid on all Wednesdays",
  },
  {
    title: "Combo Meal Discount",
    code: "COMBO20",
    description: "Get 20% off on combo meals when you book tickets online.",
    expiry: "Limited time offer",
  },
];

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="moviesSpecific" element={<MovieDetailsPage movie={movie}
                dates={dates}
                cinemas={cinemas}
                reviews={reviews}
                offers={offers} />} />
          <Route path="theatres" element={<TheatresPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;