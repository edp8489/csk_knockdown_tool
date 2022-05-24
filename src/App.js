import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import {light, dark} from "./styles.js";
import {NavBar, Footer} from "./NavBar";
import InputsCard from "./InputsCard";
import * as mathUtils from "./mathUtils"
import * as plotUtils from "./plotUtils"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    nomKcsk:[],
    userKcsk: []
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
      const selectedData = cskData["fastener_data"].find(x => x.metadata.id === userInputs.fast_sel)
      console.log(selectedData)
      setOutputs(prevState =>{
        return{...prevState, ...{rawData:selectedData}}
      })
      
      // mathUtils.calcUltKnockdown(t, Pult, tcsk, d, Fbru, Fsu)
      // calculate (tcsk_t, nomKcsk) for raw data
      // @TODO
      
      let nK = selectedData.dataset.map(el => mathUtils.calcUltKnockdown(
        el.tsht,
        el.Pult,
        el.tcsk,
        el.d,
        selectedData.metadata.sht_fbru2A,
        selectedData.metadata.fast_fsu
      ))
      // console.log(nK)
      setOutputs(prevState =>{
        return{...prevState, ...{nomKcsk: nK}}
      })
      // calculate (tcsk_t, userKcsk) for user-supplied Fbru input
      // @TODO
    }
    e.preventDefault()
  }
  let kcskPlot = readyToCalc? plotUtils.genKcskPlot(
    outputState.nomKcsk,
     "Countersink Depth Ratio (tcsk / t) [-]",
     "Joint Strength Knockdown (Kcsk) [-]",
     "Joint Strength Knockdown (nominal data)"
  ) :
  plotUtils.genKcskPlot(
    outputSchema.nomKcsk,
     "Countersink Depth Ratio (tcsk / t) [-]",
     "Joint Strength Knockdown (Kcsk) [-]",
     "Joint Strength Knockdown (nominal data)"
  )

  let rawDataPlot = readyToCalc? plotUtils.genEnvPlot(
    {points: outputState.rawData.dataset,nomKcsk:outputState.nomKcsk},
    "Sheet thickness (t) [in]",
    "Joint Ultimate Strength [lbf]",
    "Joint Ultimate Strength w/ Bearing-Shear Envelope"
  ) :
  plotUtils.genEnvPlot(
    {points:[],nomKcsk:[]},
    "Sheet thickness (t) [in]",
    "Joint Ultimate Strength [lbf]",
    "Joint Ultimate Strength w/ Bearing-Shear Envelope")

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
          <Typography variant="subtitle1">Outputs</Typography><br />
          <span>{readyToCalc? "Calculated values (debug use)":"User input required. Press 'Calculate' when ready"}</span>
          <Accordion TransitionProps={{unmountOnExit: true}}>
            <AccordionSummary 
                expandIcon={<ExpandMoreIcon />} 
                id="debug-acc-header">
              <Typography>Debug Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <ul>
            <li>Fastener dropdown id: {readyToCalc? userInputs.fast_sel: ""}</li>
            <li>Data Source: {readyToCalc? outputState.rawData.metadata.fast_ref: ""}</li>
            <li>User Fbru input: {readyToCalc? userInputs.fbru : ""} [{readyToCalc? userInputs.unit : ""}]</li>
            <li>User Fbru (psi): {(readyToCalc && userInputs.unit!=="psi")?mathUtils.mpa2psi(userInputs.fbru):"no conversion necessary"}</li>
          </ul>
            </AccordionDetails>
          </Accordion>
          {rawDataPlot}
          {kcskPlot}
        </Paper>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
