function postprocessLatex(text) {
    return text
      .replace(/\\\((.*?)\\\)/g, '$$$1$')
      .replace(/\\\[(.*?)\\\]/g, '$$ $1 $$');
  }

  export default postprocessLatex