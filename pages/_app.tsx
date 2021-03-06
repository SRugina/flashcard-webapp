import "../styles/index.css";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";
import { GlobalProvider } from "../providers/GlobalProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <GlobalProvider>
        <Component {...pageProps} />
      </GlobalProvider>
    </Layout>
  );
}

export default MyApp;
