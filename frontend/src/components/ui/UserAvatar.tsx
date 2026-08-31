import React from "react";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

const colors = [
  "bg-orange",
  "bg-blue",
  "bg-green",
  "bg-purple",
  "bg-amber",
  "bg-red",
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UserAvatar({
  name,
  size = "md",
  color,
}: UserAvatarProps) {
  const bgColor = color || getColorFromName(name);
  const initials = getInitials(name);

  return (
    <div
      className={`${sizeMap[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold font-[family-name:var(--font-syne)] select-none shrink-0 transition-transform duration-200 hover:scale-105`}
      title={name}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}
