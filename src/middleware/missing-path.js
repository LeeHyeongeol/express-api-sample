const missingPath = (req, res, next) => {
  const { url } = req;

  const removeLog = ['/favicon.ico'].includes(url);

  if (removeLog) {
    res.sendStatus(200);
    return;
  }

  const isContent = url.includes('/images');

  const message = isContent ? 'NOT_FOUND' : 'MISSING_PATH';
  next(message); // error 메시지를 넘긴다
};

module.exports = missingPath;
