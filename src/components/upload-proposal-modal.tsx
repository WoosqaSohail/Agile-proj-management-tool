import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";

interface UploadProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (file: File, model: string) => void;
}

export function UploadProposalModal({
  open,
  onOpenChange,
  onGenerate,
}: UploadProposalModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    return validTypes.includes(file.type);
  };

  const handleGenerate = async () => {
    if (selectedFile) {
      setIsProcessing(true);
      // Simulate processing time
      setTimeout(() => {
        onGenerate(selectedFile, selectedModel);
        setIsProcessing(false);
        setSelectedFile(null);
      }, 2000);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <FileText className="h-8 w-8 text-slate-400" />;
    
    if (selectedFile.type.includes("pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (selectedFile.type.includes("word")) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    } else {
      return <FileText className="h-8 w-8 text-slate-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Proposal Document</DialogTitle>
          <DialogDescription>
            Upload a project proposal or requirements document to automatically
            generate user stories using AI-powered analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div>
            <Label className="mb-2 block">Document File</Label>
            <div
              className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-300 bg-slate-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />

              {!selectedFile ? (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-slate-400" />
                  </div>
                  <div>
                    <p className="mb-1">
                      Drag and drop your file here, or{" "}
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-700"
                      >
                        browse
                      </label>
                    </p>
                    <p className="text-sm text-slate-500">
                      Supports PDF, DOCX, or TXT files (max 10MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-center">{getFileIcon()}</div>
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* RAG Model Selector */}
          <div>
            <Label htmlFor="model" className="mb-2 block">
              RAG Model
            </Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">
                  <div className="flex items-center gap-2">
                    <span>GPT-4 Turbo</span>
                    <Badge variant="outline" className="text-xs">
                      Recommended
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-2">Claude 2</SelectItem>
                <SelectItem value="llama-2">Llama 2 70B</SelectItem>
                <SelectItem value="mistral">Mistral Large</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-sm text-slate-500">
              Select the AI model to analyze your document and generate user
              stories with source traceability.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!selectedFile || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Generate User Stories
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
