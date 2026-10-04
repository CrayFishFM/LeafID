import type { LeafData } from './leaf-shared';
import type { Progress } from './progress';

export interface Suggestion {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}

/** Explain how to separate two species, using curated tips where we have them. */
export function contrastTip(leaf: LeafData, actual: string, chosen: string): string {
  const a = leaf.byId[actual];
  const c = leaf.byId[chosen];
  if (!a || !c) return '';
  const curated = a.lookalikes.find((l) => l.id === chosen)?.tip ?? c.lookalikes.find((l) => l.id === actual)?.tip;
  if (curated) return curated;
  const diffs: string[] = [];
  if (a.arrangement !== c.arrangement) diffs.push(`${a.common} is ${a.arrangement}; ${c.common} is ${c.arrangement}`);
  if (a.leafType !== c.leafType) diffs.push(`${a.common} has ${a.leafType} leaves; ${c.common} has ${c.leafType} leaves`);
  if (diffs.length) return diffs.join('. ') + '.';
  return `${a.common}: ${(a.keyFeatures[0] ?? a.shape).toLowerCase()}. ${c.common}: ${(c.keyFeatures[0] ?? c.shape).toLowerCase()}.`;
}

export function suggestionsFor(leaf: LeafData, p: Progress): Suggestion[] {
  const SPECIES = leaf.species, SPECIES_BY_ID = leaf.byId, GROUPS = leaf.groups;
  const out: Suggestion[] = [];
  const seen = p.species.filter((s) => s.attempts > 0);

  if (p.total < 10) {
    out.push({
      title: 'Build a baseline',
      body: 'Answer at least 10 questions so the app can tell which species you know and which need work. Skim the field guide first if the codes are new to you.',
      href: '/quiz',
      cta: 'Start practising',
    });
  }

  const weak = seen
    .filter((s) => s.attempts >= 2 && s.mastery < 0.5)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3);
  if (weak.length) {
    out.push({
      title: `Review ${weak.map((s) => SPECIES_BY_ID[s.id].code).join(', ')}`,
      body: weak
        .map((s) => `${SPECIES_BY_ID[s.id].common}: ${(SPECIES_BY_ID[s.id].keyFeatures[0] ?? SPECIES_BY_ID[s.id].shape).toLowerCase()}`)
        .join(' · '),
      href: `/learn/${weak[0].id}`,
      cta: 'Open in field guide',
    });
  }

  for (const c of p.confusions.filter((c) => c.count >= 2).slice(0, 2)) {
    out.push({
      title: `You've mistaken ${SPECIES_BY_ID[c.species].code} for ${SPECIES_BY_ID[c.chosen].code} ${c.count} times`,
      body: contrastTip(leaf, c.species, c.chosen),
      href: `/learn/${c.species}`,
      cta: 'Compare them',
    });
  }

  // Arrangement / leaf-type mix-ups are a sign the learner is skipping the first ID step.
  const structural = p.confusions.filter((c) => {
    const a = SPECIES_BY_ID[c.species], b = SPECIES_BY_ID[c.chosen];
    return a && b && (a.arrangement !== b.arrangement || a.leafType !== b.leafType);
  });
  const structuralCount = structural.reduce((n, c) => n + c.count, 0);
  if (structuralCount >= 3) {
    out.push({
      title: 'Start every ID with arrangement and leaf type',
      body: `${structuralCount} of your misses mixed up opposite/alternate or simple/compound leaves. Ask those two questions first — remember "MAD Horse": Maples, Ashes, Dogwoods and Horse-chestnut (plus elderberry) are the opposite-leaved trees.`,
    });
  }

  const weakGroup = p.groups
    .filter((g) => g.attempts >= 6 && g.correct / g.attempts < 0.7)
    .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts)[0];
  if (weakGroup) {
    out.push({
      title: `Focus on ${GROUPS[weakGroup.id].label.toLowerCase()}`,
      body: `You're at ${Math.round((weakGroup.correct / weakGroup.attempts) * 100)}% on this group. Practising them side by side forces you to notice the small differences.`,
      href: `/quiz?scope=${weakGroup.id}`,
      cta: 'Practise this group',
    });
  }

  if (p.total >= 10 && p.hinted / p.total > 0.4) {
    out.push({
      title: 'Lean on hints a little less',
      body: 'You use hints on many questions. Try committing to an answer first — getting it wrong and reading the explanation is how the ID sticks.',
    });
  }

  const unseen = SPECIES.length - seen.length;
  if (p.total >= 10 && unseen > 0) {
    out.push({
      title: `${unseen} species not seen yet`,
      body: 'Keep practising on "All species" and the new ones will come up more often.',
      href: '/quiz?scope=all',
      cta: 'Practise all',
    });
  }

  const mastered = p.species.filter((s) => s.level === 'mastered').length;
  if (mastered >= SPECIES.length * 0.75) {
    out.push({
      title: 'Put your skills to work',
      body: `You've mastered ${mastered} of ${SPECIES.length} species. Help verify community uploads — every vote improves the photo library.`,
      href: '/community',
      cta: 'Review uploads',
    });
  }

  if (p.dayStreak === 0 && p.total > 0) {
    out.push({
      title: 'Little and often',
      body: 'Short daily sessions beat long cramming sessions for memory. Aim for 10 questions a day.',
      href: '/quiz?scope=weak',
      cta: 'Quick review',
    });
  }

  return out;
}
