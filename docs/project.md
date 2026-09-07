# Project and content

logicalmethods.ai is an openly available course website for **Logical methods for
AI**, taught at Utrecht University. Its primary audience is undergraduate AI
students; independent learners can also use the material. The course explains
how logic supports knowledge representation, correct reasoning, and AI research,
including connections to contemporary AI.

The [About page](../content/about/_index.md) defines the learning outcomes:
identify applications of logic in AI, explain its strengths and weaknesses,
represent knowledge with formulas, apply automated reasoning algorithms, and
evaluate inferences for validity. It identifies Johannes Korbmacher as maintainer
and states that the website is not officially reviewed or approved by Utrecht
University. The [home page](../content/_index.md) marks the course as under active
development; do not assume every lesson is complete or reviewed.

## Learning material

| Source                                            | Role                                                                   |
| ---                                               | ---                                                                    |
| [`content/textbook/`](../content/textbook/)       | Reading before class; explanations, examples, and learning objectives. |
| [`content/slides/`](../content/slides/)           | Lecture material, including embedded Excalidraw presentations.         |
| [`content/exercises/`](../content/exercises/)     | Tutorial practice and solutions.                                       |
| [`content/assignments/`](../content/assignments/) | Homework sheets.                                                       |
| [`content/about/`](../content/about/)             | Course description, credits, and licensing information.                |

The textbook moves through logic and AI, valid inference, formal languages,
Boolean logic, satisfiability, conditionals, proofs, first-order logic and
inference, many-valued logic, probability, and learning. Related sections often
share topic names and weights, but are not exact mirrors: for example, the
textbook uses `proofs/`, while exercises and slides use `proof/`.

Additional routes serve the AI degree programme: [`tutoraat`](../content/tutoraat/)
contains tutoring guidance, and
[`verdiepingspakketten`](../content/verdiepingspakketten/) supports study-track
guidance. These sections and [`unlock`](../content/unlock/) are hidden from normal
navigation, not private. Quiz templates and scripts exist, but there is no
`content/quizzes/` section in this baseline.

## Editorial direction

Keep explanations suitable for AI undergraduates: introduce concepts, state
learning objectives where appropriate, and connect formal definitions and
algorithms to examples. Maintain consistent notation and check corresponding
textbook, exercise, and slide material when revising a topic. Preserve attribution
and separate mathematical correctness from questions of presentation.

The repository [README](../README.md) declares MIT licensing for site code and
CC BY 4.0 for course content. Preserve bundled dependencies' own license notices.
