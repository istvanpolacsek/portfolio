import { z } from 'zod';
import {
  AERO_OPTIONS,
  anthropic,
  CLASSES,
  DRIVETRAIN_OPTIONS,
  GAMES,
  TUNING_TYPES,
  TYRE_COMPOUNDS,
} from '../../lib';
import { TUNE_SYSTEM_PROMPT } from '../../prompts';

export const generateTuneSchema = z.object({
  vehicle: z.string().describe('Full vehicle name, e.g. 2003 Ferrari Enzo'),
  game: z.enum(GAMES).describe('Forza game title'),
  cls: z.enum(CLASSES).describe('Performance class'),
  tuning_type: z.enum(TUNING_TYPES).describe('Type of tune to generate'),
  tyre_compound: z.enum(TYRE_COMPOUNDS).describe('Tyre compound fitted'),
  aero: z.enum(AERO_OPTIONS).describe('Adjustable aero configuration'),
  drivetrain: z
    .enum(DRIVETRAIN_OPTIONS)
    .describe('Drivetrain — use -- to infer factory default'),
  notes: z
    .string()
    .optional()
    .describe('Optional free text notes or preferences'),
});

export type GenerateTuneParams = z.infer<typeof generateTuneSchema>;

export async function generateTune(
  params: GenerateTuneParams,
): Promise<string> {
  const {
    vehicle,
    game,
    cls,
    tuning_type,
    tyre_compound,
    aero,
    drivetrain,
    notes,
  } = params;

  const userMessage = [
    `Vehicle: ${vehicle}`,
    `Game: ${game}`,
    `Class: ${cls}`,
    `Tuning type: ${tuning_type}`,
    `Tyre compound: ${tyre_compound}`,
    `Adjustable aero: ${aero}`,
    `Drivetrain: ${drivetrain}`,
    notes ? `Notes: ${notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    system: TUNE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('');

  return text;
}
