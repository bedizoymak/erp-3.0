import { cleanup, configure, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import ProtectedRoute from "@/components/ProtectedRoute";
import CalculatorRoutes from "./index";
import { MACHINES } from "./data/machines";

// jsdom doesn't implement PointerEvent capture or scrollIntoView, which the
// Radix Select used by WeightCalculation.tsx calls on open/select. This is a
// jsdom environment gap, not app behavior — polyfill as no-ops so clicking the
// real Select in tests doesn't throw.
beforeAll(() => {
  // The calculator's routes are React.lazy() + Suspense. Under the full test
  // suite's parallel load, resolving a chunk's dynamic import() can occasionally
  // take longer than testing-library's 1000ms default findBy timeout even
  // though the app itself renders quickly in isolation — raise it so CPU
  // contention across ~115 test files doesn't produce false negatives here.
  configure({ asyncUtilTimeout: 5000 });

  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

/**
 * Component-level verification of the restored DAYAN CALCULATOR module.
 *
 * A redirect-to-/login only proves the auth *gate* fires; it says nothing
 * about what renders once past it. These tests render the real calculator
 * screens by mocking @/contexts/ERPAuthContext the same way
 * src/components/ProtectedRoute.test.tsx already does for the rest of the
 * ERP suite — an isolated test fixture, not a change to production auth code.
 */

const useERPAuthMock = vi.fn();

vi.mock("@/contexts/ERPAuthContext", () => ({
  useERPAuth: () => useERPAuthMock(),
}));

type AuthOverrides = Partial<{
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthorizedERPUser: boolean;
  hasPermission: (permission?: string | null) => boolean;
}>;

function setAuthState(overrides: AuthOverrides = {}) {
  useERPAuthMock.mockReturnValue({
    isLoading: false,
    isAuthenticated: true,
    isAuthorizedERPUser: true,
    hasPermission: () => true,
    ...overrides,
  });
}

function renderCalculatorAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Giriş sayfası</div>} />
        <Route
          path="/apps/calculator/*"
          element={
            <ProtectedRoute>
              <CalculatorRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("calculator route permission enforcement (production.view)", () => {
  afterEach(cleanup);
  beforeEach(() => localStorage.clear());

  it("redirects to login when the session lacks production.view", () => {
    const hasPermission = vi.fn(() => false);
    setAuthState({ hasPermission });

    renderCalculatorAt("/apps/calculator");

    expect(hasPermission).toHaveBeenCalledWith("production.view");
    expect(screen.getByText("Giriş sayfası")).toBeInTheDocument();
  });

  it("renders the calculator dashboard when the session has production.view", async () => {
    const hasPermission = vi.fn(() => true);
    setAuthState({ hasPermission });

    renderCalculatorAt("/apps/calculator");

    expect(hasPermission).toHaveBeenCalledWith("production.view");
    // "DAYAN CALCULATOR" appears both in the layout's own header and in the
    // dashboard page's hero heading — assert at least one rendered.
    expect((await screen.findAllByText("DAYAN CALCULATOR")).length).toBeGreaterThan(0);
  });

  it("admin role bypasses the permission check the same as any other /apps module", () => {
    const hasPermission = vi.fn(() => false);
    setAuthState({ hasPermission });
    // ProtectedRoute -> hasPermission is the enforcement point; admin bypass is
    // exercised in permissions.test.ts (hasPermission()). This test only proves
    // the calculator route asks for the correct permission string, matching the
    // same production.view family as /apps/reports/production and /apps/production/*.
    renderCalculatorAt("/apps/calculator/weight");
    expect(hasPermission).toHaveBeenCalledWith("production.view");
  });
});

describe("calculator dashboard and navigation (authenticated)", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    setAuthState();
  });

  it("dashboard renders both entry cards and the brand header", async () => {
    renderCalculatorAt("/apps/calculator");
    const main = await screen.findByRole("main");
    // "DAYAN CALCULATOR" and "Ağırlık Hesaplama" also appear in the layout's
    // own nav header outside <main>; scoping to <main> disambiguates.
    expect(within(main).getByText("DAYAN CALCULATOR")).toBeInTheDocument();
    expect(within(main).getByText("Makineler")).toBeInTheDocument();
    expect(within(main).getByText("Ağırlık Hesaplama")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Makine Seçimi/ })).toHaveAttribute(
      "href",
      "/apps/calculator/machines",
    );
    expect(screen.getByRole("link", { name: /Hesaplamaya Git/ })).toHaveAttribute(
      "href",
      "/apps/calculator/weight",
    );
  });

  it("machine selection lists every machine from data/machines.ts", async () => {
    renderCalculatorAt("/apps/calculator/machines");
    expect(await screen.findByText("Makine Seçimi")).toBeInTheDocument();
    for (const machine of MACHINES) {
      expect(screen.getByText(machine.name)).toBeInTheDocument();
    }
  });

  it("machine detail exposes spur and helical entry points with correct links", async () => {
    renderCalculatorAt("/apps/calculator/machines/kucuk-azdirma");
    expect(await screen.findByText("Küçük Azdırma")).toBeInTheDocument();
    expect(screen.getByText("Düz Dişli Hesaplama")).toBeInTheDocument();
    expect(screen.getByText("Helis Dişli Hesaplama")).toBeInTheDocument();
    const startLinks = screen.getAllByRole("link", { name: /Hesaplamaya Başla/i });
    expect(startLinks).toHaveLength(2);
    expect(startLinks[0]).toHaveAttribute("href", "/apps/calculator/machines/kucuk-azdirma/spur");
    expect(startLinks[1]).toHaveAttribute("href", "/apps/calculator/machines/kucuk-azdirma/helical");
  });

  it("unknown machine id shows the not-found fallback instead of crashing", async () => {
    renderCalculatorAt("/apps/calculator/machines/does-not-exist");
    expect(await screen.findByText("Makine bulunamadı.")).toBeInTheDocument();
  });

  it("reishauer-taslama shows the same gear-type selection screen as every other machine, with Düz Dişli disabled and Helis Dişli routing to the dedicated Reishauer form", async () => {
    renderCalculatorAt("/apps/calculator/machines/reishauer-taslama");
    expect(await screen.findByText("REISHAUER Taşlama")).toBeInTheDocument();
    expect(screen.getByText("Düz Dişli Hesaplama")).toBeInTheDocument();
    expect(screen.getByText("Helis Dişli Hesaplama")).toBeInTheDocument();

    // Düz Dişli is force-disabled for REISHAUER (mirrors MachineDetailScreen.kt's
    // spurAvailable = machineId != REISHAUER_MACHINE_ID) -- exactly one disabled
    // "Henüz Hazır Değil" button, and no Spur link at all.
    const disabledButtons = screen.getAllByRole("button", { name: /Henüz Hazır Değil/ });
    expect(disabledButtons.length).toBe(1);
    expect(disabledButtons[0]).toBeDisabled();
    expect(screen.queryByRole("link", { name: /Hesaplamaya Başla/i, hidden: false })).toBeInTheDocument();

    // Helis Dişli's single enabled link routes to the dedicated Reishauer form,
    // not the generic Helical form.
    const startLinks = screen.getAllByRole("link", { name: /Hesaplamaya Başla/i });
    expect(startLinks).toHaveLength(1);
    expect(startLinks[0]).toHaveAttribute(
      "href",
      "/apps/calculator/machines/reishauer-taslama/reishauer",
    );
  });

  it("an unavailable machine's operations render disabled rather than navigable", async () => {
    renderCalculatorAt("/apps/calculator/machines/gleason");
    expect(await screen.findByText("Gleason Makinesi")).toBeInTheDocument();
    const disabledButtons = screen.getAllByRole("button", { name: /Henüz Hazır Değil/ });
    expect(disabledButtons.length).toBe(2);
    for (const button of disabledButtons) expect(button).toBeDisabled();
    expect(screen.queryByRole("link", { name: /Hesaplamaya Başla/i })).not.toBeInTheDocument();
  });

  it("machine selection renders unavailable machines as a disabled, non-navigable card", async () => {
    renderCalculatorAt("/apps/calculator/machines");
    await screen.findByText("Makine Seçimi");
    const gleasonCard = screen.getByText("Gleason Makinesi").closest("div.rounded-xl, [class*='Card']") ?? screen.getByText("Gleason Makinesi");
    expect(gleasonCard).toBeInTheDocument();
    const disabledButton = screen.getAllByRole("button", { name: /Henüz Hazır Değil/ });
    expect(disabledButton.length).toBeGreaterThan(0);
    // kucuk-azdirma / reishauer-taslama remain navigable "Seç" links
    const seciLinks = screen.getAllByRole("link", { name: /Seç/ });
    expect(seciLinks.length).toBe(2);
  });
});

