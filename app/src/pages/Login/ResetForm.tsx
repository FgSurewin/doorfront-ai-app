import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LockResetIcon from "@mui/icons-material/LockReset";
import Typography from "@mui/material/Typography";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import { useSnackbar } from "notistack";
import { resetPassword } from "../../apis/user";
import { saveAllLocal } from "../../utils/localStorage";
import { useUserStore } from "../../global/userState";
import { useNavigate } from "react-router-dom";

interface Values {
  email: string;
  newPassword: string;
  nickname: string;
}

export default function ResetForm() {
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
        <LockResetIcon />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ color: "text.primary" }}>
        Reset your password
      </Typography>
      <Box sx={{ mt: 1, width: "100%" }}>
        <Formik
          initialValues={{
            email: "",
            newPassword: "",
            nickname: "",
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
            if (!values.newPassword) errors.newPassword = "Required";
            if (!values.nickname) errors.nickname = "Required";
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setSubmitting(true);
              const result = await resetPassword(values);
              if (result.code === 0) {
                enqueueSnackbar(result.message, {
                  variant: "success",
                });
                // Save to global state
                updateUserInfo(result.data!);
                // Save to localStorage
                saveAllLocal(result.data!);
                // Go to home page
                navigate("/login");
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
                required
                fullWidth
                component={TextField}
                name="nickname"
                type="nickname"
                label="Nickname"
                sx={{ mb: 2 }}
              />
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
                name="newPassword"
                type="password"
                label="New Password"
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
                Reset
              </Button>
              <address>
                If you have also forgotten your nickname, please contact us{" "}
                <a href="mailto:doorfront2022@gmail.com">
                  (doorfront2022@gmail.com)
                </a>{" "}
                for further assistance.
              </address>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
