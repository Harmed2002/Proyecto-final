import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'

// Components
import Register from './components/register/Register';
import Login from './components/login/Login';
// import Header from './components/Header/Header';
import NavBar from './components/NavBar/NavBar';

import Checkout from './components/checkout/Checkout';
// import Products from './components/products/Products';
import NewProducts from './components/newProducts/NewProducts';

// Context
import { SalesProvider } from "./context/SalesContext";

// Pages
import HomePage from "./pages/HomePage/HomePage";
// import DetailPage from "./pages/DetailPage/DetailPage";
// import CategoryPage from "./pages/CategoryPage/CategoryPage";
// import ShopPage from './pages/ShopPage/ShopPage';


const App = () => {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          {/* <Route path='/products' element={<Products />} /> */}
          <Route path='/products' element={<HomePage />} />
          <Route path='/new-products' element={<NewProducts />} />
          <Route path='/checkout/:cartId' element={<Checkout />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
