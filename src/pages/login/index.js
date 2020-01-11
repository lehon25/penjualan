import React,{ useState } from 'react';
//import komponent material ui
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';


// import styles
import useStyles from './styles';

// react router dom
import { Link ,Redirect} from 'react-router-dom';

// validator
import isEmail from 'validator/lib/isEmail';

// firebase
import {useFirebase} from '../../components/FirebaseProvider';

// Component AppLoading
import AppLoading from '../../components/AppLoading/index';

function Login(props){
    const {location}=props
    const classes = useStyles()
    const [form,setForm]= useState({
        email:'',
        password:'',
        showPassword:false

    });

    const [error,setError] = useState({
        email:'',
        password:''
    })
    

    const [isSubmitting,setSubmitting] = useState(false);

    const {auth,user,loading} = useFirebase();

    // const handleChange = e => {
    //     setForm({
    //         ...form,
    //         [e.target.name]:e.target.value
    //     })
    //     setError({
    //         ...error,
    //         [e.target.name]:''
    //     })
    // }
    const handleChange = event => {
        setForm({ ...form,[event.target.name]:event.target.value});
             setError({
            ...error,
            [event.target.name]:''
        })
      };
    

    const handleClickShowPassword = ()=>{
        setForm({...form, showPassword: !form.showPassword })
    }

    const validate =()=>{
        const newError = { ...error };
        if(!form.email){
            newError.email = 'Email wajib diisi';
        }else if(!isEmail(form.email)){
            newError.email='Email tidak valid';
        }
        if(!form.password){
            newError.password = 'Password wajib diisi';
        }
       
        return newError;


    }
    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();
        if(Object.values(findErrors).some(err => err !== '')){
            setError(findErrors);
        }else{
            try{
                setSubmitting(true)
                await auth.signInWithEmailAndPassword(form.email,form.password)
            }catch(e){
                const newError={}
                switch(e.code){
                    case 'auth/user-not-found':
                        newError.email = 'Email tidak terdaftar';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid';
                        break;
                    case 'auth/wrong-password':
                        newError.password = 'Password salah';
                        break;
                    case 'auth/user-disabled':
                        newError.email = 'Pengguna di blokir'
                        break;
                        default:
                            newError.email = 'Terjadi kesalahan silahkan coba lagi'
                            break;
                }
                setError(newError);
                setSubmitting(false)
            }
        }
    }

    if(loading){
        return <AppLoading/>
    }
    if(user){
        const redirectTo=location.state && 
            location.state.from && 
            location.state.from.pathname ?
            location.state.from.pathname : '/'
        return <Redirect to={redirectTo}/>
    }
    console.log('form',form)
    console.log('user',user)

    return<Container maxWidth='xs'>
        <Paper className={classes.paper}>
    <Typography variant="h5" component="h1" className={classes.title}>Login</Typography>

    <form onSubmit={handleSubmit} noValidate>
        <TextField id="email" 
            type="email" 
            name="email" 
            margin="normal" 
            label="Alamat Email" 
            fullWidth 
            required 
            value={form.email} 
            onChange={handleChange} 
            helperText={error.email}
            error={error.email ?true:false}
            disabled={isSubmitting}/>
    <FormControl className={classes.password} >
        {/* <TextField id="password" 
            type="password" 
            // name="password" 
            margin="normal" 
            label="Password" 
            fullWidth
            required 
            value={form.password} 
            // onChange={handleChange}
            helperText={error.password}
            error={error.password ?true:false}
            disabled={isSubmitting}/> */}
             
             <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>       
        <Input id="password" 
            type={form.showPassword ? 'text' : 'password'}
            value={form.password}
            fullWidth
            margin="normal"
            required 
            name="password"
            helperText={error.password}
            disabled={isSubmitting}
            onChange={handleChange}
            error={error.password ?true:false}
            label="Password" 
            endAdornment={
            <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {form.password ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
               }/>
              </FormControl>
        
        
        <Grid container className={classes.buttons}>
            <Grid item xs>
                <Button type="submit" color="primary" variant="contained" size="large" disabled={isSubmitting}>Login</Button>
            </Grid>
            <Grid item>
            <Button component={Link} variant="contained" size="large" to="/registrasi" disabled={isSubmitting}>Daftar</Button>
            </Grid>
        </Grid>
        <div className={classes.forgotPassword}>
        <Typography component={Link} to='lupa-password'>
            Lupa Password
        </Typography>
        </div>
      
    </form>
</Paper>
   </Container>
}

export default Login;