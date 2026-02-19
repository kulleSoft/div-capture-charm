import { useState } from "react";
import { ChevronDown, ChevronUp, Type, KeyRound, MousePointerClick, CheckSquare, ToggleLeft, SlidersHorizontal, Copy, Check } from "lucide-react";

interface AndroidElement {
  class: string;
  id: string;
  text: string;
  description: string;
  bounds: string;
}

const defaultElements: AndroidElement[] = [
{ class: "android.widget.TextView", id: "", text: "teste", description: "", bounds: "[24,57][91,98]" },
{ class: "android.widget.EditText", id: "com.kulle:id/edit", text: "senha", description: "", bounds: "[233,380][306,429]" },
{ class: "android.widget.Button", id: "com.kulle:id/btn", text: "PRESSIONE", description: "", bounds: "[204,429][336,501]" },
{ class: "android.widget.TextView", id: "com.kulle:id/text", text: "Brasil é nosso 2026", description: "", bounds: "[181,501][359,550]" },
{ class: "android.widget.CheckBox", id: "com.kulle:id/checkbox", text: "marcar", description: "", bounds: "[205,550][334,599]" },
{ class: "android.widget.Switch", id: "com.kulle:id/switch1", text: "Switch", description: "", bounds: "[196,599][344,648]" },
{ class: "android.widget.SeekBar", id: "com.kulle:id/seekbar1", text: "", description: "", bounds: "[12,648][528,699]" }];


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

const exampleJson = `[{"class":"android.widget.Button","id":"com.app:id/ok","text":"OK","description":"","bounds":"[0,0][100,50]"}]`;

const Index = () => {
  const [elements, setElements] = useState<AndroidElement[]>(defaultElements);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggle = (i: number) =>
  setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  // Expõe função oculta no console: addElements([{...}])
  useState(() => {
    (window as any).addElements = (data: any) => {
      try {
        const arr = Array.isArray(data) ? data : [data];
        const valid = arr.every(
          (el: any) => typeof el.class === "string" && typeof el.bounds === "string"
        );
        if (!valid) {
          console.error("Cada item precisa ter pelo menos 'class' e 'bounds'.");
          return;
        }
        const normalized: AndroidElement[] = arr.map((el: any) => ({
          class: String(el.class || ""),
          id: String(el.id || ""),
          text: String(el.text || ""),
          description: String(el.description || ""),
          bounds: String(el.bounds || "")
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
    console.log("🔧 Comandos disponíveis:");
    console.log("  addElements([{class, id, text, description, bounds}])");
    console.log("  clearElements()");
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        


        <p className="mb-3 text-sm text-muted-foreground">{elements.length} elemento(s)</p>

        <ul className="space-y-3">
          {elements.map((el, i) => {
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
                  <CopyButton el={el} />
                  <span className="text-muted-foreground">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen &&
                <div className="border-t px-4 py-3 text-sm space-y-2 bg-muted/40 rounded-b-lg animate-accordion-down">
                    <Detail label="Classe" value={el.class} />
                    <Detail label="ID" value={el.id || "—"} />
                    <Detail label="Texto" value={el.text || "—"} />
                    <Detail label="Descrição" value={el.description || "—"} />
                    <Detail label="Bounds" value={el.bounds} />
                  </div>
                }
              </li>);

          })}
        </ul>
      </div>
    </div>);

};

const Detail = ({ label, value }: {label: string;value: string;}) =>
<div className="flex gap-2">
    <span className="font-medium text-muted-foreground w-20 shrink-0">{label}</span>
    <span className="text-card-foreground break-all">{value}</span>
  </div>;

const CopyButton = ({ el }: { el: AndroidElement }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const text = `Classe: ${el.class}\nID: ${el.id || "—"}\nTexto: ${el.text || "—"}\nDescrição: ${el.description || "—"}\nBounds: ${el.bounds}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={(e) => { e.stopPropagation(); handleCopy(); }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

export default Index;