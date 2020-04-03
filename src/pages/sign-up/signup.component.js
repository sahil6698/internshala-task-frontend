import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link, withRouter} from "react-router-dom";
import {withSnackbar} from "notistack";
import {BASEURL} from "../../assets/contants";

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

const SignUp = ({enqueueSnackbar, history}) => {
    const classes = useStyles();
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");

    const handleRoleSelect = (e) => {
        setRole(e.target.value);
    };

    const handleChange = (e) => {
        const name = e.target.id;
        const value = e.target.value;
        if (name === 'username' ){
            setUsername(value);
        } else if (name === 'name') {
            setName(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'restaurantName') {
            setRestaurantName(value);
        } else if (name === 'restaurantAddress') {
            setRestaurantAddress(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            name,
            username,
            email,
            password,
            role
        };
        if (role === 'restaurant') {
            body['restaurant'] = {
                name: restaurantName,
                address: restaurantAddress
            }
        }
        const res = await fetch(`${BASEURL}user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const jsonRes = await res.json();
        if (res.status > 300) {
            enqueueSnackbar(jsonRes.message, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            })
        } else {
            enqueueSnackbar(jsonRes.message, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            history.push('/');
        }

    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Welcome to the Restaurant App, Please Sign Up to continue.
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="username"
                                name="username"
                                value={username}
                                variant="outlined"
                                required
                                onChange={handleChange}
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                value={name}
                                onChange={handleChange}
                                label="Name"
                                name="name"
                                autoComplete="name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                value={email}
                                id="email"
                                onChange={handleChange}
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                onChange={handleChange}
                                name="password"
                                value={password}
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Select
                                variant={'outlined'}
                                labelId="role"
                                id="role"
                                value={role}
                                onChange={handleRoleSelect}
                                fullWidth
                            >
                                <MenuItem value={'customer'}>Customer User</MenuItem>
                                <MenuItem value={'restaurant'}>Restaurant User</MenuItem>
                            </Select>
                        </Grid>
                        {
                            role === 'restaurant' ?
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        value={restaurantName}
                                        onChange={handleChange}
                                        name="restaurantName"
                                        label="Restaurant Name"
                                        id="restaurantName"
                                    />
                                </Grid>


                                : ""
                        }
                        {
                            role === 'restaurant' ?
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        value={restaurantAddress}
                                        fullWidth
                                        onChange={handleChange}
                                        name="restaurantAddress"
                                        label="Restaurant Address"
                                        id="restaurantAddress"
                                    />
                                </Grid>


                                : ""
                        }
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onSubmit={handleSubmit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
export default withRouter(withSnackbar(SignUp));
