
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { GenerateScriptRequest } from "@/lib/gemini-api";

interface ScriptFormProps {
  onSubmit: (data: GenerateScriptRequest) => void;
  isLoading: boolean;
}

const ScriptForm: React.FC<ScriptFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [duration, setDuration] = useState("5");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      topic,
      tone,
      duration,
      additionalInstructions,
    });
  };

  return (
    <Card className="w-full shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium">
              Video Topic
            </Label>
            <Input
              id="topic"
              placeholder="What is your video about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full transition-all focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-sm font-medium">
                Tone
              </Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="w-full">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration (minutes)
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration" className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="3">3 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInstructions" className="text-sm font-medium">
              Additional Instructions (Optional)
            </Label>
            <Textarea
              id="additionalInstructions"
              placeholder="Any specific requirements for your script..."
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              className="min-h-[100px] transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full transition-all" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              "Generate Script"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScriptForm;
