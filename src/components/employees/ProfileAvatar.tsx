type Props = {
  name: string;
  size?: "sm" | "lg";
};

export default function ProfileAvatar({ name, size = "sm" }: Props) {
  const sizeClass = size === "lg" ? "w-45 h-45 text-xl" : "w-10 h-10 text-sm";

  return (
    <div
      className={`${sizeClass} rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold flex-shrink-0`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}