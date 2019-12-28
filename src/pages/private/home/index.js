import React from 'react';
import Button from '@material-ui/core/Button'
//Firebase
import {useFirebase}  from '../../../components/FirebaseProvider';

function Home(){
    const {auth} = useFirebase()

    return <><h1>Halaman Home (Buat transaksi)</h1>
    <Button onClick={(e)=>{
        auth.signOut()
    }}>Sign Out</Button></>
}

export default Home;