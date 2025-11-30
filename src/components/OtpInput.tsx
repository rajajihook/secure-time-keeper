import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  className?: string;
}

export function OtpInput({ length = 6, onComplete, className }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value.slice(-1);
    setValues(newValues);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const otp = newValues.join("");
    if (otp.length === length && !newValues.includes("")) {
      onComplete(otp);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newValues = [...values];
    pastedData.split("").forEach((char, index) => {
      if (index < length) newValues[index] = char;
    });
    setValues(newValues);

    const lastIndex = Math.min(pastedData.length, length) - 1;
    inputRefs.current[lastIndex]?.focus();

    if (pastedData.length === length) {
      onComplete(pastedData);
    }
  };

  return (
    <div className={cn("flex gap-3 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-input bg-card transition-all duration-200",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20",
            values[index] && "border-primary bg-primary/5"
          )}
        />
      ))}
    </div>
  );
}
