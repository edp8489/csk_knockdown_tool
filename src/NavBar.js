import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from "@mui/material/Button"

const buttonSVG = <svg viewBox="0 0 32 32" width="24" height="24" fill="currentcolor">
                    <circle cx="16" cy="16" r="14" fill="none" stroke="currentcolor" strokeWidth="4"></circle>
                    <path d="M 16 0 A 16 16 0 0 0 16 32 z">
                    </path>
                </svg>

export default function NavBar(props){
    const {themeToggle} = props
    return(
        <React.Fragment>
      <AppBar position="fixed">
        <Toolbar>
            <Link href="https://edp8489.github.io"  underline="hover" color="inherit" sx={{ml:"10px", mr:"10px"}}>Home</Link>
            <Link href="https://edp8489.github.io/portfolio"  underline="hover" color="inherit" sx={{ml:"10px", mr:"10px"}}>Projects</Link>
            <Typography sx={{flexGrow:1}}>&nbsp;</Typography>
            <Button  color="inherit" onClick={themeToggle} >{buttonSVG}</Button>
            </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
    )
}


