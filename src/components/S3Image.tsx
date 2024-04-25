import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";

export default function S3Image({
  s3Key,
  ...props
}: {
  key: string | undefined;

  [key: string]: any;
}) {
  const [imageUrl, setImageUrl] = useState("/assets/picture/empty-image.png");

  console.log("S3Image key:", s3Key);
  useEffect(() => {
    if (s3Key !== undefined) {
      getUrl({ key: s3Key }).then((url) => {
        console.log("S3Image url:", url);
        setImageUrl(url.url.href);
      });
    }
  }, [s3Key]);
  return <img src={imageUrl} {...props} />;
}
