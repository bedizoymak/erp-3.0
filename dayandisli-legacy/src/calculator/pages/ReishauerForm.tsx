import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CalculatorLayout } from "../components/CalculatorLayout";
import { ResultCard } from "../components/ResultCard";
import { getMachineById } from "../data/machines";
import {
  computeReishauerNominalDiameter,
  computeReishauerParams,
  normalizeReishauerAngleInput,
  normalizeReishauerAngleSeparator,
  parseReishauerAngle,
  validateReishauerInputs,
  HelixDirection,
  ReishauerResult,
} from "../utils/gearReishauer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

/** REISHAUER Taşlama's dedicated calculation form -- ported from Android's
 * ReishauerFormScreen.kt. Unlike Küçük Azdırma's plain decimal-degree Helical form, α and β here
 * use the D,M,S,CS (Derece,Dakika,Saniye,Salise) shop-floor notation via gearReishauer.ts's
 * tolerant parser/normalizer, and the diameter (ø) is auto-computed from mn/Z/β but manually
 * overridable, matching ReishauerFormScreen.kt's D,M,S,CS text fields and diameter override. */
export default function ReishauerForm() {
  const { machineId } = useParams<{ machineId: string }>();
  const navigate = useNavigate();
  const machine = getMachineById(machineId || "");

  const [mn, setMn] = useState<string>("1.0");
  const [z, setZ] = useState<string>("20");
  const [alphaRaw, setAlphaRaw] = useState<string>("20°00′00″00");
  const [betaRaw, setBetaRaw] = useState<string>("15°00′00″00");
  const [helixDirection, setHelixDirection] = useState<HelixDirection>("Sağ");
  const [diameter, setDiameter] = useState<string>("");
  const [diameterTouched, setDiameterTouched] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<ReishauerResult | null>(null);

  const mnVal = parseFloat(mn);
  const zVal = parseInt(z, 10);
  const alphaDeg = parseReishauerAngle(alphaRaw);
  const betaDeg = parseReishauerAngle(betaRaw);

  // Auto-compute the default diameter from mn/Z/β until the user overrides it manually.
  useEffect(() => {
    if (diameterTouched) return;
    if (Number.isNaN(mnVal) || Number.isNaN(zVal) || betaDeg == null) return;
    const nominal = computeReishauerNominalDiameter(mnVal, zVal, betaDeg);
    setDiameter(nominal.toFixed(4));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mn, z, betaRaw]);

  useEffect(() => {
    const diameterVal = parseFloat(diameter);

    if (Number.isNaN(mnVal) || Number.isNaN(zVal) || Number.isNaN(diameterVal)) {
      setResult(null);
      setErrors([]);
      return;
    }

    const validationErrors = validateReishauerInputs(mnVal, zVal, diameterVal, alphaDeg, betaDeg);
    setErrors(validationErrors);

    if (validationErrors.length === 0 && alphaDeg != null && betaDeg != null) {
      const calculated = computeReishauerParams(
        mnVal,
        zVal,
        alphaDeg,
        alphaRaw,
        betaDeg,
        betaRaw,
        helixDirection,
        diameterVal,
      );
      setResult(calculated);
    } else {
      setResult(null);
    }
  }, [mn, z, alphaRaw, betaRaw, helixDirection, diameter, mnVal, zVal, alphaDeg, betaDeg]);

  const handleViewReceipt = () => {
    if (result) {
      navigate(`/apps/calculator/machines/${machineId}/reishauer/receipt`, {
        state: { result },
      });
    }
  };

  if (!machine) {
    return (
      <CalculatorLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Makine bulunamadı.</p>
        </div>
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout>
      <div className="max-w-4xl mx-auto">
        <Link
          to={`/apps/calculator/machines/${machineId}`}
          className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {machine.name}
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2">
          REISHAUER Profil Taşlama Hesaplama
        </h1>
        <p className="text-slate-400 mb-8">
          Reishauer profil taşlama parametrelerini girin
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Parametreler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mn" className="text-slate-300">
                  Modül (mn)
                </Label>
                <Input
                  id="mn"
                  type="number"
                  step="0.1"
                  min="0.3"
                  max="3.0"
                  value={mn}
                  onChange={(e) => setMn(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="0.3 - 3.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="z" className="text-slate-300">
                  Diş Sayısı (Z)
                </Label>
                <Input
                  id="z"
                  type="number"
                  step="1"
                  min="6"
                  value={z}
                  onChange={(e) => setZ(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="≥ 6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alpha" className="text-slate-300">
                  Kavrama Açısı (α) D,M,S,CS
                </Label>
                <Input
                  id="alpha"
                  type="text"
                  value={alphaRaw}
                  onChange={(e) => setAlphaRaw(normalizeReishauerAngleSeparator(e.target.value))}
                  onBlur={(e) => setAlphaRaw(normalizeReishauerAngleInput(e.target.value))}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="20°00′00″00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beta" className="text-slate-300">
                  Helis Açısı (β) D,M,S,CS
                </Label>
                <Input
                  id="beta"
                  type="text"
                  value={betaRaw}
                  onChange={(e) => setBetaRaw(normalizeReishauerAngleSeparator(e.target.value))}
                  onBlur={(e) => setBetaRaw(normalizeReishauerAngleInput(e.target.value))}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="15°00′00″00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction" className="text-slate-300">
                  Helis Yönü
                </Label>
                <Select
                  value={helixDirection}
                  onValueChange={(v) => setHelixDirection(v as HelixDirection)}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sağ">Sağ</SelectItem>
                    <SelectItem value="Sol">Sol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diameter" className="text-slate-300">
                  Çap (ø) mm
                </Label>
                <Input
                  id="diameter"
                  type="number"
                  step="0.01"
                  min="8"
                  max="250"
                  value={diameter}
                  onChange={(e) => {
                    setDiameterTouched(true);
                    setDiameter(e.target.value);
                  }}
                  className="bg-slate-900 border-slate-600 text-white"
                  placeholder="8 - 250"
                />
                <p className="text-xs text-slate-500">
                  mn/Z/β üzerinden otomatik hesaplanır; elle değiştirilebilir.
                </p>
              </div>

              {errors.length > 0 && (
                <div className="rounded-lg bg-red-900/20 border border-red-800 p-4">
                  {errors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Sonuçlar</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="grid grid-cols-2 gap-4">
                    <ResultCard label="Modül (mn)" value={result.mn} />
                    <ResultCard label="Diş Sayısı (Z)" value={result.z} />
                    <ResultCard label="Helis Yönü" value={result.helixDirection} />
                    <ResultCard label="Çap (ø)" value={result.diameter} unit="mm" />
                    <ResultCard label={`Wk (k=${result.k1})`} value={result.wk1} unit="mm" />
                    <ResultCard label={`Wk (k=${result.k2})`} value={result.wk2} unit="mm" />
                    <ResultCard label={`Wk (k=${result.k3})`} value={result.wk3} unit="mm" />
                    <ResultCard label="Taksimat Oranı" value={result.taksimatRatio} />
                    <ResultCard label="Helis Çark Oranı" value={result.helixGearRatio} />
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">
                    Geçerli parametreler girin
                  </p>
                )}
              </CardContent>
            </Card>

            {result && (
              <Button
                onClick={handleViewReceipt}
                className="w-full bg-purple-600 hover:bg-purple-700 h-12"
              >
                Reçeteyi Görüntüle (PDF)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
