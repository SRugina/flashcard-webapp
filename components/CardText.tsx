import { Dispatch } from "react";

const CardText = ({
  content,
}: {
  content: string;
  setContent: Dispatch<string>;
}) => {
  return <div>{content}</div>;
};

export default CardText;
