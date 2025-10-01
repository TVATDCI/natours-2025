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
      // only sanitize certain fields, not 'tour', 'user', 'alert'
      if (!['tour', 'user', 'alert'].includes(key)) {
        cleaned = cleaned.replace(/[$<>]/g, '');
      }

      req.query[key] = cleaned;
    }
  });

  next();
};
