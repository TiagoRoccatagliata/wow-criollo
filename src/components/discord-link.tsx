import { config } from "@/lib/config";
import { DiscordIcon } from "./icons";
export function DiscordLink({
  children = "Discord",
  className = "button button-discord",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={config.discordInvite}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <DiscordIcon />
      {children}
    </a>
  );
}
