
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Download, Download as DownloadIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ScriptOutputProps {
  script: string;
  isVisible: boolean;
}

const ScriptOutput: React.FC<ScriptOutputProps> = ({ script, isVisible }) => {
  const [copied, setCopied] = React.useState(false);
  const scriptRef = useRef<HTMLDivElement>(null);

  if (!isVisible || !script) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success("Roteiro copiado para a área de transferência");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([script], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "roteiro-video.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Roteiro baixado com sucesso");
  };

  const handleDownloadTemplate = () => {
    const templateContent = `TÍTULO DO PROJETO
ROTEIRO v.1 / SUA EMPRESA / DURAÇÃO ESTIMADA

---------------------------------------------------

CENA | ÁUDIO (locução off) | IMAGEM (ilustração / animação)
-----|-------------------|---------------------------
1 | [Insira aqui o texto para a narração da cena 1] | [Descreva o que deve aparecer na tela durante a cena 1]
2 | [Insira aqui o texto para a narração da cena 2] | [Descreva o que deve aparecer na tela durante a cena 2]
3 | [Insira aqui o texto para a narração da cena 3] | [Descreva o que deve aparecer na tela durante a cena 3]
4 | [Insira aqui o texto para a narração da cena 4] | [Descreva o que deve aparecer na tela durante a cena 4]
5 | [Insira aqui o texto para a narração da cena 5] | [Descreva o que deve aparecer na tela durante a cena 5]

---------------------------------------------------

OBSERVAÇÕES ADICIONAIS:
- [Adicione notas sobre estilo visual]
- [Adicione notas sobre tom de narração]
- [Adicione outras instruções relevantes]`;

    const element = document.createElement("a");
    const file = new Blob([templateContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "modelo-roteiro.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Modelo de roteiro baixado com sucesso");
  };

  // Função para formatar o roteiro com estilo adequado
  const formatScript = (text: string) => {
    // Substitui [texto entre colchetes] com versão estilizada
    const styledText = text.replace(
      /\[(.*?)\]/g,
      '<span class="text-blue-500 font-medium">[$1]</span>'
    );

    // Torna os cabeçalhos de seção em negrito
    const withHeaders = styledText.replace(
      /(INTRODUÇÃO|CONTEÚDO PRINCIPAL|CONCLUSÃO|ENCERRAMENTO)([^\n]*)/gi,
      '<span class="font-bold text-primary">$1$2</span>'
    );

    return withHeaders;
  };

  const formatScriptAsTable = (text: string) => {
    try {
      // Verifica se o roteiro já parece estar no formato de tabela
      if (text.includes("CENA") && text.includes("ÁUDIO") && text.includes("IMAGEM")) {
        return formatScript(text);
      }
      
      // Caso contrário, tenta converter para um formato tabular
      const sections = text.split(/\n{2,}/g);
      let result = `<div class="overflow-x-auto">
        <table class="min-w-full border-collapse">
          <thead class="bg-primary/90 text-white">
            <tr>
              <th class="border px-4 py-2 text-left">CENA</th>
              <th class="border px-4 py-2 text-left">ÁUDIO (locução off)</th>
              <th class="border px-4 py-2 text-left">IMAGEM (ilustração / animação)</th>
            </tr>
          </thead>
          <tbody>`;
          
      // Tenta extrair seções numeradas para criar as linhas da tabela
      let sceneCount = 1;
      let foundScenes = false;
      
      for (const section of sections) {
        if (section.match(/INTRODUÇÃO|CONTEÚDO PRINCIPAL|CONCLUSÃO/i)) {
          // Extrai conteúdo de cada seção principal
          const lines = section.split('\n').filter(line => line.trim() !== '');
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Pula os cabeçalhos das seções
            if (line.match(/INTRODUÇÃO|CONTEÚDO PRINCIPAL|CONCLUSÃO/i)) continue;
            
            let audioText = line;
            let imageText = "[Visualização sugerida]";
            
            // Tenta extrair instruções visuais de colchetes
            const visualMatch = line.match(/\[(.*?)\]/g);
            if (visualMatch && visualMatch.length > 0) {
              imageText = visualMatch.join(' ');
              audioText = line.replace(/\[(.*?)\]/g, '').trim();
            }
            
            result += `
              <tr class="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="border px-4 py-2 bg-primary/10 font-bold text-center">${sceneCount}</td>
                <td class="border px-4 py-2">${audioText}</td>
                <td class="border px-4 py-2">${imageText}</td>
              </tr>`;
              
            sceneCount++;
            foundScenes = true;
          }
        }
      }
      
      if (!foundScenes) {
        // Se não encontrou seções estruturadas, divide o roteiro em parágrafos para criar cenas
        const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
        for (let i = 0; i < paragraphs.length; i++) {
          const paragraph = paragraphs[i];
          
          // Ignora linhas que parecem ser títulos
          if (paragraph.toUpperCase() === paragraph && paragraph.length < 30) continue;
          
          // Tenta extrair instruções visuais de colchetes
          let audioText = paragraph;
          let imageText = "[Visualização sugerida]";
          
          const visualMatch = paragraph.match(/\[(.*?)\]/g);
          if (visualMatch && visualMatch.length > 0) {
            imageText = visualMatch.join(' ');
            audioText = paragraph.replace(/\[(.*?)\]/g, '').trim();
          }
          
          result += `
            <tr class="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="border px-4 py-2 bg-primary/10 font-bold text-center">${sceneCount}</td>
              <td class="border px-4 py-2">${audioText}</td>
              <td class="border px-4 py-2">${imageText}</td>
            </tr>`;
            
          sceneCount++;
          foundScenes = true;
        }
      }
      
      result += `
          </tbody>
        </table>
      </div>`;
      
      if (!foundScenes) {
        // Se ainda não conseguiu estruturar, retorna o texto formatado normalmente
        return formatScript(text);
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao formatar como tabela:", error);
      // Em caso de erro, retorna o formato original
      return formatScript(text);
    }
  };

  return (
    <Card className="w-full mt-6 border border-gray-100 dark:border-gray-800 animate-slide-up shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Seu Roteiro de Vídeo</CardTitle>
        <CardDescription>Pronto para ser usado no seu próximo vídeo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-end gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center transition-all"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copiar
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center transition-all"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex items-center transition-all"
            onClick={handleDownloadTemplate}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Baixar Modelo de Tabela
          </Button>
        </div>
        <div 
          ref={scriptRef}
          className="relative p-4 rounded-md bg-gray-50 dark:bg-gray-900 text-sm overflow-auto max-h-[500px]"
        >
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formatScriptAsTable(script) }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptOutput;
