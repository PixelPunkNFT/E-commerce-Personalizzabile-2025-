const express = require('express');
const { 
  uploadSiteLogo, 
  getSiteLogo,
  getHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getShopName,
  updateShopName,
  getContactInfo,
  updateContactInfo,
  getSocialMedia,
  updateSocialMedia,
  getAboutInfo,
  updateAboutInfo
} = require('../controller/customizeController');
const { isAuthentictedUser, authorizeRoles } = require('../middleWare/auth');

const router = express.Router();

router.route('/admin/customize/shop-name')
  .get(getShopName)
  .put(isAuthentictedUser, authorizeRoles('admin'), updateShopName);

router.route('/admin/customize/logo')
  .post(isAuthentictedUser, authorizeRoles('admin'), uploadSiteLogo)
  .get(getSiteLogo);

router.route('/admin/customize/contact-info')
  .get(getContactInfo)
  .put(isAuthentictedUser, authorizeRoles('admin'), updateContactInfo);

router.route('/admin/customize/hero-slides')
  .get(getHeroSlides)
  .post(isAuthentictedUser, authorizeRoles('admin'), addHeroSlide);

router.route('/admin/customize/hero-slides/:slideId')
  .put(isAuthentictedUser, authorizeRoles('admin'), updateHeroSlide)
  .delete(isAuthentictedUser, authorizeRoles('admin'), deleteHeroSlide);

router.route('/admin/customize/social-media')
  .get(getSocialMedia)
  .put(isAuthentictedUser, authorizeRoles('admin'), updateSocialMedia);

router.route('/admin/customize/about-info')
  .get(getAboutInfo)
  .put(isAuthentictedUser, authorizeRoles('admin'), updateAboutInfo);

module.exports = router;
