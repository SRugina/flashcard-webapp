import "../styles/index.css";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";
import { GlobalProvider } from "../providers/GlobalProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => console.warn(router.pathname), [router.pathname]);

  return router.pathname !== "/print-collection-flashcard" ||
    router.pathname !== "/print-collection-flashcard" ? (
    <Layout>
      <GlobalProvider>
        <Component {...pageProps} />
        <ToastContainer autoClose={3000} pauseOnFocusLoss={false} />
      </GlobalProvider>
    </Layout>
  ) : (
    <GlobalProvider>
      <Component {...pageProps} />
    </GlobalProvider>
  );
}

export default MyApp;
