import { ArtistProfile, ProjectConfig } from '../App';
import { TalentProfile, TalentRole } from '../types/talent';

export interface OutreachBrief {
  subject: string;
  message: string;
}

export function generateOutreachBrief(
  artist: ArtistProfile,
  project: ProjectConfig,
  role: TalentRole,
  candidate?: TalentProfile
): OutreachBrief {
  const artistName = artist.artistName || 'Artist';
  const genres = artist.genres || '';
  const city = artist.city || '';
  const tracks = project.units;
  const projectType = project.projectType.toLowerCase();

  const subject = `${artistName} — ${tracks} ${projectType} needs ${role.toLowerCase()}`;

  const lines: string[] = [];
  lines.push(`Hi${candidate ? ` ${candidate.name.split(' ')[0]}` : ''},`);
  lines.push('');
  lines.push(`I lead a ${projectType} project for ${artistName}${genres ? ` (${genres})` : ''}${city ? ` based in ${city}` : ''}.`);
  lines.push(`We're planning ${tracks} track${tracks > 1 ? 's' : ''} with a ${project.targetWeeks}-week timeline.`);
  lines.push('');
  lines.push(`We're looking for a ${role} to help with:`);
  switch (role) {
    case 'Producer':
      lines.push('- Pre-pro, sound direction, and production for each track');
      lines.push('- Deliverables: session files, stems, and rough mixes');
      break;
    case 'Mixer':
      lines.push('- Professional mixes with vocal priority and translation');
      lines.push('- Deliverables: mix prints (main/instrumental/acapella), stems');
      break;
    case 'Mastering Engineer':
      lines.push('- Streaming-compliant masters with consistent loudness');
      lines.push('- Deliverables: 16-bit WAV, 24-bit WAV, DDP optional');
      break;
    case 'Recording Engineer':
      lines.push('- Tracking sessions for vocals and core instruments');
      lines.push('- Deliverables: consolidated multitracks');
      break;
    case 'Vocal Producer':
      lines.push('- Vocal comping, tuning, doubles, adlibs, harmonies');
      lines.push('- Deliverables: tuned/edited vocal stacks');
      break;
    case 'Session Musician':
    case 'Guitarist':
    case 'Drummer':
    case 'Bassist':
    case 'Keyboardist':
      lines.push('- Remote session parts with 1-2 revisions');
      lines.push('- Deliverables: DI + processed audio as needed');
      break;
    case 'String Arranger':
      lines.push('- String arrangements and mockups with optional live players');
      lines.push('- Deliverables: MIDI + notation + audio prints');
      break;
    case 'Live MD':
    case 'Live Musician':
      lines.push('- Show design, stems, playback rig, and band coordination');
      break;
    case 'Songwriter':
      lines.push('- Topline/lyrics co-writing aligned to references');
      break;
  }
  lines.push('');
  lines.push('If this fits, could you share availability and rate (per song/day)?');
  lines.push('Happy to send references and stems as next step.');
  lines.push('');
  lines.push('Thanks!');
  lines.push(`${artistName}`);

  return { subject, message: lines.join('\n') };
}
