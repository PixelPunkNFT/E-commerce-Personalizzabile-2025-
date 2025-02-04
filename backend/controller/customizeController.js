const asyncWrapper = require('../middleWare/asyncWrapper');
const cloudinary = require('cloudinary').v2;
const SiteCustomization = require('../model/siteCustomizationModel');
const fs = require('fs');
const path = require('path');
// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const ErrorHandler = require('../utils/errorHandler');

// Get Shop Name
exports.getShopName = asyncWrapper(async (req, res, next) => {
  const siteCustomization = await SiteCustomization.findOne();
  
  if (!siteCustomization) {
    return res.status(200).json({
      success: true,
      shopName: "SHOP"
    });
  }

  res.status(200).json({
    success: true,
    shopName: siteCustomization.shopName
  });
});

// Update Shop Name
exports.updateShopName = asyncWrapper(async (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role !== 'admin') {
    return next(new ErrorHandler('Accesso non autorizzato. Solo gli amministratori possono accedere a questa risorsa.', 403));
  }

  const { shopName } = req.body;

  if (!shopName) {
    return next(new ErrorHandler('Il nome dello shop è richiesto', 400));
  }

  let siteCustomization = await SiteCustomization.findOne();
  
  if (!siteCustomization) {
    siteCustomization = await SiteCustomization.create({ shopName });
  } else {
    siteCustomization.shopName = shopName;
    await siteCustomization.save();
  }

  res.status(200).json({
    success: true,
    shopName: siteCustomization.shopName
  });
});

// Upload Logo
exports.uploadSiteLogo = asyncWrapper(async (req, res, next) => {
  if (!req.files || !req.files.logo) {
    return next(new ErrorHandler('Nessun logo caricato', 400));
  }

  const logoFile = req.files.logo;
  const { width = 300, height = 100 } = req.body;

  // Converti il file in base64
  const base64Image = `data:${logoFile.mimetype};base64,${logoFile.data.toString('base64')}`;

  try {
    // Carica il logo nelle dimensioni specificate
    const logoResult = await cloudinary.uploader.upload(base64Image, {
      folder: 'site_logos',
      width: parseInt(width),
      height: parseInt(height),
      crop: 'fill'
    });

    // Carica la stessa immagine come favicon (32x32)
    const faviconResult = await cloudinary.uploader.upload(base64Image, {
      folder: 'site_logos',
      width: 32,
      height: 32,
      crop: 'fill'
    });

    // Trova o crea il documento di personalizzazione del sito
    let siteCustomization = await SiteCustomization.findOne();
    if (!siteCustomization) {
      siteCustomization = new SiteCustomization();
    }

    // Aggiorna l'URL del logo, favicon e le dimensioni
    siteCustomization.logoUrl = logoResult.secure_url;
    siteCustomization.faviconUrl = faviconResult.secure_url;
    siteCustomization.logoWidth = parseInt(width);
    siteCustomization.logoHeight = parseInt(height);
    await siteCustomization.save();

    // Aggiorna index.html con il nuovo favicon
    const indexPath = path.join(__dirname, '../../frontend/public/index.html');
    const indexHtml = await fs.promises.readFile(indexPath, 'utf8');
    const updatedHtml = indexHtml.replace(
      /<link rel="icon" href="[^"]*"/,
      `<link rel="icon" href="${faviconResult.secure_url}"`
    );
    await fs.promises.writeFile(indexPath, updatedHtml);

    res.status(200).json({
      success: true,
      logoUrl: logoResult.secure_url,
      faviconUrl: faviconResult.secure_url
    });
  } catch (error) {
    return next(new ErrorHandler('Errore durante il caricamento del logo', 500));
  }
});

// Get Logo
exports.getSiteLogo = asyncWrapper(async (req, res, next) => {
  const siteCustomization = await SiteCustomization.findOne();
  
  // Non aggiorniamo più l'index.html qui per evitare il loop

  res.status(200).json({
    success: true,
    logoUrl: siteCustomization ? siteCustomization.logoUrl : null,
    faviconUrl: siteCustomization ? siteCustomization.faviconUrl : null,
    logoWidth: siteCustomization ? siteCustomization.logoWidth : 300,
    logoHeight: siteCustomization ? siteCustomization.logoHeight : 100
  });
});

// Get Hero Slides
exports.getHeroSlides = asyncWrapper(async (req, res, next) => {
  const siteCustomization = await SiteCustomization.findOne();
  
  res.status(200).json({
    success: true,
    slides: siteCustomization ? siteCustomization.heroSlides : []
  });
});

