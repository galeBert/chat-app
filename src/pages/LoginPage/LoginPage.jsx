import React, { useState } from "react";
import { useHistory } from "react-router";
import Button from "components/Button";
import Logo from "components/Logo";
//
import "./LoginPage.css";
import { ReactComponent as GoogleIcon } from "assets/google-icon.svg";

//importing gql
import { CHECK_EMAIL } from "graphql/mutation";

//importing functions
import { handleAuth, getCollection } from "functions/auth";
import TextField from "components/TextField";
import { Formik, Form } from "formik";
import { useMutation } from "@apollo/client";
import { GET_ADMIN_LOGIN } from "graphql/query";
import { useAdminContext } from "hooks/useAdmin";
import { useModal } from "hooks/useModal";
import LoadingScreen from "components/LoadingScreen";

export default function LoginPage() {
  const modal = useModal()
  const history = useHistory()
  const admin = useAdminContext();
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [accessCode, setAccessCode] = useState(null);
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null);

  const [check] = useMutation(CHECK_EMAIL, {
    update(_, { data: { checkEmail } }) {
      if (checkEmail?.isBanned) {
        modal.actions.setIsLoadingScreen(false)
        setError("Your account already banned")
        return;
      }
      if (checkEmail?.valid && !(checkEmail?.isBanned)) {
        localStorage.setItem("token", token);

        setTimeout(() => {
          getAdminLogin()
          modal.actions.setIsLoadingScreen(false)
          history.push("/");
        }, 2000)
      } else {
        setError("Your Email Invalid");
        modal.actions.setIsLoadingScreen(false)
      }
    }
  })

  const [getAdminLogin] = useMutation(GET_ADMIN_LOGIN, {
    update(_, { data: { getAdminLogin } }) {
      admin.actions.onSetAdminLogin(getAdminLogin)
    }
  });

  const handleAuthButton = () => {
    modal.actions.setIsLoadingScreen(true)
    handleAuth(check, setToken, accessCode).catch((err) => { if (err) modal.actions.setIsLoadingScreen(false) })
  }
  return (
    <div className="login-container">
      {modal.value.isLoadingScreen && <LoadingScreen />}
      <div className="logo-container">
        <Logo className="login-logo text-gray-300" />
      </div>
      {isValidPassword ? (
        <div className="text-center">
          <Button
            icon={<GoogleIcon />}
            color="gray"
            onClick={handleAuthButton}
          >
            <span className="text-dark-100 ml-4">Continue with Google</span>
          </Button>
          {error && <span className="text-red-300">{error}</span>}
        </div>
      ) : (
        <div>
          <Formik
            initialValues={{
              password: "",
            }}
            onSubmit={async (data, { setSubmitting, setErrors }) => {
              setSubmitting(true);
              const accessCodeSnapshot = await getCollection(
                "adminAccessCode",
                "code",
                data.password
              );

              setIsValidPassword(!accessCodeSnapshot.empty);
              if (accessCodeSnapshot.empty) {
                setErrors({ password: "Access denied! wrong password" });
              }

              setAccessCode(data.password)
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting, errors }) => (
              <Form className="text-center" onSubmit={handleSubmit}>
                <TextField label="Password" name="password" type="password" />
                {isSubmitting ? (
                  <span>loading...</span>
                ) : (
                  <span>press 'Enter' to confirm password</span>
                )}
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
