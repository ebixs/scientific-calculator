# Scientific Calculator

A clean, dependency-free scientific calculator built with vanilla HTML, CSS, and JavaScript.

**[Live demo](#)** ← replace with your GitHub Pages link once deployed

## Features

- Basic operations: addition, subtraction, multiplication, division
- Scientific operations: square root, square, power (xʸ), reciprocal (1/x), percent
- Operation chaining (e.g. `3 + 4 + 5` evaluates the running total)
- Full keyboard support (digits, `+ - * /`, `Enter`, `Backspace`, `Esc`)
- Responsive layout, works on mobile
- No frameworks, no build step — open `index.html` and it runs

## Why this project

Built to practice DOM manipulation, state management without a framework, and
basic UI/visual design fundamentals.

## Tech stack

- HTML5
- CSS3 (Grid layout, custom properties)
- Vanilla JavaScript (ES6+)

## Running locally

```bash
git clone https://github.com/<your-username>/scientific-calculator.git
cd scientific-calculator
# then just open index.html in a browser, or serve it:
python3 -m http.server 8000
```

## Notes

This project was drafted with AI assistance (Claude) and then reviewed,
tested, and committed by me. I've read through the JavaScript logic in
`script.js` and can walk through how the state machine (current entry,
pending operator, previous value) works.

## License

MIT
