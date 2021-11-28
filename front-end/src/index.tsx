import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import "index.css"
import * as serviceWorker from "shared/helpers/service-worker"
import StaffApp from "staff-app/app"
import { GlobalStyle } from "shared/styles/global-style"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiSwitch: {
      switchBase: {
        // Controls default (unchecked) color for the thumb
        color: "#00FF00"
      },
      colorSecondary: {
        "&$checked": {
          // Controls checked color for the thumb
          color: "#FFFF00"
        }
      },
      track: {
        // Controls default (unchecked) color for the track
        opacity: 0.9,
        backgroundColor: "#FFFF00",
        "$checked$checked + &": {
          // Controls checked color for the track
          opacity: 0.9,
          backgroundColor: "#00FF00"
        }
      }
    }
  }
});

const Home: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <p>Engineering Test</p>
        <Link to="staff/daily-care">Staff</Link>
      </header>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home>Engineering Test</Home>} />
          <Route path="staff/*" element={<StaffApp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

serviceWorker.register()