// Add Hero Slide
exports.addHeroSlide = asyncWrapper(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return next(new ErrorHandler('Nessuna immagine caricata', 400));
  }

  const { quote, saleText, productText } = req.body;
  if (!quote || !saleText || !productText) {
    return next(new ErrorHandler('Tutti i campi di testo sono obbligatori', 400));
  }

  const imageFile = req.files.image;
  const base64Image = `data:${imageFile.mimetype};base64,${imageFile.data.toString('base64')}`;

  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'hero_slides',
      width: 1920,
      height: 1080,
      crop: 'fill'
    });

    let siteCustomization = await SiteCustomization.findOne();
    if (!siteCustomization) {
      siteCustomization = new SiteCustomization();
    }

    siteCustomization.heroSlides.push({
      image: result.secure_url,
      quote,
      saleText,
      productText
    });

    await siteCustomization.save();

    res.status(200).json({
      success: true,
      slides: siteCustomization.heroSlides
    });
  } catch (error) {
    return next(new ErrorHandler('Errore durante il caricamento dell\'immagine', 500));
  }
});

// Update Hero Slide
exports.updateHeroSlide = asyncWrapper(async (req, res, next) => {
  const { slideId } = req.params;
  const { quote, saleText, productText } = req.body;
  
  let siteCustomization = await SiteCustomization.findOne();
  if (!siteCustomization) {
    return next(new ErrorHandler('Personalizzazione del sito non trovata', 404));
  }

  const slideIndex = siteCustomization.heroSlides.findIndex(
    slide => slide._id.toString() === slideId
  );

  if (slideIndex === -1) {
    return next(new ErrorHandler('Slide non trovata', 404));
  }

  // Aggiorna i campi di testo
  if (quote) siteCustomization.heroSlides[slideIndex].quote = quote;
  if (saleText) siteCustomization.heroSlides[slideIndex].saleText = saleText;
  if (productText) siteCustomization.heroSlides[slideIndex].productText = productText;

  // Se è stata caricata una nuova immagine
  if (req.files && req.files.image) {
    const imageFile = req.files.image;
    const base64Image = `data:${imageFile.mimetype};base64,${imageFile.data.toString('base64')}`;

    try {
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'hero_slides',
        width: 1920,
        height: 1080,
        crop: 'fill'
      });

      siteCustomization.heroSlides[slideIndex].image = result.secure_url;
    } catch (error) {
      return next(new ErrorHandler('Errore durante il caricamento dell\'immagine', 500));
    }
  }

  await siteCustomization.save();

  res.status(200).json({
    success: true,
    slides: siteCustomization.heroSlides
  });
});

// Get Contact Info
exports.getContactInfo = asyncWrapper(async (req, res, next) => {
  const siteCustomization = await SiteCustomization.findOne();
  
  if (!siteCustomization) {
    return res.status(200).json({
      success: true,
      contactInfo: {
        phoneNumber: "8171280546",
        businessHours: {
          monday: "9:00-18:00",
          tuesday: "9:00-18:00",
          wednesday: "9:00-18:00",
          thursday: "9:00-18:00",
          friday: "9:00-18:00"
        },
        businessDetails: "Dettagli del negozio"
      }
    });
  }

  res.status(200).json({
    success: true,
    contactInfo: siteCustomization.contactInfo
  });
});

// Update Contact Info
exports.updateContactInfo = asyncWrapper(async (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role !== 'admin') {
    return next(new ErrorHandler('Accesso non autorizzato. Solo gli amministratori possono accedere a questa risorsa.', 403));
  }

  const { phoneNumber, businessHours, businessDetails } = req.body;

  let siteCustomization = await SiteCustomization.findOne();
  
  if (!siteCustomization) {
    siteCustomization = await SiteCustomization.create({
      contactInfo: { phoneNumber, businessHours, businessDetails }
    });
  } else {
    siteCustomization.contactInfo = {
      ...siteCustomization.contactInfo,
      ...(phoneNumber && { phoneNumber }),
      ...(businessHours && { businessHours }),
      ...(businessDetails && { businessDetails })
    };
    await siteCustomization.save();
  }

  res.status(200).json({
    success: true,
    contactInfo: siteCustomization.contactInfo
  });
});

