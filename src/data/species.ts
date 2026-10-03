export type Arrangement = 'opposite' | 'alternate';
export type LeafType = 'simple' | 'compound';

export type GroupId = 'maples' | 'oaks' | 'birch-family' | 'compound' | 'poplars' | 'other-simple';

export interface Lookalike {
  id: string;
  /** How to tell this species apart from the lookalike. */
  tip: string;
}

export interface Species {
  id: string;
  /** Ontario tree code shown to the learner (or common name when no code is used). */
  code: string;
  common: string;
  scientific: string;
  group: GroupId;
  arrangement: Arrangement;
  leafType: LeafType;
  /** One-line description of the leaf shape. */
  shape: string;
  margin: string;
  /** Most diagnostic features, ordered from most to least useful. */
  keyFeatures: string[];
  /** Non-leaf clues that help confirm the ID in the field. */
  fieldClues: string[];
  lookalikes: Lookalike[];
}

export const GROUPS: Record<GroupId, { label: string; blurb: string }> = {
  maples: { label: 'Maples', blurb: 'Opposite, palmately lobed (except Manitoba maple).' },
  oaks: { label: 'Oaks', blurb: 'Alternate, lobed; pointed vs. rounded lobes splits red and white oaks.' },
  'birch-family': { label: 'Birch family & look-alikes', blurb: 'Alternate, oval, toothed leaves that are easy to mix up.' },
  compound: { label: 'Compound leaves', blurb: 'Ashes, walnuts, elderberry, mountain ash and sumac.' },
  poplars: { label: 'Poplars & aspens', blurb: 'Alternate, broad leaves; check the teeth and petiole.' },
  'other-simple': { label: 'Beech, elm & basswood', blurb: 'Distinctive simple leaves worth learning together.' },
};

