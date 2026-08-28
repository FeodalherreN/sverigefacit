export type TopicMetric = {
  value: string;
  label: string;
  period: string;
};

export type TopicSource = {
  name: string;
  organization: string;
  url: string;
};

export type SeoTopic = {
  slug: string;
  category: string;
  seoTitle: string;
  heading: string;
  description: string;
  lead: string;
  temporalCoverage: string;
  variableMeasured: string[];
  metrics: TopicMetric[];
  observed: string;
  policy: string;
  limitation: string;
  definition: string;
  sources: TopicSource[];
  related: string[];
};

export const seoTopics: SeoTopic[] = [
  {
    slug: 'brottslighet',
    category: 'Brott & trygghet',
    seoTitle: 'Brottslighet i Sverige – statistik över tid',
    heading: 'Brottslighet i Sverige',
    description:
      'Se svensk statistik över konstaterat dödligt våld 2002–2025, med regeringsperioder, källor och en tydlig gräns mellan samband och orsak.',
    lead:
      'Dödligt våld är ett av de mest robusta brottsmåtten eftersom Brå granskar varje fall. Serien är ändå för smal för att ensam beskriva all brottslighet och trygghet.',
    temporalCoverage: '2002/2025',
    variableMeasured: ['Konstaterade offer för dödligt våld'],
    metrics: [
      { value: '84', label: 'offer för dödligt våld', period: '2025' },
      { value: '−8', label: 'offer jämfört med året före', period: '2024–2025' },
      { value: '124', label: 'offer under seriens högsta år', period: '2020' },
    ],
    observed:
      'Brå konstaterade 84 offer för dödligt våld 2025, jämfört med 92 året före. Årsserien har varierat tydligt och ska läsas som antal offer, inte antal händelser.',
    policy:
      'Polisens resurser, lagstiftning, social prevention och insatser mot illegala vapen kan påverka utvecklingen. Effekterna kan komma med fördröjning och samverka med lokala konflikter.',
    limitation:
      'En upp- eller nedgång under en regeringsperiod bevisar inte att regeringen orsakade förändringen. Enskilda händelser kan dessutom påverka ett litet årsantal kraftigt.',
    definition:
      'Konstaterat dödligt våld avser fall där Brå efter manuell granskning bedömt att en person dödats genom brott. Måttet skiljer sig från preliminära anmälningar om mord eller dråp.',
    sources: [
      {
        name: 'Konstaterade fall av dödligt våld',
        organization: 'Brottsförebyggande rådet',
        url: 'https://bra.se/statistik/statistik-om-rattsvasendet/konstaterade-fall-av-dodligt-vald',
      },
    ],
    related: ['invandring-och-brott', 'migration', 'arbetsloshet'],
  },
  {
    slug: 'migration',
    category: 'Migration',
    seoTitle: 'Invandring till Sverige – statistik 2000–2025',
    heading: 'Invandring till Sverige',
    description:
      'Följ registrerad invandring till Sverige 2000–2025 och se hur lagstiftning, EU-regler, krig och folkbokföring påverkar tolkningen.',
    lead:
      'Invandring mäts här som registrerade varaktiga flyttningar till Sverige. Det är inte samma sak som asylansökningar, beviljade uppehållstillstånd eller personer födda utomlands.',
    temporalCoverage: '2000/2025',
    variableMeasured: ['Registrerade invandringar'],
    metrics: [
      { value: '89 434', label: 'registrerade invandringar', period: '2025' },
      { value: '−23 %', label: 'förändring mot året före', period: '2024–2025' },
      { value: '163 005', label: 'registrerade invandringar', period: '2016' },
    ],
    observed:
      'SCB registrerade 89 434 invandringar 2025, ned från 116 197 under 2024. Nivån har varierat kraftigt under perioden 2000–2025.',
    policy:
      'Svenska regler påverkar asyl, anhöriginvandring och arbetskraftsinvandring. Samtidigt styr EU-rätt, krig, familjeband, arbetsmarknad och hur snabbt personer folkbokförs.',
    limitation:
      'Årsserien visar inte ensam effekten av en viss migrationsreform. Den kan inte heller användas som direkt mått på integration eller framtida offentliga kostnader.',
    definition:
      'SCB räknar folkbokförda varaktiga flyttningar. Återinvandrade svenskfödda ingår, medan många personer som vistas kortvarigt i landet inte gör det.',
    sources: [
      {
        name: 'Befolkningsutvecklingen i riket',
        organization: 'Statistiska centralbyrån',
        url: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101G/BefUtvKon1749/',
      },
    ],
    related: ['invandring-och-brott', 'arbetsloshet', 'privatekonomi'],
  },
  {
    slug: 'arbetsloshet',
    category: 'Arbetsmarknad',
    seoTitle: 'Arbetslöshet i Sverige – statistik 2001–2025',
    heading: 'Arbetslöshet i Sverige',
    description:
      'Jämför Sveriges arbetslöshet 2001–2025 med regeringsperioder, konjunktur och politiska mål. Officiell statistik från SCB:s AKU.',
    lead:
      'Arbetslösheten är central i valdebatten men påverkas både av svensk politik och av konjunktur, räntor, demografi och hur arbetskraften definieras.',
    temporalCoverage: '2001/2025',
    variableMeasured: ['Arbetslöshet bland personer 15–74 år'],
    metrics: [
      { value: '8,8 %', label: 'arbetslöshet 15–74 år', period: '2025' },
      { value: '+0,4 p.e.', label: 'förändring mot året före', period: '2024–2025' },
      { value: '6,5 %', label: 'arbetslöshet', period: '2018' },
    ],
    observed:
      'Arbetslösheten var 8,8 procent 2025, upp från 8,4 procent 2024. Den var 6,5 procent 2018 och steg tydligt under pandemiåret 2020.',
    policy:
      'Skatter, utbildning, arbetsmarknadsåtgärder och matchning kan påverka. Finans- och penningpolitik spelar också roll, liksom internationell efterfrågan.',
    limitation:
      'Skillnader mellan regeringsperioder är inte samma sak som reformeffekter. För en kausal slutsats krävs en trovärdig jämförelse med hur utvecklingen annars skulle ha blivit.',
    definition:
      'SCB:s arbetskraftsundersökningar, AKU, är en urvalsundersökning. Arbetslös avser en person utan arbete som kan och aktivt söker arbete enligt den internationella definitionen.',
    sources: [
      {
        name: 'Arbetskraftsundersökningarna (AKU)',
        organization: 'Statistiska centralbyrån',
        url: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0401__AM0401A/AKURLBefAr/',
      },
      {
        name: 'Harmoniserad arbetslöshet, EU-LFS',
        organization: 'Eurostat',
        url: 'https://ec.europa.eu/eurostat/databrowser/view/une_rt_a/default/table?lang=en',
      },
    ],
    related: ['privatekonomi', 'migration', 'pensioner'],
  },
  {
    slug: 'privatekonomi',
    category: 'Hushållsekonomi',
    seoTitle: 'Privatekonomi i Sverige – inkomster, matpriser och räntor',
    heading: 'Privatekonomi i Sverige',
    description:
      'Se hur svenska hushålls köpkraft, matpriser och räntebörda har utvecklats. Officiella tidsserier med definitioner och metodbegränsningar.',
    lead:
      'Hushållens ekonomi kan inte beskrivas med ett enda tal. Därför visas real disponibel inkomst, prisnivå och räntebörda bredvid varandra.',
    temporalCoverage: '2000/2025',
    variableMeasured: ['Median ekonomisk standard', 'Livsmedelspriser', 'Hushållens räntekvot'],
    metrics: [
      { value: '324,9 tkr', label: 'median ekonomisk standard', period: '2024' },
      { value: '+32 %', label: 'livsmedlens prisnivå', period: '2021–2025' },
      { value: '5,5 %', label: 'hushållens räntekvot', period: 'Q4 2025' },
    ],
    observed:
      'Median ekonomisk standard återhämtade sig under 2024 men låg fortfarande under 2021 års nivå i fasta priser. Livsmedlens prisnivå steg cirka 32 procent 2021–2025.',
    policy:
      'Skatter, transfereringar, energipolitik och offentliga stöd påverkar hushållen. Riksbankens ränta, globala priser, kronkurs och löneutveckling verkar samtidigt.',
    limitation:
      'Aggregat beskriver inte varje hushåll. En bolånetagare, hyresgäst och pensionär kan möta helt olika kostnadsutveckling trots samma nationella genomsnitt.',
    definition:
      'Ekonomisk standard är disponibel inkomst justerad för hushållets storlek. Prisindex visar prisnivå, inte inflationstakt. Räntekvoten gäller hushållssektorn som helhet.',
    sources: [
      {
        name: 'Hushållens ekonomi',
        organization: 'Statistiska centralbyrån',
        url: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__HE__HE0110__HE0110F/TabVX1DispInkN/',
      },
      {
        name: 'KPI för livsmedel',
        organization: 'Statistiska centralbyrån',
        url: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__PR__PR0101__PR0101L/KPICOI80Ar/',
      },
      {
        name: 'Hushållens räntekvot',
        organization: 'Statistiska centralbyrån',
        url: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__NR__NR0103__NR0103C/SektorENS2010KvKeyIn/',
      },
      {
        name: 'Harmoniserat konsumentprisindex, HIKP',
        organization: 'Eurostat',
        url: 'https://ec.europa.eu/eurostat/databrowser/view/prc_hicp_ainr/default/table?lang=en',
      },
      {
        name: 'Hushållens elpriser i köpkraftsstandard',
        organization: 'Eurostat',
        url: 'https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_204/default/table?lang=en',
      },
    ],
    related: ['arbetsloshet', 'pensioner', 'aldreomsorg'],
  },
  {
    slug: 'pensioner',
    category: 'Pension',
    seoTitle: 'Pensioner i Sverige – real utveckling över tid',
    heading: 'Pensioner i Sverige',
    description:
      'Följ den allmänna pensionens reala utveckling i Sverige. Se nivåer, köpkraft, källor och varför årsgenomsnitt inte visar varje pensionärs ekonomi.',
    lead:
      'Pensionens nominella belopp och faktiska köpkraft är två olika saker. Här visas genomsnittlig allmän pension omräknad till 2023 års priser.',
    temporalCoverage: '2003/2023',
    variableMeasured: ['Genomsnittlig allmän pension i fasta priser'],
    metrics: [
      { value: '15 713 kr', label: 'allmän pension per månad', period: '2023 års priser' },
      { value: '16 701 kr', label: 'allmän pension per månad', period: '2021' },
      { value: '−4 %', label: 'real förändring på ett år', period: '2022–2023' },
    ],
    observed:
      'Den genomsnittliga allmänna pensionen var 15 713 kronor per månad 2023 räknat i 2023 års priser, lägre realt än under 2021 och 2022.',
    policy:
      'Indexering, garantipension, skatter och pensionssystemets regler påverkar. Inflation och arbetslivets historiska inkomster är samtidigt avgörande.',
    limitation:
      'Genomsnittet påverkas när nya årskullar börjar ta ut pension och äldre lämnar kollektivet. Det visar inte fördelningen eller inkomsten för en typisk pensionär.',
    definition:
      'Måttet avser genomsnittlig allmän pension före skatt i fasta priser. Tjänstepension och privat pensionssparande ingår inte.',
    sources: [
      {
        name: 'Fastprisberäknad pension 2024',
        organization: 'Pensionsmyndigheten',
        url: 'https://www.pensionsmyndigheten.se/statistik/publikationer/Fastprisberaknad-pension-2024/',
      },
    ],
    related: ['aldreomsorg', 'privatekonomi', 'arbetsloshet'],
  },
  {
    slug: 'aldreomsorg',
    category: 'Äldreomsorg',
    seoTitle: 'Äldreomsorg i Sverige – hemtjänst och särskilt boende',
    heading: 'Äldreomsorg i Sverige',
    description:
      'Se utvecklingen för hemtjänst och särskilt boende bland personer 65 år och äldre, med rätt nämnare och statistik från Socialstyrelsen.',
    lead:
      'När gruppen äldre växer kan antalet mottagare öka samtidigt som andelen sjunker. Därför behöver både nivå, nämnare och faktisk kapacitet granskas.',
    temporalCoverage: '2014/2025',
    variableMeasured: ['Andel 65+ med hemtjänst', 'Andel 65+ i särskilt boende'],
    metrics: [
      { value: '10,22 %', label: 'av 65+ med hemtjänst', period: '2025' },
      { value: '5,11 %', label: 'av 65+ i särskilt boende', period: '2025' },
      { value: '11,33 %', label: 'av 65+ med hemtjänst', period: '2014' },
    ],
    observed:
      'Andelen personer 65 år och äldre med hemtjänst minskade från 11,33 procent 2014 till 10,22 procent 2025. Andelen i särskilt boende minskade från 5,73 till 5,11 procent.',
    policy:
      'Kommunernas biståndsbedömning, bemanning, statsbidrag, bostadsutbud och regler påverkar. Befolkningens ålder och hälsa förändrar samtidigt behovet.',
    limitation:
      'Andel med insats är inte ett direkt kvalitetsmått och visar inte väntetid eller ouppfyllt behov. Antalet mottagare kan öka även när andelen minskar.',
    definition:
      'Måtten avser andelen folkbokförda personer 65 år och äldre med beviljad eller verkställd hemtjänst respektive särskilt boende enligt Socialstyrelsens statistik.',
    sources: [
      {
        name: 'Statistik om socialtjänstinsatser till äldre 2025',
        organization: 'Socialstyrelsen',
        url: 'https://www.socialstyrelsen.se/publikationer/statistik-om-socialtjanstinsatser-till-aldre-2025-2026-4-10218/',
      },
    ],
    related: ['pensioner', 'privatekonomi', 'arbetsloshet'],
  },
  {
    slug: 'klimat-och-miljo',
    category: 'Klimat & miljö',
    seoTitle: 'Klimat och miljö i Sverige – utsläpp, energi och natur',
    heading: 'Klimat och miljö i Sverige',
    description:
      'Följ Sveriges utsläpp, transportsektor, konsumtionsutsläpp, elproduktion, kolsänka och skyddad natur med aktuella originalkällor.',
    lead:
      'Miljöutvecklingen ryms inte i ett enda betyg. Här hålls utsläpp inom Sverige, svensk konsumtion, elproduktion, markens kolsänka och naturens tillstånd isär.',
    temporalCoverage: '2000/2025',
    variableMeasured: [
      'Territoriella växthusgasutsläpp',
      'Utsläpp från inrikes transporter',
      'Konsumtionsbaserade utsläpp per person',
      'Nettoupptag i mark och skog',
      'Fossilfri andel av elproduktionen',
      'Formellt skyddad natur',
    ],
    metrics: [
      { value: '46,7 Mt', label: 'territoriella utsläpp, preliminärt', period: '2025' },
      { value: '−2,8 %', label: 'förändring mot året före', period: '2024–2025' },
      { value: '15,7 %', label: 'formellt skyddad totalareal', period: '2025' },
    ],
    observed:
      'De territoriella utsläppen var preliminärt 46,7 miljoner ton koldioxidekvivalenter 2025, knappt tre procent lägre än 2024. Transportutsläppen minskade med fyra procent.',
    policy:
      'Naturvårdsverket anger den höjda reduktionsplikten som en huvudförklaring till minskningen 2025. Skatter, EU-regler, elektrifiering, energi- och naturvårdsbeslut kan också påverka olika mått.',
    limitation:
      'Konjunktur, väder, produktion, energipriser och teknikutveckling ändras samtidigt. Utsläpp, biologisk mångfald och vattenstatus kan därför inte sammanfattas i ett kausalt miljöbetyg.',
    definition:
      'Territoriella utsläpp avser utsläpp inom Sveriges gränser och exkluderar LULUCF och internationella transporter. Konsumtionsutsläpp inkluderar även utsläpp utomlands från svensk konsumtion.',
    sources: [
      {
        name: 'Sveriges utsläpp och upptag av växthusgaser',
        organization: 'Naturvårdsverket',
        url: 'https://www.naturvardsverket.se/data-och-statistik/klimat/sveriges-utslapp-och-upptag-av-vaxthusgaser/',
      },
      {
        name: 'Territoriella växthusgasutsläpp per person',
        organization: 'Eurostat / Europeiska miljöbyrån',
        url: 'https://ec.europa.eu/eurostat/databrowser/view/sdg_13_10/default/table?lang=en',
      },
      {
        name: 'Konsumtionsbaserade växthusgasutsläpp per person',
        organization: 'Naturvårdsverket / SCB',
        url: 'https://www.naturvardsverket.se/data-och-statistik/konsumtion/vaxthusgaser-konsumtionsbaserade-utslapp-per-person/',
      },
      {
        name: 'Energiindikator: fossilfri elproduktion',
        organization: 'Energimyndigheten',
        url: 'https://pxexternal.energimyndigheten.se/pxweb/sv/Energimyndighetens_statistikdatabas/Energimyndighetens_statistikdatabas__Energiindikatorer__6__6.1/EN_IND6-1A.px/',
      },
      {
        name: 'Formellt skyddad natur',
        organization: 'Statistiska centralbyrån',
        url: 'https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0603__MI0603D/ArealSkydd/',
      },
      {
        name: 'Klimatindikatorn temperatur',
        organization: 'SMHI',
        url: 'https://www.smhi.se/klimat/klimatet-da-och-nu/klimatindikatorer/temperatur',
      },
      {
        name: 'Rödlistade arter i Sverige 2025',
        organization: 'SLU Artdatabanken',
        url: 'https://www.slu.se/artdatabanken/publikationer/rodlistor/rodlista-2025/',
      },
      {
        name: 'Kommunalt avfall',
        organization: 'Naturvårdsverket',
        url: 'https://www.naturvardsverket.se/data-och-statistik/avfall/kommunalt-avfall/',
      },
      {
        name: 'Levande sjöar och vattendrag – fördjupad utvärdering',
        organization: 'Havs- och vattenmyndigheten',
        url: 'https://www.havochvatten.se/download/18.beb19a418366a19e1cac9bc/1664802617668/rapport-2022-17-levande-sjoar-och-vattendrag-fu-23.pdf',
      },
    ],
    related: ['privatekonomi', 'arbetsloshet', 'migration'],
  },
  {
    slug: 'invandring-och-brott',
    category: 'Brott & trygghet',
    seoTitle: 'Brott och migrationsbakgrund – vad visar Brås statistik?',
    heading: 'Brott och migrationsbakgrund',
    description:
      'Vad visar Brå om brott och migrationsbakgrund? Utforska 48 brottstyper efter födelseregion samt alla brott efter födelseland, med nivåer och justerade överrisker.',
    lead:
      'Brås historiska registerstudie visar gruppskillnader i registrerad misstanke. Sverigefacit redovisar både region × brottstyp och land × alla brott, men studien kan inte avgöra varför skillnaderna finns.',
    temporalCoverage: '2015/2018',
    variableMeasured: ['Misstänkta per 1 000 efter födelseregion och brottstyp', 'Observerad överrisk', 'Standardiserad överrisk'],
    metrics: [
      { value: '8,0 %', label: 'utrikesfödda registrerade som misstänkta', period: '2015–2018' },
      { value: '3,2 %', label: 'referensgruppen registrerad som misstänkt', period: '2015–2018' },
      { value: '2,51× → 1,77×', label: 'rå respektive standardiserad överrisk', period: 'historisk kohort' },
    ],
    observed:
      'I kohorten registrerades 7,99 procent av utrikesfödda som minst skäligen misstänkta för minst ett brott, jämfört med 3,18 procent i referensgruppen.',
    policy:
      'Utbildning, arbetsmarknad, bostadssegregation, polisens arbetssätt och ålderssammansättning kan påverka. En del av skillnaden minskar i Brås statistiska standardisering.',
    limitation:
      'Kvarvarande association är inte en skattning av en migrationseffekt. Misstänkt är inte dömd, födelseland är inte etnicitet och gruppgenomsnitt säger inget om en enskild person.',
    definition:
      'Populationen var 8 066 363 personer som var minst 15 år och folkbokförda den 31 december 2014. Utfallet avser minst skäligen misstänkt för brott begångna 2015–2018.',
    sources: [
      {
        name: 'Misstänkta för brott bland personer med inrikes respektive utrikes bakgrund',
        organization: 'Brottsförebyggande rådet',
        url: 'https://bra.se/rapporter/arkiv/2021-08-25-misstankta-for-brott-bland-personer-med-inrikes-respektive-utrikes-bakgrund',
      },
      {
        name: 'Utsatthet för brott bland personer med utländsk bakgrund',
        organization: 'Brottsförebyggande rådet',
        url: 'https://bra.se/rapporter/arkiv/2024-05-21-utsatthet-for-brott-bland-personer-med-utlandsk-bakgrund',
      },
    ],
    related: ['brottslighet', 'migration', 'arbetsloshet'],
  },
];

export const topicBySlug = Object.fromEntries(
  seoTopics.map((topic) => [topic.slug, topic]),
) as Record<string, SeoTopic>;

export const topicPath = (slug: string) => `/statistik/${slug}`;
