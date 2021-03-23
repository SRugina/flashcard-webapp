import {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import { toast } from "react-toastify";

export type GlobalData = {
  createToast: (message: string) => void;
  activeLayer: number;
  setActiveLayer: Dispatch<SetStateAction<number>>;
  activeItem: number;
  setActiveItem: Dispatch<SetStateAction<number>>;
  isDrawingMode: boolean;
  setIsDrawingMode: Dispatch<SetStateAction<boolean>>;
  penColour: string;
  penColourRef: MutableRefObject<string>;
  setPenColour: (val: string) => void;
  penRadius: number;
  penRadiusRef: MutableRefObject<number>;
  setPenRadius: (val: number) => void;
  penErase: boolean;
  penEraseRef: MutableRefObject<boolean>;
  setPenErase: (val: boolean) => void;
};

// Create a context that will hold the values that we are going to expose to our components.
export const GlobalContext = createContext((null as unknown) as GlobalData);

type Props = {
  children: ReactNode;
};

// Create a "controller" component that will calculate all the data that we need
export const GlobalProvider = ({ children }: Props) => {
  const createToast = (message: string) => {
    toast.error(message);
  };

  const [activeLayer, setActiveLayer] = useState(0);
  const [activeItem, setActiveItem] = useState(-1);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const [penColour, _setPenColour] = useState("#000000");
  const penColourRef = useRef(penColour);
  const setPenColour = (val: string) => {
    penColourRef.current = val;
    _setPenColour(val);
  };

  const [penRadius, _setPenRadius] = useState(2);
  const penRadiusRef = useRef(penRadius);
  const setPenRadius = (val: number) => {
    penRadiusRef.current = val;
    _setPenRadius(val);
  };

  const [penErase, _setPenErase] = useState(false);
  const penEraseRef = useRef(penErase);
  const setPenErase = (val: boolean) => {
    penEraseRef.current = val;
    _setPenErase(val);
  };

  const values = useMemo(
    () => ({
      createToast,
      activeLayer,
      setActiveLayer,
      activeItem,
      setActiveItem,
      isDrawingMode,
      setIsDrawingMode,
      penColour,
      penColourRef,
      setPenColour,
      penRadius,
      penRadiusRef,
      setPenRadius,
      penErase,
      penEraseRef,
      setPenErase,
    }),
    [activeLayer, activeItem, isDrawingMode, penColour, penRadius, penErase]
  );

  // Finally, return the interface that we want to expose to our other components
  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};

// We also create a simple custom hook to read these values from.
export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error(
      "`useGlobal` hook must be used within a `GlobalProvider` component"
    );
  }
  return context;
};
