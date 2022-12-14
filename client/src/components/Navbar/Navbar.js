import React, {useEffect, useState} from "react";
import { Link, useHistory, useLocation } from 'react-router-dom'
import { AppBar, Typography, Toolbar, Button, Avatar} from "@material-ui/core";
import useStyles from './styles'
import memories from '../../images/memories.png'
import {useDispatch} from 'react-redux'
import decode from 'jwt-decode';
import * as actionType from '../../constants/actionTypes';

const Navbar = () => {
    
    //from auth.js reducers
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();

    const logout = () =>{
        //once logout, push it to the root home

        //dispatch an action type of 'LOGOUT'
        dispatch({ type: actionType.LOGOUT });
        //Redirect to the main route
        history.push('/auth')

        //once logout, user has to be null
        setUser(null);
    };

    useEffect(()=>{
        // JWT.. for manual sign up
        const token = user?.token;
    
        // token expiry
        if (token) {
            const decodedToken = decode(token);
            // get token expiry time in milliseconds lower the current time in ms - log user out
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
          }

        // google sign
        setUser(JSON.parse(localStorage.getItem('profile')));
        // when user sign in at /auth page, once sign in it will redirect user to the root page
        //when location changes, i want to set the user and refresh the page 
    },[location])
    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>

            <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">
                Memories
            </Typography>
            <img
                className={classes.image}
                src={memories}
                alt="memories"
                height="60"
            />
            </div>

            <Toolbar className={classes.toolbar}>
                {user?(
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant="h6">{user.result.name}</Typography>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                    </div>
                    ):
                    (
                        <Button component={Link} to="/auth" varinat="contained" color="primary">Sign in</Button>
                    )
                }
            </Toolbar>
            
        </AppBar>
    );
};

export default Navbar;
