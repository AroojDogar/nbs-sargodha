import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { school } from "@/data/school";

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20">
      <div className="relative overflow-hidden bg-primary text-white">
        <Image
          src="/images/aboutt.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[3fr_2fr] lg:items-end lg:px-10">
          <div>
            <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              Talk to the admissions office
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">
              Questions about eligibility, fees or admission tests? Reach the school directly.
            </p>
          </div>
          <ul className="space-y-5 text-lg">
            <li className="flex gap-3">
              <Mail className="mt-1 shrink-0" size={20} aria-hidden />
              <a href={`mailto:${school.contact.email}`} className="underline-offset-4 hover:underline">
                {school.contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-1 shrink-0" size={20} aria-hidden />
              <span>{school.contact.phone}</span>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-1 shrink-0" size={20} aria-hidden />
              <span>{school.contact.location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-ink text-mist">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 py-10 lg:px-10">
          <div className="flex items-center gap-4">
            <Image src="/nbs-logo.png" alt="" width={56} height={56} className="size-14 rounded-full bg-white" />
            <Image src="/uos-logo.png" alt="" width={56} height={56} className="size-14 rounded-full bg-white" />
            <p className="max-w-xs text-sm leading-relaxed">
              {school.name}, {school.university}
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li><Link href="/#programs" className="hover:text-white">Programs</Link></li>
            <li><Link href="/faculty" className="hover:text-white">Faculty</Link></li>
            <li><Link href="/student-life" className="hover:text-white">Student life</Link></li>
            <li><Link href="/handbook" className="hover:text-white">Handbook</Link></li>
            <li><a href="https://www.su.edu.pk" className="hover:text-white">University website</a></li>
          </ul>
        </div>
        <p className="border-t border-white/10 px-6 py-5 text-center text-xs">
          © {new Date().getFullYear()} {school.name}. Concept website created as a student project.
        </p>
      </div>
    </footer>
  );
}
