"use client";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import React, { useState } from "react";
import usePreventBodyScroll from "./usePreventBodyScroll";

import {
  Card,
  CardHeader,
  Image,
  Divider,
  CardBody,
  CardFooter,
  Link,
} from "@nextui-org/react";
type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const elemPrefix = "test";
const getId = (index: number) => `${elemPrefix}${index}`;
const getItems = () =>
  Array(20)
    .fill(0)
    .map((_, ind) => ({ id: getId(ind) }));

const userReviews = [
  {
    id: "1",
    user: "Artist1",
    avatar: "https://example.com/avatar1.png",
    comment: "This service is a game-changer for my artwork. Highly recommend!",
    rating: 5,
    region: "North America",
  },
  {
    id: "2",
    user: "Designer2",
    avatar: "https://example.com/avatar2.png",
    comment:
      "Helps me visualize my ideas quickly. Could use more customization options though.",
    rating: 4.5,
    region: "Europe",
  },
  {
    id: "3",
    user: "Student3",
    avatar: "https://example.com/avatar3.png",
    comment:
      "Great for my school projects. Easy to use and the results are impressive.",
    rating: 4.5,
    region: "Asia",
  },
  {
    id: "4",
    user: "Hobbyist4",
    avatar: "https://example.com/avatar4.png",
    comment:
      "Fun to play around with. Sometimes the results are not what I expected, but overall it's pretty cool.",
    rating: 4,
    region: "South America",
  },
  {
    id: "3",
    user: "Student3",
    avatar: "https://example.com/avatar3.png",
    comment:
      "Great for my school projects. Easy to use and the results are impressive.",
    rating: 4.5,
    region: "South America",
  },
  {
    id: "4",
    user: "Hobbyist4",
    avatar: "https://example.com/avatar4.png",
    comment:
      "Fun to play around with. Sometimes the results are not what I expected, but overall it's pretty cool.",
    rating: 4,
    region: "Europe",
  },
  {
    id: "5",
    user: "Professional5",
    avatar: "https://example.com/avatar5.png",
    comment:
      "This service has significantly improved my workflow. The AI is incredibly accurate.",
    rating: 5,
    region: "South America",
  },
  {
    id: "6",
    user: "Beginner6",
    avatar: "https://example.com/avatar6.png",
    comment:
      "As a beginner, this service has been a great learning tool for me.",
    rating: 4.7,
    region: "North America",
  },
];
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [...Array(Math.ceil(rating))].map((_, i) => {
    return (
      <span
        key={i}
        className="star"
        style={{ color: "#ffc107", fontSize: "16px" }}
      >
        {i + 1 <= rating ? "★" : "☆"}
      </span>
    );
  });

  return <div>{stars}</div>;
};
export default function UserReview() {
  const [items] = React.useState(userReviews);
  //   const [totalStars, setTotalStars] = useState(5);

  const { disableScroll, enableScroll } = usePreventBodyScroll();
  return (
    <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
      <ScrollMenu onWheel={onWheel} separatorClassName="w-[8px]">
        {items.map(({ id, user, comment, rating, region }) => (
          <div
            className="max-w-[400px] space-y-4 w-[320px] home-review-bg ml-10 rounded-lg p-4"
            key={id}
          >
            <div className="gap-3 justify-center items-center mt-4">
              <StarRating rating={rating} />
            </div>

            <p className="h-[100px] m-4">{comment}</p>

            <div className="flex flex-row space-x-4  items-center">
              <div className="w-1/4 w-[32px] ">
                <Image src="/assets/picture/team-players-1.png" alt="logo" />
              </div>
              <div className="flex flex-col m-2">
                <p className="home-review-user bold">{user}</p>

                <p className="m-2">{region}</p>
              </div>
            </div>
          </div>
        ))}
      </ScrollMenu>
    </div>
  );
}
function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}