// Get Social Media
exports.getSocialMedia = asyncWrapper(async (req, res, next) => {
  try {
    let siteCustomization = await SiteCustomization.findOne();
    
    if (!siteCustomization) {
      // Se non esiste, crea un nuovo documento con i valori predefiniti
      siteCustomization = await SiteCustomization.create({
        socialMedia: {
          facebook: { isActive: false, link: "" },
          instagram: { isActive: false, link: "" },
          tiktok: { isActive: false, link: "" },
          linkedin: { isActive: false, link: "" }
        }
      });
    } else if (!siteCustomization.socialMedia || !siteCustomization.socialMedia.linkedin) {
      // Se esiste ma manca linkedin o la struttura completa, aggiorna il documento
      siteCustomization.socialMedia = {
        ...siteCustomization.socialMedia,
        facebook: siteCustomization.socialMedia?.facebook || { isActive: false, link: "" },
        instagram: siteCustomization.socialMedia?.instagram || { isActive: false, link: "" },
        tiktok: siteCustomization.socialMedia?.tiktok || { isActive: false, link: "" },
        linkedin: siteCustomization.socialMedia?.linkedin || { isActive: false, link: "" }
      };
      await siteCustomization.save();
    }

    res.status(200).json({
      success: true,
      socialMedia: siteCustomization.socialMedia
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Errore del server durante il recupero dei social media"
    });
  }
});

// Update Social Media
exports.updateSocialMedia = asyncWrapper(async (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role !== 'admin') {
    return next(new ErrorHandler('Accesso non autorizzato. Solo gli amministratori possono accedere a questa risorsa.', 403));
  }

  const { socialMedia } = req.body;

  let siteCustomization = await SiteCustomization.findOne();
  
  if (!siteCustomization) {
    siteCustomization = await SiteCustomization.create({ socialMedia });
  } else {
    siteCustomization.socialMedia = {
      ...siteCustomization.socialMedia,
      ...socialMedia
    };
    await siteCustomization.save();
  }

  res.status(200).json({
    success: true,
    socialMedia: siteCustomization.socialMedia
  });
});

// Delete Hero Slide
exports.deleteHeroSlide = asyncWrapper(async (req, res, next) => {
  const { slideId } = req.params;
  
  let siteCustomization = await SiteCustomization.findOne();
  if (!siteCustomization) {
    return next(new ErrorHandler('Personalizzazione del sito non trovata', 404));
  }

  siteCustomization.heroSlides = siteCustomization.heroSlides.filter(
    slide => slide._id.toString() !== slideId
  );

  await siteCustomization.save();

  res.status(200).json({
    success: true,
    slides: siteCustomization.heroSlides
  });
});

// Get About Info
exports.getAboutInfo = asyncWrapper(async (req, res, next) => {
  const siteCustomization = await SiteCustomization.findOne();
  
  if (!siteCustomization || !siteCustomization.aboutInfo) {
    return res.status(200).json({
      success: true,
      aboutInfo: {
        section1: {
          title: 'Chi siamo',
          description: 'Il titolo e il contenuto di questa sezione sono completamente personalizzabili dalla dashboard admin, all interno del menu Personalizzazione . Qui puoi modificare il testo a tuo piacimento per adattarlo alla tua visione e alle esigenze del tuo brand.'
        },
        section2: {
          title: 'La Nostra Missione',
          description: 'Il titolo e il contenuto di questa sezione sono completamente personalizzabili dalla dashboard admin, all interno del menu Personalizzazione . Qui puoi modificare il testo a tuo piacimento per adattarlo alla tua visione e alle esigenze del tuo brand.'
        }
      }
    });
  }

  res.status(200).json({
    success: true,
    aboutInfo: siteCustomization.aboutInfo
  });
});

// Update About Info
exports.updateAboutInfo = asyncWrapper(async (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role !== 'admin') {
    return next(new ErrorHandler('Accesso non autorizzato. Solo gli amministratori possono accedere a questa risorsa.', 403));
  }

  const { section1, section2 } = req.body;

  let siteCustomization = await SiteCustomization.findOne();
  
  if (!siteCustomization) {
    siteCustomization = await SiteCustomization.create({
      aboutInfo: { section1, section2 }
    });
  } else {
    siteCustomization.aboutInfo = {
      section1: {
        ...siteCustomization.aboutInfo?.section1,
        ...(section1?.title && { title: section1.title }),
        ...(section1?.description && { description: section1.description })
      },
      section2: {
        ...siteCustomization.aboutInfo?.section2,
        ...(section2?.title && { title: section2.title }),
        ...(section2?.description && { description: section2.description })
      }
    };
    await siteCustomization.save();
  }

  res.status(200).json({
    success: true,
    aboutInfo: siteCustomization.aboutInfo
  });
});
