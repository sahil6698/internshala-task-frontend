import React, {useContext, useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link, withRouter} from "react-router-dom";
import {withSnackbar} from "notistack";
import {BASEURL} from "../../assets/contants";
import {UserContext} from "../../App";
import GenUtil from "../../gen/gen-util";
import InputLabel from "@material-ui/core/InputLabel";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const AddItemComponent = ({enqueueSnackbar, history}) => {
    const classes = useStyles();
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState();
    const [calories, setCalories] = useState();
    const {user, logout} = useContext(UserContext);
    useEffect(() => {
        if (!GenUtil.GetJWT() || Object.keys(user).length === 0) {
            enqueueSnackbar('Login first to access this page', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            history.push('/')
        } else if (user.role !== 'restaurant') {
            history.push('/dashboard')
        }
    }, []);

    const handleTypeSelect = (e) => {
        setType(e.target.value);
    };

    const handleCategorySelect = (e) => {
        setCategory(e.target.value);
    };

    const handleChange = (e) => {
        const name = e.target.id;
        const value = e.target.value;
        if (name === 'title' ){
            setTitle(value);
        } else if (name === 'price') {
            if (value) {
                setPrice(+value);
            }
        } else if (name === 'calories') {
            if (value) {
                setCalories(+value);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            type,
            title,
            category,
            price,
            calories
        };
        const res = await fetch(`${BASEURL}menu-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': GenUtil.GetJWT(),
            },
            body: JSON.stringify(body),
        });
        const jsonRes = await res.json();
        if (res.status > 300) {
            if (res.status === 401) {
                await logout()
            }
            enqueueSnackbar(jsonRes.message, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            })
        } else {
            enqueueSnackbar('Dish added successfully', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            history.push('/dashboard')
        }

    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Please provide input for menu dish.
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="title"
                                name="title"
                                value={title}
                                variant="outlined"
                                required
                                onChange={handleChange}
                                fullWidth
                                id="title"
                                label="Title"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="price"
                                value={price}
                                type='number'
                                onChange={handleChange}
                                label="Price"
                                name="price"
                                autoComplete="price"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="calories"
                                value={calories}
                                type='number'
                                onChange={handleChange}
                                label="Calories"
                                name="calories"
                                autoComplete="calories"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                                variant={'outlined'}
                                labelId="Type"
                                label={'Type'}
                                id="type"
                                value={type}
                                onChange={handleTypeSelect}
                                fullWidth
                            >
                                <MenuItem value={'Veg'}>Veg</MenuItem>
                                <MenuItem value={'Non-Veg'}>Non-Veg</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                variant={'outlined'}
                                labelId="category"
                                id="category"
                                label={'Category'}
                                value={category}
                                onChange={handleCategorySelect}
                                fullWidth
                            >
                                <MenuItem value={'Indian'}>Indian</MenuItem>
                                <MenuItem value={'Italian'}>Italian</MenuItem>
                                <MenuItem value={'Chinese'}>Chinese</MenuItem>
                                <MenuItem value={'Bread'}>Bread</MenuItem>
                                <MenuItem value={'Desert'}>Desert</MenuItem>
                                <MenuItem value={'Sweets'}>Sweets</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onSubmit={handleSubmit}
                    >
                        Add
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to="/dashboard">
                                {"To go back to dashboard click here"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
export default withRouter(withSnackbar(AddItemComponent));

