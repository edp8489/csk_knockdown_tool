import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Paper, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import {light, dark} from "./styles.js";
import InputsCard from "./InputsCard";

// defined using let instead of const in case you want to set
// other elements later based on primary/secondary colors
let lightTheme = light
let darkTheme = dark

// uncomment next line to define additional customizations
// theme = createTheme(theme, {**});

// DEBUG ONLY
// define junk data
const fsuSelect = ["50 ksi (345 MPa)", "95 ksi (655 MPa)", "108 ksi (745 MPa)"]

export default function App() {
  const [state, setState] = React.useState({ dark: false });
  const ref_fbru = React.useRef(null);
  const ref_unit = React.useRef('psi');
  const ref_fast = React.useRef("");
  let theme = state.dark ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ textAlign: "center" }}>
        <Paper elevation={3} sx={{ marginTop: "50px" }}>
          <Typography variant="h3">Countersunk Joint Knockdown Calculator</Typography>
          <br />
          <Typography variant="p">
            (in work)
          </Typography>
          <br />
          <br />
          <Button
            variant="contained"
            color={state.dark ? "secondary" : "primary"}
            onClick={() => setState({ dark: !state.dark })}
          >
            Toggle theme
          </Button>
        </Paper>
        <InputsCard  ref_fbru={ref_fbru} ref_unit={ref_unit} ref_fast={ref_fast} fastSelect={fsuSelect} />
      </Box>
    </ThemeProvider>
  );
}
