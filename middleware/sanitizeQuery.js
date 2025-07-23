// sample-sanitization

module.exports = (req, res, next) => {
  Object.entries(req.query).forEach(([key, value]) => {
    if (typeof value === 'string') {
      let cleaned = value.trim();

      // Optional: lowercase normalization for certain fields
      if (['difficulty', 'sort', 'order'].includes(key)) {
        cleaned = cleaned.toLowerCase();
      }

      // Convert to number if it's a numeric string
      const num = Number(cleaned);
      if (!Number.isNaN(num) && cleaned !== '') {
        cleaned = num;
      }

      req.query[key] = cleaned;
    }
  });

  next();
};
