import React from "react";
import PropTypes from "prop-types";

//material ui
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { currency } from "../../../utils/formatter";
import { DialogActions } from "@material-ui/core";

function DetailsDialog({ open, handleClose, transaksi }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Transaksi No:{transaksi.no}</DialogTitle>
      <DialogContent dividers>
        <Table>
          <TableHead>
            <TableCell>Item</TableCell>
            <TableCell>Jumlah</TableCell>
            <TableCell>Harga</TableCell>
            <TableCell>Subtotal</TableCell>
          </TableHead>
          <TableBody>
            {transaksi.items &&
              Object.keys(transaksi.items).map(k => {
                const item = transaksi.items[k];
                return (
                  <TableRow key={k}>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.jumlah}</TableCell>
                    <TableCell>{currency(item.harga)}</TableCell>
                    <TableCell>{currency(item.subtotal)}</TableCell>
                  </TableRow>
                );
              })}
            <TableRow>
              <TableCell colSpan={3}>
                <Typography variant="subtitle2">Total</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {currency(transaksi.total)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
DetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  transaksi: PropTypes.object.isRequired
};

export default DetailsDialog;
