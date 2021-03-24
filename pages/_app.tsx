import "../styles/index.css";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";
import { GlobalProvider } from "../providers/GlobalProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const onPrintPage =
    router.pathname === "/print-collection-flashcard" ||
    router.pathname === "/print-collection" ||
    router.pathname === "/print-subcollection-flashcard" ||
    router.pathname === "/print-subcollection";

  return !onPrintPage ? (
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