export const SPECIES: Species[] = [
  {
    id: 'Mh', code: 'Mh', common: 'Sugar maple (hard maple)', scientific: 'Acer saccharum', group: 'maples',
    arrangement: 'opposite', leafType: 'simple',
    shape: 'Palmate, 5 lobes, 8–14 cm wide',
    margin: 'Smooth between a few large, blunt-pointed teeth',
    keyFeatures: [
      'Rounded, U-shaped sinuses between the lobes',
      'Edges are smooth — only a few large wavy teeth, no fine serrations',
      'Same green on both sides',
    ],
    fieldClues: ['Clear (not milky) sap from a broken petiole', 'Sharp, pointed brown buds', 'Bright orange-yellow fall colour'],
    lookalikes: [
      { id: 'Mr', tip: 'Red maple has V-shaped sinuses and fine teeth all along the edge; sugar maple has U-shaped sinuses and smooth edges.' },
      { id: 'Ms', tip: 'Silver maple lobes are cut almost to the midrib and are finely toothed with a silvery underside; sugar maple lobes are shallower with smooth edges.' },
    ],
  },
  {
    id: 'Mr', code: 'Mr', common: 'Red maple', scientific: 'Acer rubrum', group: 'maples',
    arrangement: 'opposite', leafType: 'simple',
    shape: 'Palmate, 3 main lobes (sometimes 5), 5–10 cm',
    margin: 'Irregularly and finely double-toothed all the way around',
    keyFeatures: [
      'Shallow, sharp V-shaped sinuses',
      'Three dominant lobes, the middle one roughly square-shouldered',
      'Pale whitish-green underside, often reddish petioles',
    ],
    fieldClues: ['Red twigs and rounded red buds', 'Often in wet sites', 'Scarlet fall colour'],
    lookalikes: [
      { id: 'Mh', tip: 'Sugar maple has smooth edges and U-shaped sinuses; red maple is toothed all around with V-shaped sinuses.' },
      { id: 'Ms', tip: 'Silver maple sinuses go nearly to the midrib; red maple sinuses are shallow (less than halfway).' },
    ],
  },
  {
    id: 'Ms', code: 'Ms', common: 'Silver maple', scientific: 'Acer saccharinum', group: 'maples',
    arrangement: 'opposite', leafType: 'simple',
    shape: 'Palmate, 5 deeply cut lobes, 10–15 cm',
    margin: 'Sharply and irregularly toothed',
    keyFeatures: [
      'Very deep sinuses reaching nearly to the midrib',
      'Middle lobe narrows toward its base',
      'Bright silvery-white underside',
    ],
    fieldClues: ['Rank smell from crushed twigs', 'Shaggy grey bark on older trees', 'Floodplains and river banks'],
    lookalikes: [
      { id: 'Mr', tip: 'Red maple sinuses are shallow; silver maple sinuses cut almost to the centre.' },
      { id: 'Mh', tip: 'Sugar maple is smooth-edged with shallower U-shaped sinuses and no silver underside.' },
    ],
  },
  {
    id: 'Mm', code: 'Mm', common: 'Manitoba maple (box elder)', scientific: 'Acer negundo', group: 'compound',
    arrangement: 'opposite', leafType: 'compound',
    shape: 'Pinnately compound, 3–7 leaflets',
    margin: 'Coarse, irregular teeth; leaflets sometimes lobed',
    keyFeatures: [
      'The only compound-leaved maple — 3 to 5 (up to 7) leaflets',
      'Leaflets are coarsely and irregularly toothed, often with a lobe like a mitten',
      'Opposite leaves on green to purplish twigs, often with a whitish bloom',
    ],
    fieldClues: ['Paired winged samaras (maple keys)', 'Green twigs that rub off a white powder'],
    lookalikes: [
      { id: 'Aw', tip: 'White ash leaflets are smooth-edged and more numerous (5–9); Manitoba maple has 3–5 coarsely toothed, irregular leaflets.' },
      { id: 'El', tip: 'Elderberry leaflets are narrow and finely, evenly toothed; Manitoba maple leaflets are broad with coarse irregular teeth.' },
    ],
  },
  {
    id: 'Mp', code: 'Mp', common: 'Striped maple', scientific: 'Acer pensylvanicum', group: 'maples',
    arrangement: 'opposite', leafType: 'simple',
    shape: 'Large, 3 shallow forward-pointing lobes near the tip ("goose foot"), 12–18 cm',
    margin: 'Very fine, sharp double teeth',
    keyFeatures: [
      'Three short lobes all at the top of the leaf, like a goose\'s foot',
      'Large leaf with a rounded to heart-shaped base',
      'Finely and evenly serrated edge',
    ],
    fieldClues: ['Smooth green bark with vertical white stripes', 'Small understory tree'],
    lookalikes: [
      { id: 'Mr', tip: 'Red maple lobes are spread across the leaf with V-shaped sinuses; striped maple lobes are short and all point forward at the tip.' },
      { id: 'Bd', tip: 'Basswood is alternate, unlobed and heart-shaped with an uneven base; striped maple is opposite with three lobes.' },
    ],
  },
  {
    id: 'Or', code: 'Or', common: 'Red oak', scientific: 'Quercus rubra', group: 'oaks',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Oblong, 7–11 pointed lobes, 12–20 cm',
    margin: 'Lobed; each lobe ends in bristle tips',
    keyFeatures: [
      'Pointed lobes ending in small bristles',
      'Sinuses reach about halfway to the midrib',
      'Dull green, smooth surface',
    ],
    fieldClues: ['Acorns with a shallow, saucer-like cap', 'Bark with shiny flat "ski-track" ridges'],
    lookalikes: [
      { id: 'Ow', tip: 'White oak lobes are rounded with no bristle tips; red oak lobes are pointed with bristles.' },
      { id: 'Ob', tip: 'Bur oak lobes are rounded and it has a deep "waist" near the middle; red oak has pointed, bristle-tipped lobes.' },
    ],
  },
  {
    id: 'Ow', code: 'Ow', common: 'White oak', scientific: 'Quercus alba', group: 'oaks',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Oblong, 7–9 rounded finger-like lobes, 10–20 cm',
    margin: 'Lobed; lobes rounded, no bristles',
    keyFeatures: [
      'Rounded, finger-like lobes with no bristle tips',
      'Lobes fairly even in size along the leaf',
      'Pale, whitish underside',
    ],
    fieldClues: ['Light grey, scaly or blocky bark', 'Acorns with a bowl-shaped warty cap'],
    lookalikes: [
      { id: 'Ob', tip: 'Bur oak has a pair of deep sinuses near the middle and a broad, wavy upper half; white oak lobes are evenly spaced fingers.' },
      { id: 'Or', tip: 'Red oak lobes are pointed and bristle-tipped; white oak lobes are rounded.' },
    ],
  },
  {
    id: 'Ob', code: 'Ob', common: 'Bur oak', scientific: 'Quercus macrocarpa', group: 'oaks',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Widest near the tip, up to 25 cm, with a deep "waist"',
    margin: 'Rounded lobes; upper half shallowly wavy',
    keyFeatures: [
      'One pair of deep sinuses near the middle, almost reaching the midrib',
      'Upper half broad with shallow, rounded wavy lobes',
      'Lower half has smaller, deeper lobes',
    ],
    fieldClues: ['Large acorns with a fringed, mossy cap', 'Corky ridges on young twigs'],
    lookalikes: [
      { id: 'Ow', tip: 'White oak lobes are evenly spaced fingers; bur oak has a deep waist and a broad, wavy upper half.' },
      { id: 'Or', tip: 'Red oak lobes are pointed and bristle-tipped; bur oak lobes are rounded.' },
    ],
  },
  {
    id: 'Be', code: 'Be', common: 'American beech', scientific: 'Fagus grandifolia', group: 'other-simple',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Elliptical, pointed tip, 6–12 cm',
    margin: 'Coarse, widely spaced teeth — one tooth at the end of each vein',
    keyFeatures: [
      'Straight, parallel side veins that each end in a single tooth',
      'Glossy, thin and papery leaf',
      'Even, symmetrical base',
    ],
    fieldClues: ['Smooth, light grey bark', 'Long, narrow, cigar-shaped buds', 'Dry leaves often stay on the tree all winter'],
    lookalikes: [
      { id: 'Iw', tip: 'Ironwood has many fine double teeth per vein; beech has one coarse tooth per vein.' },
      { id: 'Ew', tip: 'White elm has a lopsided base and double teeth; beech has an even base and single teeth.' },
    ],
  },
  {
    id: 'Iw', code: 'Iw', common: 'Ironwood (hop-hornbeam)', scientific: 'Ostrya virginiana', group: 'birch-family',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Oval to oblong, pointed tip, 6–12 cm',
    margin: 'Sharply double-toothed (fine teeth)',
    keyFeatures: [
      'Fine, sharp double teeth',
      'Soft, slightly fuzzy leaf with straight, evenly spaced veins',
      'Base nearly even or slightly uneven',
    ],
    fieldClues: ['Bark in thin, shaggy vertical strips', 'Hop-like papery fruit clusters', 'Very hard wood; small understory tree'],
    lookalikes: [
      { id: 'By', tip: 'Yellow birch twigs smell of wintergreen when scratched and its bark curls; ironwood has shaggy strip bark and no wintergreen smell.' },
      { id: 'Ew', tip: 'White elm leaves are larger with a clearly lopsided base; ironwood is smaller with a near-even base.' },
      { id: 'Be', tip: 'Beech has one coarse tooth per vein; ironwood has many fine double teeth.' },
    ],
  },
  {
    id: 'Bw', code: 'Bw', common: 'White birch (paper birch)', scientific: 'Betula papyrifera', group: 'birch-family',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Ovate (egg-shaped), pointed tip, 5–10 cm',
    margin: 'Double-toothed',
    keyFeatures: [
      'Egg-shaped with a rounded or wedge-shaped base',
      'Fewer veins (5–9 pairs) than yellow birch',
      'Double-toothed edge',
    ],
    fieldClues: ['Chalky white bark that peels in paper-like sheets', 'Often in clusters on disturbed sites'],
    lookalikes: [
      { id: 'By', tip: 'Yellow birch leaves are longer with more vein pairs (9–11) and its twigs smell of wintergreen; white birch has fewer veins.' },
      { id: 'Pt', tip: 'Trembling aspen leaves are nearly round with fine single teeth and a flattened petiole; white birch is egg-shaped and double-toothed.' },
    ],
  },
  {
    id: 'By', code: 'By', common: 'Yellow birch', scientific: 'Betula alleghaniensis', group: 'birch-family',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Ovate-oblong, pointed tip, 8–11 cm',
    margin: 'Sharply double-toothed',
    keyFeatures: [
      'Longer, narrower leaf than white birch',
      '9–11 pairs of straight veins',
      'Sharp double teeth',
    ],
    fieldClues: ['Scratched twigs smell like wintergreen', 'Golden-bronze bark peeling in thin curls'],
    lookalikes: [
      { id: 'Bw', tip: 'White birch has fewer vein pairs (5–9) and chalky white bark; yellow birch has 9–11 pairs and bronze bark.' },
      { id: 'Iw', tip: 'Ironwood has no wintergreen smell and shaggy strip bark; yellow birch smells of wintergreen.' },
    ],
  },
  {
    id: 'Al', code: 'Al', common: 'Speckled alder', scientific: 'Alnus incana ssp. rugosa', group: 'birch-family',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Broadly oval, 5–10 cm',
    margin: 'Double-toothed and slightly wavy',
    keyFeatures: [
      'Strong, ladder-like veins sunken into the upper surface',
      'Broad, wrinkled-looking leaf',
      'Double-toothed, wavy edge',
    ],
    fieldClues: ['Shrub in wet ground', 'Bark speckled with pale lenticels', 'Small woody "cones" stay on all year'],
    lookalikes: [
      { id: 'Iw', tip: 'Ironwood leaves are thinner and smoother with less sunken veins; alder leaves look wrinkled with deep ladder-like veins.' },
      { id: 'Bw', tip: 'White birch has a smoother, pointed egg-shaped leaf; alder is broader and wrinkled with sunken veins.' },
    ],
  },
  {
    id: 'Ew', code: 'Ew', common: 'White elm', scientific: 'Ulmus americana', group: 'other-simple',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Oval, pointed tip, 10–15 cm',
    margin: 'Coarsely double-toothed',
    keyFeatures: [
      'Lopsided (asymmetric) base — one side starts lower on the petiole',
      'Straight, parallel veins',
      'Double teeth; upper surface smooth or slightly rough',
    ],
    fieldClues: ['Vase-shaped crown', 'Bark has alternating brown and white layers in cross-section'],
    lookalikes: [
      { id: 'Iw', tip: 'Ironwood leaves are smaller with a near-even base; elm has a strongly lopsided base.' },
      { id: 'Be', tip: 'Beech has one coarse tooth per vein and an even base; elm has double teeth and an uneven base.' },
      { id: 'Bd', tip: 'Basswood is broadly heart-shaped and much wider; elm is oval with parallel veins.' },
    ],
  },
  {
    id: 'Bd', code: 'Bd', common: 'Basswood', scientific: 'Tilia americana', group: 'other-simple',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Large and heart-shaped, 12–15 cm, long pointed tip',
    margin: 'Coarsely toothed',
    keyFeatures: [
      'Broad heart shape with an uneven base',
      'Large leaf, almost as wide as long',
      'Coarse, sharp teeth',
    ],
    fieldClues: ['Fruit hangs from a leafy, wing-like bract', 'Red-green rounded buds', 'Often sprouts in clumps from the base'],
    lookalikes: [
      { id: 'Ew', tip: 'Elm is narrower and oval with parallel veins; basswood is broadly heart-shaped.' },
      { id: 'Pd', tip: 'Cottonwood is triangular with a flat base and a flattened petiole; basswood is heart-shaped with a round petiole.' },
    ],
  },
  {
    id: 'Aw', code: 'Aw', common: 'White ash', scientific: 'Fraxinus americana', group: 'compound',
    arrangement: 'opposite', leafType: 'compound',
    shape: 'Pinnately compound, 5–9 leaflets (usually 7)',
    margin: 'Smooth or with a few faint teeth',
    keyFeatures: [
      'Opposite compound leaves with 5–9 stalked leaflets',
      'Leaflets smooth-edged or barely toothed',
      'Whitish underside to the leaflets',
    ],
    fieldClues: ['Diamond-patterned bark', 'Leaf scar is U-shaped and wraps around the bud', 'Single-winged samaras'],
    lookalikes: [
      { id: 'Ab', tip: 'Black ash leaflets have no stalks and are finely toothed (7–11); white ash leaflets are stalked and mostly smooth-edged.' },
      { id: 'Wb', tip: 'Black walnut is alternate with 15–23 toothed leaflets; white ash is opposite with 5–9.' },
    ],
  },
  {
    id: 'Ab', code: 'Ab', common: 'Black ash', scientific: 'Fraxinus nigra', group: 'compound',
    arrangement: 'opposite', leafType: 'compound',
    shape: 'Pinnately compound, 7–11 leaflets',
    margin: 'Finely toothed',
    keyFeatures: [
      'Side leaflets have no stalks (attached directly)',
      'Tufts of rusty hairs where leaflets join the stalk',
      'Finely toothed leaflets',
    ],
    fieldClues: ['Corky, spongy bark that rubs off', 'Swamps and wet woods', 'Blue-black buds'],
    lookalikes: [
      { id: 'Aw', tip: 'White ash leaflets are stalked and mostly smooth-edged; black ash leaflets are stalkless and toothed.' },
      { id: 'El', tip: 'Elderberry leaflets are narrower and more sharply toothed, on a shrub with white pith; black ash is a tree.' },
    ],
  },
  {
    id: 'El', code: 'Elderberry', common: 'Elderberry', scientific: 'Sambucus canadensis', group: 'compound',
    arrangement: 'opposite', leafType: 'compound',
    shape: 'Pinnately compound, 5–11 leaflets (often 7)',
    margin: 'Sharply and evenly toothed',
    keyFeatures: [
      'Opposite compound leaves on a shrub',
      'Leaflets lance-shaped with long pointed tips and sharp, fine teeth',
      'Lower leaflets sometimes split into three',
    ],
    fieldClues: ['Stems with soft white pith', 'Warty lenticels on bark', 'Flat-topped white flower clusters, purple-black berries (red elderberry has red berries)'],
    lookalikes: [
      { id: 'Ab', tip: 'Black ash is a tree with stalkless leaflets and rusty hair tufts; elderberry is a shrub with pithy stems.' },
      { id: 'Am', tip: 'Mountain ash is alternate with 11–17 narrow leaflets; elderberry is opposite with 5–11.' },
    ],
  },
  {
    id: 'Am', code: 'Am', common: 'Mountain ash', scientific: 'Sorbus americana', group: 'compound',
    arrangement: 'alternate', leafType: 'compound',
    shape: 'Pinnately compound, 11–17 leaflets',
    margin: 'Sharply toothed',
    keyFeatures: [
      'Alternate compound leaves with 11–17 narrow, pointed leaflets',
      'Sharp teeth along most of each leaflet',
      'Leaflets all about the same size',
    ],
    fieldClues: ['Clusters of bright orange-red berries', 'Gummy, dark red buds', 'Not a true ash (it is in the rose family)'],
    lookalikes: [
      { id: 'Ss', tip: 'Staghorn sumac has velvety, antler-like twigs and milky sap; mountain ash twigs are smooth.' },
      { id: 'Aw', tip: 'True ashes are opposite with 5–11 leaflets; mountain ash is alternate with 11–17.' },
    ],
  },
  {
    id: 'Bn', code: 'Bn', common: 'Butternut', scientific: 'Juglans cinerea', group: 'compound',
    arrangement: 'alternate', leafType: 'compound',
    shape: 'Pinnately compound, 11–17 leaflets, 40–60 cm long',
    margin: 'Finely toothed',
    keyFeatures: [
      'Terminal (end) leaflet usually present',
      'Leaflets and stalk sticky and hairy',
      'Fewer leaflets (11–17) than black walnut',
    ],
    fieldClues: ['Hairy "moustache" fringe above the leaf scar', 'Dark brown chambered pith', 'Oblong sticky nuts', 'Endangered in Ontario (butternut canker)'],
    lookalikes: [
      { id: 'Wb', tip: 'Black walnut has more leaflets (15–23), often no end leaflet, light-coloured pith and no hairy moustache above the leaf scar.' },
      { id: 'Ss', tip: 'Staghorn sumac has velvety antler-like twigs and milky sap; butternut has sticky hairy leaflets and chambered pith.' },
    ],
  },
  {
    id: 'Wb', code: 'Wb', common: 'Black walnut', scientific: 'Juglans nigra', group: 'compound',
    arrangement: 'alternate', leafType: 'compound',
    shape: 'Pinnately compound, 15–23 leaflets, 30–60 cm long',
    margin: 'Finely toothed',
    keyFeatures: [
      'Many leaflets (15–23); end leaflet small or missing',
      'Middle leaflets the largest',
      'Smoother leaflets than butternut',
    ],
    fieldClues: ['Light tan chambered pith', 'Leaf scar has no hairy fringe', 'Round green husked nuts', 'Dark, diamond-ridged bark'],
    lookalikes: [
      { id: 'Bn', tip: 'Butternut has fewer leaflets (11–17), usually keeps its end leaflet, and has a hairy moustache above the leaf scar.' },
      { id: 'Ss', tip: 'Staghorn sumac has velvety twigs and milky sap; black walnut twigs are not velvety.' },
    ],
  },
  {
    id: 'Ss', code: 'Staghorn sumac', common: 'Staghorn sumac', scientific: 'Rhus typhina', group: 'compound',
    arrangement: 'alternate', leafType: 'compound',
    shape: 'Pinnately compound, 11–31 leaflets',
    margin: 'Sharply toothed',
    keyFeatures: [
      'Many lance-shaped, toothed leaflets',
      'Velvety, hairy leaf stalks and twigs',
      'Leaflets whitish underneath; brilliant red in fall',
    ],
    fieldClues: ['Thick, fuzzy twigs like deer antlers in velvet', 'Milky sap', 'Upright, cone-shaped clusters of fuzzy red fruit'],
    lookalikes: [
      { id: 'Am', tip: 'Mountain ash has smooth twigs and orange berry clusters; sumac twigs are velvety with red fuzzy cones.' },
      { id: 'Wb', tip: 'Black walnut is a large tree with non-velvety twigs; sumac is a shrub with velvety twigs and milky sap.' },
    ],
  },
  {
    id: 'Pl', code: 'Pl', common: 'Largetooth aspen', scientific: 'Populus grandidentata', group: 'poplars',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Broadly oval, 7–10 cm',
    margin: 'Large, coarse, rounded teeth (fewer than 15 per side)',
    keyFeatures: [
      'Big, coarse teeth — you can count them easily',
      'Flattened petiole, so the leaf flutters',
      'Young leaves white-woolly underneath',
    ],
    fieldClues: ['Smooth greenish-grey bark', 'Grey, fuzzy buds'],
    lookalikes: [
      { id: 'Pt', tip: 'Trembling aspen has small, fine teeth (20+ per side) and a rounder leaf; largetooth has big coarse teeth.' },
      { id: 'Pd', tip: 'Cottonwood is triangular with a flat base; largetooth aspen is oval with a rounded base.' },
    ],
  },
  {
    id: 'Pt', code: 'Pt', common: 'Trembling aspen', scientific: 'Populus tremuloides', group: 'poplars',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Nearly round, short pointed tip, 3–7 cm',
    margin: 'Small, fine, regular teeth (20+ per side)',
    keyFeatures: [
      'Almost circular leaf with a short sharp tip',
      'Fine, even teeth',
      'Flattened petiole — leaves tremble in the slightest breeze',
    ],
    fieldClues: ['Smooth, pale greenish-white bark', 'Shiny brown, non-sticky buds'],
    lookalikes: [
      { id: 'Pl', tip: 'Largetooth aspen has big coarse teeth; trembling aspen teeth are small and fine.' },
      { id: 'Bw', tip: 'White birch is egg-shaped and double-toothed with a round petiole; trembling aspen is round with a flat petiole.' },
    ],
  },
  {
    id: 'Pb', code: 'Pb', common: 'Balsam poplar', scientific: 'Populus balsamifera', group: 'poplars',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Ovate to lance-shaped, long pointed tip, 7–15 cm',
    margin: 'Finely round-toothed',
    keyFeatures: [
      'Longer and narrower than other poplars',
      'Glossy dark green above, pale with rusty stains below',
      'Round (not flattened) petiole',
    ],
    fieldClues: ['Large, sticky, sweet-smelling resinous buds', 'Moist sites'],
    lookalikes: [
      { id: 'Pd', tip: 'Cottonwood is triangular with a flattened petiole; balsam poplar is narrower with a round petiole.' },
      { id: 'Pt', tip: 'Trembling aspen is small and round with a flat petiole; balsam poplar is long and pointed with a round petiole.' },
    ],
  },
  {
    id: 'Pd', code: 'Pd', common: 'Eastern cottonwood', scientific: 'Populus deltoides', group: 'poplars',
    arrangement: 'alternate', leafType: 'simple',
    shape: 'Triangular (delta-shaped), flat base, 7–15 cm',
    margin: 'Coarse, curved, rounded teeth',
    keyFeatures: [
      'Triangular leaf with a straight or flat base',
      'Coarse, curved teeth',
      'Flattened petiole, often with small glands where it meets the blade',
    ],
    fieldClues: ['Deeply furrowed grey bark', 'Cottony seeds in early summer', 'River banks in southern Ontario'],
    lookalikes: [
      { id: 'Pb', tip: 'Balsam poplar is narrower with a round petiole and rusty underside; cottonwood is triangular with a flat petiole.' },
      { id: 'Pl', tip: 'Largetooth aspen is oval with a rounded base; cottonwood is triangular with a flat base.' },
    ],
  },
];

export const SPECIES_BY_ID: Record<string, Species> = Object.fromEntries(SPECIES.map((s) => [s.id, s]));

export function speciesLabel(id: string): string {
  const s = SPECIES_BY_ID[id];
  if (!s) return id;
  return s.code === s.common ? s.common : `${s.code} · ${s.common}`;
}
