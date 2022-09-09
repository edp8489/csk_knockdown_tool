import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import { light, dark } from "./styles.js";
import { NavBar, Footer } from "./components/NavBar";
import InputsCard from "./components/InputsCard";
import InfoPanel from "./components/InfoPanel";
import * as mathUtils from "./mathUtils"
import * as plotUtils from "./plotUtils"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Chart as ChartJS } from 'chart.js';
import { DataEnvPlot, KcskPlot } from "./components/Graphs";

// analytics
import TagManager from 'react-gtm-module'
const tagManagerArgs = {
    gtmId: 'GTM-TTMV4VF'
}
TagManager.initialize(tagManagerArgs)

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
const fSelDisp = cskData["fastener_data"].map(x => mathUtils.selectFormat(x.metadata))
const fSelVal = cskData["fastener_data"].map(x => x.metadata.id)

export default function App() {
  const [darkMode, toggleDark] = React.useState(false);
  const [readyToCalc, setReady] = React.useState(false)
  const [userInputs, setInputs] = React.useState({
    fbru: "",
    unit: "psi",
    fast_sel: ""
  });
  // @TODO expand state with userKcsk
  const outputSchema = {
    rawData: {},
    nomKcsk: [],
    userKcsk: [],
    graph1CJS: null,
    graph2CJS: null,
    graph3CJS: null
  }
  const [outputState, setOutputs] = React.useState(outputSchema)

  let theme = darkMode ? darkTheme : lightTheme;

  // set default text properties for chart objects
  ChartJS.defaults.font.size = 14;
  ChartJS.defaults.color = theme.palette.text.primary;

  const handleChange = function (e) {
    setInputs(prevState => {
      return { ...prevState, ...{ [e.target.name]: e.target.value } }
    })
    setReady(false)
    setOutputs(outputSchema)
    e.preventDefault()
  }

  const calculate = function (e) {
    // only perform if all inputs are present
    // @TODO Make user Fbru optional and don't populate third graph if empty
    if (userInputs.fast_sel === "") {
      alert("Please select a fastener first!")
    }
    else {
      setReady(true)
      const selectedData = cskData["fastener_data"].find(x => x.metadata.id === userInputs.fast_sel)
      setOutputs(prevState => {
        return {
          ...prevState, ...{
            rawData: selectedData,
          }
        }
      })

      // Calc everything first then pass to a single setOutputs call

      // calculate bearing-shear strength envelopes for each dataset
      let plotPenv = selectedData.dataset.map(el => mathUtils.genPlotPenv(
        el.tsht,
        el.d,
        selectedData.metadata.sht_fbru2A,
        selectedData.metadata.fast_fsu
      ))

      // calculate nondim strength knockdowns for test data
      let nK = selectedData.dataset.map(el => mathUtils.calcUltKnockdown(
        el.tsht,
        el.Pult,
        el.tcsk,
        el.d,
        selectedData.metadata.sht_fbru2A,
        selectedData.metadata.fast_fsu
      ))
      // console.log(nK)

      // calculate nondim strength knockdowns for user-supplied Fbru input
      // @TODO (if present)
      let uK = selectedData.dataset.map(el => mathUtils.calcUltKnockdown(
        el.tsht,
        el.Pult,
        el.tcsk,
        el.d,
        userInputs.fbru,
        selectedData.metadata.fast_fsu
      ))

      // generate data object for data-envelope plot component
      
      let graph1CJS = plotUtils.fmtEnvPlotData({
        points: selectedData.dataset,
        envelope: plotPenv
      })
      

      // generate data object for test data Kcsk plot component
      let graph2CJS = plotUtils.fmtKndPlotData(nK)

      // generate data object for user Kcsk plot component
      let graph3CJS = plotUtils.fmtKndPlotData(uK)

      setOutputs(prevState => {
        return {
          ...prevState, ...{
            nomKcsk: nK,
            userKcsk: uK,
            graph1CJS: graph1CJS,
            graph2CJS: graph2CJS,
            graph3CJS: graph3CJS
          }
        }
      })
    }
    e.preventDefault()
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ width: "75%", marginLeft: "12.5%", marginRight: "12.5%" }}>
        <NavBar themeToggle={() => toggleDark(!darkMode)} />
        <Paper elevation={3} sx={{ marginTop: "20px", padding: "10px" }}>
          <Typography component="div">
            <Box sx={{ typography: "h3", textAlign: "center" }}>Countersunk Joint Knockdown Calculator</Box>
            <br />
            <Box sx={{ typography: "p", textAlign: "center" }}>
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
                  Select fastener type from available datasets to generate knockdown curve.<br/><br />
                  Provide ultimate bearing strength of your specific joint configuration to scale the non-dimensional knockdown
                  curve appropriately (<em>implementation TBD</em>).
                  <br /> <br />
                  <b>Fastener Type:</b> Dataset for knockdown curve generation. Select based on fastener type, head style, and material ultimate shear strength. <em>(required)</em><br />
                  <s><b>Sheet Fbru:</b> Ultimate bearing strength of user sheet material</s> <em>(not yet implemented)</em><br />
                  <s><b>Units:</b> Units for user input &amp; display output</s> <em>(not yet implemented)</em> <br />
                </Box>
                <br />
                <Box sx={{ typography: "subtitle", textAlign: "center" }}>Returns</Box>
                <Box sx={{ typography: "p" }}>
                  1. Plot of selected dataset with ultimate bearing-shear envelopes for each diameter <br />
                  2. Plot of non-dimensional bearing strength knockdown vs countersink depth ratio for dataset<br />
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
          sx={{ textAlign: "center" }} />
        <Paper elevation={3} sx={{ padding: "10px", textAlign: "center" }}>
          <Typography variant="overline">Outputs</Typography><br />
          <InfoPanel display={readyToCalc} metadata={outputState.rawData.metadata} />
          <br />
          <span>{readyToCalc ?
            "Click legend entries to toggle data display" :
            "User input required. Press 'Calculate' when ready"}
          </span>
          <DataEnvPlot CJS={ChartJS} data={outputState.graph1CJS} />
          <KcskPlot CJS={ChartJS} data={outputState.graph2CJS} userScaled={false} />
        </Paper>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
