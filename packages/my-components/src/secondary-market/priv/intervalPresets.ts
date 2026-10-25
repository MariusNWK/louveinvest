export interface IIntervalPreset {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const INTERVAL_PRESETS: IIntervalPreset[] = [
  { id: "BOOK", label: "Plage carnet actuel (18 € – 36 €)", min: 18, max: 36 },
  { id: "HIST", label: "Plage historique 2026 (20 € – 50 €)", min: 20, max: 50 },
  { id: "WIDE", label: "Plage élargie (15 € – 70 €)", min: 15, max: 70 },
];
