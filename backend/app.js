const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

// Import routes
const user = require("./route/userRoute");
const order = require("./route/orderRoute");
const product = require("./route/productRoute");
const payment = require("./route/paymentRoute");
const admin = require("./route/adminRoute");
const paymentAdmin = require("./route/paymentAdminRoute");
const imageRoutes = require('./route/imageAvatarRandomRoute'); 
const Categories = require('./route/categoriesRoute'); 
const webhook = require('./route/webhookRoute');
const stripeKeys = require('./route/stripeKeysRoute');
const whatsApp = require('./route/whatsAppRoute');
const customize = require('./route/customizeRoute');
const sizes = require('./route/sizeRoute');
const smtp = require('./route/smtpRoute');

// Configura middleware di base
// Questa route deve venire PRIMA di express.json()
app.post('/api/v1/webhook', express.raw({type: 'application/json'}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

// Configura CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Configura route API
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", admin);
app.use("/api/v1", paymentAdmin);
app.use("/api/v1", imageRoutes);
app.use("/api/v1", Categories);
app.use("/api/v1", webhook);
app.use("/api/v1", stripeKeys);
app.use("/api/v1", whatsApp);
app.use("/api/v1", customize);
app.use("/api/v1", sizes);
app.use("/api/v1", smtp);

// Gestione errori
app.use(errorMiddleware);

// Servi file statici in production
if (process.env.NODE_ENV === 'production') {
  const __dirname1 = path.resolve();
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
}

module.exports = app;
