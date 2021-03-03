import Head from "next/head";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => (
  <div className="min-h-screen flex flex-col antialiased text-gray-800 bg-gray-200 font-sans">
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div id="content" className="flex-1">
      {children}
    </div>
    <footer className="w-full text-center border-t border-grey p-4 bottom-0">
      <span>About Us etc.</span>
    </footer>
  </div>
);

export default Layout;
