"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="mb-8 rounded-xl border border-blue-100 dark:border-blue-900/30 overflow-hidden bg-blue-50/50 dark:bg-blue-900/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-blue-50/80 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200">
          <List className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Table of Contents</span>
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
            ({items.length} items)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4 pt-0 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <hr className="my-2 border-blue-100 dark:border-blue-800/30" />
          <nav>
            <ul className="space-y-1">
              {items.map((item, index) => (
                <li
                  key={`${item.id}-${index}`}
                  style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="block py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors truncate"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
