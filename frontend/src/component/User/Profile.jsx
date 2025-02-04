import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ExitToApp as LogoutIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
import "./Profile.css";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import { useAlert } from "react-alert";
const ProfilePage = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, isAuthenticated } = useSelector((state) => state.userData);

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Disconnesso con successo");
    history.push("/login");
  };
  useEffect(() => {
    // if user not logged in
    if (isAuthenticated === false) {
      history.push("/login");
    }
  }, [history, isAuthenticated]);

  const createdAt = (user) => {
    const createdAt = new Date(user.createdAt);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };

    const formatter = new Intl.DateTimeFormat("en-IN", options);
    const formattedDate = formatter.format(createdAt);
    return formattedDate;
  };

  return (
    <div className="rootProfile">
      <div className="header-root">
        <Typography variant="h5" component="h1" className="headingProfile">
          Ciao, {user.name} !
        </Typography>

        <Typography variant="body2" className="greeting">
        Bentornato! Felice shopping!
        </Typography>
      </div>

      <div className="profileConatiner">
        <div className="leftCotainer">
          <h4
          
            className="profileHeadingLeft"
          >
            Panoramica del profilo
          </h4>
          <div className="profileSection">
            <Avatar
              alt={user.name}
              src={user.avatar.url}
              className="profileAvatar"
            />
            <div className="leftDetails">
              <Typography className="profileText">
                <h5 className="profileSubHeading">Nome :</h5>
                {user.name}
              </Typography>
              <Typography className="profileText">
                <h5 className="profileSubHeading">Email : </h5>
                {user.email}
              </Typography>
              <Typography className="profileText">
                <h5 className="profileSubHeading">Membro da :</h5>{" "}
                {createdAt(user)}
              </Typography>
            </div>
          </div>

          <div className="myOrder">
            <Typography variant="h4" component="h1" className="profileHeading">
              Ordini
            </Typography>
            <Link
              to="/orders"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="contained" className="ordersButton">
                Ordini
              </Button>
            </Link>
          </div>
        </div>

        <div className="rightConatiner">
          <div className="righHeadings">
            <Typography variant="h4" component="h1" className="profileHeading">
              Informazioni personali
            </Typography>
            <Typography className="profileText2">
            Ehilà ! Sentiti libero di modificare i tuoi dati qui sotto in modo che tu
              l'account è aggiornato.
            </Typography>
          </div>
          <div className="profileDetials">
            <div className="detials">
              <Typography
                variant="h4"
                component="h1"
                className="profileHeading"
              >
                I MIEI DETTAGLI
              </Typography>
              <Typography className="profileText">{user.name}</Typography>
              <Typography className="profileText">E-MAIL UTENTE</Typography>
              <Typography className="profileText">NUMERO DI TELEFONO</Typography>
              <Typography className="profileText">GENERE</Typography>
            </div>

            <Link to="/profile/update" style={{ textDecoration: "none" }}>
              <Button variant="contained" className="profileButton">
              MODIFICA I DETTAGLI
              </Button>
            </Link>
            <div className="detials">
              <Typography
                variant="h4"
                component="h1"
                className="profileHeading"
                style={{ marginTop: "1.5rem" }}
              >
                DETTAGLI DEL LOGIN
              </Typography>
              <Typography className="profileSubHeading">EMAIL</Typography>
              <Typography className="profileText">{user.email}</Typography>

              <Typography
                className="profileSubHeading"
                style={{ marginTop: "10px" }}
              >
                PASSWORD
              </Typography>
              <Typography className="profileSubHeading">
                *************
              </Typography>
            </div>
            <Link
              to="/password/update"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="contained" className="profileButton">
              AGGIORNA LA PASSWORD
              </Button>
            </Link>

            <div className="mangeAccount">
              <Typography
                variant="h4"
                component="h1"
                className="profileHeading"
              >
                Disconnettersi da tutti i dispositivi
              </Typography>

              <p className="profileText3">
              Per accedere nuovamente al sito web del nostro Store, è necessario
                fornisci le tue credenziali Questa azione ti disconnetterà da qualsiasi
                altri browser web che hai utilizzato in precedenza.
              </p>
            </div>
            <Button
              variant="contained"
              color="textPrimary"
              className="profileButton"
              startIcon={<LogoutIcon />}
              onClick={logoutHandler}
            >
              Logout Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
