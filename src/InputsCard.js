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

export default function InputsCard(props){
  // required props:
  // ref for numeric input value {ref_fbru}
  // ref for unit radio value {ref_unit}
  // ref for fastener Fsu select value {ref_fast}
  // array of options for fastener Fsu select {fastSelect}

  const fastSelEntries = props.fastSelect.map((val, ind)=>(<MenuItem key={ind} value={val}>{val}</MenuItem>));
  
  return(
    <Paper elevation={3} sx={{ marginTop: "10px", marginBottom: "10px" }}>
      <Typography variant="overline" >Inputs</Typography>
      <br />
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
      <FormControl sx={{margin:"10px"}}>
      <TextField
          required
          id="fbru-input"
          label="Sheet Fbru"
          type="number"
          inputRef={props.ref_fbru}
        />
      </FormControl>
      <FormControl sx={{margin:"10px"}}>
      <FormLabel id="unit-radio-buttons-group-label">Units</FormLabel>
      <RadioGroup
        row
        aria-labelledby="units-radio-buttons-group-label"
        name="units-radio-buttons-group"
        defaultValue="psi"
        ref={props.ref_unit}
      >
        <FormControlLabel value="psi" control={<Radio />} label="psi" />
        <FormControlLabel value="mpa" control={<Radio />} label="MPa" />
      </RadioGroup>
    </FormControl>
    </div>
    <div>
    <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="fastener-select-helper-label">Fastener Fsu</InputLabel>
        <Select
          labelId="fastener-select-helper-label"
          id="fastener-select-helper"
          label="Fastener Fsu"
          inputRef={props.ref_fast}
          defaultValue=""
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {fastSelEntries}
        </Select>
        <FormHelperText>Fastener Shear Strength</FormHelperText>
      </FormControl>
    </div>
    </Box>
    </Paper>
  )
}