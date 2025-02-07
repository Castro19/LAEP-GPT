/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { environment } from "@/helpers/getEnvironmentVars";

// Debounce function
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

type SearchbarProps = {
  onSelect: (value: string) => void;
  fetchData: (value: string) => Promise<any[]>;
};

const Searchbar = ({ onSelect, fetchData }: SearchbarProps) => {
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce input value changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputChange = useCallback(
    debounce((value) => {
      setInputValue(value);
    }, 300),
    []
  );

  // Fetch courses when inputValue changes
  useEffect(() => {
    if (!inputValue) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const onFetchData = async () => {
      try {
        const dataFetched = await fetchData(inputValue);

        setData(dataFetched || []);
      } catch (err) {
        if (environment === "dev") {
          console.error("Failed to fetch courses:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    onFetchData();
  }, [fetchData, inputValue]);

  const hasMatches = data.length > 0;

  return (
    <Command className="w-full min-h-full">
      <CommandInput
        placeholder="Type to search for a class"
        onValueChange={(value) => handleInputChange(value)}
      />
      <CommandList>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : inputValue !== "" && !hasMatches ? (
          <CommandEmpty className="text-center">No Match found.</CommandEmpty>
        ) : (
          <CommandGroup>
            {data.map((item, index) => {
              return (
                <CommandItem
                  key={index}
                  value={item}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSelect(currentValue);
                  }}
                >
                  {item}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default Searchbar;
