# Brief contract

Source: `context/course-materials/cw2-brief.pdf` (4 pages), read in full on 26.11.2026.
Module: Systems Analysis and Design 6BUIS026C. CW2 is individual and weighs 60% of the module (p1).

**The PDF wins.** If this file and the PDF disagree, follow the PDF, fix this file and tell the user what differed.
This contract covers the prototypes and the submission rules that touch them. The UML diagrams, the methodology section and the Word report are written elsewhere.

## Deadline

| ID | Rule | Page | Quote |
| --- | --- | --- | --- |
| D-01 | Deadline is 26 November 2026. No time of day is given. | p1 | "Submission deadline 26-11-2026" |

## Prototype requirements

| ID | Requirement | Page | Quote |
| --- | --- | --- | --- |
| B-01 | Two prototypes: one high-fidelity, one low-fidelity. | p2 | "Develop two prototypes for your case – one high-fidelity prototype (can use AI) and one low-fidelity prototype." |
| B-02 | The prototypes present the main functions of the system. No number of screens or flows is given. | p2 | "You should present the main functions of the system in your prototype." |
| B-03 | The high-fi is an executable, functioning product. | p2 | "High fidelity prototype must be an executable program." and "High-fidelity prototype must be a functioning product." |
| B-04 | A video of the running application, at most 1 minute, is submitted along with the code. The marker does not run the code. | p2 | "You must submit maximum 1 minute video recording of your running application along with your code. The marker will not run executable code on his/her machine for security reasons." |
| B-05 | The screencast explains the application. Without it the work counts as not submitted. | p2 | "If you fail to submit a screencast explaining the application, it will be considered as non-submission." |
| B-06 | The low-fi is at least a series of drawings linked to each other. | p2 | "Low-fidelity prototype can be as simple as a series of drawings linked to each other. You may use online services like https://draw.io to prepare it." |
| B-07 | The prototype files are clearly identifiable, for example in the root folder. | p2 | "Make sure the prototype files are clearly identifiable. For example, put it into the root folder. If it is not clearly identifiable, it may not be marked." |
| B-08 | AI agents may build the high-fi. | p2 | "You can use any AI agent to build your high-fidelity prototype (Claude, Codex, etc.)." |
| B-09 | The Word report contains the prototypes as screencast, screenshots and links. | p3 | "Report in Microsoft Word format containing: 1. Prototypes (screencast, screenshots and links)." |
| B-10 | The report is named `SAD_CW2_STUDENTID.docx` and is not zipped. | p3 | "Please name your file in the following format: SAD_CW2_STUDENTID.docx." and "Do not archive (zip) your file." |

## Marks and penalties (p4, "Assessment criteria/marking scheme")

| ID | Item | Points | Quote |
| --- | --- | --- | --- |
| M-01 | Prototypes in total | 50 of 100 | "Prototypes ... 50" |
| M-02 | Low-fidelity prototype | 15 | "Low fidelity prototype: 15 points." |
| M-03 | High-fidelity prototype | 35 | "High fidelity prototype: 35 points." |
| P-01 | Low-fi is only wireframes | −6 | "Low fidelity prototypes are just wireframes: -6 points." |
| P-02 | No video | −35, and non-submission under B-05 | "No video recording: -35 points." |
| P-03 | No code | −35 | "No code submitted: -35 points." |

## Not in the brief

These are not requirements from the PDF. Check them, but report them under their own heading and never as a brief penalty.

| ID | Item | Where it comes from |
| --- | --- | --- |
| U-01 | The source code and the video go in a separate zip, with the prototype files and a README clearly at its root. The zip does not contain the harness or `context/`. | The user's stated practice. The PDF describes only the `.docx` upload (p3). |
| U-02 | The links in the report (repository, live app, Figma prototype, video) open for someone who is not logged in. | The user's reading of "links" in B-09. |
| U-03 | "Just wireframes" (P-01) means drawings with no links between them. | Inference from B-06. The PDF does not define it. |
| U-04 | The zip also holds the AI usage record, `ai-usage/prompts.md`: the prompts used on CW2, tidied but not invented. | The user's stated practice, recorded 26.11.2026 (decisions 42, 44 and 45). |
| R-01 | The brief allows AI for the high-fi in so many words (B-01, B-08) and says nothing about AI for the low-fi. The low-fi is built through the Figma MCP by the user's decision. | Risk, recorded 26.11.2026. |

## Notes from the lectures (supporting, not requirements)

The slide text never defines low or high fidelity. Slide images were not viewed. Files are in `context/course-materials/` (`lecture-01-intro-sdlc.pdf`, `lecture-03-prototyping.pdf`, `tutorial-06-figma-prototyping.pdf`).

- Lecture 01 p30: "Anything can be considered a prototype, working or not. For example: drawing, working software, video, HTML version of a desktop app."
- Lecture 03 p17: "Software prototyping is the process of creating an incomplete model of the future full-featured software."
- Tutorial 06 p7: "We will use Figma. It is industry standard…". Tutorials 06 to 08 cover Figma basics, auto layout, components and animations.

## How to use this contract

1. Read it before producing any coursework output.
2. Before saying a piece of work is done, run the `coursework-check` skill against the IDs above.
3. Never add a requirement that has no row here. If something seems missing, re-read the PDF and ask the user.
