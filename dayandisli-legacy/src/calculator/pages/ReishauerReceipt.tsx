import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { CalculatorLayout } from "../components/CalculatorLayout";
import { GearCombinationsTable } from "../components/GearCombinationsTable";
import { getMachineById } from "../data/machines";
import {
  findReishauerHelisCombinations,
  findReishauerTaksimatCombinations,
  toDmscs,
  toDmscsSigned,
  ReishauerHelisCombination,
  ReishauerResult,
} from "../utils/gearReishauer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { PURPLE_ACCENT, ReceiptPainter, loadLogoDataUrl } from "../utils/pdfReceipt";

/** REISHAUER Taşlama's receipt page -- ported from Android's ReishauerReceiptScreen.kt.
 * Parameters recap plus Taksimat and Helis Çark Kombinasyonları sections, using
 * gearReishauer.ts's own combination-search exports (its own 25..127 gear inventory and 24/Z
 * Taksimat convention, distinct from Küçük Azdırma/Helical Hobbing's gearCombinations.ts). */
export default function ReishauerReceipt() {
  const { machineId } = useParams<{ machineId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const machine = getMachineById(machineId || "");
  const result = location.state?.result as ReishauerResult | undefined;

  if (!result || !machine) {
    return (
      <CalculatorLayout>
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">Hesaplama sonucu bulunamadı.</p>
          <Link to={`/apps/calculator/machines/${machineId}/reishauer`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hesaplamaya Dön
            </Button>
          </Link>
        </div>
      </CalculatorLayout>
    );
  }

  const taksimatCombinations = findReishauerTaksimatCombinations(result.z);
  const helisCombinations = findReishauerHelisCombinations(
    result.mn,
    result.betaDeg,
    result.helixGearRatioFullPrecision,
  );

  const handleDownloadPDF = async () => {
    const [{ jsPDF }, { fontRobotoRegular, fontRobotoBold }, logo] = await Promise.all([
      import("jspdf"),
      import("@/lib/pdfAssets/font-roboto"),
      loadLogoDataUrl(),
    ]);
    const doc = new jsPDF();
    doc.addFileToVFS("Roboto-Regular.ttf", fontRobotoRegular);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFileToVFS("Roboto-Bold.ttf", fontRobotoBold);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
    doc.setFont("Roboto", "normal");

    const painter = new ReceiptPainter({
      doc,
      accent: PURPLE_ACCENT,
      moduleLabel: "REISHAUER TAŞLAMA",
      machineName: machine.name,
      logoDataUrl: logo?.dataUrl,
      logoAspect: logo?.aspect,
    });

    painter.drawDocumentHeader();

    painter.drawHighlightStrip([
      { label: "MODÜL", value: result.mn.toFixed(4), unit: "mn" },
      { label: "DİŞ SAYISI", value: result.z.toString(), unit: "Z" },
      { label: "KAVRAMA AÇISI", value: result.alphaRaw, unit: "" },
      { label: "HELİS AÇISI", value: `${result.betaRaw} (${result.helixDirection})`, unit: "" },
      { label: "ÇAP", value: result.diameter.toFixed(2), unit: "mm" },
    ]);

    painter.drawSectionTitle("Hesaplama Parametreleri");
    painter.drawKeyValueTable([
      { label: "Modül (mn)", value: result.mn.toFixed(4), unit: "mm" },
      { label: "Diş Sayısı (Z)", value: result.z.toString(), unit: "" },
      { label: "Kavrama Açısı (α)", value: result.alphaRaw, unit: "" },
      { label: "Helis Açısı (β)", value: result.betaRaw, unit: "" },
      { label: "Helis Yönü", value: result.helixDirection, unit: "" },
      { label: "Çap (ø)", value: result.diameter.toFixed(2), unit: "mm" },
      { label: "Nominal Çap", value: result.nominalDiameter.toFixed(2), unit: "mm" },
      { label: "Taksimat Oranı", value: result.taksimatRatio.toFixed(6), unit: "" },
      { label: "Helis Çark Oranı", value: result.helixGearRatio.toFixed(9), unit: "" },
    ]);

    painter.drawSectionTitle("Reishauer Wk Ölçüm Değerleri (k1 / k2 / k3)");
    painter.drawWkCards(
      [
        { k: result.k1, wk: result.wk1, unit: "mm" },
        { k: result.k2, wk: result.wk2, unit: "mm" },
        { k: result.k3, wk: result.wk3, unit: "mm" },
      ],
      true,
    );

    painter.drawSectionTitle("Taksimat Çark Kombinasyonları");
    painter.drawCombinationCards(taksimatCombinations, result.taksimatRatio, "Taksimat Çark Kombinasyonları");

    painter.drawSectionTitle("Helis Çark Kombinasyonları");
    painter.drawCombinationCards(
      helisCombinations.map((h) => h.combination),
      result.helixGearRatioFullPrecision,
      "Helis Çark Kombinasyonları",
      (_combo, index) => {
        const h = helisCombinations[index];
        return {
          realizedAngle: toDmscs(h.actualHelixAngleDeg),
          deviation: toDmscsSigned(h.deviationDeg),
          isPerfectMatch: h.isPerfectMatch,
        };
      },
    );

    painter.finalizeFooters();

    doc.save(`reishauer-recete-z${result.z}.pdf`);
  };

  return (
    <CalculatorLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Hesaplamaya Dön
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              REISHAUER Profil Taşlama Reçetesi
            </h1>
            <p className="text-slate-400">{machine.name}</p>
          </div>
          <Button
            onClick={handleDownloadPDF}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF İndir
          </Button>
        </div>

        {/* Parameters Summary */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Parametreler</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-slate-400">Modül (mn)</p>
              <p className="text-white font-mono">{result.mn.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Diş Sayısı (Z)</p>
              <p className="text-white font-mono">{result.z}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Kavrama Açısı (α)</p>
              <p className="text-white font-mono">{toDmscs(result.alphaDeg)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Helis Açısı (β)</p>
              <p className="text-white font-mono">{toDmscs(result.betaDeg)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Helis Yönü</p>
              <p className="text-white font-mono">{result.helixDirection}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Çap (ø)</p>
              <p className="text-white font-mono">{result.diameter.toFixed(2)} mm</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Wk (k={result.k1})</p>
              <p className="text-white font-mono">{result.wk1.toFixed(4)} mm</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Wk (k={result.k2})</p>
              <p className="text-white font-mono">{result.wk2.toFixed(4)} mm</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Wk (k={result.k3})</p>
              <p className="text-white font-mono">{result.wk3.toFixed(4)} mm</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Taksimat Oranı</p>
              <p className="text-white font-mono">{result.taksimatRatio.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Helis Çark Oranı</p>
              <p className="text-white font-mono">{result.helixGearRatio.toFixed(6)}</p>
            </div>
          </div>
        </div>

        {/* Gear Combinations */}
        <div className="space-y-6">
          <GearCombinationsTable
            combinations={taksimatCombinations}
            title="Taksimat Çark Kombinasyonları"
          />
          <GearCombinationsTable<ReishauerHelisCombination["combination"] & { __helis?: ReishauerHelisCombination }>
            combinations={helisCombinations.map((h) => ({ ...h.combination, __helis: h }))}
            title="Helis Çark Kombinasyonları"
            extraColumns={[
              {
                header: "Gerçek Açı",
                render: (combo) => toDmscs(combo.__helis!.actualHelixAngleDeg),
              },
              {
                header: "Sapma",
                render: (combo) => toDmscsSigned(combo.__helis!.deviationDeg),
              },
              {
                header: "Tam Eşleşme",
                render: (combo) => (combo.__helis!.isPerfectMatch ? "Evet" : "Hayır"),
              },
            ]}
          />
        </div>
      </div>
    </CalculatorLayout>
  );
}
