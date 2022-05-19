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

const summary = "This tool calculates strength knockdown factors for " +
                "single-shear joints based on fastener type, fastener head style, " +
                "and parent material properties.\nAll strength data comes from from MIL-HDBK-5J / MMPDS-01"

const MPA_TO_PSI = 145 // 1 MPa = 145 psi
const LBF_TO_NEWTON = 1.448 // 1 lbf = 4.448 N

function mpa2psi(mpa_val){
  return mpa_val*MPA_TO_PSI
}

function lbf2newton(lbf_val){
  return lbf_val*LBF_TO_NEWTON
}


export default function App() {
  const [darkMode, toggleDark] = React.useState(false);
  const [readyToCalc, setReady] = React.useState(false)
  const [userInputs, setInputs] = React.useState({
    fbru:"",
    unit: "psi",
    fast_sel: ""
  });
  
  let theme = darkMode ? darkTheme : lightTheme;

  const handleChange = function(e) {
    setInputs(prevState => {
      return{...prevState, ...{[e.target.name]:e.target.value}}
    })
    setReady(false)
    e.preventDefault()
  }

  const calculate = function(e){
    // only perform if all inputs are present
    if (userInputs.fbru ==="" || userInputs.fast_sel ===""){
      alert("Please define all inputs first!")
    }
    else {
      setReady(true)
    }
    e.preventDefault()
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ textAlign: "center", width: "75%", marginLeft:"12.5%", marginRight:"12.5%" }}>
        <Paper elevation={3} sx={{ marginTop: "50px", padding:"10px" }}>
          <Typography variant="h3">Countersunk Joint Knockdown Calculator</Typography>
          <br />
          <Typography variant="p">
            (in work)<br />
            {summary}
          </Typography>
          <br />
          <br />
          <Button
            variant="contained"
            color={darkMode ? "secondary" : "primary"}
            onClick={() => toggleDark( !darkMode )}
          >
            Toggle theme
          </Button>
        </Paper>
        <InputsCard 
          fbruVal={userInputs.fbru}
          unitVal={userInputs.unit}
          fastVal={userInputs.fast_sel}
          fastSelect={fsuSelect}
          hdlChg={handleChange}
          hdlSub={calculate} />
        <Paper elevation={3} sx={{padding: "10px"}}>
          <Typography variant="subtitle1">Outputs (Debug Only)</Typography><br />
          <span>{readyToCalc? "Calculated values":"User input required. Press 'Calculate' when ready"}</span>
          <ul>
            <li>Sheet Fbru input: {readyToCalc? userInputs.fbru : ""} [{readyToCalc? userInputs.unit : ""}]</li>
            <li>Sheet Fbru (psi): {(readyToCalc && userInputs.unit==="psi")?"no conversion necessary":mpa2psi(userInputs.fbru)}</li>
          </ul>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
