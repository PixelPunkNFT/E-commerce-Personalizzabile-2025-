import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Dashboard from "../component/Admin/Dashboard";
import ProductList from "../component/Admin/ProductList";
import OrderList from "../component/Admin/OrderList";
import UserList from "../component/Admin/UserList";
import UpdateProduct from "../component/Admin/UpdateProduct";
import ProcessOrder from "../component/Admin/ProcessOrder";
import UpdateUser from "../component/Admin/UpdateUser";
import NewProduct from "../component/Admin/NewProduct";
import ProductReviews from "../component/Admin/ProductReviews";
import GestioneAbbonamento from "../component/Admin/GestioneAbbonamento";
import CustomizeWhatsApp from "../component/Admin/CustomizeWhatsApp";
import Sizes from "../component/Admin/Sizes";
import CustomizeShopName from "../component/Admin/CustomizeShopName";
import CustomizeContact from "../component/Admin/CustomizeContact";
import CustomizeSocials from "../component/Admin/CustomizeSocials";
import PrivateRoute from "../component/Route/PrivateRoute";

const Admin = () => {
     
    return (
      
        <>
            <Switch>
              <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/dashboard"
            component={Dashboard}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/products"
            component={ProductList}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/product/:id"
            component={UpdateProduct}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/reviews"
            component={ProductReviews}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/orders"
            component={OrderList}
          />
          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/order/:id"
            component={ProcessOrder}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/new/product"
            component={NewProduct}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/users"
            component={UserList}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/user/:id"
            component={UpdateUser}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/gestione-abbonamento"
            component={GestioneAbbonamento}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/customize/whatsapp"
            component={CustomizeWhatsApp}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/customize/shop-name"
            component={CustomizeShopName}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/customize/contact"
            component={CustomizeContact}
          />

          <PrivateRoute
            isAdmin={true}
            exact
            path="/admin/customize/socials"
            component={CustomizeSocials}
          />

          <Route
            exact
            path="/sizes"
            component={Sizes}
          />

            </Switch>
        </>
    
    );
    }
export default Admin;
