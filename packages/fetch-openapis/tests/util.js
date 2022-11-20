const fs = require('fs/promises');

const readFixture = async (fixtureFile) => {
  let jsonData = {};
  try {
    jsonData = JSON.parse(await fs.readFile(`${__dirname}/fixtures/${fixtureFile}.json`));
  }
  catch(e) {
    console.error(e.message);
  }
  return jsonData;
}

module.exports = {
  readFixture
};
