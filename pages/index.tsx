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
        <br />
        Known Issues:
        <ul className="list-disc">
          <li>
            Changes can take up to 60 seconds to update everywhere, e.g. adding
            a new card then trying to print the collection immediately
            won&apos;t show the flashcard.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IndexPage;
