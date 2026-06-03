import Link from "next/link";
import { Brain, Users, Smartphone, Zap, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    title: "Creá tu banco",
    description:
      "Armá preguntas con IA en segundos o agregá las tuyas. Organizalas por categoría y dificultad.",
  },
  {
    number: "02",
    title: "Compartí el código",
    description:
      "Los jugadores entran desde su celular con un código de 6 letras. Sin descarga ni registro.",
  },
  {
    number: "03",
    title: "¡A competir!",
    description:
      "Respondé en tiempo real, acumulá puntos por velocidad y mirá el podio al final.",
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Preguntas con IA",
    description:
      "Claude Haiku genera un banco completo sobre cualquier tema en segundos. Solo revisás y guardás.",
  },
  {
    icon: Users,
    title: "Modo equipos",
    description:
      "Los jugadores compiten en equipos. El sistema los distribuye automáticamente al iniciar.",
  },
  {
    icon: Smartphone,
    title: "Sin registro para jugadores",
    description:
      "Solo el moderador necesita cuenta. Los jugadores entran con un código desde cualquier celular.",
  },
  {
    icon: Zap,
    title: "Tiempo real < 500ms",
    description:
      "Cada respuesta y cada avance de ronda llegan a todas las pantallas en menos de medio segundo.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30 px-4 py-1.5 text-sm text-[#7C3AED] font-medium mb-8">
          <Zap className="h-3.5 w-3.5" />
          Trivia multijugador en tiempo real
        </div>

        <h1 className="font-heading text-5xl sm:text-6xl font-extrabold text-[#F8FAFC] max-w-2xl leading-tight">
          Tu trivia en vivo,
          <br />
          <span className="text-[#7C3AED]">a tu manera</span>
        </h1>

        <p className="mt-6 text-xl text-[#9CA3AF] max-w-lg leading-relaxed">
          Creá partidas de trivia con IA, invitá a tus amigos y competí en
          tiempo real desde el celular. Sin complicaciones.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white h-12 px-8 text-base font-semibold"
            >
              Crear una partida
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Link href="/play">
            <Button
              size="lg"
              variant="outline"
              className="border-[#2D2A3E] text-[#F8FAFC] hover:bg-[#1E1B2E] h-12 px-8 text-base"
            >
              Unirse con código
            </Button>
          </Link>
        </div>

        {/* Room code illustration */}
        <div className="mt-16 flex items-center gap-2 rounded-2xl bg-[#1E1B2E] border border-[#2D2A3E] px-8 py-4">
          <span className="text-[#9CA3AF] text-sm">Código de sala:</span>
          <span className="font-heading font-extrabold text-2xl tracking-[0.25em] text-[#F8FAFC]">
            KP7XNM
          </span>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 px-6 border-t border-[#2D2A3E] bg-[#1E1B2E]/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-[#F8FAFC] text-center mb-4">
            Cómo funciona
          </h2>
          <p className="text-[#9CA3AF] text-center mb-12">
            De cero a partida en menos de 10 minutos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 font-heading font-bold text-[#7C3AED] text-lg mx-auto">
                  {step.number}
                </div>
                <h3 className="font-semibold text-[#F8FAFC] text-lg">
                  {step.title}
                </h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-[#2D2A3E]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-[#F8FAFC] text-center mb-4">
            Todo lo que necesitás
          </h2>
          <p className="text-[#9CA3AF] text-center mb-12">
            Diseñado para reuniones, clases y eventos corporativos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[#2D2A3E] bg-[#1E1B2E] p-6 space-y-3"
              >
                <div className="h-10 w-10 rounded-lg bg-[#7C3AED]/15 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-[#7C3AED]" />
                </div>
                <h3 className="font-semibold text-[#F8FAFC]">{feature.title}</h3>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="py-20 px-6 border-t border-[#2D2A3E] text-center">
        <h2 className="font-heading text-3xl font-bold text-[#F8FAFC] mb-4">
          ¿Listo para jugar?
        </h2>
        <p className="text-[#9CA3AF] mb-8">
          Creá tu primera partida gratis. Sin tarjeta de crédito.
        </p>
        <Link href="/register">
          <Button className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white h-12 px-10 text-base font-semibold">
            Empezar gratis
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-[#2D2A3E] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[#9CA3AF]">
          <span className="font-heading font-bold text-[#F8FAFC]">QuizArena</span>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-[#F8FAFC] transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register" className="hover:text-[#F8FAFC] transition-colors">
              Crear cuenta
            </Link>
            <Link href="/play" className="hover:text-[#F8FAFC] transition-colors">
              Unirse a partida
            </Link>
          </div>
          <span>© 2026 QuizArena</span>
        </div>
      </footer>
    </div>
  );
}
