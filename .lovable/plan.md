

## Plano: Adicionar botões "Visualizar" e "Usar" ao lado do botão "Copiar"

### O que será feito

No componente `DetailRow`, onde atualmente existe apenas o botão de copiar (icone de copia), serão adicionados mais dois botões:

1. **Visualizar** (icone de olho) - executa `console.log("👁 Visualizar: [label] = [value]")`
2. **Usar** (icone de play/pointer) - executa `console.log("🔧 Usar: [label] = [value]")`
3. **Copiar** (já existente) - mantém o comportamento atual + adiciona `console.log("📋 Copiar: [label] = [value]")`

### Detalhes técnicos

- **Arquivo**: `src/pages/Index.tsx`
- **Componente**: `DetailRow`
- **Icones**: Importar `Eye` e `Play` do `lucide-react`
- Os três botões ficarão lado a lado na mesma área onde está o botão de copiar atual
- Todos os botões terão o mesmo estilo visual (7x7, arredondado, hover em primary)
- Cada botão terá um `console.log` com informações do label e valor do campo