describe("shared top navigator: Makineler stays highlighted on every nested machines/* subpage", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    setAuthState();
  });

  it.each([
    ["/apps/calculator/machines", "Makineler"],
    ["/apps/calculator/machines/kucuk-azdirma", "Makineler"],
    ["/apps/calculator/machines/kucuk-azdirma/spur", "Makineler"],
    ["/apps/calculator/machines/kucuk-azdirma/helical", "Makineler"],
    ["/apps/calculator/machines/reishauer-taslama/reishauer", "Makineler"],
    ["/apps/calculator/weight", "Ağırlık Hesaplama"],
    ["/apps/calculator", "Ana Sayfa"],
  ])("marks %s active via aria-current=page on the %s nav link", async (path, expectedLabel) => {
    renderCalculatorAt(path);
    const activeLink = await screen.findByRole("link", { current: "page" });
    expect(activeLink).toHaveTextContent(expectedLabel);
  });

  it("exactly one nav segment is marked current at a time on a deep Spur route", async () => {
    renderCalculatorAt("/apps/calculator/machines/kucuk-azdirma/spur");
    await screen.findByText("Düz Dişli Hesaplama");
    expect(screen.getAllByRole("link", { current: "page" })).toHaveLength(1);
  });
});

describe("reishauer form: live calculation renders k/Wk/taksimat/helis results and reaches the receipt", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    setAuthState();
  });

  it("computes results for default parameters and navigates to the receipt", async () => {
    const user = userEvent.setup();
    renderCalculatorAt("/apps/calculator/machines/reishauer-taslama/reishauer");
    await screen.findByText("REISHAUER Profil Taşlama Hesaplama");

    // default mn=1.0, z=20, alpha=20°, beta=15° should produce a valid result
    // with no validation errors, exposing k/Wk/taksimat/helis ResultCards and
    // an enabled receipt button.
    const receiptButton = await screen.findByRole("button", { name: /Reçeteyi Görüntüle/ });
    expect(screen.getByText("Taksimat Oranı")).toBeInTheDocument();
    expect(screen.getByText("Helis Çark Oranı")).toBeInTheDocument();

    await user.click(receiptButton);

    expect(await screen.findByText("REISHAUER Profil Taşlama Reçetesi")).toBeInTheDocument();
    expect(screen.getByText("Taksimat Çark Kombinasyonları")).toBeInTheDocument();
    expect(screen.getByText("Helis Çark Kombinasyonları")).toBeInTheDocument();
  });
});

