
import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, suggestions = [], onSelectSuggestion, ...props }, ref) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const suggestionRef = React.useRef<HTMLDivElement>(null);

    // Merge the passed ref with our local ref
    const mergedRef = (node: HTMLInputElement) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      inputRef.current = node;
    };

    // Filter suggestions based on input value
    const filteredSuggestions = React.useMemo(() => {
      if (!props.value || typeof props.value !== 'string') return suggestions;
      return suggestions.filter(item => 
        item.toLowerCase().includes(props.value?.toString().toLowerCase() || '')
      );
    }, [props.value, suggestions]);

    // Handle click outside to close suggestions
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          suggestionRef.current && 
          !suggestionRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={mergedRef}
          onFocus={() => setShowSuggestions(true)}
          {...props}
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div 
            ref={suggestionRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (onSelectSuggestion) {
                    onSelectSuggestion(suggestion);
                  }
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
