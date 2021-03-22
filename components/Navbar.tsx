import { memo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelf } from "../utils/auth";
import Button from "./Button";

const Navbar = memo(() => {
  const router = useRouter();
  const { self, logout } = useSelf();
  const [isOpen, setIsOpen] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  async function signOut() {
    try {
      await logout();
      await router.push("/");
    } catch (error) {
      console.error("error signing out: ", error);
    }
  }

  return (
    <header className="sm:flex sm:items-center sm:justify-between sm:px-4 sm:py-3">
      <div className="flex items-center justify-between px-4 py-3 sm:p-0">
        <div className="cursor-pointer">
          <Link href="/">
            <a className="text-nord9 font-bold text-2xl focus:ring-0">
              Flashcard Web App
            </a>
          </Link>
        </div>
        <div className="sm:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-label="Open menu"
            className="block text-nord3 hover:text-nord0 focus:text-nord0 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 fill-current"
            >
              {isOpen ? (
                // an X
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // a hamburger menu
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`px-2 pt-2 pb-4 ${
          self ? "" : "sm:flex sm:items-center sm:justify-between sm:px-0"
        } ${isOpen ? "block" : "hidden sm:block"}`}
      >
        {self ? (
          <div className="relative">
            <button
              className="hidden sm:flex items-center justify-between text-nord0 hover:text-nord2 focus:text-nord9 accountFocus"
              onClick={() => setAccountMenu(!accountMenu)}
            >
              <svg
                className="w-8 h-8 block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                className="w-6 h-6 block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {/* the head of a triangle facing down */}
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              className={`bg-gray-100 shadow-md sm:mt-2 rounded sm:absolute sm:right-0 ${
                isOpen || accountMenu ? "block" : "hidden"
              }
                `}
            >
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="account-menu"
              >
                <Button
                  type="link"
                  href="/"
                  color="custom"
                  size="small"
                  className="mt-0 sm:mx-2 block hover:bg-gray-200 focus:bg-gray-200"
                >
                  Collections
                </Button>
                <Button
                  type="button"
                  onClick={async () => await signOut()}
                  color="custom"
                  size="small"
                  className="mt-0 sm:mx-2 block whitespace-nowrap hover:bg-gray-200 focus:bg-gray-200"
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Button
              type="link"
              href="/login"
              color="bg"
              size="small"
              className={`mt-1 sm:mt-0 sm:ml-2 block`}
            >
              Login
            </Button>
            <Button
              type="link"
              href="/signup"
              color="primary"
              size="small"
              className="mt-1 sm:mt-0 sm:ml-2 block"
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  );
});

export default Navbar;