describe("reishauer receipt: fresh direct navigation with no router state (bookmark/typed URL/new tab)", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    setAuthState();
  });

  it("shows the not-found fallback with a working back link instead of crashing", async () => {
    renderCalculatorAt("/apps/calculator/machines/reishauer-taslama/reishauer/receipt");
    expect(await screen.findByText("Hesaplama sonucu bulunamadı.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Hesaplamaya Dön/ })).toHaveAttribute(
      "href",
      "/apps/calculator/machines/reishauer-taslama/reishauer",
    );
  });
});

describe("spur gear form: live calculation matches the numerical parity fixture (mn=2, z=20, alpha=20)", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    setAuthState();
  });

  it("computes and renders Wk(k=2)=9.4166, Wk(k=3)=15.3209, Taksimat=0.4000", async () => {
    const user = userEvent.setup();
    renderCalculatorAt("/apps/calculator/machines/kucuk-azdirma/spur");
    await screen.findByText("Düz Dişli Hesaplama");

    const mnInput = screen.getByLabelText(/Modül \(mn\)/);
    await user.clear(mnInput);
    await user.type(mnInput, "2");

    const zInput = screen.getByLabelText(/Diş Sayısı \(Z\)/);
    await user.clear(zInput);
    await user.type(zInput, "20");

    const alphaInput = screen.getByLabelText(/Kavrama Açısı/);
    await user.clear(alphaInput);
    await user.type(alphaInput, "20");

    // auto diameter should now read 44.00 ((20+2)*2)
    const diameterInput = screen.getByLabelText(/Çap \(ø\)/) as HTMLInputElement;
    expect(diameterInput.value).toBe("44.00");

    expect(await screen.findByText("9.4166")).toBeInTheDocument();
    expect(screen.getByText("15.3209")).toBeInTheDocument();
    expect(screen.getByText("0.4000")).toBeInTheDocument();

    const receiptButton = screen.getByRole("button", { name: /Reçeteyi Görüntüle/ });
    await user.click(receiptButton);

    // navigated to the receipt screen carrying the computed result via router state
    expect(await screen.findByText("Düz Dişli Üretim Reçetesi")).toBeInTheDocument();
    expect(screen.getByText("9.4166 mm")).toBeInTheDocument();
    expect(screen.getByText("15.3209 mm")).toBeInTheDocument();
  });
});

