import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { school } from "@/data/school";
import { eventsPortal } from "@/data/events";

const mapQuery = encodeURIComponent("University of Sargodha, Sargodha, Pakistan");

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20">
      <div className="relative overflow-hidden bg-primary text-white">
        <Image
          src="/images/campus.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-10">
          <div>
            <span className="block h-[3px] w-12 rounded bg-gold" aria-hidden />
            <h2 className="mt-6 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              Talk to the admissions office
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">
              Questions about eligibility, fees or admission tests? Reach the school directly or visit us on campus.
            </p>
            <ul className="mt-10 space-y-5 text-lg">
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

          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            <iframe
              title="Map showing the University of Sargodha"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] w-full border-0"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 text-ink">
              <p className="text-sm text-slate">NBS is in the Ibn-e-Rushd Block on the main campus.</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light"
              >
                <Navigation size={16} aria-hidden />
                Get directions
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-gold bg-ink text-mist">
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
            <li><Link href="/events" className="hover:text-white">Events</Link></li>
            <li><Link href="/handbook" className="hover:text-white">Handbook</Link></li>
            <li><Link href="/attendance" className="hover:text-white">Attendance</Link></li>
            <li><Link href="/results" className="hover:text-white">Results</Link></li>
            <li><a href={eventsPortal.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">Events portal</a></li>
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
