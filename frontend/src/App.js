import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { load_UserProfile } from "./actions/userAction";
import { getSiteLogo, checkCookieConsent } from "./actions/siteAction";
import ShopLoader from "./component/layouts/loader/Loader";
import PrivateRoute from "./component/Route/PrivateRoute";

import "./App.css";
import CookieBanner from "./component/CookieBanner/CookieBanner";
import CreateCheckoutSessionComponent from "./component/Admin/Payment";
import CreatePortalSessionComponent from '../../frontend/src/component/Admin/Payment'; 
import Header from "./component/layouts/Header1.jsx/Header";
import StripeWrapper from "./component/Cart/StripeWrapper";
import PaymentAdmin from "./component/Admin/Payment";

import Home from "./component/Home/Home";
import Services from "./Terms&Condtions/Service";
import Footer from "./component/layouts/Footer/Footer";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Signup from "./component/User/SignUp";
import Login from "./component/User/Login";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgetPassword from "./component/User/ForgetPassword";
import ResetPassword from "./component/User/ResetPassword";
import Shipping from "./component/Cart/Shipping";
import Cart from "./component/Cart/Cart";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrder from "./component/order/MyOrder";
import ContactForm from "./Terms&Condtions/Contact";
import AboutUsPage from "./Terms&Condtions/Aboutus";
import TermsAndConditions from "./Terms&Condtions/TermsCondtion";
import PrivacyPolicy from "./Terms&Condtions/Privacy";
import Abbonamento from "./component/Admin/Abbonamento";
import GestioneAbbonamento from "./component/Admin/GestioneAbbonamento";
import CategoriesList from "./component/Admin/Categories";
import Sizes from "./component/Admin/Sizes";

//  const LazySubscription = React.lazy(() => import("./component/Admin/Abbonamento"));
const LazyDashboard = React.lazy(() => import("./component/Admin/Dashboard"));
const LazyProductList = React.lazy(() =>
  import("./component/Admin/ProductList")
);
const LazyOrderList = React.lazy(() => import("./component/Admin/OrderList"));
const LazyUserList = React.lazy(() => import("./component/Admin/UserList"));
const LazyUpdateProduct = React.lazy(() =>
  import("./component/Admin/UpdateProduct")
);
const LazyProcessOrder = React.lazy(() =>
  import("./component/Admin/ProcessOrder")
);
const LazyUpdateUser = React.lazy(() => import("./component/Admin/UpdateUser"));
const LazyNewProduct = React.lazy(() => import("./component/Admin/NewProduct"));
const LazyProductReviews = React.lazy(() =>
  import("./component/Admin/ProductReviews")
);
const LazyCustomizeSite = React.lazy(() =>
  import("./component/Admin/CustomizeSite")
);
const LazyCustomizeImages = React.lazy(() =>
  import("./component/Admin/CustomizeImages")
);
const LazyCustomizeTexts = React.lazy(() =>
  import("./component/Admin/CustomizeTexts")
);
const LazyCustomizePayments = React.lazy(() =>
  import("./component/Admin/CustomizePayments")
);
const LazyCustomizeWhatsApp = React.lazy(() =>
  import("./component/Admin/CustomizeWhatsApp")
);
const LazyCustomizeShopName = React.lazy(() =>
  import("./component/Admin/CustomizeShopName")
);
const LazyCustomizeSocials = React.lazy(() =>
  import("./component/Admin/CustomizeSocials")
);

