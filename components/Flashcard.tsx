import { FlashcardData } from "../interfaces";
import Layer from "./Layer";

const Flashcard = ({ layers }: FlashcardData) => {
  return (
    <div
      className="relative bg-white rounded-lg"
      style={{ width: "152mm", height: "102mm" }}
    >
      <div
        id="flashcard-background"
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-between rounded-lg overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {
          /* Create 17 lines, equally spaced, for the background of the flashcard */
          Array(17)
            .fill(17)
            .map((_, index) => (
              <div
                key={index}
                className="w-full bg-black"
                style={{ height: "0.3mm" }}
              ></div>
            ))
        }
      </div>
      {layers.map((layer, index) => {
        return <Layer key={layer.id} zIndex={index} {...layer} />;
      })}
    </div>
  );
};

export default Flashcard;
