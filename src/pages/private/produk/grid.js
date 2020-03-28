import React, { useState, useEffect } from "react";
// material-ui
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import ImageIcon from "@material-ui/icons/Image";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
//styles
import useStyles from "./styles/grid";
// page component
import AddDialog from "./add";
import { useFirebase } from "../../../components/FirebaseProvider";
import { useCollection } from "react-firebase-hooks/firestore";

//Page Loading
import AppPageLoading from "../../../components/AppPageLoading";
// utils
import { currency } from "../../../utils/formatter";
import { Link } from "react-router-dom";

function GridProduk() {
  const classes = useStyles();
  const { firestore,storage, user } = useFirebase();
  const produkCol = firestore.collection(`toko/${user.uid}/produk`);
  const [snapshot, loading] = useCollection(produkCol);
  const [produkItems, setProdukItems] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    if (snapshot) {
      setProdukItems(snapshot.docs);
    }
  }, [snapshot]);
  if (loading) {
    return <AppPageLoading />;
  }

  const handleDelete = produkDoc => async e => {
    if (window.confirm("Anda yakin menghapus produk ini ?")) {
      await produkDoc.ref.delete();
      const fotoURL = produkDoc.data().foto;
      if (fotoURL) {
        storage.refFromURL(fotoURL).delete();

      }
    }
  };
  return (
    <>
      <Typography variant="h5" component="h1" paragraph>
        {" "}
        Daftar produk
      </Typography>
      {produkItems.length <= 0 && (
        <Typography>Belum ada Data Produk</Typography>
      )}
      <Grid container spacing={5}>
        {produkItems.map(produkDoc => {
          const produkData = produkDoc.data();
          console.log("produckdata", produkData.foto);
          return (
            <Grid key={produkDoc.id} item={true} xs={12} sm={12} md={6} lg={4}>
              <Card className={classes.card}>
                {produkData.foto && (
                  <CardMedia
                    className={classes.foto}
                    image={produkData.foto}
                    title={produkData.nama}
                  />
                )}

                {!produkData.foto && (
                  <div className={classes.fotoPlaceholder}>
                    <ImageIcon size="large" color="disabled" />
                  </div>
                )}
                <CardContent className={classes.produkDetails}>
                  <Typography variant="h5" noWrap>
                    {produkData.nama}
                  </Typography>
                  <Typography variant="subtitle1">
                    Harga : {currency(produkData.harga)}
                  </Typography>
                  <Typography variant="subtitle1">
                    Stok : {produkData.stok}
                  </Typography>
                </CardContent>
                <CardActions className={classes.produkActions}>
                  <IconButton
                    component={Link}
                    to={`/produk/edit/${produkDoc.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete(produkDoc)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Fab
        className={classes.fab}
        color="primary"
        onClick={e => {
          setOpenAddDialog(true);
        }}
      >
        <AddIcon />
      </Fab>
      <AddDialog
        open={openAddDialog}
        handleClose={() => {
          setOpenAddDialog(false);
        }}
      />
    </>
  );
}

export default GridProduk;
