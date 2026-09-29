"use client";
import { useEffect, useState, type InputHTMLAttributes } from "react";

/**
 * Lit un nombre tel qu'on le tape en France : « 1 500 », « 1500 € », « 4,3 ».
 * Renvoie null si rien d'exploitable (jamais NaN).
 */
export function parseNumber(text: string): number | null {
  const cleaned = text
    .replace(/[\s  ]/g, "")
    .replace(/[^0-9,.-]/g, "")
    .replace(",", ".");
  if (!cleaned || cleaned === "-" || cleaned === ".") return null;
  const [int, ...rest] = cleaned.split(".");
  const n = Number(rest.length ? `${int}.${rest.join("")}` : int);
  return Number.isFinite(n) ? n : null;
}

const show = (n: number | null | undefined) => (n === null || n === undefined || !Number.isFinite(n) ? "" : String(n).replace(".", ","));

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> & {
  value: number | null | undefined;
  onChange: (n: number | null) => void;
  /** Autorise les décimales (note Google, prix) ; sinon arrondi à l'entier. */
  decimal?: boolean;
  min?: number;
  max?: number;
};

/**
 * Champ numérique tolérant : on garde le texte tapé pendant la saisie (« 4, » reste « 4, »),
 * et on ne transmet qu'un nombre valide ou null.
 */
export function NumberInput({ value, onChange, decimal = false, min, max, className = "field", onBlur, ...rest }: Props) {
  const [text, setText] = useState(show(value));

  // Valeur modifiée ailleurs (rechargement, autre associé) : on resynchronise si elle diffère de la saisie
  useEffect(() => {
    if (parseNumber(text) !== (value ?? null)) setText(show(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const clamp = (n: number | null) => {
    if (n === null) return null;
    let v = decimal ? n : Math.round(n);
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    return v;
  };

  return (
    <input
      {...rest}
      type="text"
      inputMode={decimal ? "decimal" : "numeric"}
      className={className}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(clamp(parseNumber(e.target.value)));
      }}
      onBlur={(e) => {
        setText(show(clamp(parseNumber(text))));
        onBlur?.(e);
      }}
    />
  );
}
