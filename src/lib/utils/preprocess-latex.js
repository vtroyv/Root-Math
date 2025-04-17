function preprocessLatex(latex) {
  // Step 1: Add '\\' around LaTeX text commands (\text{...}) based on their position.
  latex = latex.replace(/(\\text\{.*?\})/g, (match, p1, offset, fullString) => {
    const before = fullString.slice(0, offset).trim();
    const after = fullString.slice(offset + match.length).trim();
    if (offset === 0) {
      // At the start: add '\\\\' after if there's content following.
      return after.length > 0 ? `${p1}\\\\` : p1;
    } else if (offset + match.length === fullString.length) {
      // At the end: add '\\\\' before if there's content preceding.
      return before.length > 0 ? `\\\\${p1}` : p1;
    } else {
      // In the middle: add '\\\\' both before and after.
      return `\\\\${p1}\\\\`;
    }
  });

  // Step 2: Remove all instances of the space command '\,'
  latex = latex.replace(/\\,/g, '');

  // Step 2.5: Remove any empty subscripts '_{}'
  latex = latex.replace(/_\{\}/g, '');

  // Step 3: Remove opening and closing braces '{}' at the very start and end of the string.
  latex = latex.replace(/^\{|\}$/g, '');

  // Step 4: Remove the \displaylines command if present.
  latex = latex.replace(/\\displaylines\s*/g, '');

  // Step 4.5: Remove \begin{aligned} and \end{aligned} wrappers.
  latex = latex.replace(/\\begin\{aligned\}/g, '');
  latex = latex.replace(/\\end\{aligned\}?/g, '');

  // Step 5: Split the LaTeX string by '\\\\' (which indicates a new line).
  let lines = latex.split(/\\\\/);

  // Step 6: For each line, trim whitespace and remove stray ampersands.
  lines = lines.map((line) => {
    let trimmed = line.trim();
    // Remove a leading ampersand (and any following whitespace)
    trimmed = trimmed.replace(/^&\s*/, '');
    // Remove a trailing ampersand (and any preceding whitespace)
    trimmed = trimmed.replace(/\s*&$/, '');
    return trimmed;
  });

  // Step 7: Filter out empty lines and lines that still include \end{aligned} markers.
  lines = lines.filter(
    (line) => line !== '' && !line.includes('\\end{aligned') && !line.includes('\\endaligned')
  );

  // Step 8: Remove lines that *only* contain '\\' (after trimming).
  // (Lines with '\\' plus other content remain.)
  lines = lines.filter((line) => line.trim() !== '\\');

  // Step 9: Remove lines that are exactly '{{' or '}}'
  lines = lines.filter((line) => line !== '{{' && line !== '}}');

  return lines;
}

export default preprocessLatex;
