// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RegisterPage from "./pages/Register"
import LoginPage from "./pages/Login"
import MyNavbar from "./components/navbar"
import ListingPage from "./pages/List"
import HomePage from "./pages/Home"
import BookDetailPage from "./pages/Detail"
import OrdersPage from "./pages/ViewOrder"
import ViewOrderDetails from "./pages/ViewOrderDetail"

function App() {
  return (
    <div>
      <MyNavbar />
      <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/book/list" element={<ListingPage />} />
            <Route path="/book/view/:bookId" element={<BookDetailPage />} />
            <Route path="/book/orders" element={<OrdersPage />} />
            <Route path="/books/orders/:bookId" element={<ViewOrderDetails />} />
            <Route exact path="/" element={<HomePage />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
