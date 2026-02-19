import { useState } from "react";
import { ChevronDown, ChevronUp, Type, KeyRound, MousePointerClick, CheckSquare, ToggleLeft, SlidersHorizontal, Plus, X, Code } from "lucide-react";

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
  { class: "android.widget.SeekBar", id: "com.kulle:id/seekbar1", text: "", description: "", bounds: "[12,648][528,699]" },
];

const getWidgetType = (className: string) => className.split(".").pop() || className;

const getIcon = (type: string) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "TextView": return <Type className={iconClass} />;
    case "EditText": return <KeyRound className={iconClass} />;
    case "Button": return <MousePointerClick className={iconClass} />;
    case "CheckBox": return <CheckSquare className={iconClass} />;
    case "Switch": return <ToggleLeft className={iconClass} />;
    case "SeekBar": return <SlidersHorizontal className={iconClass} />;
    default: return <Type className={iconClass} />;
  }
};

const exampleJson = `[{"class":"android.widget.Button","id":"com.app:id/ok","text":"OK","description":"","bounds":"[0,0][100,50]"}]`;

const Index = () => {
  const [elements, setElements] = useState<AndroidElement[]>(defaultElements);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");

  const toggle = (i: number) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  const handleAddJson = () => {
    setError("");
    try {
      const parsed = JSON.parse(jsonText);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const valid = arr.every(
        (el: any) => typeof el.class === "string" && typeof el.bounds === "string"
      );
      if (!valid) {
        setError("Cada item precisa ter pelo menos 'class' e 'bounds'.");
        return;
      }
      const normalized: AndroidElement[] = arr.map((el: any) => ({
        class: String(el.class || ""),
        id: String(el.id || ""),
        text: String(el.text || ""),
        description: String(el.description || ""),
        bounds: String(el.bounds || ""),
      }));
      setElements((prev) => [...prev, ...normalized]);
      setJsonText("");
      setShowJsonInput(false);
    } catch {
      setError("JSON inválido. Verifique a formatação.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Elementos Android
          </h1>
          <button
            onClick={() => setShowJsonInput((v) => !v)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showJsonInput ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showJsonInput ? "Fechar" : "Adicionar JSON"}
          </button>
        </div>

        {showJsonInput && (
          <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm animate-accordion-down">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Code className="w-4 h-4" />
              Cole o JSON dos elementos abaixo
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => { setJsonText(e.target.value); setError(""); }}
              placeholder={exampleJson}
              rows={5}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
            />
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
            <button
              onClick={handleAddJson}
              disabled={!jsonText.trim()}
              className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Carregar na Lista
            </button>
          </div>
        )}

        <p className="mb-3 text-sm text-muted-foreground">{elements.length} elemento(s)</p>

        <ul className="space-y-3">
          {elements.map((el, i) => {
            const type = getWidgetType(el.class);
            const isOpen = !!expanded[i];
            return (
              <li key={i} className="rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {getIcon(type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">
                      {el.text || <span className="italic text-muted-foreground">(sem texto)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{type}</p>
                  </div>
                  <span className="text-muted-foreground">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t px-4 py-3 text-sm space-y-2 bg-muted/40 rounded-b-lg animate-accordion-down">
                    <Detail label="Classe" value={el.class} />
                    <Detail label="ID" value={el.id || "—"} />
                    <Detail label="Texto" value={el.text || "—"} />
                    <Detail label="Descrição" value={el.description || "—"} />
                    <Detail label="Bounds" value={el.bounds} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2">
    <span className="font-medium text-muted-foreground w-20 shrink-0">{label}</span>
    <span className="text-card-foreground break-all">{value}</span>
  </div>
);

export default Index;
