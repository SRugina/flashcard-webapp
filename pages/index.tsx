import Head from "next/head";
import Link from "next/link";

const IndexPage = () => {
  return (
    <div>
      <Head>
        <title>Flashcard Web App</title>
        <meta name="Description" content="A Flashcard Web App" />
      </Head>
      <div className="mx-auto w-full text-center">
        This is a flashcard webapp with drawing, collections, and exporting to
        PDF support. (WIP)
        <br />
        Repository:{" "}
        <Link href="https://github.com/SRugina/flashcard-webapp">
          <a className="text-nord9">GitHub</a>
        </Link>
        <br />
        <br />
        <h1 className="text-2xl font-bold">
          WARNING: Printing to PDF only works properly in Chromium-based
          browsers, e.g. Google Chrome
        </h1>
      </div>
    </div>
  );
};

export default IndexPage;
