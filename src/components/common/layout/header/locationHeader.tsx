import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

type Props = {
  firstTitle: string;
  firstPath?: string;
  secondTitle?: string;
  secondPath?: string;
  thirdTitle?: string;
};

export default function LocationHeader({
  firstTitle,
  firstPath,
  secondTitle,
  secondPath,
  thirdTitle,
}: Props) {
  return (
    <header className="flex items-center gap-1 text-xs text-slate-800">
      <Link href="/">
        <Home className="hover:text-[#f97316] h-4 w-4" />
      </Link>
      {firstPath && !secondPath ? (
        <>
          <Link href={`${firstPath}`} className="pt-0.5">
            {"> "}
            <span className="hover:text-[#f97316]">{`${firstTitle}`}</span>
          </Link>
          <span className="pt-0.5">{`> ${secondTitle}`}</span>
        </>
      ) : secondPath ? (
        <Link href={`${firstPath}`} className="pt-0.5">
          {"> "}
          <span className="hover:text-[#f97316]">{`${firstTitle}`}</span>
        </Link>
      ) : (
        <span className="pt-0.5">{`> ${firstTitle}`}</span>
      )}
      {secondPath ? (
        <>
          <Link href={`${secondPath}`} className="pt-0.5">
            {"> "}
            <span className="hover:text-[#f97316]">{`${secondTitle}`}</span>
          </Link>
          <span className="pt-0.5">{`> ${thirdTitle}`}</span>
        </>
      ) : (
        <></>
      )}
    </header>
  );
}
