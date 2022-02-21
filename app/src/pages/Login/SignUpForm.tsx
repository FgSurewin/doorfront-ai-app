import React from "react";
import PetsIcon from "@mui/icons-material/Pets";
import {
  Avatar,
  Box,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import { useSnackbar } from "notistack";
import { signUp } from "../../apis/user";

type roleType = "Student" | "Faculty" | "Volunteer" | "";

const roles: roleType[] = ["Student", "Faculty", "Volunteer"];

interface Values {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: roleType;
  institution: string;
}

export default function SignUpForm({
  switchToLogin,
}: {
  switchToLogin: () => void;
}) {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Box
      sx={{
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <PetsIcon />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ color: "text.primary" }}>
        Sign Up
      </Typography>
      <Box sx={{ mt: 1, width: "100%" }}>
        <Formik
          initialValues={{
            nickname: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
            institution: "",
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
            if (!values.nickname) errors.nickname = "Required";
            if (!values.password) errors.password = "Required";
            if (!values.confirmPassword) {
              errors.confirmPassword = "Required";
            } else if (values.confirmPassword !== values.password) {
              errors.confirmPassword = "Invalid confirm password";
            }
            if (!values.institution) errors.institution = "Required";
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { confirmPassword, ...other } = values;
              setSubmitting(true);
              const result = await signUp(other);
              if (result.code === 0) {
                enqueueSnackbar("Sign up successfully", {
                  variant: "success",
                });
                switchToLogin();
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
          {({ submitForm, isSubmitting }) => (
            <Form id="Login-form">
              <Field
                required
                fullWidth
                component={TextField}
                name="nickname"
                type="nickname"
                label="Nickname"
                sx={{ mb: 2 }}
              />
              <Field
                required
                fullWidth
                component={TextField}
                name="email"
                type="email"
                label="Email"
                sx={{ mb: 2 }}
              />
              <Field
                required
                fullWidth
                component={TextField}
                type="password"
                label="Password"
                name="password"
                sx={{ mb: 2 }}
              />
              <Field
                required
                fullWidth
                component={TextField}
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                sx={{ mb: 2 }}
              />
              <Field
                required
                component={TextField}
                type="text"
                name="role"
                label="Role"
                select
                fullWidth
                variant="standard"
                helperText="Required"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {roles.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Field>
              <Field
                required
                fullWidth
                component={TextField}
                type="text"
                label="Institution"
                name="institution"
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                sx={{ color: "white", fontWeight: "bold", mb: 4 }}
              >
                Submit
              </Button>
              {isSubmitting && (
                <CircularProgress
                  color="primary"
                  sx={{ m: "0 auto", display: "block" }}
                />
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
