/** Tiny event bus so any component can open the command menu or set filters. */
export const OPEN_COMMAND = "uia:command-open";
export const SET_CATEGORY = "uia:set-category";

export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_COMMAND));
}

export function requestCategory(category: string) {
  window.dispatchEvent(new CustomEvent(SET_CATEGORY, { detail: category }));
}
