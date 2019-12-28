import React from 'react';

//material ui
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// styles
import useStyles from './styles';

// React Router DOM
import {Link} from 'react-router-dom';

function NotFound(){
    const classes = useStyles();
    return (
        <Container className={classes.paper}>
            <Paper>
                <Typography variant='subtitle1'>
                    Halaman Tidak ditemukan
                </Typography>
                <Typography variant='h3'>
                    404
                </Typography>
                <Typography component={Link} to='/'>
                    Kembali ke Beranda
                </Typography>
            </Paper>

        </Container>
    )
}

export default NotFound;