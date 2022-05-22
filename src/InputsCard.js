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

export default function InputsCard(props){
  // required props:
  // state variable for numeric input value {fbruVal}
  // state variable for unit radio value {unitVal}
  // state variable for fastener Fsu select value {fastVal}
  // handleChange function {hdlChg}
  // handleSubmit function {hdlSub}
  // array of options for fastener Fsu select {fastList}

  const fastSelEntries = props.fastList.map((val, ind)=>(<MenuItem key={ind} value={val}>{val}</MenuItem>));


  return(
    <Paper elevation={3} sx={{ marginTop: "10px", marginBottom: "10px", padding:"10px" }}>
      <Typography variant="overline" >Inputs</Typography>
      <br />
      <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={props.hdlSub}
    >
      <div>
      <FormControl sx={{margin:"10px"}}>
      <TextField
          required
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
        <FormControlLabel value="psi" control={<Radio />} label="psi" />
        <FormControlLabel value="MPa" control={<Radio />} label="MPa" />
      </RadioGroup>
    </FormControl>
    </div>
    <div>
    <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="fastener-select-helper-label">Fastener Fsu</InputLabel>
        <Select
          required
          labelId="fastener-select-helper-label"
          id="fastener-select-helper"
          label="Fastener Fsu"
          name="fast_sel"
          value={props.fastVal}
          onChange={props.hdlChg}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {fastSelEntries}
        </Select>
        <FormHelperText>Fastener Shear Strength</FormHelperText>
      </FormControl>
    </div>
    <Button variant="contained" type="submit">Calculate</Button>
    </Box>
    </Paper>
  )
}