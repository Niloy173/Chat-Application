function decorateHtmlResponse(title) {
  return function (req, res, next) {
    res.locals.loggedInUser = {};
    res.locals.errors = {};
    res.locals.data = {};
    res.locals.html = true;
    res.locals.title = `${title} - ${process.env.APP_NAME}`;
    next();
  };
}

module.exports = {
  decorateHtmlResponse,
};
