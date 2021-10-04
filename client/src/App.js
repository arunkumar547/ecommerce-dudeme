import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ProductDetails from './components/product/ProductDetails'
import Home from './components/Home'
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile'

import { loadUser } from './actions/userActions'
import store from './store'
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';
import Dashboard from './components/admin/Dashboard';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
import OrderSuccess from './components/cart/OrderSuccess';
import ProductsList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UserList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';
// import cookie from 'react-cookies';

function App() {

  useEffect(() => {
    // console.log("cookie.load('token')", cookie.load("token"))
    store.dispatch(loadUser())
  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fliuid">
          <Route exact path="/" component={Home} />
          <Route path="/search/:keyword" component={Home} />
          <Route exact path="/product/:id" component={ProductDetails} />

          <Route exact path="/cart" component={Cart} />
          <ProtectedRoute exact path="/shipping" component={Shipping} />
          <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
          <ProtectedRoute exact path="/payment" component={Payment} />
          <ProtectedRoute exact path="/success" component={OrderSuccess} />


          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/password/forgot" component={ForgotPassword} />
          <Route exact path="/password/reset/:token" component={NewPassword} />
          <ProtectedRoute exact path="/me" component={Profile} />
          <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
          <ProtectedRoute exact path="/password/update" component={UpdatePassword} />

          <ProtectedRoute exact path="/orders/me" component={ListOrders} />
          <ProtectedRoute exact path="/order/order/:id" component={OrderDetails} />

        </div>

        <ProtectedRoute exact path="/dashboard" isAdmin={true} component={Dashboard} />
        <ProtectedRoute exact path="/admin/products" isAdmin={true} component={ProductsList} />
        <ProtectedRoute exact path="/admin/product" isAdmin={true} component={NewProduct} />
        <ProtectedRoute exact path="/admin/product/:id" isAdmin={true} component={UpdateProduct} />
        <ProtectedRoute exact path="/admin/orders" isAdmin={true} component={OrdersList} />
        <ProtectedRoute exact path="/admin/order/:id" isAdmin={true} component={ProcessOrder} />
        <ProtectedRoute exact path="/admin/users" isAdmin={true} component={UsersList} />
        <ProtectedRoute path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact />
        <ProtectedRoute path="/admin/reviews" isAdmin={true} component={ProductReviews} exact />

        {!loading && user && (!isAuthenticated || user.role !== 'admin') &&
          <Footer />
        }

      </div>
    </Router>
  );
}

export default App;
