const { fetchApi } = require("../model/api.model");
const endpointsJSON = require("../endpoints.json");
exports.getApi = (req, res, next) => {
  res.status(200).send({ endpointsJSON });
};
