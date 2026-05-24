export const GAMES = [
  'Forza Horizon 5',
  'Forza Horizon 4',
  'Forza Motorsport',
] as const;

export const CLASSES = ['D', 'C', 'B', 'A', 'S1', 'S2', 'X'] as const;

export const TUNING_TYPES = [
  'road',
  'street',
  'dirt',
  'cross-country',
  'drift',
  'drag',
] as const;

export const TYRE_COMPOUNDS = [
  'stock',
  'street',
  'sport',
  'semi-slick',
  'slick',
  'rally',
  'offroad',
  'snow',
] as const;

export const AERO_OPTIONS = ['N/A', 'front only', 'rear only', 'both'] as const;

export const DRIVETRAIN_OPTIONS = ['--', 'FWD', 'RWD', 'AWD'] as const;

export type Game = (typeof GAMES)[number];
export type Class = (typeof CLASSES)[number];
export type TuningType = (typeof TUNING_TYPES)[number];
export type TyreCompound = (typeof TYRE_COMPOUNDS)[number];
export type AeroOption = (typeof AERO_OPTIONS)[number];
export type DrivetrainOption = (typeof DRIVETRAIN_OPTIONS)[number];
