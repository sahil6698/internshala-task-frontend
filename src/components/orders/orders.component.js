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
import {UserContext} from "../../App";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

export default function OrdersTable({orders}) {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const {user} = useContext(UserContext);


    const columns = user.role === 'customer' ? [
        { id: 'orderId', label: 'Order Id', minWidth: 20 },
        { id: 'restaurantName', label: 'Restaurant Name', minWidth: 100 },
        { id: 'item', label: 'Dish Ordered', mi2nWidth: 100 },
        { id: 'total', label: 'Order Total', minWidth: 100 },
    ] : [
        { id: 'orderId', label: 'Order Id', minWidth: 20 },
        { id: 'email', label: 'Customer Email', minWidth: 100 },
        { id: 'item', label: 'Dish Ordered', mi2nWidth: 100 },
        { id: 'total', label: 'Order Total', minWidth: 100 },
    ] ;


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

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
        orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
            return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {columns.map((column) => {
                        const value = row[column.id];
                        return (
                            <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                    );
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
    count={orders.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onChangePage={handleChangePage}
    onChangeRowsPerPage={handleChangeRowsPerPage}
    />
    </Paper>
);
}
