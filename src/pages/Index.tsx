
import React, { useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import ScriptForm from "@/components/ScriptForm";
import ScriptOutput from "@/components/ScriptOutput";
import { generateScript, GenerateScriptRequest } from "@/lib/gemini-api";

const Index = () => {
  const [scriptContent, setScriptContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleGenerateScript = async (data: GenerateScriptRequest) => {
    setIsLoading(true);
    try {
      const result = await generateScript(data);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      setScriptContent(result.script);
      setShowOutput(true);
      if (result.script) {
        toast.success("Your script has been generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate script. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        
        <div className="mt-8 space-y-6">
          <section className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Create Your Script</h2>
              <p className="text-muted-foreground">
                Fill in the form below to generate a professional video script tailored to your needs.
              </p>
            </div>
            
            <ScriptForm 
              onSubmit={handleGenerateScript} 
              isLoading={isLoading} 
            />
            
            <ScriptOutput 
              script={scriptContent} 
              isVisible={showOutput} 
            />
          </section>
          
          <section className="py-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 animate-fade-in" style={{animationDelay: "0.1s"}}>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <span className="text-primary font-medium">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Define Your Topic</h3>
                <p className="text-muted-foreground text-sm">
                  Start by entering the main topic of your video and essential parameters.
                </p>
              </div>
              
              <div className="glass-panel p-6 animate-fade-in" style={{animationDelay: "0.2s"}}>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <span className="text-primary font-medium">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Generate Script</h3>
                <p className="text-muted-foreground text-sm">
                  Our AI creates a structured script with timing and visual cues included.
                </p>
              </div>
              
              <div className="glass-panel p-6 animate-fade-in" style={{animationDelay: "0.3s"}}>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <span className="text-primary font-medium">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Export & Use</h3>
                <p className="text-muted-foreground text-sm">
                  Download your script or copy it to your clipboard and start creating.
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-muted-foreground">
            Video Script Creator © {new Date().getFullYear()}. Powered by Gemini AI.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
