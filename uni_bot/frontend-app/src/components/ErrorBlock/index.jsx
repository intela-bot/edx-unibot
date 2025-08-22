import { Alert, AlertTitle } from '@mui/material';


export default function ErrorBlock() {
  return (
    <Alert severity="error">
      <AlertTitle>Error Retrieving Data</AlertTitle>
      This is a success Alert with an encouraging title.
    </Alert>
  );
}
