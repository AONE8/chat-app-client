import { createPortal } from "react-dom";

const TransparentBackdrop = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return createPortal(
    <div
      className="absolute w-screen h-screen top-0 left-0 z-50"
      onClick={() => setOpen(false)}
    ></div>,
    document.getElementById("backdrop") as HTMLElement
  );
};

export default TransparentBackdrop;
