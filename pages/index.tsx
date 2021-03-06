import Head from "next/head";
import Editor from "../components/Editor";

const IndexPage = () => {
  return (
    <div>
      <Head>
        <title>Flashcard Web App</title>
        <meta name="Description" content="A Flashcard Web App" />
      </Head>
      <div className="py-20 mx-auto w-full">
        <Editor />
      </div>
    </div>
  );
};

export default IndexPage;
