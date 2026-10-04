import Image from "next/image";

const initials = (name: string) =>
  name
    .replace(/^(Prof\.\s)?Dr\.?\s/, "")
    .replace(/^M\.\s/, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export default function Avatar({ name, photo, className = "" }: { name: string; photo?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-primary/10 ${className}`}>
      {photo ? (
        <Image src={`/people/${photo}`} alt={name} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover object-top" />
      ) : (
        <span className="absolute inset-0 grid place-items-center font-display text-4xl font-semibold text-primary">
          {initials(name)}
        </span>
      )}
    </div>
  );
}
