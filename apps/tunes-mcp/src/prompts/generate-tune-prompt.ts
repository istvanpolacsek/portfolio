import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import {
  AERO_OPTIONS,
  CLASSES,
  DRIVETRAIN_OPTIONS,
  GAMES,
  TUNING_TYPES,
  TYRE_COMPOUNDS,
} from '../lib';

const GAME_ALIASES: Record<string, (typeof GAMES)[number]> = {
  fh5: 'Forza Horizon 5',
  fh4: 'Forza Horizon 4',
  fm: 'Forza Motorsport',
};

const AERO_ALIASES: Record<string, (typeof AERO_OPTIONS)[number]> = {
  'n-a': 'N/A',
  na: 'N/A',
  none: 'N/A',
  front: 'front only',
  rear: 'rear only',
};

function resolveGame(raw: string): (typeof GAMES)[number] {
  const alias = GAME_ALIASES[raw.toLowerCase()];
  if (alias) return alias;
  const exact = GAMES.find(
    (g) => g.toLowerCase() === raw.toLowerCase(),
  );
  if (exact) return exact;
  return raw as (typeof GAMES)[number];
}

function resolveAero(raw: string): (typeof AERO_OPTIONS)[number] {
  const alias = AERO_ALIASES[raw.toLowerCase()];
  if (alias) return alias;
  const exact = AERO_OPTIONS.find(
    (a) => a.toLowerCase() === raw.toLowerCase(),
  );
  if (exact) return exact;
  return raw as (typeof AERO_OPTIONS)[number];
}

export function registerGenerateTunePrompt(server: McpServer): void {
  server.registerPrompt(
    'generate-tune',
    {
      title: 'Generate Forza Tune',
      description:
        'Generate a structured Forza tuning sheet. Shorthand aliases accepted: FH5, FH4, FM for game; n-a/na/none/front/rear for aero.',
      argsSchema: {
        vehicle: z
          .string()
          .describe('Full vehicle name, e.g. Porsche 944 Turbo'),
        game: completable(
          z.string().describe('Game: FH5, FH4, FM — or full name'),
          (value) =>
            (Object.keys(GAME_ALIASES) as string[])
              .concat(GAMES as unknown as string[])
              .filter((g) => g.toLowerCase().startsWith(value.toLowerCase())),
        ),
        cls: completable(
          z.string().describe('Performance class'),
          (value) =>
            (CLASSES as unknown as string[]).filter((c) =>
              c.toLowerCase().startsWith(value.toLowerCase()),
            ),
        ),
        tuning_type: completable(
          z.string().describe('Tuning type'),
          (value) =>
            (TUNING_TYPES as unknown as string[]).filter((t) =>
              t.toLowerCase().startsWith(value.toLowerCase()),
            ),
        ),
        tyre_compound: completable(
          z.string().describe('Tyre compound'),
          (value) =>
            (TYRE_COMPOUNDS as unknown as string[]).filter((t) =>
              t.toLowerCase().startsWith(value.toLowerCase()),
            ),
        ),
        aero: completable(
          z
            .string()
            .describe('Aero config: N/A, front only, rear only, both — or n-a/front/rear'),
          (value) =>
            (Object.keys(AERO_ALIASES) as string[])
              .concat(AERO_OPTIONS as unknown as string[])
              .filter((a) => a.toLowerCase().startsWith(value.toLowerCase())),
        ),
        drivetrain: completable(
          z.string().describe('Drivetrain: --, FWD, RWD, AWD'),
          (value) =>
            (DRIVETRAIN_OPTIONS as unknown as string[]).filter((d) =>
              d.toLowerCase().startsWith(value.toLowerCase()),
            ),
        ),
        notes: z
          .string()
          .optional()
          .describe('Optional free-text preferences, e.g. purist, grip build'),
      },
    },
    (args) => {
      const game = resolveGame(args.game);
      const aero = resolveAero(args.aero);

      const paramLines = [
        `vehicle: ${args.vehicle}`,
        `game: ${game}`,
        `cls: ${args.cls}`,
        `tuning_type: ${args.tuning_type}`,
        `tyre_compound: ${args.tyre_compound}`,
        `aero: ${aero}`,
        `drivetrain: ${args.drivetrain}`,
        args.notes ? `notes: ${args.notes}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: `Call the generate_tune tool with these parameters:\n${paramLines}`,
            },
          },
        ],
      };
    },
  );
}
