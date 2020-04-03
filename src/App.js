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


export const UserContext = createContext({});
function App() {
    const [user, setUser] = useState({});
    const logout = async () => {
        GenUtil.unSetJWT();
        await updateUser();
        history.push('/');
    };
    const updateUser = async () => {
        if (GenUtil.GetJWT()) {
            const res = await fetch(`${BASEURL}user`, {
                headers: {
                    'authorization': GenUtil.GetJWT()
                }
            });
            if (res.status < 300 ){
                if (res.status === 401) {
                    await logout()
                }
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
            }
        } else {
            setUser({});
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

export default App;
