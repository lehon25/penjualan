import {makeStyles} from '@material-ui/core/styles';

const useStyles =makeStyles(theme=>({
   fab:{
       position: 'absolute',
       bottom: theme.spacing(2),
       right:theme.spacing(2)
   },
   card:{
       display:'flex'
   },
   foto:{
       width:150
   },
   fotoPlaceholder:{
       width:150,
       alignSelf:'center',
       textAlign:'center'
   },
   produkDetails:{
       flex:'2.0 auto'
   },
   produkActions:{
       flexDirection:'column'
   }
}))

export default useStyles;