const mongoose = require('mongoose');

const siteCustomizationSchema = new mongoose.Schema({
  aboutInfo: {
    section1: {
      title: {
        type: String,
        default: 'Chi siamo'
      },
      description: {
        type: String,
        default: 'Il titolo e il contenuto di questa sezione sono completamente personalizzabili dalla dashboard admin, all interno del menu Personalizzazione . Qui puoi modificare il testo a tuo piacimento per adattarlo alla tua visione e alle esigenze del tuo brand.'
      }
    },
    section2: {
      title: {
        type: String,
        default: 'La Nostra Missione'
      },
      description: {
        type: String,
        default: 'Il titolo e il contenuto di questa sezione sono completamente personalizzabili dalla dashboard admin, all interno del menu Personalizzazione . Qui puoi modificare il testo a tuo piacimento per adattarlo alla tua visione e alle esigenze del tuo brand.'
      }
    }
  },
  contactInfo: {
    phoneNumber: {
      type: String,
      default: "8171280546"
    },
    businessHours: {
      monday: {
        type: String,
        default: "9:00-18:00"
      },
      tuesday: {
        type: String,
        default: "9:00-18:00"
      },
      wednesday: {
        type: String,
        default: "9:00-18:00"
      },
      thursday: {
        type: String,
        default: "9:00-18:00"
      },
      friday: {
        type: String,
        default: "9:00-18:00"
      },
      saturday: {
        type: String,
        default: "9:00-13:00"
      },
      sunday: {
        type: String,
        default: "Chiuso"
      }
    },
    businessDetails: {
      shopName: {
        type: String,
        default: "Nome Negozio"
      },
      address: {
        type: String,
        default: "Indirizzo del negozio"
      },
      city: {
        type: String,
        default: "Città"
      },
      country: {
        type: String,
        default: "Italia"
      },
      postalCode: {
        type: String,
        default: "00000"
      },
      vatNumber: {
        type: String,
        default: "Partita IVA"
      }
      
    }
  },
  shopName: {
    type: String,
    default: "SHOP"
  },
  logoUrl: {
    type: String,
    default: null
  },
  logoWidth: {
    type: Number,
    default: 300
  },
  logoHeight: {
    type: Number,
    default: 100
  },
  faviconUrl: {
    type: String,
    default: null
  },
  heroSlides: [{
    image: {
      type: String,
      required: true
    },
    quote: {
      type: String,
      required: true
    },
    saleText: {
      type: String,
      required: true
    },
    productText: {
      type: String,
      required: true
    }
  }],
  socialMedia: {
    facebook: {
      isActive: {
        type: Boolean,
        default: false
      },
      link: {
        type: String,
        default: ""
      }
    },
    instagram: {
      isActive: {
        type: Boolean,
        default: false
      },
      link: {
        type: String,
        default: ""
      }
    },
    tiktok: {
      isActive: {
        type: Boolean,
        default: false
      },
      link: {
        type: String,
        default: ""
      }
    },
    linkedin: {
      isActive: {
        type: Boolean,
        default: false
      },
      link: {
        type: String,
        default: ""
      }
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SiteCustomization', siteCustomizationSchema);
