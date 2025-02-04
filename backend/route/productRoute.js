const express  = require("express");
const router  = express.Router();

const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, getProductReviews, deleteReview, createProductReview, getAllProductsAdmin} = require("../controller/productController");
const { isAuthentictedUser,checkSubscriptionStatus, authorizeRoles } = require("../middleWare/auth");
 
 

router.route("/product").get(getAllProducts)
router.route("/admin/product/new").post(isAuthentictedUser,  authorizeRoles("admin"),checkSubscriptionStatus, createProduct);
router.route("/admin/products").get(isAuthentictedUser, authorizeRoles("admin") , getAllProductsAdmin)
router.route("/admin/product/:id") 
.put(isAuthentictedUser, authorizeRoles("admin"),checkSubscriptionStatus, updateProduct)
.delete(isAuthentictedUser, authorizeRoles("admin"),checkSubscriptionStatus, deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review/new").put(isAuthentictedUser , createProductReview);
router.route("/reviews").get(getProductReviews) 
router.route("/product/reviews/delete").delete(isAuthentictedUser , authorizeRoles("admin") ,checkSubscriptionStatus,deleteReview);
module.exports = router  