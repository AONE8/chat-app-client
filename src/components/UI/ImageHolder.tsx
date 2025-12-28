import { FC } from "react";

interface ImageHolderProps {
  username?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  className?: string;
  size?: 12 | 24;
}

const ImageHolder: FC<ImageHolderProps> = ({
  username = "",
  avatarUrl,
  isOnline,
  className,
  size = 12,
}) => {
  const imageHolder = {
    12: "image-holder",
    24: "image-holder--24",
  };

  return (
    <div
      className={`${imageHolder[size]} ${
        isOnline ? "avatar-online" : ""
      } ${className}`}
    >
      {avatarUrl && (
        <div className="image">
          <img src={avatarUrl} alt={username} />
        </div>
      )}

      <div className="no-image">
        <p className="w-fit h-fit">{username.charAt(0).toUpperCase()}</p>
      </div>
    </div>
  );
};

export default ImageHolder;
