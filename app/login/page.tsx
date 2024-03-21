"use client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";

import { useState, useMemo } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] =
    useState(false);

  function validateEmail(value: string) {
    return value.match(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i
    );
  }

  function checkPassword(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const passwordValue = event.target.value;
    setPassword(passwordValue);

    // Example validation: password must be at least 8 characters
    if (passwordValue.length == 0) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    let email =
      document.getElementById("username").value;
    alert(email);
  }
  return (
    <>
      <AuroraBackground>
        <Card
          className="min-w-[50%]"
          shadow="none"
          isBlurred
        >
          <CardHeader className="flex flex-col items-center pt-10">
            <div className=" text-2xl text-white ">
              Welcome Back
            </div>
            <div className="text-sm py-4">
              Don&apos;t have an account yet? Sign
              Up Here
            </div>
          </CardHeader>
          <CardBody>
            <form
              className="flex flex-col space-y-4 items-center"
              onSubmit={handleSubmit}
            >
              <Input
                type="email"
                label="E-Mail"
                isRequired
                className=" w-1/2"
                id="username"
                isInvalid={emailError}
                color={
                  emailError
                    ? "danger"
                    : "default"
                }
                errorMessage={
                  emailError &&
                  "Please enter a valid email"
                }
                onValueChange={setEmail}
              />
              <Input
                type="password"
                label="Password"
                id="password"
                isRequired
                isInvalid={passwordError}
                errorMessage={
                  passwordError &&
                  "Password cannot be empty"
                }
                value={password}
                onChange={checkPassword}
                className=" w-1/2"
              />
              <Button
                color="primary"
                variant="shadow"
                type="submit"
              >
                Log In
              </Button>
            </form>
          </CardBody>
        </Card>
      </AuroraBackground>
    </>
  );
}
