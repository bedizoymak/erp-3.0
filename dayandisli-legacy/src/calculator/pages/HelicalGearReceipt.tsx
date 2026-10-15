import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { CalculatorLayout } from "../components/CalculatorLayout";
import { GearCombinationsTable } from "../components/GearCombinationsTable";
import { getMachineById } from "../data/machines";
import { HelicalGearResult } from "../utils/gearHelical";
import {
  findTaksimatCombinations,
  findHelicalCombinations,
} from "../utils/gearCombinations";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { PURPLE_ACCENT, ReceiptPainter, loadLogoDataUrl } from "../utils/pdfReceipt";


export default function HelicalGearReceipt() {
  const { machineId } = useParams<{ machineId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const machine = getMachineById(machineId || "");
  const result = location.state?.result as HelicalGearResult | undefined;

  if (!result || !machine) {
    return (
      <CalculatorLayout>
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">Hesaplama sonucu bulunamadı.</p>
          <Link to={`/apps/calculator/machines/${machineId}/helical`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hesaplamaya Dön
            </Button>
          </Link>
        </div>
      </CalculatorLayout>
    );
  }

  const taksimatCombinations = findTaksimatCombinations(result.z);
  const helicalCombinations = findHelicalCombinations(result.helicalGearRatio);

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
      moduleLabel: "HELİS DİŞLİ",
      machineName: machine.name,
      logoDataUrl: logo?.dataUrl,
      logoAspect: logo?.aspect,
    });

    painter.drawDocumentHeader();

    painter.drawHighlightStrip([
      { label: "MODÜL", value: result.mn.toFixed(4), unit: "mn" },
      { label: "DİŞ SAYISI", value: result.z.toString(), unit: "Z" },
      { label: "KAVRAMA AÇISI", value: result.alphaDeg.toFixed(2), unit: "°" },
      { label: "HELİS AÇISI", value: `${result.betaDeg.toFixed(2)} (${result.helixDirection})`, unit: "°" },
      { label: "ÇAP", value: result.diameter.toFixed(2), unit: "mm" },
    ]);

    painter.drawSectionTitle("Hesaplama Parametreleri");
    painter.drawKeyValueTable([
      { label: "Modül (mn)", value: result.mn.toFixed(4), unit: "mm" },
      { label: "Diş Sayısı (Z)", value: result.z.toString(), unit: "" },
      { label: "Kavrama Açısı (α)", value: result.alphaDeg.toFixed(2), unit: "°" },
      { label: "Helis Açısı (β)", value: result.betaDeg.toFixed(2), unit: "°" },
      { label: "Helis Yönü", value: result.helixDirection, unit: "" },
      { label: "Çap (ø)", value: result.diameter.toFixed(2), unit: "mm" },
      { label: "Taksimat Oranı", value: result.taksimatRatio.toFixed(6), unit: "" },
      { label: "Helis Çark Oranı", value: result.helicalGearRatio.toFixed(6), unit: "" },
    ]);

    painter.drawSectionTitle("Wk Ölçüm Değerleri");
    painter.drawWkCards([
      { k: result.kFloor, wk: result.wkFloor, unit: "mm" },
      { k: result.kCeil, wk: result.wkCeil, unit: "mm" },
    ]);

    painter.drawSectionTitle("Taksimat Çark Kombinasyonları");
    painter.drawCombinationCards(taksimatCombinations, result.taksimatRatio, "Taksimat Çark Kombinasyonları");

    painter.drawSectionTitle("Helis Çark Kombinasyonları");
    painter.drawCombinationCards(helicalCombinations, result.helicalGearRatio, "Helis Çark Kombinasyonları");

    painter.finalizeFooters();

    doc.save(`helis-disli-recete-z${result.z}.pdf`);
  };

  return (
    <CalculatorLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
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
              Helisel Dişli Üretim Reçetesi
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
              <p className="text-white font-mono">{result.alphaDeg.toFixed(2)}°</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Helis Açısı (β)</p>
              <p className="text-white font-mono">{result.betaDeg.toFixed(2)}°</p>
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
              <p className="text-xs text-slate-400">Wk (k={result.kFloor})</p>
              <p className="text-white font-mono">{result.wkFloor.toFixed(4)} mm</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Wk (k={result.kCeil})</p>
              <p className="text-white font-mono">{result.wkCeil.toFixed(4)} mm</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Taksimat Oranı</p>
              <p className="text-white font-mono">
                {result.taksimatRatio.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Helis Çark Oranı</p>
              <p className="text-white font-mono">
                {result.helicalGearRatio.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        {/* Gear Combinations */}
        <div className="space-y-6">
          <GearCombinationsTable
            combinations={taksimatCombinations}
            title="Taksimat Çark Kombinasyonları"
          />
          <GearCombinationsTable
            combinations={helicalCombinations}
            title="Helis Çark Kombinasyonları"
          />
        </div>
      </div>
    </CalculatorLayout>
  );
}




