import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import {light, dark} from "./styles.js";
import {NavBar, Footer} from "./components/NavBar";
import InputsCard from "./components/InputsCard";
import * as mathUtils from "./mathUtils"
import * as plotUtils from "./plotUtils"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {  Chart as ChartJS } from 'chart.js';

// defined using let instead of const in case you want to set
// other elements later based on primary/secondary colors
let lightTheme = light
let darkTheme = dark

// uncomment next line to define additional customizations
// theme = createTheme(theme, {**});

// import data file
// @TODO change this to a database query
const cskData = require("./data/csk_data.json")

// generate lists for select menu
const fSelDisp = cskData["fastener_data"].map(x=>mathUtils.selectFormat(x.metadata))
const fSelVal = cskData["fastener_data"].map(x=>x.metadata.id)

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

  // set default text properties for chart objects
  ChartJS.defaults.font.size = 14;
  ChartJS.defaults.color = theme.palette.text.primary;

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
  let kcskPlot = plotUtils.genKcskPlot(ChartJS,
    outputState.nomKcsk,
     "Countersink Depth Ratio (tcsk / t) [-]",
     "Joint Strength Knockdown (Kcsk) [-]",
     "Joint Strength Knockdown (nominal data)"
  )

  let rawDataPlot = readyToCalc? plotUtils.genEnvPlot(ChartJS,
    {points: outputState.rawData.dataset,nomKcsk:outputState.nomKcsk},
    "Sheet thickness (t) [in]",
    "Joint Ultimate Strength [lbf]",
    "Joint Ultimate Strength w/ Bearing-Shear Envelope"
  ) :
  plotUtils.genEnvPlot(ChartJS,
    {points:[],nomKcsk:[]},
    "Sheet thickness (t) [in]",
    "Joint Ultimate Strength [lbf]",
    "Joint Ultimate Strength w/ Bearing-Shear Envelope")

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ width: "75%", marginLeft:"12.5%", marginRight:"12.5%" }}>
        <NavBar themeToggle={() => toggleDark( !darkMode )} />
        <Paper elevation={3} sx={{ marginTop: "20px", padding:"10px" }}>
          <Typography component="div">
          <Box sx={{typography:"h3", textAlign:"center"}}>Countersunk Joint Knockdown Calculator</Box>
          <br />
          <Box sx={{typography:"p", textAlign:"center"}}>
            (<em>June 2022 - in work</em>)<br />
            This tool calculates strength knockdown factors for single-shear joints based on fastener type, fastener head style,
            and parent material properties. <br />
            
            Data source: MIL-HDBK-5J / MMPDS-01.
          </Box>
          <br />
            <Accordion TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="instructions-acc-header">Instructions</AccordionSummary>
              <AccordionDetails>
                <Box sx={{ typography: "p", textAlign: "left" }}>
                  Select fastener type from available datasets to generate knockdown curve.
                  Provide ultimate bearing strength of your specific joint configuration to scale the non-dimensional knockdown
                  curve appropriately.
                  <br /> <br />
                  <b>Sheet Bru:</b> Ultimate shear strength of user sheet material<br />
                  <b>Units:</b> Units for user input <br />
                  <b>Fastener Type:</b> Dataset for knockdown curve generation. Select based on fastener type, head style, and material ultimate shear strength.
                </Box>
                <br />
                <Box sx={{ typography: "subtitle", textAlign: "center" }}>Returns</Box>
                <Box sx={{ typography: "p" }}>
                  1. Plot of selected dataset with ultimate bearing-shear envelopes for each diameter <br />
                  2. Plot of non-dimensional strength knockdown vs countersink depth ratio for dataset<br />
                  3. (TODO) Plot of strength knockdown vs countersink depth ratio with bearing-shear envelope scaled by user-supplied Fbru value
                </Box>
              </AccordionDetails>
            </Accordion>
          </Typography>
        </Paper>
        <InputsCard 
          fbruVal={userInputs.fbru}
          unitVal={userInputs.unit}
          fastVal={userInputs.fast_sel}
          fastList={fSelVal}
          fastDisp={fSelDisp}
          hdlChg={handleChange}
          hdlSub={calculate}
          sx={{textAlign:"center"}} />
        <Paper elevation={3} sx={{padding: "10px", textAlign:"center"}}>
          <Typography variant="overline">Outputs</Typography><br />
          <span>{readyToCalc? 
            "Click legend entries to toggle data display":
            "User input required. Press 'Calculate' when ready"}
          </span>
          <Accordion TransitionProps={{unmountOnExit: true}}>
            <AccordionSummary 
                expandIcon={<ExpandMoreIcon />} 
                id="debug-acc-header">
              <Typography>Debug Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <ul>
            <li>Fastener dropdown id: {readyToCalc? userInputs.fast_sel: ""}</li>
            <li>Reference: {readyToCalc? outputState.rawData.metadata.fast_ref: ""}</li>
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
