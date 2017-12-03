const safeRequire = (path, condition) => {
  if (condition) {
    // eslint-disable-next-line
    return require(`${path}`).default;
  }
  return null;
};

export default safeRequire;
