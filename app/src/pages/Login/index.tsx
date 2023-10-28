import React from "react";
import Navbar from "../../components/Navbar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { Copyright, generateRandomImageStyle } from "./Login.style";
import {
  useSearchParams,
} from "react-router-dom"

export default function Login() {
  /* --------------------- State for tab panel --------------------- */
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const switchToLogin = () => {
    setValue(0);
  };
  /* -------------------------------------------------------------------------- */
  const [queryParameters] = useSearchParams()
  React.useEffect(()=>{
    if(queryParameters.has("ref")){
      setValue(1)
    }
  },[])
  return (
    <div style={{ height: "100vh" }}>
      <Navbar position="static" isTransparent={false} />
      <Grid container component="main" sx={{ height: "calc(100vh - 74px)" }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={6} sx={generateRandomImageStyle} />
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="icon tabs example"
            variant="fullWidth"
          >
            <Tab
              icon={<AssignmentIndIcon />}
              aria-label="AssignmentIndIcon"
              label="Sign In"
            />
            <Tab
              icon={<AssignmentIcon />}
              aria-label="AssignmentIcon"
              label="Sign Up"
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <LoginForm />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SignUpForm switchToLogin={switchToLogin} />
          </TabPanel>
          <Copyright />
        </Grid>
      </Grid>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                    Tab panel for login and sign up form                    */
/* -------------------------------------------------------------------------- */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
