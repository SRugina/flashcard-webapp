import { Dispatch } from "react";
import blobToBase64 from "../utils/blobToBase64";

const CardImage = ({
  content,
  setContent,
}: {
  content: string;
  setContent: Dispatch<string>;
}) => {
  return (
    <div
      onPaste={async (e) => {
        // Filter the image items only
        const items: Array<DataTransferItem> = [].slice
          .call(e.clipboardData.items)
          .filter(
            (item: DataTransferItem) => item.type.indexOf("image") !== -1
          );
        if (items.length === 0) {
          return;
        }

        const item = items[0];
        // Get the blob of image
        const blob = item.getAsFile();
        if (blob!.size / 1000000 > 2.5) {
          // do not allow images larger than 2.5MB
          return;
        }
        setContent(await blobToBase64(blob!));
      }}
    >
      {content ? (
        <img
          src={content}
          draggable={false}
          className="w-full h-full object-cover"
        />
      ) : (
        "Paste Image Here (<=2.5MB)"
      )}
    </div>
  );
};

export default CardImage;