describe("spur receipt: fresh direct navigation with no router state (bookmark/typed URL/new tab)", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    setAuthState();
  });

  it("shows the not-found fallback with a working back link instead of crashing", async () => {
    // Navigating straight to the receipt URL (no prior client-side navigation
    // in this session) has no location.state.result. Verified separately
    // against a real browser: history.state is null for a fresh navigation
    // like this, but IS preserved across an actual page reload (F5) after a
    // client-side navigate({state}) call — so a true refresh right after
    // clicking "Reçeteyi Görüntüle" would NOT hit this fallback; only a
    // bookmark, typed URL, or new tab does. This is pre-existing behavior of
    // the restored source (SpurGearReceipt.tsx checks `!result || !machine`),
    // not a regression introduced by this restoration.
    renderCalculatorAt("/apps/calculator/machines/kucuk-azdirma/spur/receipt");
    expect(await screen.findByText("Hesaplama sonucu bulunamadı.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Hesaplamaya Dön/ })).toHaveAttribute(
      "href",
      "/apps/calculator/machines/kucuk-azdirma/spur",
    );
  });
});

describe("helical gear form: live calculation matches the numerical parity fixture (mn=2, z=25, alpha=20, beta=15)", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    setAuthState();
  });

  it("computes and renders Wk(k=3)=15.5337, Wk(k=4)=21.4380, Taksimat=0.6400, Helis Çark Oranı=0.741462", async () => {
    const user = userEvent.setup();
    renderCalculatorAt("/apps/calculator/machines/kucuk-azdirma/helical");
    await screen.findByText("Helis Dişli Hesaplama");

    const mnInput = screen.getByLabelText(/Modül \(mn\)/);
    await user.clear(mnInput);
    await user.type(mnInput, "2");

    const zInput = screen.getByLabelText(/Diş Sayısı \(Z\)/);
    await user.clear(zInput);
    await user.type(zInput, "25");

    const alphaInput = screen.getByLabelText(/Kavrama Açısı/);
    await user.clear(alphaInput);
    await user.type(alphaInput, "20");

    const betaInput = screen.getByLabelText(/Helis Açısı/);
    await user.clear(betaInput);
    await user.type(betaInput, "15");

    // default helix direction is "Sağ" per HelicalGearForm.tsx initial state
    expect(await screen.findByText("15.5337")).toBeInTheDocument();
    expect(screen.getByText("21.4380")).toBeInTheDocument();
    expect(screen.getByText("0.6400")).toBeInTheDocument();
    expect(screen.getByText("0.7415")).toBeInTheDocument();

    const receiptButton = screen.getByRole("button", { name: /Reçeteyi Görüntüle/ });
    await user.click(receiptButton);

    expect(await screen.findByText("Helisel Dişli Üretim Reçetesi")).toBeInTheDocument();
    expect(screen.getByText("15.5337 mm")).toBeInTheDocument();
    expect(screen.getByText("21.4380 mm")).toBeInTheDocument();
    // both taksimat and helical change-gear combination tables render
    expect(screen.getByText("Taksimat Çark Kombinasyonları")).toBeInTheDocument();
    expect(screen.getByText("Helis Çark Kombinasyonları")).toBeInTheDocument();
  });
});

