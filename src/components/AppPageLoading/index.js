import React from 'react';

// material-ui
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './styles';

function AppLoading(){
    const classes = useStyles();
    return (
   
            <div className={classes.loadingBox}>
            <CircularProgress/>
            </div>

    )
}

export default AppLoading;