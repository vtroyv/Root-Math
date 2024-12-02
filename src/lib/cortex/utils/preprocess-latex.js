// function preprocessLatex(latex) {
//     //I need to adjust this so that it successfully preprocesses latex where there is a string and math command in the same line, 

//     // Step 1: Remove opening and closing braces '{}'
//     //you need to check that this isn'y removing the closing braces of text 
//     let simplifiedLatex = latex.replace(/^\{|\}$/g, '');
//     // let simplifiedLatex2 = simplifiedLatex1.replace(/^/g,' ');

//     // Step 2: Remove the `\displaylines` command
//     simplifiedLatex = simplifiedLatex.replace(/\\displaylines\s*/g, '');

//     // Step 3: Split the LaTeX string by the `\\` which indicates a new line
//     const splitLatex = simplifiedLatex.split(/\\\\/);

//     // Step 4: Trim whitespace around each line
//     const trimmedLatex = splitLatex.map(line => line.trim());

//     return trimmedLatex;
// }

// // Example usage:
// const inputLatex = "{\\displaylines\\left(p+q\\right)^2=2\\\\ \\frac{3x^2}{2}+\\sin\\left(x\\right)\\\\ =2}";
// const result = preprocessLatex(inputLatex);

// console.log(result);
// // Output: ['\\left(p+q\\right)^2=2', '\\frac{3x^2}{2}+\\sin\\left(x\\right)', '=2']

// export default preprocessLatex

function preprocessLatex(latex) {
    // Step 1: Add '//' before and after LaTeX text commands (\text{})
    // Matches \text{...} and wraps it with '//' before and after
    latex = latex.replace(/\\text\{.*?\}/g, match => `\\\\${match}\\\\`);

    // Step 2: Remove all instances of '\,' (spacebar command)
    let latexSpaceRemoved = latex.replace(/\\,/g, '');
    console.log(`The latex with space removed is: ${latexSpaceRemoved}`);

 
    // Step 3: Remove opening and closing braces '{}' at the start and end of the string
    // Ensures this does not affect braces inside text or commands
    let simplifiedLatex = latexSpaceRemoved.replace(/^\{|\}$/g, '');

    // Step 4: Remove the `\displaylines` command
    simplifiedLatex = simplifiedLatex.replace(/\\displaylines\s*/g, '');

    // Step 5: Split the LaTeX string by the `\\` which indicates a new line
    const splitLatex = simplifiedLatex.split(/\\\\/);

    // Step 6: Trim whitespace around each line
    const trimmedLatex = splitLatex.map(line => line.trim());

    return trimmedLatex;
}

export default preprocessLatex

