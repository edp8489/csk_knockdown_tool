import {createTheme } from "@mui/material/styles";

export const light = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2"
      },
      secondary: {
        main: "#d32f2f"
      },
      background: {
        default: "#f5f5f5"
      }
    }
  });
  
export const dark = createTheme({
palette: {
    mode: "dark",
    primary: {
    main: "#1976d2"
    },
    secondary: {
    main: "#d32f2f"
    },
    background: {
    default: "rgb(0,30,60)",
    paper: "rgb(26,33,40)"
    }
}
});