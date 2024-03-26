import { Schema } from "@/../amplify/data/resource";
import Slider from "react-slick";
import S3Image from "./S3Image";

export default function ProductDescriptionComponent({
  descriptions,
}: {
  descriptions: Schema["ProductDescription"][];
}) {
  console.log("ProductDescriptionComponent params:", descriptions);
  return (
    <Slider arial-label-="Product Description">
      {descriptions.map((description) => (
        <div key={description.id}>
          <h3>{description.description}</h3>
          <S3Image
            s3Key={description.imageKey}
            alt={description.description}
            key={`${description.id}_image`}
          />
        </div>
      ))}
    </Slider>
  );
}
