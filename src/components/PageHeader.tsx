import Image from "next/image";

export default function PageHeader({
  title,
  intro,
  image = "/images/campus.jpg",
  className = "",
}: {
  title: string;
  intro: string;
  image?: string;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden bg-ink text-white ${className}`}>
      <Image src={image} alt="" fill priority sizes="100vw" className="animate-kenburns object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-20 lg:px-10 lg:pt-48 lg:pb-24">
        <span className="block h-[3px] w-12 rounded bg-gold" aria-hidden />
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{intro}</p>
      </div>
    </section>
  );
}