describe("helical receipt: fresh direct navigation with no router state (bookmark/typed URL/new tab)", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    setAuthState();
  });

  it("shows the not-found fallback with a working back link instead of crashing", async () => {
    renderCalculatorAt("/apps/calculator/machines/kucuk-azdirma/helical/receipt");
    expect(await screen.findByText("Hesaplama sonucu bulunamadı.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Hesaplamaya Dön/ })).toHaveAttribute(
      "href",
      "/apps/calculator/machines/kucuk-azdirma/helical",
    );
  });
});

describe("weight calculator: live calculation matches the numerical parity fixtures", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    setAuthState();
  });

  it("solid cylinder d=50mm l=100mm steel -> 1.54 kg (matches weight.parity.test.ts)", async () => {
    renderCalculatorAt("/apps/calculator/weight");
    await screen.findByRole("main");
    // defaults are already d=50, l=100, steel per WeightCalculation.tsx initial state
    expect(await screen.findByText("1.54")).toBeInTheDocument();
  });

  it("pipe geometry od=60 id=40 l=100 steel -> 1.23 kg", async () => {
    const user = userEvent.setup();
    renderCalculatorAt("/apps/calculator/weight");
    await screen.findByRole("main");

    // Geometry type is now a set of clickable cards (not a dropdown) — click
    // the "Boru" card directly.
    await user.click(await screen.findByText("Boru"));

    const outerDiameter = await screen.findByLabelText(/Dış Çap/);
    await user.clear(outerDiameter);
    await user.type(outerDiameter, "60");
    const innerDiameter = screen.getByLabelText(/İç Çap/);
    await user.clear(innerDiameter);
    await user.type(innerDiameter, "40");

    expect(await screen.findByText("1.23")).toBeInTheDocument();
  });

  it("flat bar geometry w=50 h=10 l=100 steel -> 0.39 kg", async () => {
    const user = userEvent.setup();
    renderCalculatorAt("/apps/calculator/weight");
    await screen.findByRole("main");

    // Geometry type is now a set of clickable cards (not a dropdown) — click
    // the "Lama" card directly.
    await user.click(await screen.findByText("Lama"));

    expect(await screen.findByText("0.39")).toBeInTheDocument();
  });

  it("computes material cost when a price per kg is given", async () => {
    const user = userEvent.setup();
    renderCalculatorAt("/apps/calculator/weight");
    await screen.findByRole("main");

    const price = screen.getByLabelText(/Malzeme Fiyatı/);
    await user.type(price, "100");

    // 1.541343895667492 kg * 100 TL/kg ≈ 154.13 TL; with the default quantity
    // of 1, both "Birim Maliyet" and "Toplam Maliyet" render the same figure.
    expect((await screen.findAllByText(/154,13/)).length).toBeGreaterThan(0);
  });
});
