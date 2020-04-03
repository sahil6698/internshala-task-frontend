import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {UserContext} from "../App";
import {BASEURL} from "../assets/contants";
import GenUtil from "../gen/gen-util";
import {withRouter} from "react-router-dom";
import {withSnackbar} from "notistack";



const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

const MenuItemsTable = ({menuItems, asyncFetchOrders, enqueueSnackbar}) => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const {user, logout} = useContext(UserContext);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleBuy = async (menuItemId, restaurantId) => {
        const res = await fetch(`${BASEURL}order`, {
            method: 'POST',
            headers: {
                'authorization': GenUtil.GetJWT(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item: menuItemId,
                restaurantId,
            })
        });
        const jsonRes = await res.json();
        if (res.status === 401) {
            await logout()
        }
        if (res.status < 300 ){
            await asyncFetchOrders();
            enqueueSnackbar('Order created successfully.', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        } else {
            enqueueSnackbar(jsonRes.message, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }

    };

    const columns = user.role === 'customer' ? [
        { id: 'title', label: 'Name', minWidth: 100 },
        { id: 'type', label: 'Type', minWidth: 200 },
        { id: 'category', label: 'Category', minWidth: 100 },
        { id: 'price', label: 'Price', minWidth: 100 },
        { id: 'calories', label: 'Calories', minWidth: 100 },
        { id: 'buy', label: 'BUY', minWidth: 100 },
    ]: [{ id: 'title', label: 'Name', minWidth: 100 },
        { id: 'type', label: 'Type', minWidth: 200 },
        { id: 'category', label: 'Category', minWidth: 100 },
        { id: 'price', label: 'Price', minWidth: 100 },
        { id: 'calories', label: 'Calories', minWidth: 100 }];

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            menuItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                let menuItemId = row['id'];
                                let restaurantId = row['restaurantId'];
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            let value;
                                            if (column.id === 'buy') {
                                                value = 'BUY';
                                                    return (
                                                        <TableCell key={`${menuItemId}${Math.random()}`} align={column.align} onClick={async () => {await handleBuy(menuItemId, restaurantId)}} style={{cursor: 'pointer', color: 'blue'}}>
                                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                                        </TableCell>
                                                    );

                                            } else {
                                                value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            }
                                        })}
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={menuItems.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
export default withRouter(withSnackbar(MenuItemsTable));
