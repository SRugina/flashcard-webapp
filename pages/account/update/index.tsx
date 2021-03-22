import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { useSelf } from "../../../utils/auth";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { UpdateUserData } from "../../../interfaces";
import { FetchError, ApiError } from "../../../utils/fetch";

const AccountUpdatePage = () => {
  const router = useRouter();
  const { self, protectRoute, updateSelf } = useSelf();

  protectRoute();

  const [username, setUsername] = useState("");

  const [genericError, setGenericError] = useState(<></>);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await changeDetails();
  };

  const changeDetails = async () => {
    try {
      const updateUser: UpdateUserData = {
        username,
      };
      await updateSelf(updateUser);
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
    (self && (
      <div className="my-4 flex mx-auto justify-evenly">
        <section className="container max-w-xs bg-gray-100 shadow-md mx-auto sm:m-0 p-6 rounded-lg">
          <h1 className="text-2xl text-center font-bold">Update Details</h1>
          <div className="text-nord11 text-center">{genericError}</div>
          <form className="mb-4 mt-8" onSubmit={handleSubmit}>
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

export default AccountUpdatePage;
