module.exports = function(req, res, next) {
  if (!req) {
    // req.flash('error', 'You must be logged in to access that page');
    console.log(req);
    res.redirect('/auth/login');
  } else {
    next();
  }
};
