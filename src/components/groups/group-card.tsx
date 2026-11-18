import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Users } from "lucide-react";
import { ACTIVITIES, CLASSES, FACTIONS } from "@/features/groups/catalog";
import { relativeTime } from "@/lib/format";
import type { PublicPost } from "@/server/groups";
import { ActivityIcon, ClassIcon, FactionIcon } from "../icons";
import type { CSSProperties } from "react";
import { StatusBadge } from "./status-badge";
export function GroupCard({ post }: { post: PublicPost }) {
  const characterClass = CLASSES[post.characterClass];
  return (
    <Link
      href={`/grupos/${post.id}`}
      className="group-card"
      style={{ "--class-color": characterClass.color } as CSSProperties}
    >
      <div className="card-top">
        <StatusBadge status={post.status} compact />
        <span className="card-time">
          {post.isDemo ? (
            <span className="demo-tag">DEMO</span>
          ) : (
            relativeTime(post.createdAt)
          )}
        </span>
      </div>
      <div className="character-row">
        <span className="class-emblem">
          <ClassIcon characterClass={post.characterClass} size={40} />
        </span>
        <div>
          <h3>
            {post.characterName}
            <span className="level-badge">{post.level}</span>
          </h3>
          <p>
            <span className="class-name">{characterClass.label}</span>
            <span className="separator">·</span>
            <span
              className={`faction-label ${post.faction === "HORDE" ? "faction-horde" : "faction-alliance"}`}
            >
              <FactionIcon faction={post.faction} size={16} />
              {FACTIONS[post.faction]}
            </span>
          </p>
        </div>
      </div>
      <div className="card-activity">
        <span
          className={`activity-badge activity-${post.activity.toLowerCase()}`}
        >
          <ActivityIcon activity={post.activity} size={20} />
          {ACTIVITIES[post.activity]}
        </span>
        <span>Nivel {post.recommendedLevel}+</span>
      </div>
      <h4>
        <MapPin size={15} />
        {post.zone}
      </h4>
      <p className="card-description">{post.description}</p>
      <div className="card-meta">
        <span>
          <Clock3 size={14} />
          {post.schedule}
        </span>
        <span>
          <Users size={14} />
          {post.playersNeeded} {post.playersNeeded === 1 ? "lugar" : "lugares"}
        </span>
      </div>
      <div className="card-footer">
        <span>Ver grupo</span>
        <ArrowUpRight size={16} />
      </div>
    </Link>
  );
}
