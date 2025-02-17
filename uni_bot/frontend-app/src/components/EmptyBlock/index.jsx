import { Alert, AlertTitle } from '@mui/material';


export default function EmptyBlock() {
  return (
    <Alert severity="info">
      <AlertTitle>No Data Available</AlertTitle>
      There is no data to display at the moment. Please check back later.
    </Alert>
  );
}