function App() {
  const dispatch = useDispatch();

  const { consent } = useSelector((state) => state.cookieConsent);

  useEffect(() => {
    dispatch(load_UserProfile());
    dispatch(getSiteLogo());
    dispatch(checkCookieConsent());

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Router>
        {!consent && <CookieBanner />}
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <>
                {<Header />}
                <Home />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/product/:id"
            render={() => (
              <>
                {<Header />}
                <ProductDetails />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/products"
            render={() => (
              <>
                {<Header />}
                <Products />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            path="/products/:keyword"
            render={() => (
              <>
                {<Header />}
                <Products />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/signup"
            render={() => (
              <>
                {<Header />}
                <Signup />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/login"
            render={() => (
              <>
                {<Header />}
                <Login />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/password/forgot"
            render={() => (
              <>
                {<Header />}
                <ForgetPassword />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/password/reset/:token"
            render={() => (
              <>
                {<Header />}
                <ResetPassword />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route exact path="/cart">
            <Header />
            <Cart />
            <Services />
            <Footer />
          </Route>

          <Route exact path="/products">
            <Header />
            <Products />
            <Services />
            <Footer />
          </Route>

          <Route exact path="/login">
            <Header />
            <Login />
            <Services />
            <Footer />
          </Route>

          <Route
            exact
            path="/policy/privacy"
            render={() => (
              <>
                {<Header />}
                <PrivacyPolicy />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/terms/conditions"
            render={() => (
              <>
                {<Header />}
                <TermsAndConditions />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/contact"
            render={() => (
              <>
                {<Header />}
                <ContactForm />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/about_us"
            render={() => (
              <>
                {<Header />}
                <AboutUsPage />
                {<Footer />}
              </>
            )}
          />

          <Route exact path="/account">
            <Header />
            <PrivateRoute exact path="/account" component={Profile} />
            <Services />
            <Footer />
          </Route>

          <Route
            exact
            path="/profile/update"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute
                  exact
                  path="/profile/update"
                  component={UpdateProfile}
                />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/password/update"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute
                  exact
                  path="/password/update"
                  component={UpdatePassword}
                />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/orders"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute exact path="/orders" component={MyOrder} />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/shipping"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute exact path="/shipping" component={Shipping} />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/order/confirm"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute
                  exact
                  path="/order/confirm"
                  component={ConfirmOrder}
                />
                <Services />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/success"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute exact path="/success" component={OrderSuccess} />
                <Services />
                {<Footer />}
              </>
            )}
          />
        </Switch>

        {/* Admin routes */}
        <Suspense fallback={<ShopLoader />}>
          <Switch>
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/dashboard"
              component={LazyDashboard}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/products"
              component={LazyProductList}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/product/:id"
              component={LazyUpdateProduct}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/reviews"
              component={LazyProductReviews}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/orders"
              component={LazyOrderList}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/order/:id"
              component={LazyProcessOrder}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/new/product"
              component={LazyNewProduct}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/users"
              component={LazyUserList}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/user/:id"
              component={LazyUpdateUser}
            />
            <Route
              path="/create-checkout-session"
              component={CreateCheckoutSessionComponent}
            />
            <Route
              path="/create-portal-session"
              component={CreatePortalSessionComponent}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/customize"
              component={LazyCustomizeSite}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/customize/images"
              component={LazyCustomizeImages}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/customize/texts"
              component={LazyCustomizeTexts}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/customize/payments"
              component={LazyCustomizePayments}
            />
            <PrivateRoute
              isAdmin={true}
              exact
              path="/admin/customize/whatsapp"
              component={LazyCustomizeWhatsApp}
            />

            <Route exact path="/admin/customize/shop-name">
              <Suspense fallback={<ShopLoader />}>
                <PrivateRoute
                  isAdmin={true}
                  exact
                  path="/admin/customize/shop-name"
                  component={LazyCustomizeShopName}
                />
              </Suspense>
            </Route>

            <Route exact path="/admin/customize/socials">
              <Suspense fallback={<ShopLoader />}>
                <PrivateRoute
                  isAdmin={true}
                  exact
                  path="/admin/customize/socials"
                  component={LazyCustomizeSocials}
                />
              </Suspense>
            </Route>

            <Route path="/categories" component={CategoriesList} />
            <Route path="/sizes" component={Sizes} />
            <Route
              exact
              path="/admin/abbonamento"
              render={() => (
                <>
                  <Abbonamento />
                </>
              )}
            />
            <Route
              exact
              path="/admin/gestione-abbonamento"
              render={() => (
                <>
                  {<Header />}
                  <PrivateRoute
                    isAdmin={true}
                    exact
                    path="/admin/gestione-abbonamento"
                    component={GestioneAbbonamento}
                  />
                </>
              )}
            />
          </Switch>
        </Suspense>

        <Route exact path="/process/payment">
          {<Header />}
          <PrivateRoute exact path="/process/payment" component={StripeWrapper} />
        </Route>

        <Route exact path="/admin/process/payment">
          {<Header />}
          <PrivateRoute exact path="/admin/process/payment" component={PaymentAdmin} />
        </Route>
      </Router>
    </>
  );
}

export default App;
