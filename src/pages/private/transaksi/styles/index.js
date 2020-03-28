import {makeStyles} from '@material-ui/core/styles';

const useStyles =makeStyles(theme=>({
card:{
    display:'flex'
},
transaksiSummary:{
    flex:'2 0 auto'
},
transaksiActions:{
    flexDirection:'column'
}
}))

export default useStyles;