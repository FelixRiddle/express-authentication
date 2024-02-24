/** @type {import('jest').Config} */
const config = {
    verbose: true,
    // This one did the trick
    roots: [
        "src"
    ]
};
  
module.exports = config;
