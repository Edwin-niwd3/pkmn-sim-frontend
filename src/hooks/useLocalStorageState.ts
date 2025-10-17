import {useState, useEffect} from 'react';

//T stands for whatever type of state we want, in this case we want pokemon
//Think: 'useState<Pokemon> -> useLocalStorageState<Pokemon>
export function useLocalStorageState<T>(key:string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [isLoaded, setIsLoaded] = useState(false);
  const [value, setValue] = useState<T>(initialValue);

    useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      setValue(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, [key]);

  useEffect(() => {
    if(isLoaded) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  }, [key, value, isLoaded]);

  return [value, setValue];
}