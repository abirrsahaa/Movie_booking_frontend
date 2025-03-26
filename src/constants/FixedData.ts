import { Cinema, DetailsMovie,  Offer,  Review } from "@/interfaces/interfaces_All";

export const movie: DetailsMovie = {
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
  poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgL0MrTzzTfdC_ucVWLD7_bd8n5s1GQobGsg&s",
  banner: "https://www.posterized.in/cdn/shop/files/newwall11.jpg?v=1736616645&width=1946",
};

export const dates: { day: string; date: string; month: string }[] = [
  { day: "Today", date: "15", month: "March" },
  { day: "Sat", date: "16", month: "March" },
  { day: "Sun", date: "17", month: "March" },
  { day: "Mon", date: "18", month: "March" },
  { day: "Tue", date: "19", month: "March" },
  { day: "Wed", date: "20", month: "March" },
  { day: "Thu", date: "21", month: "March" },
];

export const cinemas: Cinema[] = [
  {
    id:1,
    name: "INOX: Prozone Mall",
    distance: "5.2 km",
    showtimes: [
      {id:1, time: "10:15 AM", price: 200 },
      { id:2,time: "1:30 PM",  price: 200 },
      {id:3, time: "4:45 PM",  price: 250 },
      {id:4, time: "8:00 PM",  price: 250 },
      { id:5,time: "10:30 PM", price: 250 },
    ]
  },
  {
    id:2,
    name: "PVR: Cinemas",
    distance: "3.8 km",
    showtimes: [
      {id:6, time: "11:30 AM",  price: 230 },
      {id:7, time: "2:45 PM",  price: 230 },
      {id:8, time: "6:00 PM",  price: 280 },
      {id:9, time: "9:15 PM",  price: 240 },
    ]
  },
  {
    id:3,
    name: "Cinepolis: Forum Mall",
    distance: "7.1 km",
    showtimes: [
      {id:10, time: "12:30 PM",  price: 220 },
      {id:11, time: "3:45 PM",  price: 220 },
      {id:12, time: "7:15 PM",  price: 290 },
      {id:13, time: "10:45 PM",  price: 290 },
    ]
  },
];

export const reviews: Review[] = [
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

export const offers: Offer[] = [
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

export const prices: Record<string, number> = {
    'Premium': 250,
    'Executive': 200,
    'Standard': 180
  };