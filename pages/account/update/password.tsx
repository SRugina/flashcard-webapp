import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { useSelf } from "../../../utils/auth";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { UpdateUserPasswordData } from "../../../interfaces";

const AccountUpdatePasswordPage = () => {
  const router = useRouter();
  const { self, protectRoute, updatePassword } = useSelf();

  protectRoute();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");

  const [genericError, setGenericError] = useState(<></>);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await changePassword();
  };

  const changePassword = async () => {
    try {
      const updateUserPassword: UpdateUserPasswordData = {
        oldPassword,
        password,
      };
      await updatePassword(updateUserPassword);
      await router.push("/");
    } catch (rawErrors) {
      if (!(typeof rawErrors === "string")) {
        // might occur if an unknown type of response occurs e.g. server down
        setGenericError(<>Oops, something went wrong.</>);
      } else {
        setGenericError(<>{rawErrors}</>);
      }
    }
  };
  return (
    (self && (
      <div className="my-4 flex mx-auto justify-evenly">
        <section className="container max-w-xs bg-gray-100 shadow-md mx-auto sm:m-0 p-6 rounded-lg">
          <h1 className="text-2xl text-center font-bold">Change Password</h1>
          <div className="text-nord11 text-center">{genericError}</div>
          <form className="mb-4 mt-8" onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                type="password"
                id="oldPassword"
                label="Old Password"
                value={oldPassword}
                placeholder="******************"
                onChange={(e) => setOldPassword(e.target.value)}
                minLength={10}
                extraInputClass="mb-3"
                required
              />
            </div>

            <div className="mb-4">
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
                Update
              </Button>
            </div>
          </form>
        </section>
      </div>
    )) ||
    null
  );
};

export default AccountUpdatePasswordPage;
