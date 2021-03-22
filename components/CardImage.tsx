import { Dispatch } from "react";
import { useGlobal } from "../providers/GlobalProvider";
import blobToBase64 from "../utils/blobToBase64";

const CardImage = ({
  content,
  setContent,
}: {
  content: string;
  setContent: Dispatch<string>;
}) => {
  const { createToast } = useGlobal();
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
        if (blob!.size > 2.5 * 1000000) {
          // do not allow images larger than 2.5MB
          createToast("Image can only be at most 2.5MB");
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
