import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Home } from './pages/home/Home';
import Date from './context/Date';
import AddProd from './pages/products/AddProd';
import { UpdateProd } from './pages/products/UpdateProd';
import { Navbar } from './components/navbar/Navbar';
import { ProductPage } from './pages/productpage/ProductPage';
import { Rings } from './pages/products/rings/Rings';
import {Bracelet } from './pages/products/bracelet/Bracelet';
import { Earrings} from './pages/products/earrings/Earrings';
import { Necklace} from './pages/products/necklace/Necklace';
import { Pendants } from './pages/products/pendants/Pendants';
import { EngagementRings } from './pages/products/engagementRings/EngagementRings';
import { Admin } from './pages/admin/Admin';
import { Account } from './pages/account/Account';
import { LogIn } from './pages/account/LogIn';
import { SignIn } from './pages/account/SignIn';
import { Cart } from './pages/cart/Cart';
import { Card } from './pages/cart/Card';
import { Favorite } from './pages/favorite/Favorite';
import { BuyBack } from './pages/programs/form_buyback/BuyBack';
import { Personalization } from './pages/programs/form_personalizare/Personalization';
import { Appointment } from './pages/appointment/Appointment';
import { Search } from './components/navbar/Search';
function App() {
  return (


    <Date>
      <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produs/:id" element={<ProductPage />} />
          <Route path="/inele" element={<Rings/>} />
          <Route path="/bratari" element={<Bracelet />} />
          <Route path="/cercei" element={< Earrings/>} />
          <Route path="/coliere" element={< Necklace/>} />
          <Route path="/pandantive" element={< Pendants/>} />
          <Route path="/verighete" element={< EngagementRings/>} />
          <Route path="/admin" element={< Admin/>} />
          <Route path="/cont" element={< Account/>} />
          <Route path="/conectare" element={<LogIn />} />
          <Route path="/inregistrare" element={< SignIn/>} />
          <Route path="/cos" element={<Cart />} />
          <Route path="/card" element={<Card />} />
          <Route path="/favorite" element={< Favorite/>} />
          <Route path="/buyback" element={< BuyBack/>} />
          <Route path="/personalizare" element={< Personalization/>} />
          <Route path="/programare" element={< Appointment/>} />
          <Route path="/search" element={< Search/>} />
          
          
          <Route path="/admin" element={
            <ProtectedRoutesForAdmin>
              < Admin />
            </ProtectedRoutesForAdmin>} /> 
          
          <Route path='/addproduct' element={
            <ProtectedRoutesForAdmin>
              <AddProd />
            </ProtectedRoutesForAdmin>}
          />
          <Route path='/updateproduct' element={
            <ProtectedRoutesForAdmin>
              <UpdateProd />
            </ProtectedRoutesForAdmin>} />
          
        </Routes>
      </Router>
    </Date>
  );
}
export default App;

export const ProtectedRoutes = ({ children }) => {
  if (localStorage.getItem('user')) {
    return children
  }
  else {
    return <Navigate to='/conectare' />
  }
}

export const ProtectedRoutesForAdmin = ({children}) => {
  const admin = JSON.parse(localStorage.getItem('user'))
  console.log(admin.user.email)
  if (admin.user.email === 'tester@gmail.com') {
    return children
  }
  else {
    return <Navigate to='/conectare' />
  }
}
