import React, { useState, useEffect } from 'react';

// material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';

import { useFirebase } from '../../../components/FirebaseProvider';
import { useDocument } from 'react-firebase-hooks/firestore';

import AppPageLoading from '../../../components/AppPageLoading';
import { useSnackbar } from 'notistack';

import useStyles from './styles/edit';

import { Prompt } from 'react-router-dom';

function EditProduk({ match }) {
    const classes = useStyles();
    const { firestore, storage, user } = useFirebase();
    const { enqueueSnackbar } = useSnackbar();
    const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`);

    const produkStorageRef = storage.ref(`toko/${user.uid}/produk`);

    const [snapshot, loading] = useDocument(produkDoc);

    const [form, setForm] = useState({
        nama: '',
        sku: '',
        harga: 0,
        stok: 0,
        deskripsi: ''
    });

    const [error, setError] = useState({
        nama: '',
        sku: '',
        harga: '',
        stok: '',
        deskripsi: ''
    })

    const [isSubmitting, setSubmitting] = useState(false);

    const [isSomethingChange, setSomethingChange] = useState(false);

    useEffect(() => {

        if (snapshot) {

            setForm(currentForm => ({
                ...currentForm,
                ...snapshot.data()
            }));
        }
    }, [snapshot]);

    const handleChange = e => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

        setError({
            ...error,
            [e.target.name]: ''
        })

        setSomethingChange(true);
    }

    const validate = () => {

        const newError = { ...error };

        if (!form.nama) {
            newError.nama = 'Nama Produk wajib diisi';
        }

        if (!form.harga) {
            newError.harga = 'Harga Produk wajib diisi';
        }

        if (!form.stok) {
            newError.stok = 'Stok Produk wajib diisi';
        }

        return newError;

    }

    const handleSubmit = async e => {
        e.preventDefault();

        const findErros = validate();

        if (Object.values(findErros).some(err => err !== '')) {
            setError(findErros);
        } else {
            setSubmitting(true);
            try {
                await produkDoc.set(form, { merge: true });
                enqueueSnackbar('Data produk berhasil disimpan', { variant: 'success' })
                setSomethingChange(false);
            }
            catch (e) {
                enqueueSnackbar(e.message, { variant: 'error' })
            }
            setSubmitting(false);
        }

    }

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];

        if (!['image/png', 'image/jpeg'].includes(file.type)) {

            setError(error => ({
                ...error,
                foto: `Tipe file tidak didukung: ${file.type}`
            }))
        }
        else if (file.size >= 512000) {
            setError(error => ({
                ...error,
                foto: `Ukuran file terlalu besar > 500KB`
            }))
        } else {

            const reader = new FileReader();

            reader.onabort = () => {

                setError(error => ({
                    ...error,
                    foto: `Proses pembacaan file dibatalkan`
                }))
            }

            reader.onerror = () => {

                setError(error => ({
                    ...error,
                    foto: 'File tidak bisa dibaca'
                }))
            }

            reader.onload = async () => {
                setError(error => ({
                    ...error,
                    foto: ''
                }))
                setSubmitting(true);
                try {
                    const fotoExt = file.name.substring(file.name.lastIndexOf('.'));

                    const fotoRef = produkStorageRef.child(`${match.params.produkId}${fotoExt}`);

                    const fotoSnapshot = await fotoRef.putString(reader.result, 'data_url');

                    const fotoUrl = await fotoSnapshot.ref.getDownloadURL();

                    setForm(currentForm => ({
                        ...currentForm,
                        foto: fotoUrl
                    }));

                    setSomethingChange(true);
                } catch (e) {
                    setError(error => ({
                        ...error,
                        foto: e.message
                    }))


                }

                setSubmitting(false);

            }

            reader.readAsDataURL(file);

        }
    }

    if (loading) {

        return <AppPageLoading />
    }
    return <div>
        <Typography variant="h5" component="h1">Edit Produk: {form.nama}</Typography>
        <Grid container alignItems="center" justify="center">
            <Grid item xs={12} sm={6}>
                <form id="produk-form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="nama"
                        name="nama"
                        label="Nama Produk"
                        margin="normal"
                        fullWidth
                        required
                        value={form.nama}
                        onChange={handleChange}
                        helperText={error.nama}
                        error={error.nama ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="sku"
                        name="sku"
                        label="SKU Produk"
                        margin="normal"
                        fullWidth
                        value={form.sku}
                        onChange={handleChange}
                        helperText={error.sku}
                        error={error.sku ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="harga"
                        name="harga"
                        label="Harga Produk"
                        type="number"
                        margin="normal"
                        required
                        fullWidth
                        value={form.harga}
                        onChange={handleChange}
                        helperText={error.harga}
                        error={error.harga ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="stok"
                        name="stok"
                        label="Stok Produk"
                        type="number"
                        margin="normal"
                        required
                        fullWidth
                        value={form.stok}
                        onChange={handleChange}
                        helperText={error.stok}
                        error={error.stok ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="deskripsi"
                        name="deskripsi"
                        label="Deskripsi Produk"
                        margin="normal"
                        multiline
                        rowsMax={3}
                        fullWidth
                        value={form.deskripsi}
                        onChange={handleChange}
                        helperText={error.deskripsi}
                        error={error.deskripsi ? true : false}
                        disabled={isSubmitting}
                    />
                </form>
            </Grid>
            <Grid item xs={12} sm={6}>
                <div className={classes.uploadFotoProduk}>
                    {form.foto &&
                        <img src={form.foto} className={classes.previewFotoProduk} alt={`Foto Produk ${form.nama}`} />}
                    <input
                        className={classes.hideInputFile}
                        type="file"
                        id="upload-foto-produk"
                        accept="image/jpeg,image/png"
                        onChange={handleUploadFile}
                    />
                    <label htmlFor="upload-foto-produk">
                        <Button
                            disabled={isSubmitting}
                            variant="outlined"
                            component="span"
                        >Upload Foto <UploadIcon className={classes.iconRight} /></Button>
                    </label>
                    {error.foto &&
                        <Typography color="error">
                            {error.foto}
                        </Typography>}
                </div>
            </Grid>
            <Grid item xs={12}>
                <div className={classes.actionButtons}>
                    <Button
                        disabled={isSubmitting || !isSomethingChange}
                        form="produk-form"
                        type="submit"
                        color="primary"
                        variant="contained">
                        <SaveIcon className={classes.iconLeft} />
                        Simpan
                </Button>
                </div>
            </Grid>
        </Grid>
        <Prompt
            when={isSomethingChange}
            message="Terdapat perubahan yang belum disimpan, apakah anda yakin ingin meninggalkan halaman ini?"

        />
    </div>
}

export default EditProduk;