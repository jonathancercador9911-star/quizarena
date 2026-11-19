import { TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TireTemps {
  fl: number;
  fr: number;
  rl: number;
  rr: number;
}

export interface CockpitHudProps {
  position: number;
  totalDrivers: number;
  lap: number;
  totalLaps: number;
  gapAhead: string;
  lastLap: string;
  bestLap: string;
  delta: number;
  sectors: (boolean | null)[];
  speed: number;
  gear: string;
  rpm: number;
  ers: number;
  drs: "ready" | "active" | "off";
  tires: TireTemps;
  battery: number;
  regen: number;
  pitAlert?: string;
}

const defaultTelemetry: CockpitHudProps = {
  position: 3,
  totalDrivers: 20,
  lap: 14,
  totalLaps: 52,
  gapAhead: "+0.612",
  lastLap: "1:31.402",
  bestLap: "1:30.887",
  delta: -0.214,
  sectors: [true, true, null],
  speed: 312,
  gear: "7",
  rpm: 11840,
  ers: 68,
  drs: "ready",
  tires: { fl: 96, fr: 98, rl: 101, rr: 112 },
  battery: 68,
  regen: 142,
};

/** HUD de cabina en primera persona. Datos de muestra por defecto; listo para recibir telemetría real por props. */
export function CockpitHud(props: Partial<CockpitHudProps> = {}) {
  const t: CockpitHudProps = { ...defaultTelemetry, ...props };
  const hotTire = t.tires.rr >= 110;

  return (
    <div className="pointer-events-none absolute inset-0 grid grid-rows-[auto_1fr_auto] gap-4 p-4 font-fz-mono sm:p-6">
      <div className="hidden items-start justify-between sm:flex">
        <PositionPanel
          position={t.position}
          total={t.totalDrivers}
          lap={t.lap}
          totalLaps={t.totalLaps}
          gapAhead={t.gapAhead}
        />
        <LapTimesPanel
          lastLap={t.lastLap}
          bestLap={t.bestLap}
          delta={t.delta}
          sectors={t.sectors}
        />
      </div>

      <div className="hidden items-start justify-between sm:flex">
        <MinimapPanel />
        <TiresPanel tires={t.tires} battery={t.battery} regen={t.regen} hot={hotTire} />
      </div>

      <div className="flex flex-col items-center gap-3">
        {t.pitAlert && (
          <Badge
            variant="destructive"
            className="pointer-events-auto gap-1.5 rounded-sm bg-destructive px-3 py-1 text-xs font-bold tracking-wide text-destructive-foreground"
          >
            <TriangleAlert className="size-3.5" />
            {t.pitAlert}
          </Badge>
        )}
        <div className="flex items-center gap-4 sm:gap-6">
          <WheelButtonColumn labels={["N", "PIT", "BBAL"]} />
          <TelemetryCluster
            speed={t.speed}
            gear={t.gear}
            rpm={t.rpm}
            lap={t.lap}
            totalLaps={t.totalLaps}
            delta={t.delta}
            ers={t.ers}
            drs={t.drs}
          />
          <WheelButtonColumn labels={["DRS", "ERS", "OK"]} active="DRS" activeOn={t.drs !== "off"} />
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  big,
  valueClassName,
}: {
  label: string;
  value: string;
  big?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] tracking-wide text-muted-foreground">{label}</span>
      <span className={cn(big ? "text-3xl" : "text-lg", "font-bold tabular-nums", valueClassName)}>
        {value}
      </span>
    </div>
  );
}

function PositionPanel({
  position,
  total,
  lap,
  totalLaps,
  gapAhead,
}: {
  position: number;
  total: number;
  lap: number;
  totalLaps: number;
  gapAhead: string;
}) {
  return (
    <Card className="pointer-events-auto w-56 gap-3 rounded-sm border border-border bg-card py-4">
      <CardContent className="flex flex-col gap-3 px-5">
        <div className="font-fz-display flex items-baseline gap-2">
          <span className="text-5xl font-bold leading-none">P{position}</span>
          <span className="text-sm text-muted-foreground">/ {total}</span>
        </div>
        <div className="h-px bg-border" />
        <Row label="VUELTA" value={`${lap} / ${totalLaps}`} />
        <Row label="INT. P2" value={gapAhead} />
      </CardContent>
    </Card>
  );
}

