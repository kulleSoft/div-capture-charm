import { useState } from "react";
import { ChevronDown, ChevronUp, Type, KeyRound, MousePointerClick, CheckSquare, ToggleLeft, SlidersHorizontal, Copy, Check, Eye, Play, Search } from "lucide-react";

interface AndroidElement {
  class: string;
  id: string;
  text: string;
  description: string;
  position: string;
  clickable: boolean;
  editable: boolean;
  checkable: boolean;
}

const defaultElements: AndroidElement[] = [];


const getWidgetType = (className: string) => className.split(".").pop() || className;

const getIcon = (type: string) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "TextView":return <Type className={iconClass} />;
    case "EditText":return <KeyRound className={iconClass} />;
    case "Button":return <MousePointerClick className={iconClass} />;
    case "CheckBox":return <CheckSquare className={iconClass} />;
    case "Switch":return <ToggleLeft className={iconClass} />;
    case "SeekBar":return <SlidersHorizontal className={iconClass} />;
    default:return <Type className={iconClass} />;
  }
};

const exampleJson = `[{"class":"android.widget.Button","id":"btn","text":"OK","description":"","position":"100:200","clickable":true,"editable":false,"checkable":false}]`;

const Index = () => {
  const [elements, setElements] = useState<AndroidElement[]>(defaultElements);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState("");
  const [packageName, setPackageName] = useState("com.exemplo");

  const toggle = (i: number) =>
  setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  // Expõe função oculta no console: addElements([{...}])
  useState(() => {
    (window as any).addElements = (data: any) => {
      try {
        const arr = Array.isArray(data) ? data : [data];
        const valid = arr.every(
          (el: any) => typeof el.class === "string" && typeof el.position === "string"
        );
        if (!valid) {
          console.error("Cada item precisa ter pelo menos 'class' e 'position'.");
          return;
        }
        const normalized: AndroidElement[] = arr.map((el: any) => ({
          class: String(el.class || ""),
          id: String(el.id || ""),
          text: String(el.text || ""),
          description: String(el.description || ""),
          position: String(el.position || ""),
          clickable: Boolean(el.clickable),
          editable: Boolean(el.editable),
          checkable: Boolean(el.checkable)
        }));
        setElements((prev) => [...prev, ...normalized]);
        console.log(`✅ ${normalized.length} elemento(s) adicionado(s)`);
      } catch {
        console.error("JSON inválido.");
      }
    };
    (window as any).clearElements = () => {
      setElements([]);
      console.log("✅ Lista limpa");
    };
    (window as any).setPackage = (name: string) => {
      setPackageName(String(name));
      console.log(`✅ Pacote definido: ${name}`);
    };
    console.log("🔧 Comandos disponíveis:");
    console.log("  addElements([{class, id, text, description, position, clickable, editable, checkable}])");
    console.log("  clearElements()");
    console.log("  setPackage('com.exemplo.app')");
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        


        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por texto, ID ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => console.log("🔄 Botão Atualizar UI pressionado")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Atualizar UI
          </button>
        </div>

        <PackageCard packageName={packageName} />

        <ul className="space-y-3">
          {elements.filter((el) => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            const type = getWidgetType(el.class).toLowerCase();
            return el.text.toLowerCase().includes(q) || el.id.toLowerCase().includes(q) || el.description.toLowerCase().includes(q) || type.includes(q);
          }).map((el, i) => {
            const type = getWidgetType(el.class);
            const isOpen = !!expanded[i];
            return (
              <li key={i} className="rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left">

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {getIcon(type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">
                      {el.text || <span className="italic text-muted-foreground">(sem texto)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{type}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); console.log(`👁 Visualizar posição@@ ${el.position}`); }}
                    className="flex h-7 shrink-0 items-center px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Visualizar
                  </button>
                  <span className="text-muted-foreground">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen &&
                <div className="border-t px-4 py-3 text-sm space-y-2 bg-muted/40 rounded-b-lg animate-accordion-down">
                    <DetailRow label="Classe" value={el.class} />
                    <DetailRow label="ID" value={el.id || "—"} />
                    <DetailRow label="Texto" value={el.text || "—"} />
                    <DetailRow label="Descrição" value={el.description || "—"} />
                    <DetailRow label="Posição" value={el.position} />
                    <DetailRow label="Clicável" value={el.clickable ? "Sim" : "Não"} />
                    <DetailRow label="Editável" value={el.editable ? "Sim" : "Não"} />
                    <DetailRow label="Marcável" value={el.checkable ? "Sim" : "Não"} />
                  </div>
                }
              </li>);

          })}
        </ul>
      </div>
    </div>);

};

const fallbackCopy = (text: string, onSuccess: () => void) => {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand("copy"); onSuccess(); } catch { /* ignore */ }
  document.body.removeChild(ta);
};

const PackageCard = ({ packageName }: { packageName: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const onSuccess = () => { setCopied(true); setTimeout(() => setCopied(false), 1500); };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(packageName).then(onSuccess).catch(() => fallbackCopy(packageName, onSuccess));
    } else {
      fallbackCopy(packageName, onSuccess);
    }
  };
  return (
    <div className="mb-3 rounded-lg border bg-card px-4 py-3 shadow-sm flex items-center gap-2">
      <p className="text-sm text-muted-foreground flex-1 min-w-0">Pacote app: <span className="font-semibold text-card-foreground truncate inline-block max-w-[60%] align-bottom">{packageName}</span></p>
      <button onClick={() => console.log(`🔧 Usar@@ Pacote = ${packageName}`)} className="flex h-7 shrink-0 items-center px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        Usar
      </button>
      <button onClick={() => { console.log(`📋 Copiar@@ Pacote = ${packageName}`); handleCopy(); }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const onSuccess = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(onSuccess).catch(() => fallbackCopy(value, onSuccess));
    } else {
      fallbackCopy(value, onSuccess);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="text-card-foreground break-all flex-1">{value}</span>
      <button onClick={() => console.log(`🔧 Usar@@ ${label} = ${value}`)} className="flex h-7 shrink-0 items-center px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        Usar
      </button>
      <button onClick={() => { console.log(`📋 Copiar@@ ${label} = ${value}`); handleCopy(); }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

export default Index;
