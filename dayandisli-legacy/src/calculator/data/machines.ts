// Machine data for DAYAN CALCULATOR
//
// Ported from the native Android app's Machines.kt: same ids, names, descriptions
// and order. Availability (`available`) mirrors Android's MachinesScreen.kt
// `supportedMachineIds` set (kucuk-azdirma, reishauer-taslama) -- every other
// machine has no working calculator yet and must render as a disabled
// "Henüz Hazır Değil" card rather than a dead link.
//
// `reishauerFlow: true` marks reishauer-taslama as routing straight to the
// dedicated Reishauer form/receipt flow (ReishauerForm.tsx/ReishauerReceipt.tsx)
// instead of the generic Spur/Helical picker in MachineDetail.tsx, mirroring
// CalculatorNavHost.kt's onHelical special-case for Destinations.REISHAUER_MACHINE_ID.

export interface Machine {
  id: string;
  name: string;
  description: string;
  icon?: string;
  /** Whether this machine has at least one working calculator. Matches Android's
   * MachinesScreen.kt `supportedMachineIds`. */
  available: boolean;
  /** True only for reishauer-taslama: its Helis Dişli operation card routes to the
   * dedicated Reishauer form instead of the generic Helical form, and its Düz Dişli
   * card is force-disabled ("Henüz Hazır Değil") -- mirrors CalculatorNavHost.kt's
   * onHelical special-case and MachineDetailScreen's spurAvailable=false for
   * Destinations.REISHAUER_MACHINE_ID. The machine detail (gear-type selection)
   * screen is still shown first, exactly like every other machine. */
  reishauerFlow?: boolean;
}

export const MACHINES: Machine[] = [
  {
    id: "kucuk-azdirma",
    name: "Küçük Azdırma",
    description: "Küçük modüllü dişliler için azdırma makinesi",
    available: true,
  },
  {
    id: "reishauer-taslama",
    name: "REISHAUER Taşlama",
    description: "Yüksek hassasiyetli profil taşlama makinesi",
    available: true,
    reishauerFlow: true,
  },
  {
    id: "yatay-azdirma",
    name: "Yatay Azdırma",
    description: "Yatay tip azdırma makinesi",
    available: false,
  },
  {
    id: "fellows-lorenz-snj5",
    name: "Fellows Makinesi Lorenz SNJ5",
    description: "Lorenz SNJ5 model Fellows makinesi",
    available: false,
  },
  {
    id: "pfauter-p403",
    name: "Azdırma Makinesi Pfauter P403",
    description: "Pfauter P403 model azdırma makinesi",
    available: false,
  },
  {
    id: "fellows-lorenz-s71",
    name: "Fellows Makinesi Lorenz S71",
    description: "Lorenz S71 model Fellows makinesi",
    available: false,
  },
  {
    id: "azdirma-genel",
    name: "Azdırma (Genel)",
    description: "Genel amaçlı azdırma makinesi",
    available: false,
  },
  {
    id: "torna-tezgahi",
    name: "Torna Tezgahı",
    description: "Dişli tornalama işlemleri için torna tezgahı",
    available: false,
  },
  {
    id: "silindirik-taslama",
    name: "Silindirik Taşlama Makinesi",
    description: "Silindirik yüzey taşlama makinesi",
    available: false,
  },
  {
    id: "gleason",
    name: "Gleason Makinesi",
    description: "Konik dişli üretimi için Gleason makinesi",
    available: false,
  },
  {
    id: "hurth",
    name: "Hurth Makinesi",
    description: "Hurth marka dişli makinesi",
    available: false,
  },
  {
    id: "liebherr",
    name: "Liebherr Makinesi",
    description: "Liebherr marka hassas dişli makinesi",
    available: false,
  },
];

export function getMachineById(id: string): Machine | undefined {
  return MACHINES.find((m) => m.id === id);
}

/** Real machine photography, ported from the Android app's res/drawable/machine_*.jpg assets
 * (see MachinesScreen.kt's machinePhotoRes()) into public/calculator/machines/. Machines without
 * a source photo fall back to an icon badge in MachineSelection.tsx, exactly like Android's
 * `machinePhotoRes` returning null for ids outside its documented set (currently none -- Gleason
 * is the last one covered by Android's own photo set; Hurth/Liebherr have no photo either side). */
export function machinePhotoUrl(machineId: string): string | null {
  const known: Record<string, string> = {
    "kucuk-azdirma": "kucuk_azdirma",
    "reishauer-taslama": "reishauer_taslama",
    "yatay-azdirma": "yatay_azdirma",
    "fellows-lorenz-snj5": "fellows_lorenz_snj5",
    "pfauter-p403": "pfauter_p403",
    "fellows-lorenz-s71": "fellows_lorenz_s71",
    "azdirma-genel": "azdirma_genel",
    "torna-tezgahi": "torna_tezgahi",
    "silindirik-taslama": "silindirik_taslama",
    gleason: "gleason",
  };
  const file = known[machineId];
  return file ? `/calculator/machines/${file}.jpg` : null;
}
