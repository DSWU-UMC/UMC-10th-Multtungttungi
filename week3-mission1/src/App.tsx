import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';

// BrouserRouter v5
// createBrowerRouter v6

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [{
      path: 'movies/:category',
      element: <MoviePage />,
    },
    {
      path: 'movies/:movieId',
      element: <MovieDetailPage />
    }
  ], 
  },
]);

function App() : Element {
  return <RouterProvider router={router} />;
}

export default App;