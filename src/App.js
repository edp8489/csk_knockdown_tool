import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Paper, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import {light, dark} from "./styles.js";
import {NavBar, Footer} from "./NavBar";
import InputsCard from "./InputsCard";
import * as mathUtils from "./mathUtils"

// defined using let instead of const in case you want to set
// other elements later based on primary/secondary colors
let lightTheme = light
let darkTheme = dark

// uncomment next line to define additional customizations
// theme = createTheme(theme, {**});

// DEBUG ONLY
// define junk data
//const fsuSelect = ["50 ksi (345 MPa)", "95 ksi (655 MPa)", "108 ksi (745 MPa)"]
const cskData = require("./data/csk_data.json")
//console.log(Object.keys(cskData))
//console.log(cskData["fastener_data"].map(x=>x.metadata.fast_fsu))
const fSelDisp = cskData["fastener_data"].map(x=>mathUtils.selectFormat(x.metadata.fast_fsu))
const fSelVal = cskData["fastener_data"].map(x=>x.metadata.id)

const summary = "This tool calculates strength knockdown factors for " +
                "single-shear joints based on fastener type, fastener head style, " +
                "and parent material properties.\nAll strength data comes from from MIL-HDBK-5J / MMPDS-01"

export default function App() {
  const [darkMode, toggleDark] = React.useState(false);
  const [readyToCalc, setReady] = React.useState(false)
  const [userInputs, setInputs] = React.useState({
    fbru: "",
    unit: "psi",
    fast_sel: ""
  });
  // @TODO expand state with Kcsk_user
  const outputSchema = {
    rawData:{},
    tcsk_t:[],
    Kcsk: []
  }
  const [outputState, setOutputs] = React.useState(outputSchema)
  
  let theme = darkMode ? darkTheme : lightTheme;

  const handleChange = function(e) {
    setInputs(prevState => {
      return{...prevState, ...{[e.target.name]:e.target.value}}
    })
    setReady(false)
    setOutputs(outputSchema)
    e.preventDefault()
  }

  const calculate = function(e){
    // only perform if all inputs are present
    if (userInputs.fbru ==="" || userInputs.fast_sel ===""){
      alert("Please define all inputs first!")
    }
    else {
      setReady(true)
      const selectedData = cskData["fastener_data"].filter(x => x.metadata.id === userInputs.fast_sel)
      setOutputs(prevState =>{
        return{...prevState, ...{rawData:selectedData}}
      })
      
      //let [t_nd, K] = mathUtils.calcUltKnockdown()
    }
    e.preventDefault()
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ textAlign: "center", width: "75%", marginLeft:"12.5%", marginRight:"12.5%" }}>
        <NavBar themeToggle={() => toggleDark( !darkMode )} />
        <Paper elevation={3} sx={{ marginTop: "20px", padding:"10px" }}>
          <Typography variant="h3">Countersunk Joint Knockdown Calculator</Typography>
          <br />
          <Typography variant="p">
            (in work)<br />
            {summary}
          </Typography>
          <br />
          <br />
        </Paper>
        <InputsCard 
          fbruVal={userInputs.fbru}
          unitVal={userInputs.unit}
          fastVal={userInputs.fast_sel}
          fastList={fSelVal}
          fastDisp={fSelDisp}
          hdlChg={handleChange}
          hdlSub={calculate} />
        <Paper elevation={3} sx={{padding: "10px"}}>
          <Typography variant="subtitle1">Outputs (Debug Only)</Typography><br />
          <span>{readyToCalc? "Calculated values":"User input required. Press 'Calculate' when ready"}</span>
          <ul>
            <li>Sheet Fbru input: {readyToCalc? userInputs.fbru : ""} [{readyToCalc? userInputs.unit : ""}]</li>
            <li>Sheet Fbru (psi): {(readyToCalc && userInputs.unit!=="psi")?mathUtils.mpa2psi(userInputs.fbru):"no conversion necessary"}</li>
            <li>tcsk/t: {readyToCalc? "TODO": ""}</li>
            <li>Kcsk: {readyToCalc? "TODO": ""}</li>
          </ul>
        </Paper>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
