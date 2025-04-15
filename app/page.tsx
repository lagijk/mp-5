import UrlForm from "./components/url-form";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box minHeight="100vh" sx={{backgroundColor: "#EDF1D6"}} display="flex" justifyContent="center" alignItems="center" padding={4}>
      <Box maxWidth="700px" width="100%">
        <Typography variant="h4" fontWeight="bold" > URL Shortener</Typography>
        <UrlForm/>
      </Box>
    </Box>
   
  );
}