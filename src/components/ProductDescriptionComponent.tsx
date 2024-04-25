import { Schema } from "@/../amplify/data/resource";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import S3Image from "./S3Image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ProductDescriptionComponent({
  productId,
  descriptions,
  ...props
}: {
  productId: string;
  descriptions: Schema["ProductDescription"][];
  [key: string]: any;
}) {
  console.log("ProductDescriptionComponent params:", descriptions);
  return (
    <Carousel {...props}>
      <CarouselContent>
        {descriptions.map((description) => (
          <CarouselItem key={description.id}>
            <div className="flex justify-center">
              <h3 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1 text-white text-shadow-md">
                {description.description}
              </h3>
              <S3Image
                s3Key={description.imageKey}
                alt={description.description}
                key={`${description.id}_image`}
                width={240}
                height={120}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
