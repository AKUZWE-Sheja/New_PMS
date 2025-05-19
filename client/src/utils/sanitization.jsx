// Cleans up a raw search input to make it safe and consistent
export const sanitizeSearchInput = (input) => {
    // If the input is empty or not a string, bail out with an empty string
    if (!input || typeof input !== 'string') return '';
    
    return input
      .trim() // remove whitespace from both ends
      .replace(/\s+/g, ' ') // collapse multiple spaces into one
      .toLowerCase() // everything to lowercase
      .replace(/[<>{}]/g, ''); // strip out potentially dangerous characters
  };
  
  // Prepares a search query with some validation and optional fuzzy matching
  export const sanitizeSearchQuery = (
    input,
    options = {}
  ) => {
    // Grab the settings, or use defaults if none are passed
    const { maxLength = 100, allowPartial = true, minLength = 1 } = options;
  
    // Clean up the input using our handy sanitizer
    const sanitized = sanitizeSearchInput(input);
    
    // Check if the cleaned-up input is within length limits and doesn't contain funky stuff like semicolons
    const isValid = sanitized.length >= minLength && 
                    sanitized.length <= maxLength && 
                    !/[;]/.test(sanitized);
  
    // If partial matching is allowed, wrap the input in wildcards (like for SQL-style search)
    const query = allowPartial && sanitized ? `%${sanitized}%` : sanitized;
  
    // Return everything we might want to know about the input
    return {
      raw: input, // what we got originally
      sanitized: isValid ? query : '', // safe and ready to use (or empty if it's bad)
      isValid, // whether it passed our checks
    };
  };
  