import React, {useContext, useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {BASEURL} from "../../assets/contants";
import {withSnackbar} from 'notistack';
import {Link, withRouter} from 'react-router-dom';
import GenUtil from "../../gen/gen-util";
import {UserContext} from "../../App";

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignIn = ({enqueueSnackbar, history}) => {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useContext(UserContext);
    useEffect(() => {
       if (GenUtil.GetJWT()) {
           history.push('/dashboard')
       }
    }, []);


    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        if (name === 'username') {
            setUsername(value);
        } else {
            setPassword(value)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${BASEURL}user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const jsonRes = await response.json();
        if (response.status!==201) {
            enqueueSnackbar(jsonRes.message, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            })
        } else {
            enqueueSnackbar('Successfully Logged In', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            await login(jsonRes.data.token);
            history.push('/dashboard');
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
                    Welcome to the Restaurant App, Please Sign In to continue.
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        onChange={handleChange}
                        autoFocus
                        value={username}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={handleChange}
                        value={password}
                        autoComplete="current-password"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to="/register">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
export default withRouter(withSnackbar(SignIn));
