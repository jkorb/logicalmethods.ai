const rules = [
  {
    id: 'q1‐learning',
    clauses: [
      [
        { question: 'question-1', has: 'preference-learning' },
        { question: 'question-1', not: 'preference-reasoning' },
        { question: 'question-1', not: 'preference-cognitive' }
      ]
    ],
    text: "Het lijkt erop dat je behoorlijk zeker bent van je keuze voor \
    <em>Learning and Computation</em>. Goed om te zien! Laten we samen bekijken \
    of dat ook aansluit bij onze inschatting.",
    scores: { learning: 2, reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q1‐reasoning',
    clauses: [
      [
        { question: 'question-1', not: 'preference-learning' },
        { question: 'question-1', has: 'preference-reasoning' },
        { question: 'question-1', not: 'preference-cognitive' }
      ]
    ],
    text: "Het lijkt erop dat je behoorlijk zeker bent van je keuze voor \
    <em>Reasoning and Computation</em>. Goed om te zien! Laten we samen \
    bekijken of dat ook aansluit bij onze inschatting.",
    scores: { learning: 0, reasoning: 2, cognitive: 0 }
  },
  {
    id: 'q1‐cognitive',
    clauses: [
      [
        { question: 'question-1', not: 'preference-learning' },
        { question: 'question-1', not: 'preference-reasoning' },
        { question: 'question-1', has: 'preference-cognitive' }
      ]
    ],
    text: "Het lijkt erop dat je behoorlijk zeker bent van je keuze voor \
    <em>Cognitive Processing</em>. Goed om te zien! Laten we samen bekijken of \
    dat ook aansluit bij onze inschatting.",
    scores: { learning: 0, reasoning: 0, cognitive: 2 }
  },
  {
    id: 'q1‐undecided-none',
    clauses: [
      [
        { question: 'question-1', not: 'preference-learning' },
        { question: 'question-1', not: 'preference-reasoning' },
        { question: 'question-1', not: 'preference-cognitive' }
      ]
    ],
    text: "Het lijkt erop dat je nog niet helemaal zeker weet welk \
    verdiepingspakket je wilt kiezen. Geen probleem—daar is deze fase juist \
    voor bedoeld. Laten we er samen naar kijken.",
    scores: { learning: 0, reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q1‐undecided-all',
    clauses: [
      [
        { question: 'question-1', has: 'preference-learning' },
        { question: 'question-1', has: 'preference-reasoning' },
        { question: 'question-1', has: 'preference-cognitive' }
      ]
    ],
    text: "Het lijkt erop dat je het liefst alle verdiepingspakketten zou \
    willen kiezen—dat is goed te begrijpen 😃 Je moet er één kiezen voor jaar \
    2, maar je kunt een ander pakket nog steeds opnemen in de \
    <a href=\"https://students.uu.nl/gw/ki/mijn-studie/profileringsruimte\" \
    target=\"_blank\">profileringsruimte</a> van onze bachelor. Laten we samen \
    bekijken wat het beste aansluit.",
    scores: { learning: 1, reasoning: 1, cognitive: 1 }
  },
  {
    id: 'q1‐undecided-learning-reasoning',
    clauses: [
      [
        { question: 'question-1', has: 'preference-learning' },
        { question: 'question-1', has: 'preference-reasoning' },
        { question: 'question-1', not: 'preference-cognitive' }
      ]
    ],
    text: "Het lijkt erop dat je twijfelt tussen \
    <em>Learning and Computation</em> en <em>Reasoning and Computation</em>. \
    Laten we kijken of we je kunnen helpen bij het maken van een keuze. Laten \
    we samen kijken of we je kunnen helpen bij het maken van een keuze. Goed om \
    te weten: je moet er één kiezen voor jaar 2, maar je kunt het andere nog \
    steeds volgen in de \
    <a href=\"https://students.uu.nl/gw/ki/mijn-studie/profileringsruimte\" \
    target=\"_blank\">profileringsruimte</a> van onze bachelor.",
    scores: { learning: 1, reasoning: 1, cognitive: 0 }
  },
  {
    id: 'q1‐undecided-learning-cognitie',
    clauses: [
      [
        { question: 'question-1', has: 'preference-learning' },
        { question: 'question-1', not: 'preference-reasoning' },
        { question: 'question-1', has: 'preference-cognitive' }
      ]
    ],
    text: "Het lijkt erop dat je twijfelt tussen <em>Learning and \
    Computation</em> en <em>Cognitive Processing</em>. Laten we kijken of we je \
    kunnen helpen bij het maken van een keuze. Goed om te weten: je moet er één \
    kiezen voor jaar 2, maar je kunt het andere nog steeds volgen in de \
    <a href=\"https://students.uu.nl/gw/ki/mijn-studie/profileringsruimte\" \
    target=\"_blank\">profileringsruimte</a> van onze bachelor.",
    scores: { learning: 1, reasoning: 0, cognitive: 1 }
  },
  {
    id: 'q1‐undecided-reasoning-cognitive',
    clauses: [
      [
        { question: 'question-1', not: 'preference-learning' },
        { question: 'question-1', has: 'preference-reasoning' },
        { question: 'question-1', has: 'preference-cognitive' }
      ]
    ],
    text: "Het lijkt erop dat je twijfelt tussen <em>Reasoning and \
    Computation</em> en <em>Cognitive Processing</em>. Laten we kijken of we je \
    kunnen helpen bij het maken van een keuze. Goed om te weten: je moet er één \
    kiezen voor jaar 2, maar je kunt het andere nog steeds volgen in de \
    <a href=\"https://students.uu.nl/gw/ki/mijn-studie/profileringsruimte\" \
    target=\"_blank\">profileringsruimte</a> van onze bachelor.",
    scores: { learning: 0, reasoning: 1, cognitive: 1 }
  },
  {
    id: 'q2‐only-math',
    clauses: [
      [
        { question: 'question-3', has: 'like-wiski' },
        { question: 'question-2', not: 'like-logmeth' },
        { question: 'question-2', not: 'like-compling' },
        { question: 'question-2', not: 'like-lang' },
        { question: 'question-2', not: 'like-modprog' },
        { question: 'question-2', not: 'like-natuur' },
        { question: 'question-2', not: 'like-ml' },
        { question: 'question-2', not: 'like-icw' },
      ],
      [
        { question: 'question-3', has: 'dislike-logmeth' },
        { question: 'question-3', has: 'dislike-compling' },
        { question: 'question-3', has: 'dislike-lang' },
        { question: 'question-3', has: 'dislike-modprog' },
        { question: 'question-3', has: 'dislike-natuur' },
        { question: 'question-3', has: 'dislike-ml' },
        { question: 'question-3', not: 'dislike-wiski' },
        { question: 'question-3', has: 'dislike-icw' },
      ]
    ],
    text: "Je favoriete vak lijkt <em>Wiskunde voor KI</em> te zijn geweest – \
    mooi! Dit vak sluit niet direct aan bij een specifiek verdiepingspakket, \
    maar vormt wél een sterke basis voor zowel <em>Learning and \
    Computation</em> als <em>Reasoning and Computation</em>.",
    scores: { learning: 1, reasoning: 1, cognitive: 0 }
  },
  {
    id: 'q2‐no-favorite',
    clauses: [
      [
        { question: 'question-2', not: 'like-logmeth' },
        { question: 'question-2', not: 'like-compling' },
        { question: 'question-2', not: 'like-lang' },
        { question: 'question-2', not: 'like-modprog' },
        { question: 'question-2', not: 'like-natuur' },
        { question: 'question-2', not: 'like-ml' },
        { question: 'question-2', not: 'like-wiski' },
        { question: 'question-2', not: 'like-icw' },
      ],
      [
        { question: 'question-3', has: 'dislike-logmeth' },
        { question: 'question-3', has: 'dislike-compling' },
        { question: 'question-3', has: 'dislike-lang' },
        { question: 'question-3', has: 'dislike-modprog' },
        { question: 'question-3', has: 'dislike-natuur' },
        { question: 'question-3', has: 'dislike-ml' },
        { question: 'question-3', has: 'dislike-wiski' },
        { question: 'question-3', has: 'dislike-icw' },
      ]
    ],
    text: "Je hebt geen vakken aangegeven die je echt leuk vond in jaar 1.Dat is \
    niet niks, en het is belangrijk om daar iets mee te doen. Misschien is het \
    goed om hier eens over te praten met de <a href=\"https://students.uu.nl/gw/ki/contact/studieadviseur\" \
    target=\"_blank\">studieadviseurs</a> — samen kunnen jullie kijken wat er \
    te doen is.",
    scores: { learning: 0, reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q2‐icw-clear',
    clauses: [
      [
        { question: 'question-2', has: 'like-icw' },
        { question: 'question-3', not: 'dislike-icw' }
      ]
    ],
    text: "<em>Inleiding tot de cognitiewetenschap</em> was een van je \
    favoriete vakken – mooi! Dit vak sluit uitstekend aan bij het \
    verdiepingspakket <em>Cognitive Processing</em>.",
    scores: { learning: 0, reasoning: 0, cognitive: 1 }
  },
  {
    id: 'q2‐reasoning-clear',
    clauses: [
      [
        { question: 'question-2', has: 'like-logmeth' },
        { question: 'question-3', not: 'dislike-logmeth' },
        { question: 'question-3', not: 'dislike-compling' },
        { question: 'question-3', not: 'dislike-lang' },
        { question: 'question-3', not: 'dislike-wiski' }
      ],
      [
        { question: 'question-2', has: 'like-lang' },
        { question: 'question-3', not: 'dislike-logmeth' },
        { question: 'question-3', not: 'dislike-compling' },
        { question: 'question-3', not: 'dislike-lang' },
        { question: 'question-3', not: 'dislike-wiski' }
      ],
      [
        { question: 'question-2', has: 'like-compling' },
        { question: 'question-3', not: 'dislike-logmeth' },
        { question: 'question-3', not: 'dislike-compling' },
        { question: 'question-3', not: 'dislike-lang' },
        { question: 'question-3', not: 'dislike-wiski' }
      ]
    ],
    text: "Tussen je favoriete vakken zitten er een paar die goed aansluiten \
    bij het verdiepingspakket <em>Reasoning and Computation</em>. Denk \
    bijvoorbeeld aan <em>Logische methoden voor KI I</em>, <em>Formal and \
    Natural Languages</em> en <em>Computational Linguistics</em> – vakken die \
    sterk de nadruk leggen op formele en computationele benaderingen.",
    scores: { learning: 0, reasoning: 2, cognitive: 0 }
  },
  {
    id: 'q2‐reasoning-clear-nomath',
    clauses: [
      [
        { question: 'question-2', has: 'like-logmeth' },
        { question: 'question-3', not: 'dislike-logmeth' },
        { question: 'question-3', not: 'dislike-compling' },
        { question: 'question-3', not: 'dislike-lang' },
        { question: 'question-3', has: 'dislike-wiski' }
      ],
      [
        { question: 'question-2', has: 'like-lang' },
        { question: 'question-3', not: 'dislike-logmeth' },
        { question: 'question-3', not: 'dislike-compling' },
        { question: 'question-3', not: 'dislike-lang' },
        { question: 'question-3', has: 'dislike-wiski' }
      ],
      [
        { question: 'question-2', has: 'like-compling' },
        { question: 'question-3', not: 'dislike-logmeth' },
        { question: 'question-3', not: 'dislike-compling' },
        { question: 'question-3', not: 'dislike-lang' },
        { question: 'question-3', has: 'dislike-wiski' }
      ]
    ],
    text: "Tussen je favoriete vakken zitten er een paar die goed aansluiten \
    bij het verdiepingspakket <em>Reasoning and Computation</em>. Denk \
    bijvoorbeeld aan <em>Logische methoden voor KI I</em>, <em>Formal and \
    Natural Languages</em> en <em>Computational Linguistics</em> – vakken die \
    sterk de nadruk leggen op formele en computationele benaderingen. Tegelijk \
    heb je aangegeven dat je <em>Wiskunde voor KI</em> niet zo leuk vond. Houd \
    er rekening mee dat de vakken in dit verdiepingspakket allemaal een zekere \
    mate van wiskunde vereisen. Dat hoeft geen onoverkomelijk probleem te zijn, \
    maar het is wel iets om mee te wegen in je keuze.",
    scores: { learning: 0, reasoning: 1, cognitive: 0 }
  },
  {
    id: 'q2‐reasoning-weak',
    clauses: [
      [
        { question: 'question-2', has: 'like-logmeth' },
        { question: 'question-3', has: 'dislike-compling' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-logmeth' },
        { question: 'question-3', has: 'dislike-lang' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-compling' },
        { question: 'question-3', has: 'dislike-logmeth' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-compling' },
        { question: 'question-3', has: 'dislike-lang' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-lang' },
        { question: 'question-3', has: 'dislike-compling' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-lang' },
        { question: 'question-3', has: 'dislike-logmeth' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
    ],
    text: "Tussen je favoriete vakken zitten enkele die goed aansluiten bij het \
    verdiepingspakket <em>Reasoning and Computation</em> – zoals <em>Logische \
    methoden voor KI I</em>, <em>Formal and Natural Languages</em> en \
    <em>Computational Linguistics</em>. Aan de andere kant gaf je ook aan dat \
    je sommige vakken uit deze richting minder leuk vond. Het is misschien \
    goed om er nog eens rustig naar te kijken en te overwegen hoe goed dit \
    pakket aansluit bij wat je zoekt.", 
    scores: { learning: 0, reasoning: 1, cognitive: 0 }
  },
  {
    id: 'q2‐reasoning-weak-nomath',
    clauses: [
      [
        { question: 'question-2', has: 'like-logmeth' },
        { question: 'question-3', has: 'dislike-compling' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-logmeth' },
        { question: 'question-3', has: 'dislike-lang' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-compling' },
        { question: 'question-3', has: 'dislike-logmeth' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-compling' },
        { question: 'question-3', has: 'dislike-lang' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-lang' },
        { question: 'question-3', has: 'dislike-compling' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-lang' },
        { question: 'question-3', has: 'dislike-logmeth' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
    ],
    text: "Tussen je favoriete vakken zitten enkele die goed aansluiten bij het \
    verdiepingspakket <em>Reasoning and Computation</em> – zoals <em>Logische \
    methoden voor KI I</em>, <em>Formal and Natural Languages</em> en \
    <em>Computational Linguistics</em>. Aan de andere kant gaf je ook aan dat \
    je sommige vakken uit deze richting minder leuk vond. \
    Het is misschien goed om er nog eens rustig naar te kijken en te overwegen \
    hoe goed dit pakket aansluit bij wat je zoekt. \
    Tegelijk gaf je aan dat je niet alle vakken uit die richting even leuk \
    vond. Het is dus goed om nog even kritisch te kijken of dit pakket echt \
    bij je past. Tegelijk heb je aangegeven dat je <em>Wiskunde voor KI</em> \
    niet zo leuk vond. Houd er rekening mee dat de vakken in dit \
    verdiepingspakket allemaal een zekere mate van wiskunde vereisen. Dat \
    hoeft geen onoverkomelijk probleem te zijn, maar het is wel iets om mee te \
    wegen in je keuze.",
    scores: { learning: 0, reasoning: 1, cognitive: 0 }
  },
  {
    id: 'q2‐learning-clear',
    clauses: [
      [
        { question: 'question-2', has: 'like-natuur' },
        { question: 'question-3', not: 'dislike-natuur' },
        { question: 'question-3', not: 'dislike-modprog' },
        { question: 'question-3', not: 'dislike-ml' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-ml' },
        { question: 'question-3', not: 'dislike-natuur' },
        { question: 'question-3', not: 'dislike-modprog' },
        { question: 'question-3', not: 'dislike-ml' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-modprog' },
        { question: 'question-3', not: 'dislike-natuur' },
        { question: 'question-3', not: 'dislike-modprog' },
        { question: 'question-3', not: 'dislike-ml' },
        { question: 'question-3', not: 'dislike-wiski' },
      ]
    ],
    text: "Tussen jouw favoriete vakken zitten sommige van de vakken die goed \
    aansluiten bij het verdiepingspakket <em>Learning and \
    Computation</em> (dat wil zeggen: <em>Natuur en Berekening</em>, \
    <em>Modeleren en Programmeren</em>, <em>Machine Learning I</em>).",
    scores: { learning: 2, reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q2‐learning-clear-nomath',
    clauses: [
      [
        { question: 'question-2', has: 'like-natuur' },
        { question: 'question-3', not: 'dislike-natuur' },
        { question: 'question-3', not: 'dislike-modprog' },
        { question: 'question-3', not: 'dislike-ml' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-ml' },
        { question: 'question-3', not: 'dislike-natuur' },
        { question: 'question-3', not: 'dislike-modprog' },
        { question: 'question-3', not: 'dislike-ml' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-modprog' },
        { question: 'question-3', not: 'dislike-natuur' },
        { question: 'question-3', not: 'dislike-modprog' },
        { question: 'question-3', not: 'dislike-ml' },
        { question: 'question-3', has: 'dislike-wiski' },
      ]
    ],
    text: "Tussen jouw favoriete vakken zitten sommige van de vakken die goed \
    aansluiten bij het verdiepingspakket <em>Learning and \
    Computation</em> (dat wil zeggen: <em>Natuur en Berekening</em>, \
    <em>Modeleren en Programmeren</em>, <em>Machine Learning I</em>). \
    Tegelijk heb je aangegeven dat je <em>Wiskunde voor KI</em> niet zo leuk \
    vond. Houd er rekening mee dat de vakken in dit verdiepingspakket \
    allemaal een zekere mate van wiskunde vereisen. Dat hoeft geen \
    onoverkomelijk probleem te zijn, maar het is wel iets om mee te wegen in \
    je keuze.",
    scores: { learning: 1, reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q2‐learning-weak',
    clauses: [
      [
        { question: 'question-2', has: 'like-natuur' },
        { question: 'question-3', has: 'dislike-modprog' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-natuur' },
        { question: 'question-3', has: 'dislike-ml' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-modprog' },
        { question: 'question-3', has: 'dislike-natuur' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-modprog' },
        { question: 'question-3', has: 'dislike-ml' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-ml' },
        { question: 'question-3', has: 'dislike-modprog' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-ml' },
        { question: 'question-3', has: 'dislike-natuur' },
        { question: 'question-3', not: 'dislike-wiski' },
      ],
    ],
    text: "Je gaf aan dat vakken als <em>Natuur en Berekening</em>, \
    <em>Modeleren en Programmeren</em> en <em>Machine Learning I</em> tot je \
    favorieten horen – die sluiten goed aan bij het verdiepingspakket \
    <em>Learning and Computation</em>. Tegelijk laat je voorkeur zien dat \
    niet álle vakken in deze richting je even goed liggen. Het is daarom \
    verstandig om nog eens kritisch te kijken of dit pakket bij je leerstijl \
    en interesses past.",
    scores: { learning: 0, reasoning: 1, cognitive: 0 }
  },
  {
    id: 'q2‐learning-weak-nomath',
    clauses: [
      [
        { question: 'question-2', has: 'like-natuur' },
        { question: 'question-3', has: 'dislike-modprog' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-natuur' },
        { question: 'question-3', has: 'dislike-ml' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-modprog' },
        { question: 'question-3', has: 'dislike-natuur' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-modprog' },
        { question: 'question-3', has: 'dislike-ml' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-ml' },
        { question: 'question-3', has: 'dislike-modprog' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
      [
        { question: 'question-2', has: 'like-ml' },
        { question: 'question-3', has: 'dislike-natuur' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],
    ],
    text: "Je gaf aan dat vakken als <em>Natuur en Berekening</em>, \
    <em>Modeleren en Programmeren</em> en <em>Machine Learning I</em> tot je \
    favorieten horen – die sluiten goed aan bij het verdiepingspakket \
    <em>Learning and Computation</em>. Tegelijk laat je voorkeur zien dat \
    niet álle vakken in deze richting je even goed liggen. Het is daarom \
    verstandig om nog eens kritisch te kijken of dit pakket bij je leerstijl \
    en interesses past. Tegelijk gaf je aan dat je niet alle vakken uit die \
    richting even leuk vond. Het is dus goed om nog even kritisch te kijken \
    of dit pakket echt bij je past.",
    scores: { learning: 0, reasoning: 1, cognitive: 0 }
  },
  {
    id: 'q2‐inconsistency',
    clauses: [
      [
        { question: 'question-2', has: 'like-logmeth' },
        { question: 'question-3', has: 'dislike-logmeth' },
      ],
      [
        { question: 'question-2', has: 'like-compling' },
        { question: 'question-3', has: 'dislike-compling' },
      ],
      [
        { question: 'question-2', has: 'like-lang' },
        { question: 'question-3', has: 'dislike-lang' },
      ],      [
        { question: 'question-2', has: 'like-wiski' },
        { question: 'question-3', has: 'dislike-wiski' },
      ],      [
        { question: 'question-2', has: 'like-natuur' },
        { question: 'question-3', has: 'dislike-natuur' },
      ],      [
        { question: 'question-2', has: 'like-modprog' },
        { question: 'question-3', has: 'dislike-modprog' },
      ],      [
        { question: 'question-2', has: 'like-ml' },
        { question: 'question-3', has: 'dislike-ml' },
      ],
      [
        { question: 'question-2', has: 'like-icw' },
        { question: 'question-3', has: 'dislike-icw' }
      ]
    ],
    text: "Het lijkt erop dat je gemengde gevoelens hebt over minstens één vak. \
    Dat kan natuurlijk gebeuren – soms klikt het inhoudelijk wél, maar speelt \
    er iets anders mee. Misschien was het toeval, of iets om nog eens op terug \
    te kijken.",
    scores: { learning: 0, reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q4‐inconsistency',
    clauses: [
      [
        { question: 'question-4', has: 'like-memorizing' },
        { question: 'question-5', has: 'dislike-memorizing' },
      ],
      [
        { question: 'question-4', has: 'like-experiments' },
        { question: 'question-5', has: 'dislike-experiments' },
      ],
      [
        { question: 'question-4', has: 'like-programming' },
        { question: 'question-5', has: 'dislike-programming' },
      ],      
      [
        { question: 'question-4', has: 'like-math' },
        { question: 'question-5', has: 'dislike-math' },
      ],      
      [
        { question: 'question-4', has: 'like-arguing' },
        { question: 'question-5', has: 'dislike-arguing' },
      ],      
      [
        { question: 'question-4', has: 'like-writing' },
        { question: 'question-5', has: 'dislike-writing' },
      ],      
    ],
    text: "Het lijkt erop dat je gemengde gevoelens hebt over bepaalde \
    werkvormen. Dat is heel begrijpelijk – soms past de inhoud wel, maar ligt \
    de manier van werken je minder goed. Misschien was het toeval, of iets om \
    nog eens rustig bij stil te staan.",
    scores: { learning: 0, reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q4‐like-none',
    clauses: [
      [
        { question: 'question-5', has: 'dislike-memorizing' },
        { question: 'question-5', has: 'dislike-experiments' },
        { question: 'question-5', has: 'dislike-programming' },
        { question: 'question-5', has: 'dislike-math' },
        { question: 'question-5', has: 'dislike-arguing' },
        { question: 'question-5', has: 'dislike-writing' },
      ],      
      [
        { question: 'question-4', not: 'like-memorizing' },
        { question: 'question-4', not: 'like-experiments' },
        { question: 'question-4', not: 'like-programming' },
        { question: 'question-4', not: 'like-math' },
        { question: 'question-4', not: 'like-arguing' },
        { question: 'question-4', not: 'like-writing' },
      ],      
    ],
    text: "Je hebt aangegeven dat je geen van de methoden echt prettig vindt om \
    mee te werken. Dat is belangrijke informatie, want methoden vormen een \
    wezenlijk onderdeel van onze studie. Het kan helpen om dit te \
    bespreken met de <a href=\"https://students.uu.nl/gw/ki/contact/studieadviseur\" \
    target=\"_blank\">studieadviseurs</a> — zij kunnen met je meedenken over \
    wat bij je past, of hoe je hier verder mee om kunt gaan.", 
    scores: { learning: 0, reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q4‐cognition-clear',
    clauses: [
      [
        { question: 'question-4', has: 'like-memorizing' },
        { question: 'question-4', has: 'like-experiments' },
        { question: 'question-5', not: 'dislike-memorizing' },
        { question: 'question-5', not: 'dislike-experiments' },
      ],      
    ],
    text: "Je hebt aangegeven dat je methoden als het uit je hoofd leren van \
    feiten en experimenteel onderzoek prettig vindt. Die passen goed bij het \
    verdiepingspakket <em>Cognitive Processing</em>, waar deze benaderingen \
    regelmatig terugkomen.", 
    scores: { learning: 0, reasoning: 0, cognitive: 2 }
  },
  {
    id: 'q4‐cognition-weak',
    clauses: [
      [
        { question: 'question-4', has: 'like-memorizing' },
        { question: 'question-5', has: 'dislike-experiments' },
      ],      
      [
        { question: 'question-5', has: 'dislike-memorizing' },
        { question: 'question-4', has: 'like-experiments' },
      ],   
    ],
    text: "Je hebt aangegeven dat je één van de methoden – bijvoorbeeld het uit \
    je hoofd leren van feiten of experimenteel onderzoek – prettig vindt, maar \
    dat je minder enthousiast bent over de andere. Beide methoden spelen echter \
    een belangrijke rol binnen het verdiepingspakket <em>Cognitive \
    Processing</em>. Het is daarom verstandig om goed na te denken of je je \
    comfortabel voelt met deze combinatie, en of dit pakket als geheel bij je \
    past.", 
    scores: { learning: 0, reasoning: 0, cognitive: 1 }
  },
  {
    id: 'q4‐reasoning-clear',
    clauses: [
      [
        { question: 'question-4', has: 'like-arguing' },
        { question: 'question-4', has: 'like-writing' },
        { question: 'question-4', has: 'like-math' },
        { question: 'question-5', not: 'dislike-arguing' },
        { question: 'question-5', not: 'dislike-writing' },
        { question: 'question-5', not: 'dislike-math' },
        { question: 'question-5', not: 'dislike-programming' },

      ],      
    ],
    text: "Je hebt aangegeven dat je werkvormen als argumentatie, het schrijven \
    van teksten en het oplossen van wiskundige problemen prettig vindt. Die \
    sluiten goed aan bij het verdiepingspakket <em>Reasoning and \
    Computation</em>. Houd er wel rekening mee dat programmeren ook een rol \
    speelt binnen dit pakket – het is niet de hoofdfocus, maar het is \
    belangrijk dat je er in elk geval geen sterke afkeer van hebt. Misschien \
    is het de moeite waard om dit pakket eens van dichterbij te bekijken.",
    scores: { learning: 0, reasoning: 2, cognitive: 0 }
  },
  {
    id: 'q4‐reasoning-weak',
    clauses: [
      [
        { question: 'question-4', has: 'like-arguing' },
        { question: 'question-5', has: 'dislike-writing' },
      ],      
      [
        { question: 'question-4', has: 'like-arguing' },
        { question: 'question-5', has: 'dislike-math' },
      ],      
      [
        { question: 'question-4', has: 'like-writing' },
        { question: 'question-5', has: 'dislike-arguing' },
      ],   
      [
        { question: 'question-4', has: 'like-writing' },
        { question: 'question-5', has: 'dislike-math' },
      ],   
      [
        { question: 'question-4', has: 'like-math' },
        { question: 'question-5', has: 'dislike-arguing' },
      ], 
      [
        { question: 'question-4', has: 'like-math' },
        { question: 'question-5', has: 'dislike-writing' },
      ], 

    ],
    text: "Sommige van de werkvormen die je prettig vindt sluiten goed aan bij \
    het verdiepingspakket <em>Reasoning and Computation</em> (zoals \
    argumentatie, het schrijven \ van teksten en het oplossen van wiskundige \
    problemen). Tegelijk heb je aangegeven dat je minder enthousiast bent over \
    werkvormen die ook een belangrijke rol spelen binnen dit pakket. Het is \
    daarom verstandig om hier nog eens goed over na te denken: sluit de \
    combinatie van werkvormen echt aan bij hoe jij het liefst leert?", 
    scores: { learning: 0, reasoning: 1, cognitive: 0 }
  }, 
  {
    id: 'q4‐learning-clear',
    clauses: [
      [
        { question: 'question-4', has: 'like-programming' },
        { question: 'question-4', has: 'like-math' },
        { question: 'question-5', not: 'dislike-programming' },
        { question: 'question-5', not: 'dislike-math' },
      ],      
    ],
    text: "Je hebt aangegeven dat je programmeren en het oplossen van \
    wiskundige problemen leuke werkvormen vindt – een sterke combinatie! Deze \
    vaardigheden vormen de kern van het verdiepingspakket <em>Learning and \
    Computation</em>. Zeker de moeite waard om dat pakket eens goed te \
    bekijken.", 
    scores: { learning: 2 , reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q4‐learning-weaker',
    clauses: [
      [
        { question: 'question-4', has: 'like-math' },
        { question: 'question-4', not: 'like-programming' },
        { question: 'question-5', not: 'dislike-programming' },
        { question: 'question-5', not: 'dislike-math' },
      ],      
      [
        { question: 'question-4', has: 'like-programming' },
        { question: 'question-4', not: 'like-math' },
        { question: 'question-5', not: 'dislike-programming' },
        { question: 'question-5', not: 'dislike-math' },
      ],      
    ],
    text: "Je hebt aangegeven dat je óf programmeren óf het oplossen van \
    wiskundige problemen een prettige werkvorm vindt. Beide vaardigheden spelen \
    een belangrijke rol binnen het verdiepingspakket <em>Learning and \
    Computation</em>. Als dat je interesse wekt, is het zeker de moeite waard \
    om dit pakket eens goed te bekijken.", 
    scores: { learning: 1 , reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q4‐learning-weak',
    clauses: [
      [
        { question: 'question-4', has: 'like-programming' },
        { question: 'question-5', has: 'dislike-math' },
      ],      
      [
        { question: 'question-5', has: 'dislike-math' },
        { question: 'question-4', has: 'like-programming' },
      ],   
    ],
    text: "Sommige van de werkvormen die je prettig vindt passen goed bij het \
    verdiepingspakket <em>Learning and Computation</em> – denk aan programmeren \
    en het oplossen van wiskundige problemen. Tegelijk heb je aangegeven dat je \
    minder enthousiast bent over werkvormen die ook een belangrijke rol spelen \
    binnen dit pakket, zoals modelleren of computationele benaderingen. Het is \
    daarom verstandig om goed te overwegen of deze combinatie van werkvormen \
    past bij jouw manier van leren.", 
    scores: { learning: 1, reasoning: 0, cognitive: 0 }
  },
  {
    id: 'q6‐ai',
    clauses: [
      [
        { question: 'question-6', has: 'master-ai' },
      ],      
    ],
    text: "Je hebt interesse in een AI-master – fantastisch! Al onze \
    verdiepingspakketten bereiden je goed voor op de AI-masters in Utrecht. Let \
    er wel op dat sommige masterprogramma’s aan andere universiteiten \
    aanvullende eisen stellen, vooral over informaticavakken.", 
    scores: { learning: 1, reasoning: 1, cognitive: 1 }
  },
  {
    id: 'q6‐philosophy',
    clauses: [
      [
        { question: 'question-6', has: 'master-philosophy' },
      ],      
    ],
    text: "Filosofie als masterkeuze – interessant! Alle verdiepingspakketten \
    bieden een brede basis om in te stromen, maar inhoudelijk sluit \
    <em>Reasoning and Computation</em> heel goed aan bij de \
    denkwijzen en formele benaderingen die binnen veel filosofie cursussen’s \
    centraal staan. Let op dat je in je profileringsruimte nog aanvullende \
    filosofievakken nodig hebt om aan de toelatingseisen te voldoen.", 
    scores: { learning: 1, reasoning: 1, cognitive: 1 }
  },
  {
    id: 'q6‐cs',
    clauses: [
      [
        { question: 'question-6', has: 'master-cs' },
      ],      
    ],
    text: "Geïnteresseerd in een master zoals <em>Computing Sciences</em> of \
    <em>(Applied) Data Science</em>? Dan sluit het verdiepingspakket \
    <em>Learning and Computation</em> goed aan, met name vanwege de nadruk op \
    programmeren en computationele modellen. Ook <em>Reasoning and \
    Computation</em> kan een optie zijn. In elk geval moet je in je profileringsruimte de \
    juiste aanvullende vakken kiesen om aan sommige toelatingseisen te voldoen.", 
    scores: { learning: 2, reasoning: 1, cognitive: 0 }
  },
  {
    id: 'q6‐linguistics',
    clauses: [
      [
        { question: 'question-6', has: 'master-linguistics' },
      ],      
    ],
    text: "Als je geïnteresseerd bent in een master Linguistics, dan biedt \
    het verdiepingspakket <em>Reasoning and Computation</em> een inhoudelijk \
    goede basis. Houd er wel rekening mee dat dit alleen niet voldoende is: \
    voor toelating is doorgaans zo’n 45 EC aan taalkundige vakken nodig. Die \
    kun je behalen via gerichte keuzes in je profileringsruimte.", 
    scores: { learning: 0, reasoning: 2, cognitive: 0 }
  },
  {
    id: 'q6-neuro',
    clauses: [
      [
        { question: 'question-6', has: 'master-neuro' },
      ],      
    ],
    text: "Overweeg je een master in de richting van Psychologie of \
    Neurowetenschappen, zoals <em>Neuroscience and Cognition</em> of \
    <em>Applied Cognitive Psychology</em>? Dan ligt het verdiepingspakket \
    <em>Cognitive Processing</em> voor de hand. Zorg er daarbij wel voor dat je \
    via je profileringsruimte voldoende relevante vakken kiest om aan de \
    ingangseisen te voldoen.", 
    scores: { learning: 0, reasoning: 0, cognitive: 2 }
  },
  {
    id: 'q6‐none',
    clauses: [
      [
        { question: 'question-6', not: 'master-ai' },
        { question: 'question-6', not: 'master-cs' },
        { question: 'question-6', not: 'master-philosophy' },
        { question: 'question-6', not: 'master-linguistics' },
        { question: 'question-6', not: 'master-neuro' },
      ],      
    ],
    text: "Je hebt (nog) geen masterkeuze aangegeven – helemaal prima. \
    Misschien ben je er gewoon nog niet uit, of misschien overweeg je om na je \
    bachelor meteen de arbeidsmarkt op te gaan. In dat laatste geval kun je het \
    verdiepingspakket benaderen vanuit een praktische invalshoek: wat voor werk \
    zou je later willen doen? Dat is een grotere vraag dan we hier kunnen \
    beantwoorden, maar het kan je helpen bij je keuze.</p><p> Twijfel je nog \
    over een master? Dan kun je het verdiepingspakket ook zien als een soort \
    teaser: <em>Learning and Computation</em> sluit goed aan bij masters in \
    Computing en AI, <em>Reasoning and Computation</em> bij Filosofie en \
    Taalwetenschap, en <em>Cognitive Processing</em> bij Psychologie en \
    Neurowetenschappen. Zo kun je alvast proeven aan een richting die je \
    interessant lijkt.", 
    scores: { learning: 0, reasoning: 0, cognitive: 0 }
  },
];
