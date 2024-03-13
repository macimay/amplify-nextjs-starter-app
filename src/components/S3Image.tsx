import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";

export default function S3Image({
  key,
  ...props
}: {
  key: string | undefined;

  [key: string]: any;
}) {
  const [imageUrl, setImageUrl] = useState("/assets/picture/empty-image.png");

  useEffect(() => {
    if (key !== undefined) {
      getUrl({ key: key }).then((url) => {
        setImageUrl(url.url.href);
      });
    }
  }, [key]);
  return <img src={imageUrl} {...props} />;
}
