const ContextMenu = ({
  children,
  isFromLeft,
}: React.PropsWithChildren & { isFromLeft?: boolean }) => {
  return (
    <>
      <div
        className={
          "chatapp-cm " + isFromLeft
            ? "chatapp-left-chevron"
            : "chatapp-right-chevron"
        }
      >
        <ul className="cm-btn-container">{children}</ul>
      </div>
    </>
  );
};

export default ContextMenu;
