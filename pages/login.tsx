import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelf } from "../utils/auth";
import Button from "../components/Button";
import Input from "../components/Input";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useSelf();
  const [genericError, setGenericError] = useState(<></>);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(username, password);
      await router.push("/");
    } catch (rawErrors) {
      // eslint-disable-next-line
      console.log("RawErrors", rawErrors);
      if (!(typeof rawErrors === "string")) {
        // might occur if an unknown type of response occurs e.g. server down
        setGenericError(<>Oops, something went wrong.</>);
      } else {
        setGenericError(<>{rawErrors}</>);
      }
    }
  };
  return (
    <div className="my-4 flex mx-auto justify-evenly">
      <section className="container max-w-xs bg-gray-100 shadow-md mx-auto sm:m-0 p-6 rounded-lg">
        <h1 className="text-2xl text-center font-bold">Login</h1>
        <div className="text-nord11 text-center">{genericError}</div>
        <form className="mb-4 mt-8" onSubmit={signIn}>
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
              Login
            </Button>
          </div>
        </form>
        <p className="text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup">
            <a className="text-nord9">Sign Up</a>
          </Link>
          <br />
        </p>
      </section>
    </div>
  );
};

export default LoginPage;
