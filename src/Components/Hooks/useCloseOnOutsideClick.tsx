import React from "react";

interface useCloseOnOutsideClickProps<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  callback: () => void;
}

const useCloseOnOutsideClick = ({
  ref,
  callback,
}: useCloseOnOutsideClickProps<HTMLElement>) => {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useCloseOnOutsideClick;
