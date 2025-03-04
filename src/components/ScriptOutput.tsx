
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Download, CheckCircle2 } from "lucide-react";
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

  return (
    <Card className="w-full mt-6 border border-gray-100 dark:border-gray-800 animate-slide-up shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Seu Roteiro de Vídeo</CardTitle>
        <CardDescription>Pronto para ser usado no seu próximo vídeo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end space-x-2 mb-4">
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
        </div>
        <div 
          ref={scriptRef}
          className="relative p-4 rounded-md bg-gray-50 dark:bg-gray-900 text-sm overflow-auto max-h-[500px]"
        >
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formatScript(script) }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptOutput;
