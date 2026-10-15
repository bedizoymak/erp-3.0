import { Link } from "react-router-dom";
import { CalculatorLayout } from "../components/CalculatorLayout";
import { MACHINES, machinePhotoUrl } from "../data/machines";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Machine selection grid -- ported from Android's MachinesScreen.kt: real machine photography
 * (16:9, dark bottom gradient scrim for legibility) or an icon-badge fallback when no photo
 * exists, machine name/description, and a ghost "Seç" action row with a trailing chevron.
 * Disabled machines render at reduced opacity with "Henüz Hazır Değil" and are not navigable.
 * The whole card is one <Link> (or a plain non-interactive Card when disabled) so the entire
 * surface is clickable, not just the action row -- matches Card(onClick=...) in the source. */
export default function MachineSelection() {
  return (
    <CalculatorLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Makine Seçimi</h1>
          <p className="text-slate-400">
            Hesaplama yapmak istediğiniz makineyi seçin
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {MACHINES.map((machine) => {
            const photoUrl = machinePhotoUrl(machine.id);
            const cardClassName = cn(
              "overflow-hidden bg-slate-800/50 border-slate-700 transition-all group",
              machine.available ? "hover:border-blue-500/50" : "bg-slate-800/30 border-slate-800 opacity-50",
            );

            const cardBody = (
              <>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  {photoUrl ? (
                    <>
                      <img
                        src={photoUrl}
                        alt={`${machine.name} fotoğrafı`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/10 to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Settings className="h-10 w-10 text-slate-500" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className={machine.available ? "text-white text-lg" : "text-slate-400 text-lg"}>
                    {machine.name}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    {machine.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {machine.available ? (
                    <div className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium text-slate-300 transition-colors group-hover:bg-slate-700/50 group-hover:text-white">
                      Seç
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium text-slate-600"
                    >
                      Henüz Hazır Değil
                    </button>
                  )}
                </CardContent>
              </>
            );

            return machine.available ? (
              <Link key={machine.id} to={`/apps/calculator/machines/${machine.id}`} className="block">
                <Card className={cardClassName}>{cardBody}</Card>
              </Link>
            ) : (
              <Card key={machine.id} className={cn(cardClassName, "cursor-not-allowed")} aria-disabled="true">
                {cardBody}
              </Card>
            );
          })}
        </div>
      </div>
    </CalculatorLayout>
  );
}
