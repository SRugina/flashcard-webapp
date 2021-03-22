import "../styles/index.css";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";
import { GlobalProvider } from "../providers/GlobalProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <GlobalProvider>
        <Component {...pageProps} />
        <ToastContainer autoClose={3000} pauseOnFocusLoss={false} />
      </GlobalProvider>
    </Layout>
  );
}

export default MyApp;
