import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({

    hideInputFile: {
        display: 'none'
    },
    uploadFotoProduk: {
        textAlign: 'center',
        padding: theme.spacing(3)
    },
    previewFotoProduk: {
        width: '100%',
        height: 'auto'
    },
    iconRight: {
        marginLeft: theme.spacing(1)
    },
    iconLeft: {
        marginRight: theme.spacing(1)
    },
    actionButtons: {
        paddingTop: theme.spacing(2)
    }

}))


export default useStyles;