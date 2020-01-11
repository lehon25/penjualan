import React ,{ useRef,useState } from 'react';
//material ui
import TextField from '@material-ui/core/TextField';
import { useFirebase} from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// validator npm
import isEmail from 'validator/lib/isEmail';
import useStyles from './styles/pengguna';

function Pengguna(){
    const classes = useStyles()
    const {user} = useFirebase();
    const [error,setError]= useState({
        displayName:'',
        email:'',
        password:''
    })
    const {enqueueSnackbar} = useSnackbar();
    const [isSubmitting,setSubmitting] = useState(false);
    const displayNameRef=useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const saveDisplayName = async(e)=>{
       
        const displayName = displayNameRef.current.value;
        console.log('displayname',displayName);
        if(!displayName){
            setError({
                displayName:'Nama wajib diisi'
            })
        } else if(displayName !== user.displayName) {
            setError({
                displayName:''
            })
            setSubmitting(true)
            await user.updateProfile({displayName})
            setSubmitting(false)
            enqueueSnackbar('Data Pengguna berhasil diperbaharui',{variant:'success'})
        }
    }
    const updateEmail =async(e)=>{
        const email = emailRef.current.value;
        if(!email){
            setError({
                email:'Email Wajib diisi'
            })
        }
        else if(!isEmail(email)){
            setError({
                email:'Email tidak valid'
            })
        }
        else if(email !== user.email){
            setError({
                email:''
            })
            setSubmitting(true)
            try{
                await user.updateEmail(email)
                enqueueSnackbar('Email berhasil diperbaharui',{variant:'succes'})
            }
            catch(e){
                let emailError = '';
                switch(e.code){
                    case 'auth/email-already-in-use':
                        emailError ='Email sudah digunakan oleh pengguna lain';
                        break;
                    case 'auth/invalid-email':
                        emailError ='Email tidak valid'
                        break;
                    case 'auth/requires-recent-login':
                        emailError='Silahkan logout,kemudian login kembali untuk memperbaharui email'
                        break;
                    default:
                        emailError='Terjadi kesalahan silahkan coba lagi'
                        break;
                }       
                setError({
                    email:emailError
                })
            }
        }
        setSubmitting(false)

    }
    const sendEmailVerification = async(e)=>{
        const actionCodeSettings={
            url:`${window.location.origin}/login`
        }
        setSubmitting(true)
        await user.sendEmailVerification(actionCodeSettings);
        enqueueSnackbar(`Email verivikasi telah dikirim${emailRef.current.value}`,{variant:'success'})
        setSubmitting(false)

    }
    const updatePassword=async(e)=>{
            const password = passwordRef.current.value;
            if(!password){
                setError({
                    password:'Password wajib diisi'
                })
            }else{
                setSubmitting(true)
                try{
                    await user.updatePassword(password)
                    enqueueSnackbar('Password Berhasil diperbaharui',{variant:'success'})
                }
                catch(e){
                    let errorPassword = ''
                    switch(e.code){
                        case 'auth/weak-password':
                            errorPassword='Password terlalu lemah';
                            break;
                        case 'auth/requires-recent-login':
                            errorPassword='Silahkan logout,kemudian login kembali untuk memperbaharui Password anda'
                                break;
                            default:
                                errorPassword='Terjadi kesalahan silahkan coba lagi'
                        
                    }
                    setError({
                        password:errorPassword
                    })
                }
                setSubmitting(false)
            }
    }


    return <div className={classes.pengaturanPengguna}>
    <TextField id='displayName'
         name='displayName' 
         label='Nama'
         margin='normal'
         defaultValue={user.displayName}
         inputProps={{
            ref:displayNameRef,
            onBlur:saveDisplayName
        }}
        disabled={isSubmitting}
        helperText={error.displayName}
        error={error.displayName ? true:false}
        />
    <TextField id='email'
        name='email'
        label='email'
        margin='normal'
        type='email'
        defaultValue={user.email}
        inputProps={{
            ref:emailRef,
            onBlur:updateEmail
        }}
        disabled={isSubmitting}
        helperText={error.email}
        error={error.email ? true:false}/>
    
        {
            user.emailVerified ?
            <Typography color='primary' variant='subtitle1'>Email sudah terverifikasi</Typography>
            :
            <Button variant='outlined' 
                onClick={sendEmailVerification}
                disabled={isSubmitting}>
                Kirim email verifikasi
             </Button>
        }
        <TextField
        id="password"
        name="password"
        label="Password Baru"
        type="password"
        margin='normal'
        inputProps={{
                ref:passwordRef,
                onBlur:updatePassword}}
                autoComplete='new-password'
        disabled={isSubmitting}
        helperText={error.password}
        error={error.password ? true:false}/>
    
    </div>
}

export default Pengguna;