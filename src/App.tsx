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

          <Route path="bookings" element={<BookingsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

          <Route path="/" element={<AuthLayout />}>
            <Route index  element={ <SignupPage/> } />
            <Route path='login' element={<LoginPage />} />
            <Route path='verify-otp' element={<VerifyOtp />} />
          </Route> 



      </Routes>
    </Router>
    </Provider>
  );

}

export default App;

