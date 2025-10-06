// middlewares/validate.js
module.exports = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ error: error.errors || error });
    }
  };
};
