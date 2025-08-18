import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#ff5959" }, 
    secondary: { main: "#455a64" }, 
    background: { default: "#ffc0c0", paper: "#ffffff" }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 999 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } }
  },
  typography: {
    fontFamily: `'Inter', system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"`
  }
});

export default theme;
