function preprocessLatex(latex) {
    // Step 1: Remove opening and closing braces '{}'
    let simplifiedLatex = latex.replace(/^\{|\}$/g, '');

    // Step 2: Remove the `\displaylines` command
    simplifiedLatex = simplifiedLatex.replace(/\\displaylines\s*/g, '');

    // Step 3: Split the LaTeX string by the `\\` which indicates a new line
    const splitLatex = simplifiedLatex.split(/\\\\/);

    // Step 4: Trim whitespace around each line
    const trimmedLatex = splitLatex.map(line => line.trim());

    return trimmedLatex;
}

// Example usage:
const inputLatex = "{\\displaylines\\left(p+q\\right)^2=2\\\\ \\frac{3x^2}{2}+\\sin\\left(x\\right)\\\\ =2}";
const result = preprocessLatex(inputLatex);

console.log(result);
// Output: ['\\left(p+q\\right)^2=2', '\\frac{3x^2}{2}+\\sin\\left(x\\right)', '=2']

export default preprocessLatex