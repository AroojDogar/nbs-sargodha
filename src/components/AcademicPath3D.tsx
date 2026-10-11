"use client";

// The 3D "academic staircase": one block per level, BBA to PhD, rising as it scrolls into view.
// Drag to turn it; hover or tap a step to read about it.

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, PresentationControls, RoundedBox } from "@react-three/drei";
import { Vector3, type Mesh, type Object3D } from "three";

export interface Step {
  label: string;
  title: string;
  text: string;
}

const COLORS = ["#1f3fae", "#2547bd", "#3355cc", "#14307f", "#c99a45"];

function Block({
  index,
  total,
  visible,
  active,
  onSelect,
  register,
}: {
  index: number;
  total: number;
  visible: boolean;
  active: boolean;
  onSelect: () => void;
  register: (index: number, anchor: Object3D | null) => void;
}) {
  const ref = useRef<Mesh>(null);
  const height = 0.6 + index * 0.55;
  const x = (index - (total - 1) / 2) * 1.35;
  const z = -index * 0.35;
  const start = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    if (visible && start.current === null) start.current = clock.elapsedTime;
    const t = start.current === null ? 0 : Math.min(1, Math.max(0, (clock.elapsedTime - start.current - index * 0.18) / 0.8));
    const eased = 1 - Math.pow(1 - t, 3);
    const lift = active ? 0.15 : 0;
    mesh.scale.y = Math.max(0.001, eased);
    mesh.position.y = (height * eased) / 2 + lift * eased;
  });

  const last = index === total - 1;

  return (
    <group position={[x, 0, z]}>
      <RoundedBox
        ref={ref}
        args={[1.1, height, 1.1]}
        radius={0.08}
        smoothness={4}
        onPointerOver={(e) => {
          e.stopPropagation();
          onSelect();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => (document.body.style.cursor = "")}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <meshStandardMaterial
          color={COLORS[index % COLORS.length]}
          metalness={last ? 0.6 : 0.15}
          roughness={last ? 0.25 : 0.45}
          emissive={active ? (last ? "#7a5a20" : "#1f3fae") : "#000000"}
          emissiveIntensity={active ? 0.45 : 0}
        />
      </RoundedBox>
      {/* Where this step's label sits; LabelTracker follows it. */}
      <object3D
        position={[0, height + 0.5, 0]}
        ref={(o) => {
          register(index, o);
        }}
      />
    </group>
  );
}

// Moves the HTML labels (outside the canvas) to sit above their blocks every frame.
function LabelTracker({
  anchors,
  labels,
}: {
  anchors: RefObject<(Object3D | null)[]>;
  labels: RefObject<(HTMLSpanElement | null)[]>;
}) {
  const v = useRef(new Vector3());
  useFrame(({ camera, size }) => {
    anchors.current.forEach((anchor, i) => {
      const el = labels.current[i];
      if (!anchor || !el) return;
      v.current.setFromMatrixPosition(anchor.matrixWorld).project(camera);
      const x = ((v.current.x + 1) / 2) * size.width;
      const y = ((1 - v.current.y) / 2) * size.height;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
  });
  return null;
}

export default function AcademicPath3D({ steps }: { steps: Step[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const anchors = useRef<(Object3D | null)[]>([]);
  const register = useCallback((i: number, o: Object3D | null) => {
    anchors.current[i] = o;
  }, []);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const step = steps[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr]">
      <div ref={wrap} className="relative h-[360px] cursor-grab overflow-hidden rounded-3xl bg-fog active:cursor-grabbing sm:h-[440px]">
        <Canvas camera={{ position: [0, 3.2, 8.5], fov: 40 }} dpr={[1, 2]} frameloop={visible ? "always" : "demand"}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} />
          <directionalLight position={[-6, 4, -2]} intensity={0.4} color="#e3c27a" />
          <PresentationControls global rotation={[0.05, -0.35, 0]} polar={[-0.15, 0.25]} azimuth={[-0.8, 0.8]} snap>
            <group position={[0, -1.4, 0]}>
              {steps.map((s, i) => (
                <Block
                  key={s.label}
                  index={i}
                  total={steps.length}
                  visible={visible}
                  active={i === active}
                  onSelect={() => setActive(i)}
                  register={register}
                />
              ))}
            </group>
          </PresentationControls>
          <ContactShadows position={[0, -1.41, 0]} opacity={0.35} scale={12} blur={2.4} far={4} />
          <LabelTracker anchors={anchors} labels={labels} />
        </Canvas>

        {steps.map((s, i) => (
          <span
            key={s.label}
            ref={(el) => {
              labels.current[i] = el;
            }}
            aria-hidden
            className={`pointer-events-none absolute top-0 left-0 rounded-full px-3 py-1 font-display text-sm font-semibold whitespace-nowrap shadow-md transition-[opacity,background-color] duration-500 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDelay: visible ? `${i * 180 + 500}ms, 0ms` : "0ms",
              background: i === active ? "#c99a45" : "#ffffff",
              color: "#0a1430",
            }}
          >
            {s.label}
          </span>
        ))}

        <p className="pointer-events-none absolute bottom-3 left-0 w-full text-center text-xs text-slate">
          Drag to turn · hover or tap a step
        </p>
      </div>

      <div>
        <ol className="flex flex-wrap gap-2" aria-label="Academic levels">
          {steps.map((s, i) => (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  i === active ? "bg-primary text-white" : "border border-ink/15 text-slate hover:border-primary hover:text-primary"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ol>
        <div key={step.label} className="mt-8 animate-[fadein_.4s_ease]">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Step {active + 1} of {steps.length}
          </p>
          <h3 className="mt-2 font-display text-3xl font-semibold">{step.title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-slate">{step.text}</p>
        </div>
      </div>
    </div>
  );
}
