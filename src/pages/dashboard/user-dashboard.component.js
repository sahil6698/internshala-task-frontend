import {Button, Container} from "@material-ui/core";
import React, {useContext, useEffect, useState} from "react";
import GenUtil from "../../gen/gen-util";
import {Link, withRouter} from "react-router-dom";
import {withSnackbar} from "notistack";
import OrdersTable from "../../components/orders/orders.component";
import {makeStyles} from "@material-ui/core/styles";
import {BASEURL} from "../../assets/contants";
import MenuItemsTable from "../../components/menu-items.component";
import {UserContext} from "../../App";


const useStyles = makeStyles((theme) => ({
    tableHeader: {
        marginTop: theme.spacing(8),
        display: 'block',
        fontSize: 50,
        position: 'relative',
        textDecoration: 'underline'
    },
    addMenuItemBtn: {
        right: 10,
        top: 8,
        position: 'absolute',
    },
    logoutBtn: {
        position: 'absolute',
        right: 5,
        top: 5,
    }
}));

const UserDashboard = ({enqueueSnackbar, history}) => {
    const classes = useStyles();
    const [orders, setOrders] = useState([]);
    const {user, logout} = useContext(UserContext);
    const [menuItems, setMenuItems] = useState([]);
    const signInToContinueToast = () => {
        enqueueSnackbar('Please sign in first', {
            variant: 'error',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            }
        })
    };
    const asyncFetchOrders = async () => {
        const res = await fetch(`${BASEURL}order`, {
            method: 'GET',
            headers: {
                'authorization': GenUtil.GetJWT()
            }
        });
        const jsonRes = await res.json();
        if (res.status > 300) {
            if (res.status === 401) {
                await logout();
                history.push('/');
            }
        }
        setOrders(jsonRes.data);
    };


    useEffect(() => {
        if (!GenUtil.GetJWT()) {
            history.push('/');
            signInToContinueToast()
            return;
        }

        if (Object.keys(user).length === 0) {
            GenUtil.unSetJWT();
            signInToContinueToast();
            return;
        }


        const asyncFetchMenuItems = async () => {
            const fetchURl = user.role === 'customer' ? `${BASEURL}menu-item` : `${BASEURL}menu-item/restaurant`;
            const res = await fetch(fetchURl, {
                method: 'GET',
                headers: {
                    'authorization': GenUtil.GetJWT()
                }
            });
            const jsonRes = await res.json();
            if (res.status === 401) {
                await logout;
            }
            setMenuItems(jsonRes.data);
        };
        asyncFetchMenuItems()
        asyncFetchOrders()
    }, []);

    return(
        <Container >
            <div className={classes.logoutBtn}>
                <Button variant={"outlined"} color={'secondary'} onClick={logout}>Logout</Button>
            </div>
            <div className={classes.tableHeader}>
                Orders
            </div>
            <OrdersTable orders={orders}/>
            <div className={classes.tableHeader}>
                <p>Menu</p>
                {
                    user.role === 'restaurant' ?
                        <Link to={'/menu/add'}><Button variant={"outlined"} color={'primary'} className={classes.addMenuItemBtn}> Add Item</Button></Link>
                    : ""
                }
            </div>
            <MenuItemsTable menuItems={menuItems} asyncFetchOrders={asyncFetchOrders}/>
        </Container>
    )
};
export default withRouter(withSnackbar(UserDashboard));
