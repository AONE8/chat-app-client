import { createPortal } from "react-dom";

const Modal = ({
  ref,
  children,
  title,
  onClose,
}: {
  ref?: React.RefObject<HTMLDialogElement>;
  children?: React.ReactNode;
  title?: string;
  onClose?: () => void;
}) => {
  return createPortal(
    <dialog id="my_modal" className="modal !bg-emerald-100/75" ref={ref}>
      <div className="modal-box max-h-2/3 scroll-auto">
        <form method="dialog" onClick={onClose}>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-6">{title}</h3>
        {children}
      </div>
    </dialog>,
    document.getElementById("modal")!
  );
};

export default Modal;
