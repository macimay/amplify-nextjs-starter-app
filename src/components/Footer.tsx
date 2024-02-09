"use client";
import { Divider, Image } from "@nextui-org/react";
import { useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="w-full h-20 mt-20 h-[200px]">
      <Divider />
      <div className="flex flex-row m-20 justify-content space-x-10 ">
        <div className="flex flex-col space-y-4 ">
          <Image src="/assets/picture/logo.png" alt="logo" className="mb-4" />
          <p>Wedraw</p>
          <p>@2024</p>
        </div>
        <div className="flex flex-col space-y-4">
          <p className="text-xl bold mb-4">{t("productTitle")}</p>
          <p>Wedraw</p>
          <p>Wedraw</p>
        </div>
      </div>
    </footer>
  );
}
