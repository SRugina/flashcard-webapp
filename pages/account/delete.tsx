import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { useSelf } from "../../utils/auth";
import Button from "../../components/Button";

const AccountDeletePage = () => {
  const router = useRouter();
  const { self, protectRoute, del } = useSelf();

  protectRoute();

  const [genericError, setGenericError] = useState(<></>);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await deleteSelf();
  };

  const deleteSelf = async () => {
    try {
      await del();
      await router.push("/");
    } catch (rawErrors) {
      setGenericError(<>Oops, something went wrong.</>);
    }
  };
  return (
    (self && (
      <div className="my-4 flex mx-auto justify-evenly">
        <section className="container max-w-xs bg-gray-100 shadow-md mx-auto sm:m-0 p-6 rounded-lg">
          <h1 className="text-2xl text-center font-bold">Are you sure?</h1>
          <div className="text-nord11 text-center">{genericError}</div>
          <form className="mb-4 mt-8" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                buttonType="submit"
                color="danger"
                size="medium"
                className="mx-auto"
              >
                Delete Account
              </Button>
            </div>
          </form>
        </section>
      </div>
    )) ||
    null
  );
};

export default AccountDeletePage;
