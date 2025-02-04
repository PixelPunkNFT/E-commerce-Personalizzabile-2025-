import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import { useHistory, useRouteMatch } from "react-router-dom";
import ShopLoader from "../layouts/loader/Loader";
import { Avatar, Button, TextField, Typography } from "@material-ui/core";
import LockResetIcon from "@mui/icons-material/LockReset";
import useStyles from "./LoginFromStyle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";


function ResetPassword() {

  const match = useRouteMatch();
const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, success, loading } = useSelector(
    (state) => state.forgetPassword
  );




  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setIsValidPassword(event.target.value.length >= 8);
  };
  const handleConfirmPasswordChange = (event) => {
    setconfirmPassword(event.target.value);
  };

  const handleShowPasswordClick = () => {

    setShowPassword(!showPassword);
   
  };


  
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password aggiornata correttamente");
      history.push("/login");
    }
  }, [dispatch, error, alert, success, history]);


   // submit handler
  function resetPasswordSubmitHandler(e) {
    e.preventDefault();

   if (password !== confirmPassword) {
     alert.error("Password e Conferma password non corrispondono");
     return;
   }
   const myForm = new FormData();
   myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(match.params.token, myForm));
    
  }


  const isSignInDisabled = !(password && confirmPassword && isValidPassword) ;

  return (
    <>
      <MetaData title="Reset Password" />
      {loading ? (
        <ShopLoader />
      ) : (
        <div className={classes.formContainer}>
          <form className={classes.form}>
            <Avatar className={classes.avatar}>
              <LockResetIcon />
            </Avatar>
            <Typography variant="h5" component="h1" className={classes.heading}>
            Resetta la password
            </Typography>

            <TextField
              style={{ marginTop: "1rem" }}
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              className={`${classes.passwordInput} ${classes.textField}`}
              error={!isValidPassword && password !== ""}
              helperText={
                !isValidPassword && password !== ""
                  ? "La password deve contenere almeno 8 caratteri."
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <Button
                    variant="outlined"
                    className={classes.showPasswordButton}
                    onClick={handleShowPasswordClick}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
              value={password}
              onChange={handlePasswordChange}
            />
            <TextField 
              label="Conferma password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              className={`${classes.passwordInput} ${classes.textField}`}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="outlined"
                    className={classes.showPasswordButton}
                    onClick={handleShowPasswordClick}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />

            <Button
              variant="contained"
              className={classes.loginButton}
              fullWidth
              disabled={isSignInDisabled}
              style={{ marginTop: "3.5rem" }}
              onClick={resetPasswordSubmitHandler}
              
            >
              Conferma la nuova password
            </Button>
            <Typography
              variant="body1"
              align="center"
              style={{ marginTop: ".5rem" }}
            >
              <Link to="/login" className={classes.createAccount}>
                Cancella
              </Link>
            </Typography>
          </form>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
