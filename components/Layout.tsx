import Head from "next/head";
import { ReactNode } from "react";
import Navbar from "./Navbar";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => (
  <div className="min-h-screen flex flex-col antialiased text-nord0 bg-nord6 font-sans">
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Navbar />
    <div id="content" className="">
      {children}
    </div>
    <footer className="w-full text-center border-t border-gray p-4 bottom-0">
      <span></span>
    </footer>
  </div>
);

export default Layout;
