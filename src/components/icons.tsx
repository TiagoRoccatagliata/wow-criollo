import Image from "next/image";
import type { LucideProps } from "lucide-react";
import {
  CLASSES,
  type Activity,
  type CharacterClass,
  type Faction,
} from "@/features/groups/catalog";
import { ACTIVITY_ICONS, FACTION_ICONS } from "@/lib/wow-assets";

type GameIconProps = { size?: number; className?: string };

function GameIcon({
  src,
  size = 24,
  className = "",
}: GameIconProps & { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`wow-icon ${className}`}
      unoptimized
    />
  );
}

export function ClassIcon({
  characterClass,
  ...props
}: GameIconProps & { characterClass: CharacterClass }) {
  return <GameIcon src={CLASSES[characterClass].icon} {...props} />;
}

export function FactionIcon({
  faction,
  ...props
}: GameIconProps & { faction: Faction }) {
  return <GameIcon src={FACTION_ICONS[faction]} {...props} />;
}

export function ActivityIcon({
  activity,
  ...props
}: GameIconProps & { activity: Activity }) {
  return <GameIcon src={ACTIVITY_ICONS[activity]} {...props} />;
}

export function DiscordIcon(props: LucideProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.3 4.6A19.6 19.6 0 0 0 15.5 3l-.6 1.2a18.4 18.4 0 0 0-5.8 0L8.5 3a19.4 19.4 0 0 0-4.8 1.6C.7 9 .1 13.3.4 17.4a19.6 19.6 0 0 0 5.9 3l1.2-2a12.4 12.4 0 0 1-1.9-.9l.5-.4a14 14 0 0 0 11.8 0l.5.4a12.4 12.4 0 0 1-1.9.9l1.2 2a19.6 19.6 0 0 0 5.9-3c.4-4.8-.8-9-3.3-12.8ZM8 14.8c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3 2 1 2 2.3-.9 2.3-2 2.3Zm8 0c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3 2 1 2 2.3-.9 2.3-2 2.3Z" />
    </svg>
  );
}
