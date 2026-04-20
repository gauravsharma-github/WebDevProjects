/* ============================================================================
   PROJECTS DATA
   ============================================================================
   To add a new project, copy one block and paste it into the array.
   To remove a project, delete its block.
   To reorder, drag the blocks around.

   Required fields:  title, description, tech, github, demo
   Optional fields:  year, status ("live" | "wip" | "archived")

   Notes:
   - `tech` is an array of short strings (shown as tags)
   - Use "#" for github or demo if a link doesn't apply yet
   - `status` defaults to "live" if omitted
   ============================================================================ */

const projects = [
  {
    title: "Expanding Cards",
    description:
      "Horizontal image panels that smoothly expand on click using CSS flex ratios. Built with zero dependencies — pure HTML, CSS, and vanilla JavaScript.",
    tech: ["HTML5", "CSS3", "JavaScript", "Flexbox"],
    github: "https://github.com/your-username/expanding-cards",
    demo: "https://your-username.github.io/expanding-cards/",
    year: 2025,
    status: "live",
  },
  {
    title: "Project Two",
    description:
      "Replace this block with your next project. A short sentence or two describing what it does and what's interesting about it.",
    tech: ["React", "TypeScript", "Tailwind"],
    github: "#",
    demo: "#",
    year: 2025,
    status: "wip",
  },
  {
    title: "Project Three",
    description:
      "Another placeholder. Add as many as you like — the page adapts automatically.",
    tech: ["Node.js", "Express", "MongoDB"],
    github: "#",
    demo: "#",
    year: 2024,
    status: "archived",
  },
];
