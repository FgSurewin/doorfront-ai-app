import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
  import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import { useSnackbar } from "notistack";
import { login } from "../../apis/user";
import { saveAllLocal } from "../../utils/localStorage";
import { useUserStore } from "../../global/userState";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

interface Values {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { updateUserInfo } = useUserStore();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ color: "text.primary" }}>
        Sign in
      </Typography>
      <Box sx={{ mt: 1, width: "100%" }}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={(values) => {
            const errors: Partial<Values> = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (!values.password) errors.password = "Required";
            return errors;
            
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setSubmitting(true);
              const result = await login(values);
              if (result.code === 0) {
                enqueueSnackbar("Login successfully", {
                  variant: "success",
                });
                //console.log(result)
                // Save to global state
                updateUserInfo(result.data!);
                // Save to localStorage
                saveAllLocal(result.data!);
                // Go to home page
                navigate("/");
              } else {
                enqueueSnackbar(result.message, {
                  variant: "error",
                });
              }
            } catch (e) {
              console.log(e);
            }
          }}
        >
          {({ submitForm, isSubmitting, isValid }) => (
            <Form
              id="Login-form"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                submitForm();

              }}
            >
              <Field
                fullWidth
                component={TextField}
                name="email"
                type="email"
                label="Email"
                sx={{ mb: 2 }}
              />
              <Field
                fullWidth
                component={TextField}
                type="password"
                label="Password"
                name="password"
                sx={{ mb: 4 }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || !isValid}
                sx={{ color: "white", fontWeight: "bold", mb: 1 }}
              >
                Submit
              </Button>
              <Typography variant="body2" component={RouterLink} to="/reset">
                Forget password? Please click here to reset it
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
