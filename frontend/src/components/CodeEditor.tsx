
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
}

const CodeEditor = ({ code, setCode, language }: CodeEditorProps) => {
  return (
    <div className="border rounded-md overflow-hidden dark:border-gray-700">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b dark:border-gray-700 flex items-center">
        <span className="text-sm font-medium dark:text-gray-300">C++ Code Editor</span>
      </div>
      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="font-mono p-4 min-h-[300px] w-full border-0 focus-visible:ring-0 resize-none dark:bg-gray-900 dark:text-gray-300"
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;