function LapTimesPanel({
  lastLap,
  bestLap,
  delta,
  sectors,
}: {
  lastLap: string;
  bestLap: string;
  delta: number;
  sectors: (boolean | null)[];
}) {
  return (
    <Card className="pointer-events-auto w-60 gap-3 rounded-sm border border-border bg-card py-4">
      <CardContent className="flex flex-col gap-3 px-5">
        <Row label="ÚLTIMA" value={lastLap} />
        <Row label="MEJOR" value={bestLap} valueClassName="text-primary" />
        <div className="h-px bg-border" />
        <Row
          label="DELTA"
          value={`${delta > 0 ? "+" : ""}${delta.toFixed(3)}`}
          big
          valueClassName={delta < 0 ? "text-primary" : "text-destructive"}
        />
        <div className="grid grid-cols-3 gap-1.5">
          {sectors.map((s, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className={cn("h-1.5 rounded-full", s === null ? "bg-muted" : "bg-primary")} />
              <span className="text-[11px] text-muted-foreground">S{i + 1}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const MINIMAP_TRACK =
  "M150 450L620 450Q700 450 720 390L760 260Q780 200 840 200L880 200Q930 200 930 150Q930 100 880 100L520 100Q470 100 460 150L440 260Q430 310 380 310L260 310Q200 310 190 250L180 190Q170 130 120 140Q70 150 80 220L100 380Q110 450 150 450Z";

function MinimapPanel() {
  return (
    <Card className="pointer-events-auto w-60 gap-2 rounded-sm border border-border bg-card py-3">
      <CardContent className="flex flex-col gap-2 px-4">
        <span className="text-[11px] tracking-wide text-muted-foreground">CIRCUITO ZERO-ONE</span>
        <svg
          viewBox="40 60 940 440"
          role="img"
          aria-label="Minimapa del Circuito Zero-One con la posición del monoplaza"
          className="h-auto w-full"
        >
          <path d={MINIMAP_TRACK} fill="none" className="stroke-muted" strokeWidth={18} strokeLinejoin="round" />
          <path d={MINIMAP_TRACK} fill="none" className="stroke-primary" strokeWidth={4} strokeLinejoin="round" />
          <line x1="300" y1="430" x2="300" y2="470" className="stroke-foreground" strokeWidth={4} />
          <circle cx="740" cy="330" r="12" className="fill-destructive" opacity={0.9} />
          <circle cx="752" cy="290" r="16" className="fill-primary stroke-background" strokeWidth={5} />
        </svg>
      </CardContent>
    </Card>
  );
}

function TireTemp({ value }: { value: number }) {
  const hot = value >= 110;
  return (
    <div
      className={cn(
        "flex h-10 w-14 items-center justify-center rounded-md border-2 text-sm font-bold",
        hot ? "border-destructive text-destructive" : "border-primary"
      )}
    >
      {value}
    </div>
  );
}

function TiresPanel({
  tires,
  battery,
  regen,
  hot,
}: {
  tires: TireTemps;
  battery: number;
  regen: number;
  hot: boolean;
}) {
  return (
    <Card className="pointer-events-auto w-64 gap-3 rounded-sm border border-border bg-card py-4">
      <CardContent className="flex flex-col gap-3 px-5">
        <span className="text-[11px] tracking-wide text-muted-foreground">NEUMÁTICOS · °C</span>
        <div className="flex items-center gap-4">
          <div className="grid grid-cols-2 gap-2">
            <TireTemp value={tires.fl} />
            <TireTemp value={tires.fr} />
            <TireTemp value={tires.rl} />
            <TireTemp value={tires.rr} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] tracking-wide text-muted-foreground">BATERÍA</span>
            <span className="text-2xl font-bold">{battery}%</span>
            <span className="text-[11px] tracking-wide text-primary">REGEN +{regen} kJ</span>
          </div>
        </div>
        {hot && (
          <div className="flex items-center gap-2 rounded-sm border border-destructive px-2.5 py-1.5">
            <TriangleAlert className="size-4 text-destructive" />
            <span className="text-xs font-bold text-destructive">TRASERO DERECHO · TEMP ALTA</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TelemetryCluster({
  speed,
  gear,
  rpm,
  lap,
  totalLaps,
  delta,
  ers,
  drs,
}: {
  speed: number;
  gear: string;
  rpm: number;
  lap: number;
  totalLaps: number;
  delta: number;
  ers: number;
  drs: "ready" | "active" | "off";
}) {
  return (
    <Card
      className={cn(
        "pointer-events-auto w-[320px] gap-3 rounded-xl border-2 bg-background py-4 sm:w-[440px]",
        drs === "active" ? "border-primary" : "border-border"
      )}
    >
      <CardContent className="flex flex-col gap-2.5 px-4 sm:px-5">
        <div className="flex items-stretch justify-between">
          <div className="flex w-24 flex-col justify-between sm:w-28">
            <span className="text-[11px] tracking-wide text-muted-foreground">KM/H</span>
            <span className="text-3xl font-bold leading-none tabular-nums sm:text-4xl">{speed}</span>
            <span className="text-[11px] text-muted-foreground">RPM {rpm.toLocaleString("es-EC")}</span>
          </div>
          <div className="flex w-20 items-center justify-center border-x border-border sm:w-28">
            <span className="font-fz-display text-5xl font-bold leading-none text-primary sm:text-6xl">
              {gear}
            </span>
          </div>
          <div className="flex w-24 flex-col items-end justify-between sm:w-28">
            <span className="text-[11px] tracking-wide text-muted-foreground">VUELTA</span>
            <span className="text-xl font-bold leading-none sm:text-2xl">
              {lap}/{totalLaps}
            </span>
            <span className={cn("text-base font-bold", delta < 0 ? "text-primary" : "text-destructive")}>
              {delta > 0 ? "+" : ""}
              {delta.toFixed(3)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-muted-foreground">ERS</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-3 bg-primary" style={{ width: `${ers}%` }} />
          </div>
          <span className="w-10 text-right text-xs font-bold tabular-nums">{ers}%</span>
          <Badge
            variant={drs === "active" ? "default" : "outline"}
            className={cn(
              "rounded-sm px-2 text-xs font-bold",
              drs !== "active" && "text-muted-foreground"
            )}
          >
            DRS
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function WheelButtonColumn({
  labels,
  active,
  activeOn,
}: {
  labels: string[];
  active?: string;
  activeOn?: boolean;
}) {
  return (
    <div className="pointer-events-auto flex flex-col gap-3">
      {labels.map((label) => (
        <Button
          key={label}
          type="button"
          variant={label === active && activeOn ? "default" : "outline"}
          className="h-10 w-10 rounded-full font-fz-mono text-[10px] font-bold sm:h-12 sm:w-12 sm:text-[11px]"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
