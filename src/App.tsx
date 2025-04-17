
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TheatresPage from './pages/TheatrePage';
import BookingsPage from './pages/MyBookings';
import MovieDetailsPage from './pages/MovieDetailsPage';
import { cinemas, dates, movie, offers, reviews } from './constants/FixedData';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';

import VerifyOtp from './pages/VerifyOtp';
import "./lib/interceptors"
import SignupPage from './pages/SignupPage';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProfileView from './components/ProfileView';
import AuctionsPage from './pages/AuctionsPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import Chatbot from './components/Chatbot';


function App() {
  return (

    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/main" element={<RootLayout />}>


            <Route index element={<HomePage />} />

            <Route path="movies" element={<MoviesPage />} />

            <Route path="moviesSpecific/:id" element={<MovieDetailsPage
              movie={movie}
              dates={dates}
              cinemas={cinemas}
              reviews={reviews}
              offers={offers} />} />

            <Route path="theatres" element={<TheatresPage />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="auctions" element={<AuctionsPage />} />
            <Route path="auction/:id" element={<AuctionDetailPage />} />

            <Route path="bookings" element={<BookingsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          <Route path="/" element={<AuthLayout />}>
            <Route index element={<SignupPage />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='verify-otp' element={<VerifyOtp />} />
          </Route>
        </Routes>
         <Chatbot/>
      </Router>
    </Provider>
  );

}

export default App;

