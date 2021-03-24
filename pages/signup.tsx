import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelf } from "../utils/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import { FetchError, ApiError } from "../utils/fetch";
import Head from "next/head";

const SignUpPage = () => {
  const router = useRouter();
  const { signup } = useSelf();
  const [genericError, setGenericError] = useState(<></>);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signup({ username, password });
      await router.push("/");
    } catch (rawErrors) {
      const errInfo = (rawErrors as FetchError).info as ApiError;
      const err = errInfo ? errInfo.error : undefined;
      if (err) {
        setGenericError(<>{err}</>);
      } else {
        // might occur if an unknown type of response occurs e.g. server down
        setGenericError(<>Oops, something went wrong.</>);
      }
    }
  };
  return (
    <div>
      <Head>
        <title>Sign Up</title>
        <meta
          name="Description"
          content="The signup page of this Flashcard Web App"
        />
      </Head>
      <div className="my-4 flex mx-auto justify-evenly">
        <section className="container max-w-xs bg-gray-100 shadow-md mx-auto sm:m-0 p-6 rounded-lg">
          <h1 className="text-2xl text-center font-bold">Sign Up</h1>
          <div className="text-nord11 text-center">{genericError}</div>
          <form className="mb-4 mt-8" onSubmit={signUp}>
            <div className="mb-4">
              <Input
                type="text"
                id="username"
                label="Username"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                minLength={1}
                maxLength={20}
                pattern="[^:\n]{1,20}"
                title="Cannot contain a colon :"
                required
              />
            </div>
            <div className="mb-6">
              <Input
                type="password"
                id="password"
                label="Password"
                value={password}
                placeholder="******************"
                onChange={(e) => setPassword(e.target.value)}
                minLength={10}
                extraInputClass="mb-3"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                buttonType="submit"
                color="primary"
                size="medium"
                className="mx-auto"
              >
                Sign Up
              </Button>
            </div>
          </form>
          <p className="text-center">
            Already have an account?{" "}
            <Link href="/login">
              <a className="text-nord9">Login</a>
            </Link>
            <br />
          </p>
        </section>
      </div>
    </div>
  );
};

export default SignUpPage;
