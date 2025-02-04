const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");
const userModel = require("../model/userModel");
const sendJWtToken = require("../utils/JwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


// signUp controller>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.registerUser = asyncWrapper(async (req, res) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "Avatar", // this folder cloudainry data base manage by us
    
  });



  const { name, email, password } = req.body;
  const SiteCustomization = require("../model/siteCustomizationModel");
  const siteInfo = await SiteCustomization.findOne();

  const user = await userModel.create({
    name,
    password,
    email,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  // Invia email di benvenuto
  const message = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif; color: #333; background-color: #f9f9f9;">
      <div style="text-align: center; margin-bottom: 30px;">
        ${siteInfo.logoUrl ? `<img src="${siteInfo.logoUrl}" alt="${siteInfo.shopName}" style="max-width: 200px;">` : ''}
      </div>
      
      <div style="background: #ffffff; padding: 40px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: #1a237e; margin-bottom: 25px; text-align: center; font-size: 28px;">Benvenuto in ${siteInfo.shopName}!</h1>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; color: #444;">
          Ciao ${name},<br><br>
          Grazie per esserti registrato! Siamo entusiasti di averti come nuovo membro della nostra community.
        </p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <h2 style="color: #1a237e; font-size: 20px; margin-bottom: 15px;">I Nostri Orari</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div style="padding: 8px; background: white; border-radius: 8px; text-align: center;">
              <strong>Lunedì:</strong> ${siteInfo.contactInfo.businessHours.monday}
            </div>
            <div style="padding: 8px; background: white; border-radius: 8px; text-align: center;">
              <strong>Martedì:</strong> ${siteInfo.contactInfo.businessHours.tuesday}
            </div>
            <div style="padding: 8px; background: white; border-radius: 8px; text-align: center;">
              <strong>Mercoledì:</strong> ${siteInfo.contactInfo.businessHours.wednesday}
            </div>
            <div style="padding: 8px; background: white; border-radius: 8px; text-align: center;">
              <strong>Giovedì:</strong> ${siteInfo.contactInfo.businessHours.thursday}
            </div>
            <div style="padding: 8px; background: white; border-radius: 8px; text-align: center;">
              <strong>Venerdì:</strong> ${siteInfo.contactInfo.businessHours.friday}
            </div>
            <div style="padding: 8px; background: white; border-radius: 8px; text-align: center;">
              <strong>Sabato:</strong> ${siteInfo.contactInfo.businessHours.saturday}
            </div>
            <div style="padding: 8px; background: white; border-radius: 8px; text-align: center; grid-column: span 2;">
              <strong>Domenica:</strong> ${siteInfo.contactInfo.businessHours.sunday}
            </div>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <h2 style="color: #1a237e; font-size: 20px; margin-bottom: 15px;">Dove Trovarci</h2>
          <p style="margin: 5px 0;">📍 ${siteInfo.contactInfo.businessDetails.address}</p>
          <p style="margin: 5px 0;">🏙️ ${siteInfo.contactInfo.businessDetails.city}, ${siteInfo.contactInfo.businessDetails.postalCode}</p>
          <p style="margin: 5px 0;">📞 ${siteInfo.contactInfo.phoneNumber}</p>
        </div>

        ${Object.entries(siteInfo.socialMedia).some(([_, social]) => social.isActive) ? `
          <div style="text-align: center; margin-top: 30px;">
            <h2 style="color: #1a237e; font-size: 20px; margin-bottom: 15px;">Seguici sui Social</h2>
            <div style="display: flex; justify-content: center; gap: 15px;">
              ${siteInfo.socialMedia.facebook.isActive ? `
                <a href="${siteInfo.socialMedia.facebook.link}" style="color: #1877f2; text-decoration: none; font-size: 14px;">Facebook</a>
              ` : ''}
              ${siteInfo.socialMedia.instagram.isActive ? `
                <a href="${siteInfo.socialMedia.instagram.link}" style="color: #e4405f; text-decoration: none; font-size: 14px;">Instagram</a>
              ` : ''}
              ${siteInfo.socialMedia.tiktok.isActive ? `
                <a href="${siteInfo.socialMedia.tiktok.link}" style="color: #000000; text-decoration: none; font-size: 14px;">TikTok</a>
              ` : ''}
              ${siteInfo.socialMedia.linkedin.isActive ? `
                <a href="${siteInfo.socialMedia.linkedin.link}" style="color: #0077b5; text-decoration: none; font-size: 14px;">LinkedIn</a>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #666;">
        <p style="font-size: 12px;">© ${new Date().getFullYear()} ${siteInfo.shopName}. Tutti i diritti riservati.</p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: email,
      subject: `Benvenuto in ${siteInfo.shopName}!`,
      message,
    });
  } catch (error) {
    console.error("Errore nell'invio dell'email di benvenuto:", error);
    // Non blocchiamo la registrazione se l'email fallisce
  }

  // sending the res and staus code along with token using sendJWtToken method
  sendJWtToken(user, 201, res);
});

