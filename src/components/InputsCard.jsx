import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";


/**
 * Panel containing input fields for app
 * @component
 * @param {*} fbruVal - state variable for numeric input value
 * @param {string} unitVal - state variable for unit radio value
 * @param {string[]} fastList - array of options for fastener select dropdown
 * @param {string} fastVal - state variable for ID of selected fastener dataset
 * @param {string[]} fastDisp - state variable for fastener select list display text
 * @param {function} hdlChg - App function to handle change of input field(s)
 * @param {function} hdlSub - App function to handle form submission
 * 
 */
export default function InputsCard(props){

  const fastSelEntries = props.fastList.map((val, ind)=>(<MenuItem key={ind} value={val}>{props.fastDisp[ind]}</MenuItem>));


  return(
    <Paper elevation={3} sx={{...{ marginTop: "10px", marginBottom: "10px", padding:"10px" },...props.sx}}>
      <Typography variant="overline" >Inputs</Typography>
      <br />
      <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={props.hdlSub}
    >
      <Box>
    <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="fastener-select-helper-label">Fastener Type</InputLabel>
        <Select
          required
          labelId="fastener-select-helper-label"
          id="fastener-select-helper"
          label="Fastener Type"
          name="fast_sel"
          value={props.fastVal}
          onChange={props.hdlChg}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {fastSelEntries}
        </Select>
        <FormHelperText>Consider head style and ultimate shear strength</FormHelperText>
      </FormControl>
    </Box>
      <Box sx={{display: 'none'}}>
      <FormControl sx={{margin:"10px"}}>
      <TextField
          disabled
          id="fbru-input"
          label="Sheet Fbru"
          type="number"
          name="fbru"
          value={props.fbruVal}
          onChange={props.hdlChg}
        />
      </FormControl>
      <FormControl sx={{margin:"10px"}}>
      <FormLabel id="unit-radio-buttons-group-label">Units</FormLabel>
      <RadioGroup
        row
        aria-labelledby="units-radio-buttons-group-label"
        name="unit"
        value={props.unitVal}
        onChange={props.hdlChg}
      >
        <FormControlLabel disabled value="psi" control={<Radio />} label="psi" />
        <FormControlLabel disabled value="MPa" control={<Radio />} label="MPa" />
      </RadioGroup>
    </FormControl>
    </Box>
    <Button variant="contained" type="submit">Calculate</Button>
    </Box>
    </Paper>
  )
}