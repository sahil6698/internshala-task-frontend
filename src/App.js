import React, {createContext, useEffect, useState} from 'react';
import './App.css';
import {Route, Switch} from 'react-router-dom';
import SignIn from "./pages/sign-in/signin.component";
import SignUp from "./pages/sign-up/signup.component";
import UserDashboard from "./pages/dashboard/user-dashboard.component";
import GenUtil from "./gen/gen-util";
import {BASEURL} from "./assets/contants";
import AddItemComponent from "./pages/add-item/add-item.component";
import NotFoundComponent from "./components/not-found.component";
import {withRouter} from 'react-router-dom';
import CircularProgress from "@material-ui/core/CircularProgress";

export const UserContext = createContext({});
function App({history}) {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const logout = async () => {
        setLoading(true);
        GenUtil.unSetJWT();
        await updateUser();
        history.push('/');
        setLoading(false);
    };
    const updateUser = async () => {
        setLoading(true);

        if (GenUtil.GetJWT()) {
            const res = await fetch(`${BASEURL}user`, {
                headers: {
                    'authorization': GenUtil.GetJWT()
                }
            });
            if (res.status === 401) {
                await logout()
            }
            if (res.status < 300 ){
                const jsonRes = await res.json();
                const data = jsonRes.data;
                setUser({
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    role: data.role,
                    status: data.status,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    id: data.id
                })
                setLoading(false);
            }
        } else {
            await logout();
            setLoading(false);
        }
    };
    useEffect(() => {
        updateUser();
    }, []);
    const login = async (token) => {
        GenUtil.SetJWT(token);
        await updateUser();
    };

    return (
        loading ? <CircularProgress style={{top: '50%', left: '50%', position: "absolute"}}/>:
            <UserContext.Provider value={{user, logout, login}}>
                <div>
                    <Switch>
                        <Route exact = {true} path = {'/'} component = {SignIn}/>
                        <Route exact={true} path={'/register'} component = {SignUp} />
                        <Route exact={true} path={'/dashboard'} component = {UserDashboard} />
                        <Route exact={true} path={'/menu/add'} component = {AddItemComponent} />
                        <Route path={'*'} component={NotFoundComponent} />
                    </Switch>
                </div>
            </UserContext.Provider>
  );
}

export default withRouter(App);
