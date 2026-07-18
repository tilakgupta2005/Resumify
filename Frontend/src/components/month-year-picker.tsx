import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

interface MonthYearPickerProps {
  value: string; // YYYY-MM or empty string
  onChange: (val: string) => void;
  showPresent?: boolean; // If true, empty string displays as "Present"
  error?: string;
  className?: string;
}

export function MonthYearPicker({
  value,
  onChange,
  showPresent = false,
  error,
  className,
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"months" | "years">("months");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current year/month
  const currentYear = new Date().getFullYear();
  const [valYear, valMonth] = value ? value.split("-") : ["", ""];
  
  // Year view state (what is shown in the picker header)
  const [viewYear, setViewYear] = useState(valYear ? parseInt(valYear, 10) : currentYear);

  // Sync view year with value updates
  useEffect(() => {
    if (valYear) {
      setViewYear(parseInt(valYear, 10));
    }
  }, [valYear]);

  // Reset viewMode when closing the popup
  useEffect(() => {
    if (!isOpen) {
      setViewMode("months");
    }
  }, [isOpen]);

  // Click outside detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMonthSelect = (monthVal: string) => {
    const paddedMonth = monthVal.padStart(2, "0");
    const formattedYear = viewYear.toString();
    onChange(`${formattedYear}-${paddedMonth}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const handlePrev = () => {
    if (viewMode === "months") {
      setViewYear((y) => y - 1);
    } else {
      setViewYear((y) => y - 12);
    }
  };

  const handleNext = () => {
    if (viewMode === "months") {
      setViewYear((y) => y + 1);
    } else {
      setViewYear((y) => y + 12);
    }
  };

  const getDisplayLabel = () => {
    if (!value) {
      return showPresent ? "Present" : "Select date";
    }
    const monthObj = MONTHS.find((m) => m.value === valMonth);
    return monthObj ? `${monthObj.label} ${valYear}` : value;
  };

  // Generate 12 years centered around viewYear (e.g. viewYear - 5 to viewYear + 6)
  const startYearRange = viewYear - 5;
  const yearsArray = Array.from({ length: 12 }, (_, i) => startYearRange + i);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-4 rounded-2xl bg-muted/60 border border-transparent focus:bg-card focus:border-border outline-none text-sm transition text-left flex items-center justify-between font-medium cursor-pointer select-none",
          isOpen && "bg-card border-border",
          error && "border-destructive focus:border-destructive"
        )}
      >
        <span className={cn(!value && !showPresent && "text-muted-foreground")}>
          {getDisplayLabel()}
        </span>
        <Calendar className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 mt-2 z-50 p-4 w-72 rounded-2xl border border-border bg-card shadow-xl flex flex-col gap-3 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <button
              type="button"
              onClick={handlePrev}
              className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "months" ? "years" : "months")}
              className="text-sm font-bold text-foreground hover:bg-muted rounded-xl px-2.5 py-1 flex items-center gap-1 transition cursor-pointer select-none border border-transparent hover:border-border"
            >
              <span>
                {viewMode === "months" ? viewYear : `${startYearRange} - ${startYearRange + 11}`}
              </span>
              <ChevronDown 
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  viewMode === "years" && "rotate-180"
                )} 
              />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Selection Area */}
          {viewMode === "months" ? (
            /* Month grid */
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((m) => {
                const isSelected = valYear === viewYear.toString() && valMonth === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => handleMonthSelect(m.value)}
                    className={cn(
                      "h-10 rounded-xl flex items-center justify-center text-sm font-medium transition cursor-pointer hover:bg-muted text-foreground",
                      isSelected && "bg-primary text-primary-foreground font-semibold hover:bg-primary/95"
                    )}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Year grid */
            <div className="grid grid-cols-3 gap-2">
              {yearsArray.map((y) => {
                const isSelected = valYear === y.toString();
                const isCurrentView = viewYear === y;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setViewYear(y);
                      setViewMode("months");
                    }}
                    className={cn(
                      "h-10 rounded-xl flex items-center justify-center text-sm font-medium transition cursor-pointer hover:bg-muted text-foreground",
                      isSelected ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/95" : isCurrentView ? "bg-muted border border-border/80 font-semibold" : ""
                    )}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer Shortcuts */}
          <div className="flex gap-2 border-t border-border/40 pt-2">
            {showPresent ? (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "flex-1 h-9 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition border border-border/80 hover:bg-muted text-foreground cursor-pointer",
                  !value && "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                )}
              >
                Present
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 h-9 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition border border-border/80 hover:bg-muted text-foreground cursor-pointer"
              >
                Clear
              </button>
            )}
            {showPresent && value && (
              <button
                type="button"
                onClick={handleClear}
                className="h-9 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
