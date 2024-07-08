const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isKnownType = ['work', 'home', 'personal'].includes(type);
  if (isKnownType) return type;
};

const parseIsFavourite = (favourite) => {
  const isFavourite = favourite == 'true' ? true : false;
  return isFavourite;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
