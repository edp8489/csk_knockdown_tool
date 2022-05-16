import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Paper, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import {light, dark} from "./styles.js"

// defined using let instead of const in case you want to set
// other elements later based on primary/secondary colors
let lightTheme = light
let darkTheme = dark

// uncomment next line to define additional customizations
// theme = createTheme(theme, {**});

export default function App() {
  const [state, setState] = React.useState({ dark: false });
  let theme = state.dark ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ textAlign: "center" }}>
        <Paper elevation={3} sx={{ marginTop: "50px" }}>
          <Typography variant="h1" component="h3">Countersunk Knockdown Calculator</Typography>
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
      </Box>
    </ThemeProvider>
  );
}
