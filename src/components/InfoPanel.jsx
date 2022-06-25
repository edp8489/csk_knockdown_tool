import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

/**
* Box showing metadata for the selected dataset
* @component
* @param {boolean} display - Toggle visibility of component
* @param {Object} metadata - Metadata for selected dataset
* @param {Object[]} dataset - Strength data for selected dataset
* @todo Head style formatting for protruding head data
*/

export default function InfoPanel(props) {
    

    // unpack dataset from props
    const {fast_ref, fast_type, fast_mat, fast_fsu, head_type, csk_angle} = props.metadata;
    const {sht_mat, sht_ref, sht_fbru2A} = props.metadata;
    const {display}=props;
    let visible = display? 'block' : 'none';

    return (
        <Box sx={{display: visible}} >
                <Typography>Dataset Information</Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                <table >
                    <thead>
                    <tr><th colSpan={2} style={{textAlign:"center"}}>Fastener Info</th></tr>
                    </thead>
                <tbody>
                    <tr><td style={{textAlign:"left"}}><b>Type</b></td><td>{fast_type} ({csk_angle? csk_angle + " " : ""}{head_type})</td></tr>
                    <tr><td style={{textAlign:"left"}}><b>Material</b></td><td>{fast_mat} ({fast_fsu/1000} ksi Fsu)</td></tr>
                    <tr><td style={{textAlign:"left"}}><b>Data Reference</b></td><td>{fast_ref}</td></tr>
                </tbody></table>
                </Grid>
                <Grid item>
                <table >
                    <thead>
                    <tr><th colSpan={2} style={{textAlign:"center"}}>Sheet Info</th></tr>
                    </thead>
                <tbody>
                    <tr><td style={{textAlign:"left"}}><b>Material</b></td><td>{sht_mat} ({sht_fbru2A/1000} ksi Fbru; e/D=2; A-basis)</td></tr>
                    <tr><td style={{textAlign:"left"}}><b>Data Reference</b></td><td>{sht_ref}</td></tr>
                </tbody></table>
                </Grid>
                </Grid>
        </Box>
    )
}

InfoPanel.defaultProps = {
    display:false,
    metadata:{
        id:"",
        fast_ref: "",
        fast_type: "",
        fast_fsu: 0,
        fast_mat:"",
        sht_mat: "",
        sht_ref: "",
        sht_fbru2A: 0,
        sht_fbry2A: 0,
        units:"",
        csk_angle:"",
        head_type:""
    },
    dataset:[{
      d:0,
      tcsk:0,
      tsht:[],
      Pult:[],
      Pyld:[]
    }]
}