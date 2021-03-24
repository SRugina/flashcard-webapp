import Head from "next/head";
import Link from "next/link";

const IndexPage = () => {
  return (
    <div>
      <Head>
        <title>Flashcard Web App</title>
        <meta
          name="Description"
          content="A Flashcard Web App with drawing, collections, and exporting to PDF support."
        />
      </Head>
      <div className="mx-auto w-full text-center">
        This is a flashcard webapp with drawing, collections, and exporting to
        PDF support.
        <br />
        Repository:{" "}
        <Link href="https://github.com/SRugina/flashcard-webapp">
          <a className="text-nord9">GitHub</a>
        </Link>
        <br />
        <br />
        <h1 className="font-semibold">Known Issues:</h1>
        <ul className="list-disc">
          <li>
            Changes can take up to 60 seconds to update everywhere, e.g. adding
            a new card then trying to print the collection immediately
            won&apos;t show the flashcard.
          </li>
          <li>
            There is no UI for going backward/forward through collections, and
            no undo/redo when editing flashcards at this time.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IndexPage;