// Login User >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  // controllando se l'utente ha fornito sia la password che l'e-mail
  if (!email || !password) {
    return next(new ErrorHandler("Perfavore inserisci Email & Password", 400));
  }
  const user = await userModel.findOne({ email }).select("+password"); // .select("+password") perché nello schema impostiamo set select: false quindi la password non verrà restituita a nessuno, quindi aggiungiamo +password qui per la verifica del pass

  // utente  database principale credenziali fornite ke scheda sath
  if (!user) {
    return next(new ErrorHandler("Email o password errati", 401));
  }

  // Metodo comparePassword defind in useSchema by use . confronterà questa password con la password hashfrom nel database
  const isPasswordMatched = await user.comparePassword(password);

  // quando la password non corrisponde alla password con hash originale
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Email o password errati", 401));
  }

  sendJWtToken(user, 200, res);
});

// logOut Controller =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.logoutUser = asyncWrapper(async (req, res) => {
  // delete token for logingOut user =>
  res.cookie("token", null, {
    // curr Token has null value
    expires: new Date(Date.now()), // expires curent
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out",
  });
});

//// Forgot Password >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  const SiteCustomization = require("../model/siteCustomizationModel");
  const siteInfo = await SiteCustomization.findOne();

  // when user with this email not found
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken(); // we made this method into userModel for hash resetToken
  //when we call this metod  getResetPasswordToken  . so in userModel resetPasswordToken has reset token added and resetPasswordExprie also exprie value added but not saved to data base
  await user.save({ validateBeforeSave: false }); // now save

  let resetPasswordUrl = "";

  const isLocal = req.hostname === "localhost" || req.hostname === "127.0.0.1";
  if (isLocal) {
    resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  } else {
    resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  }

  const message = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        ${siteInfo.logoUrl ? `<img src="${siteInfo.logoUrl}" alt="${siteInfo.shopName}" style="max-width: 200px;">` : ''}
      </div>
      
      <div style="background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #1a237e; margin-bottom: 20px; text-align: center;">Recupero Password</h1>
        
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Gentile Cliente,<br><br>
          Abbiamo ricevuto una richiesta per reimpostare la password del tuo account. 
          Per procedere con il reset della password, clicca sul pulsante qui sotto:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetPasswordUrl}" style="background-color: #1a237e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reimposta Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px; text-align: center;">
          Se non hai richiesto questa email, puoi ignorarla in tutta sicurezza.<br>
          Per maggiore sicurezza, ti consigliamo di cambiare la password del tuo account.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ${siteInfo.shopName}. Tutti i diritti riservati.</p>
      </div>
    </div>
  `;

  try {
    console.log("Tentativo di invio email di recupero password");
    console.log("Configurazione email:", {
      to: user.email,
      subject: `Recupero password ${siteInfo.shopName}`
    });

    await sendEmail({
      email: user.email,
      subject: `Recupero password ${siteInfo.shopName}`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email inviata con successo all'email ${user.email}`,
    });
  } catch (error) {
    console.error("Errore dettagliato nel recupero password:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    // if there any Error then  user.resetPasswordToken and user.resetPasswordExpire has value saved already then undefined both od them for fresh value if user want to try again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(`Errore nell'invio dell'email: ${error.message}`, 500));
  }
});

