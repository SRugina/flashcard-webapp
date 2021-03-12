import { useState, useEffect } from "react";
import { useGlobal } from "../providers/GlobalProvider";

const EPenButton = {
  tip: 0x1, // left mouse, touch contact, pen contact
  barrel: 0x2, // right mouse, pen barrel button
  middle: 0x4, // middle mouse
  eraser: 0x20, // pen eraser button
};

const pointerEvents: Array<
  "pointerdown" | "pointerup" | "pointermove" | "pointerenter" | "pointerleave"
> = ["pointerdown", "pointerup", "pointermove", "pointerenter", "pointerleave"];

export function useCanvas(drawContents: string, layerId: number) {
  const {
    penColourRef,
    penRadiusRef,
    penEraseRef,
    updateDrawLayer,
  } = useGlobal();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(
    null
  );
  const [drawContent, setDrawContent] = useState(drawContents);

  const [error, setError] = useState("");
  let isDrawing = false;
  let lastPos = { x: 0, y: 0 };

  useEffect(() => {
    if (canvas !== null) {
      setCanvasCtx(canvas.getContext("2d"));
      canvas.width = canvas.getBoundingClientRect().width;
      canvas.height = canvas.getBoundingClientRect().height;
    }
  }, [canvas]);

  // update internal layer data
  useEffect(() => {
    updateDrawLayer(layerId, drawContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawContent]);

  function midPointBetween(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  function pointerEventDraw(evt: PointerEvent) {
    if (canvas !== null && canvasCtx !== null) {
      const canvasRect = canvas.getBoundingClientRect();

      const pos = {
        x: evt.clientX - canvasRect.left,
        y: evt.clientY - canvasRect.top,
      };

      let pressure = evt.pressure;
      const buttons = evt.buttons;
      const tilt = { x: evt.tiltX, y: evt.tiltY };

      switch (evt.pointerType) {
        case "touch":
          // A touchscreen was used
          pressure = 0.5;
          canvasCtx.strokeStyle = penColourRef.current;
          canvasCtx.lineWidth = pressure * 2 * penRadiusRef.current;
          break;
        case "pen":
          // A pen was used
          canvasCtx.strokeStyle = penColourRef.current;
          if (tilt.x !== 0) {
            // Favor tilts in x direction.
            canvasCtx.lineWidth =
              pressure * 2 * penRadiusRef.current * Math.abs(tilt.x);
          } else {
            canvasCtx.lineWidth = pressure * 2 * penRadiusRef.current;
          }
          break;
        case "mouse":
          pressure = 0.5;
          canvasCtx.strokeStyle = penColourRef.current;
          canvasCtx.lineWidth = pressure * 2 * penRadiusRef.current;
          break;
      }

      // If pen erase button is being used, or in erase mode, then erase!
      if (buttons === EPenButton.eraser || penEraseRef.current === true) {
        canvasCtx.strokeStyle = "rgba(0,0,0,1)";
      }

      switch (evt.type) {
        case "pointerdown":
          isDrawing = true;
          lastPos = pos;
          break;

        case "pointerup": {
          isDrawing = false;
          // update internal layer data on letting go
          const canvasContents = canvas.toDataURL();
          setDrawContent(canvasContents);
          break;
        }

        case "pointermove":
          if (!isDrawing) {
            return;
          }
          // If using eraser button, then erase with background color.
          if (buttons === EPenButton.eraser || penEraseRef.current === true) {
            // make it so new fill removes other drawings i.e. erase
            canvasCtx.globalCompositeOperation = "destination-out";
          } else {
            canvasCtx.globalCompositeOperation = "source-over";
          }

          // To maintain pressure setting per data point, need to turn
          // each data point into a stroke.
          if (pressure > 0) {
            canvasCtx.beginPath();
            canvasCtx.lineCap = "round";
            canvasCtx.lineJoin = "round";
            canvasCtx.moveTo(lastPos.x, lastPos.y);

            // Draws Bezier curve from canvasCtx position to midPoint.
            const midPoint = midPointBetween(lastPos, pos);
            canvasCtx.quadraticCurveTo(
              lastPos.x,
              lastPos.y,
              midPoint.x,
              midPoint.y
            );

            // This lineTo call eliminates gaps (but leaves flat lines if stroke
            // is fast enough).
            canvasCtx.lineTo(pos.x, pos.y);
            canvasCtx.stroke();
          }

          lastPos = pos;
          break;

        case "pointerenter":
          document.body.style.cursor = "crosshair";
          break;

        case "pointerleave":
          document.body.style.cursor = "default";
          break;

        default:
          console.warn("WARNING: unhandled event: " + evt.type);
          break;
      }
    }
  }

  useEffect(() => {
    if (canvas !== null) {
      if (window.PointerEvent) {
        for (let idx = 0; idx < pointerEvents.length; idx++) {
          canvas.addEventListener(pointerEvents[idx], pointerEventDraw, false);
        }
      } else {
        setError("Browser does not support Pointer Events.");
      }

      // load internal layer data at start
      const image = new Image();
      image.onload = function () {
        canvasCtx!.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx!.drawImage(image, 0, 0);
      };
      image.src = drawContent;
    }

    return () => {
      if (canvas !== null) {
        if (window.PointerEvent) {
          for (let idx = 0; idx < pointerEvents.length; idx++) {
            canvas.removeEventListener(
              pointerEvents[idx],
              pointerEventDraw,
              false
            );
          }
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasCtx]);

  return { setCanvas, error };
}
