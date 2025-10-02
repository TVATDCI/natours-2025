module.exports = (req, res, next) => {
  const allowed = [
    'sort',
    'page',
    'limit',
    'fields',
    'difficulty',
    'order',
    'duration',
    'rating',
    'ratingsAverage',
    'ratingsQuantity',
    'role',
    'price',
    'tour',
    'user',
    'alert',
  ];

  Object.entries(req.query).forEach(([key, value]) => {
    if (!allowed.includes(key)) {
      delete req.query[key]; // drop unknown params
      return;
    }

    if (typeof value === 'string') {
      let cleaned = value.trim();

      // lowercase normalization
      if (['difficulty', 'sort', 'order'].includes(key)) {
        cleaned = cleaned.toLowerCase();
      }

      // number conversion for numeric fields
      if (
        [
          'page',
          'limit',
          'price',
          'ratingsAverage',
          'ratingsQuantity',
          'duration',
        ].includes(key)
      ) {
        const num = Number(cleaned);
        if (!Number.isNaN(num) && cleaned !== '') {
          cleaned = num;
        }
      }

      // strip potentially harmful characters
      //  cleaned = cleaned.replace(/[$<>]/g, '');
      // only sanitize certain fields, not 'tour', 'user', 'alert'
      // Exempting 'tour', 'user', and 'alert' fields from sanitization could introduce security vulnerabilities.
      // Consider implementing field-specific validation rules instead of blanket exemptions to prevent potential XSS or injection attacks. 'Co-pilot'
      if (!['tour', 'user', 'alert'].includes(key)) {
        cleaned = cleaned.replace(/[$<>]/g, '');
      }

      req.query[key] = cleaned;
    }
  });

  next();
};
