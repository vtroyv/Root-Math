function preprocessLatex(latex) {

    // Step 1: Add '//' around LaTeX text commands (\text{}) based on position
    // If \text{} is at the start of the string and there's something after, add `\\\\` only after
    // If \text{} is at the end of the string and there's something before, add `\\\\` only before
    // If \text{} is in the middle, add `\\\\` before and after
    latex = latex.replace(/(\\text\{.*?\})/g, (match, p1, offset, fullString) => {
        const before = fullString.slice(0, offset).trim();
        const after = fullString.slice(offset + match.length).trim();

        if (offset === 0) {
            // \text{} at the start
            return after.length > 0 ? `${p1}\\\\` : p1;
        } else if (offset + match.length === fullString.length) {
            // \text{} at the end
            return before.length > 0 ? `\\\\${p1}` : p1;
        } else {
            // \text{} in the middle
            return `\\\\${p1}\\\\`;
        }
    });

    // Step 2: Remove all instances of '\,' (spacebar command)
    latex = latex.replace(/\\,/g, '');

    // Step 2.5: Remove any empty subscripts '_{}'
    latex = latex.replace(/_\{\}/g, '');

    // Step 3: Remove opening and closing braces '{}' at the start and end of the string
    // Ensures this does not affect braces inside text or commands
    latex = latex.replace(/^\{|\}$/g, '');

    // Step 4: Remove the `\displaylines` command
    latex = latex.replace(/\\displaylines\s*/g, '');

    // Step 5: Split the LaTeX string by `\\` which indicates a new line
    const splitLatex = latex.split(/\\\\/);

    // Step 6: Trim whitespace around each line
    const trimmedLatex = splitLatex.map(line => line.trim());

    // Optional Step 7: Filter out empty lines if desired
    const finalLatex = trimmedLatex.filter(line => line !== '');

    return finalLatex;
}

export default preprocessLatex;
