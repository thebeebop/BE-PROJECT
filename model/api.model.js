const fs = require("fs/promises");

exports.fetchApi = () => {
  return fs
    .readFile(
      "/Users/thebebop/northcoders/backend/be-nc-news/endpoints.json",
      "utf8"
    )
    .then((file) => {
      return file;
    });
};
