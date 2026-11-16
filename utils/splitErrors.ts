import { type Pokemon} from './Pokemon';

const escapeRegex = (s:string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function splitErrors(errors: string[] | null, team: Pokemon[]) {
  const perMon: string[][] = team.map(() => []);
  const general: string[] = [];

  for (const msg of errors ?? []) {
    let matched = false;
    team.forEach((poke, i) => {
      const names = [poke.species,poke.name].filter((n) : n is string => !!n);
      const hit = names.some(n => new RegExp(`(?<!\\w)${escapeRegex(n)}(?!\\w)`,'i').test(msg));
      if(hit) { perMon[i].push(msg); matched = true;}
    });
    if (!matched) general.push(msg);
  }
  return {perMon, general };
}