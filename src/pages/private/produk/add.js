import React, { useState } from "react";
//material ui
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useFirebase } from "../../../components/FirebaseProvider";
import { withRouter } from "react-router-dom";

function AddDialog({ history, open, handleClose }) {
  const { firestore, user } = useFirebase();
  const produkCol = firestore.collection(`toko/${user.uid}/produk`);

  const [nama, setNama] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const handleSimpan = async e => {
    setSubmitting(true);
    try {
      if (!nama) {
        throw new Error("Nama Produk Wajib Di isi");
      }
      const produkBaru = await produkCol.add({ nama });
      history.push(`produk/edit/${produkBaru.id}`);
    } catch (e) {
      setError(e.message);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} disableBackdropClick={isSubmitting} disableEscapeKeyDown={isSubmitting} onClose={handleClose}>
      <DialogTitle>Buat Produk baru</DialogTitle>
      <DialogContent dividers>
        <TextField
          id="nama"
          label="Nama Produk"
          value={nama}
          onChange={e => {
            setError("");
            setNama(e.target.value);
          }}
          helperText={error}
          error={error ? true : false}
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} onClick={handleClose}>Batal</Button>
        <Button disabled={isSubmitting} onClick={handleSimpan} color="primary">
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddDialog.propTypes = { open: PropTypes.bool.isRequired,
handleClose:PropTypes.func.isRequired };

export default withRouter(AddDialog);
