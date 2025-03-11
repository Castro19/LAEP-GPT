/**
 * parseAdvancedPrereqString:
 *  - Splits on "@" if present (to handle multiple groups).
 *  - In each group, extracts all substrings between single quotes ('...').
 *  - Each quoted chunk is returned as its own bullet (inner array of length 1).
 *  - Ignores leftover text outside quotes.
 *
 * Returns an array of arrays of strings.
 *   Outer array = bullet items
 *   Inner array = each bullet’s text (in this simplified version, always length 1).
 */
function parseAdvancedPrereqString(raw: string): string[][] {
  const segments = raw.split("@");
  const results: string[][] = [];

  segments.forEach((segment) => {
    // Regex to find all occurrences of 'some text'
    const chunkRegex = /'([^']*)'/g;
    let match: RegExpExecArray | null;

    while ((match = chunkRegex.exec(segment)) !== null) {
      const quoted = match[1].trim();
      if (quoted) {
        // Push as its own bullet
        results.push([quoted]);
      }
    }
  });

  // Filter out any accidental empties
  return results.filter((arr) => arr.length > 0 && arr.join("").trim() !== "");
}

export default parseAdvancedPrereqString;
