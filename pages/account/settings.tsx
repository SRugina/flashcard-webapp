import Button from "../../components/Button";
import { useSelf } from "../../utils/auth";

const AccountSettingsPage = () => {
  const { self, protectRoute } = useSelf();

  protectRoute();

  return (
    (self && (
      <div className="my-4 flex mx-auto justify-evenly">
        <section className="container max-w-xs bg-gray-100 shadow-md mx-auto sm:m-0 p-6 rounded-lg">
          <h1 className="text-2xl text-center font-bold">Settings</h1>
          <div className="mt-4 inline-block w-full">
            <div className="flex flex-col items-center justify-evenly">
              <Button
                type="link"
                href="/account/update"
                color="primary"
                size="medium"
                className="mx-auto mt-2"
              >
                Update Details
              </Button>
              <Button
                type="link"
                href="/account/update/password"
                color="warning"
                size="medium"
                className="mx-auto mt-2"
              >
                Update Password
              </Button>

              <Button
                type="link"
                href="/account/delete"
                color="danger"
                size="medium"
                className="mx-auto mt-2"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </section>
      </div>
    )) ||
    null
  );
};

export default AccountSettingsPage;
