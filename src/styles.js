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
    default: "rgb(43, 42, 51)",
    paper: "rgba(66, 65, 77, 1)"
    }
}
});