//>>>>>>>>>>>>>>> reset and update password :
exports.resetPassword = asyncWrapper(async (req, res, next) => {
  // creating token hash because we save resetPasswordToken  in hash form. and we send to user resetToken in hex bytes form in url . now converting that byte form to hex form for matching does user given reset token is same or not which one save in Database
  // we will extract reset token from req.params.token because we sended that token inside nodemailer message url when user will click on that link he will redirect on that  url

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .toString("hex");

  // now find that user with that hash token in db
  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // if resetPasswordExpire {gt : => greater than} currDate  cheking is token expires or not
  });

  // if user not with that token or expire token
  if (!user) {
    return next(
      new ErrorHandler(
        "Il token di reimpostazione della password non è valido o è scaduto",
        400
      )
    );
  }

  // when new pass or confirm pass are not same

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Le Password Inserite Non Corrispondono", 400)
    );
  }

  // set that new password
  user.password = req.body.password;
  //once pass set then no need token in data base untll user not reset the pass
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // save change to db
  await user.save();
  
  // Recupera l'utente aggiornato con la nuova password
  const updatedUser = await userModel.findById(user._id).select("+password");
  // this will send new token to user  bcz user succesfully logged in with new pass
  sendJWtToken(updatedUser, 200, res);
});

//// Get User Detail  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getUserDetails = asyncWrapper(async (req, res) => {

  const user = await userModel.findById(req.user.id); // user.id because we set that user into as user.req when user gose autentiction. becauae all data of users set into req.user. only user when logged in then access this function
  res.status(200).json({
    success: true,
    user, // profile details of user
  });
});

// update User password>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.updatePassword = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password"); // + password because pass not allowed in shcema to acsess
   
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword); // user.comparePassword this method define in user Schema  for comapre given normal pass to savde hash pass
  // when user not found
  if (!isPasswordMatched) {
    return next(new ErrorHandler("La vecchia password non è corretta", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("la password non corrisponde", 400));
  }
  // now set the new pass
  user.password = req.body.newPassword;
  await user.save();
  
  // Recupera l'utente aggiornato con la nuova password
  const updatedUser = await userModel.findById(user._id).select("+password");
  // now send new token to user . becasue user loggedin with new pass
  sendJWtToken(updatedUser, 200, res);
});

//>>>>>> Update user Profile>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.updateProfile = asyncWrapper(async (req, res, next) => {
  // object with user new data
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // if avatar not empty then
  if (req.body.avatar !== "") {
    const user = await userModel.findById(req.user.id);
    const imageId = user.avatar.public_id;

    //  await cloudinary.v2.uploader.destroy(imageId); // delete old Image from cloudnairy
    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "Avatar", // this folder cloudainry data base manage by us
      
    });

    newUserData.avatar = {
      public_id: myCloud.public_id, // id for img
      url: myCloud.secure_url, // new User data
    };
  }

  // set new value of user
  const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  await user.save();
  res.status(200).json({
    success: true,
    user,
  });
});

//>> Get single user (admin) Access only>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getSingleUser = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  // if user not found with that id
  if (!user) {
    return next(
      new ErrorHandler(`L'utente non esiste con l'ID: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//>>>> update User Role -- Admin {may admin can change any user to admin}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.updateUserRole = asyncWrapper(async (req, res, next) => {
  // add set new role of user
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  await userModel.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// delete user --Admin(only admin can delete user)>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  // when no user found with that id
  if (!user) {
    return next(
      new ErrorHandler(`L'utente non esiste con l'ID: ${req.params.id}`, 400)
    );
  }

  // delete iamge from cloud as well
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  // if user founded the just remove from database
  await user.remove();

  res.status(200).json({
    success: true,
    message: "Utente Eliminato Con Successo",
  });
});

// getAll user Admin>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getAllUser = asyncWrapper(async (req, res, next) => {
  const users = await userModel.find();

  res.status(201).json({
    success: true,
    users: users,
  });
});
