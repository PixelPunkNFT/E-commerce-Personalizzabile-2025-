import React, { useState, useEffect } from "react";
import { BarChart, ShoppingCart, AssignmentInd, People } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3D from "highcharts/highcharts-3d";
import { getAdminProducts, clearErrors } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import ProductImg from "../../Image/admin/products.png";
import ordersImg from "../../Image/admin/order.png";
import usersImg from "../../Image/admin/user.png"; 

Highcharts3D(Highcharts);

// Resto del codice rimane invariato
const useStyles = makeStyles((theme) => ({
  // ... stili precedenti invariati ...
  dashboard: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    width: "100%",
    gap: "1rem",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },
  firstBox: {
    width: "20%",
    margin: "0rem",
    height: "fit-content",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    display: "block",
    [theme.breakpoints.down("999")]: {
      display: "none",
    },
  },
  toggleBox: {
    width: "16rem",
    margin: "0rem",
    height: "fit-content",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    display: "block",
    zIndex: "100",
    position: "absolute",
    top: "58px",
    left: "17px",
  },
  secondBox: {
    width: "75%",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    justifyContent: "center",
    [theme.breakpoints.down("999")]: {
      width: "100%",
    },
  },
  navBar: {
    margin: "0rem",
  },
  summaryCard: {
    display: "flex",
    justifyContent: "center",
    color: "white",
    width: "100%",
    height: "15rem",
    gap: "1rem",
    margin: "1rem 0 0 0",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      height: "20rem",
      alignItems: "center",
      marginTop: "7rem !important",
    },
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#414141",
    margin: "0 1rem ",
    width: "30%",
    height: "10rem",

    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    transition: "transform 0.2s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.1) !important",
      backgroundColor: "#ed1c24 ",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, black) !important",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "32% !important",
      marginBottom: "1rem !important",
      padding: "1rem 2rem ! important",
    },
    [theme.breakpoints.down("sm")]: {
      width: "85% !important",
      marginBottom: "1rem !important",
      padding: "2rem 2rem ! important",
    },
    [theme.breakpoints.down("xs")]: {
      width: "85%",
      padding: "1.2rem",
      margin: "0   auto",
      marginBottom: "1rem",
      "&:hover": {
        transform: "scale(1.05) !important",
      },
    },
  },
  textContainer: {
    marginTop: "0.5rem",
    textAlign: "center",
    color: "white",
    textShadow: "1px 1px 2px black",
  },
  heading: {
    fontSize: "20px",
    fontWeight: 800,
    marginBottom: "0.5rem",
    textShadow: "1px 1px 2px black",
    [theme.breakpoints.down("md")]: {
      fontSize: "18px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "22px",
    },
  },
  number: {
    fontSize: "1.5rem",
    fontWeight: 500,
    textShadow: "1px 1px 2px black",
  },
  headerConetnt: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    color: "white",

    [theme.breakpoints.down("md")]: {
      "& svg": {
        fontSize: "2rem",
      },
    },

    [theme.breakpoints.down("sm")]: {
      "& svg": {
        fontSize: "3rem",
      },
    },
  },
  revenue: {
    width: "100%",
    height: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "-2.5rem auto 0",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      marginTop: "5rem !important",
    },
  },
  doughnutChart: {
    height: "fit-content",
    width: "42%",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    padding: "1rem 2rem",
    margin: "0 1rem",
    [theme.breakpoints.down("md")]: {
      width: "30%",
      padding: "1rem 3rem",
      ".highcharts-background": {
        height: "350px !important",
      },
    },
    [theme.breakpoints.down("sm")]: {
      width: "85%",
      padding: "2rem",
      marginTop: "2rem",
    },

    [theme.breakpoints.down("xs")]: {
      width: "85%",
      marginBottom: "1rem",
      padding: "1.2rem",
    },
  },
  revnueContainer: {
    width: "42%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 1rem",
    height: "400px",
    backgroundColor: "black",
    borderRadius: "5px",
    padding: "1rem 2rem",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    transition: "background-color 0.3s",

    [theme.breakpoints.down("sm")]: {
      width: "85% !important",
      padding: "1rem",
      height: "250px",
    },

    [theme.breakpoints.down("md")]: {
      width: "30%",
      padding: "1rem 3rem",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: "1rem",
      width: "85% !important",
      padding: "2rem !important",
      height: "250px",
    },

    [theme.breakpoints.down("xs")]: {
      width: "85%",
      marginBottom: "1rem",
      padding: "1rem !important",
    },
  },
  lineChart: {
    width: "90%",
    height: "fit-content",
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    padding: "2rem",
    margin: "1rem auto",

    [theme.breakpoints.down("sm")]: {
      width: "85%",
    },

    [theme.breakpoints.down("xs")]: {
      width: "85%",
      marginBottom: "1rem",
      padding: "1.2rem",
    },
  },
}));

function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const { products, loading, error } = useSelector((state) => state.products);
  const { orders, error: ordersError } = useSelector(
    (state) => state.allOrders
  );
  const { users, error: usersError } = useSelector((state) => state.allUsers);

  const alert = useAlert();

  const calculateDailySales = () => {
    if (!orders) return [];
    
    const salesByDay = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!salesByDay[date]) {
        salesByDay[date] = {
          amount: 0,
          count: 0
        };
      }
      salesByDay[date].amount += order.totalPrice;
      salesByDay[date].count += 1;
    });

    return Object.entries(salesByDay)
      .map(([date, data]) => ({
        date,
        amount: data.amount,
        count: data.count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);
  };

  const dailySales = calculateDailySales();

  let OutOfStock = 0;
  let LowStock = 0;
  const LOW_STOCK_THRESHOLD = 5;

  products &&
    products.forEach((element) => {
      if (!element.sizeStock || element.sizeStock.length === 0) {
        OutOfStock += 1;
        return;
      }

      // Un prodotto è considerato esaurito se tutte le sue taglie hanno quantità 0
      const isOutOfStock = element.sizeStock.every((sizeItem) => sizeItem.quantity === 0);
      if (isOutOfStock) {
        OutOfStock += 1;
        return;
      }

      // Un prodotto è considerato con scorte basse se tutte le taglie hanno quantità sotto la soglia
      const isLowStock = element.sizeStock.every((sizeItem) => sizeItem.quantity <= LOW_STOCK_THRESHOLD);
      if (isLowStock) {
        LowStock += 1;
      }
    });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    if (usersError) {
      alert.error(usersError);
      dispatch(clearErrors);
    }
    if (ordersError) {
      alert.error(ordersError);
      dispatch(clearErrors);
    }
    
    dispatch(getAllOrders());
    dispatch(getAllUsers());
    dispatch(getAdminProducts());
  }, [dispatch, error, alert, ordersError, usersError]);

  const toggleHandler = () => {
    console.log("toggle");
    setToggle(!toggle);
  };

  let totalAmmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmmount += item.totalPrice;
    });

  

  const doughnutOptions = {
    chart: {
      type: "pie",
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      style: {
        fontFamily: "Roboto",
      },
    },
    title: {
      text: "Stato delle scorte del prodotto",
      align: "center",
      style: {
        color: "black",
        fontWeight: "900",
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.point.name}</b><br/>` +
               `Numero prodotti: <b>${Math.round(this.y)}</b><br/>` +
               `Percentuale: <b>${this.percentage.toFixed(1)}%</b>`;
      },
      style: {
        fontSize: '12px',
        fontWeight: '500'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        depth: 35,
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            fontWeight: "500",
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "Share",
        data: [
          {
            name: "Scorte Taglie Complete",
            y: products.length - OutOfStock - LowStock,
            color: '#28a745' // verde per scorte normali
          },
          {
            name: "Scorte Taglie Basse",
            y: LowStock,
            color: '#ffc107' // giallo per scorte basse
          },
          {
            name: "Esaurito",
            y: OutOfStock,
            sliced: true,
            selected: true,
            color: '#dc3545' // rosso per esauriti
          },
        ],
      },
    ],
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [toggle]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Dashboard - Admin Panel" />
          <div className={classes.dashboard}>
            <div
              className={
                !toggle ? `${classes.firstBox}` : `${classes.toggleBox}`
              }
            >
              <Sidebar />
            </div>

            <div className={classes.secondBox}>
              <div className={classes.navBar}>
                <Navbar toggleHandler={toggleHandler} />
              </div>

              <div className={classes.summaryCard}>
                <div
                  className={classes.cardContainer}
                  style={{
                    backgroundImage: `url(${ProductImg})`,
                    backgroundSize: "cover",
                    transition: "transform 0.2s ease-in-out",
                    cursor: "pointer",
                    ":hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={() => history.push("/admin/products")}
                >
                  <div className={classes.headerConetnt}>
                    <ShoppingCart
                      fontSize="large"
                      style={{
                        fontSize: "3rem",
                        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                      }}
                    />

                    <Typography variant="h6" className={classes.heading}>
                      Prodotti Totali
                    </Typography>
                  </div>
                  <div className={classes.textContainer}>
                    <Typography variant="body2" className={classes.number}>
                      {products && products.length}
                    </Typography>
                  </div>
                </div>

                <div
                  className={classes.cardContainer}
                  style={{
                    backgroundImage: `url(${ordersImg})`,
                    backgroundSize: "cover",
                    transition: "transform 0.2s ease-in-out",
                    cursor: "pointer",
                    ":hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={() => history.push("/admin/orders")}
                >
                  <div className={classes.headerConetnt}>
                    <AssignmentInd
                      fontSize="large"
                      style={{
                        fontSize: "3rem",
                        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      }}
                    />
                    <Typography variant="h6" className={classes.heading}>
                      Ordini Totali
                    </Typography>
                  </div>
                  <div className={classes.textContainer}>
                    <Typography variant="body2" className={classes.number}>
                      {orders && orders.length}
                    </Typography>
                  </div>
                </div>

                <div
                  className={classes.cardContainer}
                  style={{
                    backgroundImage: `url(${usersImg})`,
                    backgroundSize: "cover",
                    transition: "transform 0.2s ease-in-out",
                    cursor: "pointer",
                    ":hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={() => history.push("/admin/users")}
                >
                  <div className={classes.headerConetnt}>
                    <People
                      fontSize="large"
                      style={{
                        fontSize: "3rem",
                        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      }}
                    />
                    <Typography variant="h6" className={classes.heading}>
                      Utenti Totali
                    </Typography>
                  </div>
                  <div className={classes.textContainer}>
                    <Typography variant="body2" className={classes.number}>
                      {users && users.length}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className={classes.revenue}>
                <div className={classes.doughnutChart}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={doughnutOptions}
                  />
                </div>

                <div
                  className={classes.revnueContainer}
                  style={{
                    backgroundImage: `url(${ProductImg})`,
                    backgroundSize: "cover",
                    transition: "transform 0.2s ease-in-out",
                    borderRadius: "5px",
                    width: "42%",
                  }}
                >
                  <div className={classes.headerConetnt}>
                    <BarChart
                      fontSize="large"
                      style={{
                        fontSize: "3rem",
                        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      }}
                    />

                    <Typography variant="h6" className={classes.heading}>
                      Entrate totali
                    </Typography>
                  </div>
                  <div className={classes.textContainer}>
                    <Typography variant="body2" className={classes.number}>
                      €{totalAmmount.toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>

         

              <div className={classes.lineChart}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'column',
                      style: {
                        fontFamily: 'Roboto',
                        fontWeight: '900',
                      },
                    },
                    title: {
                      text: 'Vendite Giornaliere',
                      align: 'center',
                      style: {
                        color: 'black',
                        fontWeight: '900',
                      },
                    },
                    xAxis: {
                      categories: dailySales.map(sale => sale.date),
                      labels: {
                        style: {
                          fontWeight: '400',
                        },
                      },
                    },
                    yAxis: {
                      title: {
                        text: 'Importo (€)',
                        style: {
                          fontWeight: '900',
                        },
                      },
                      labels: {
                        style: {
                          fontWeight: '900',
                        },
                      },
                    },
                    plotOptions: {
                      column: {
                        dataLabels: {
                          enabled: true,
                          formatter: function() {
                            const sale = dailySales[this.point.index];
                            return `${sale.count} ordini`;
                          },
                          style: {
                            fontWeight: '900',
                          },
                        },
                        borderRadius: 5,
                      },
                    },
                    tooltip: {
                      formatter: function() {
                        const sale = dailySales[this.point.index];
                        return `<b>${sale.date}</b><br/>` +
                               `Importo: €${sale.amount.toFixed(2)}<br/>` +
                               `Ordini: ${sale.count}`;
                      }
                    },
                    series: [{
                      name: 'Vendite',
                      data: dailySales.map(sale => sale.amount),
                      color: '#2CAFFE',
                    }],
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
