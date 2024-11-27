// blacklist.js
const blacklist = new Set(); // Replace Set with a persistent store like Redis if needed

module.exports = {
    addToBlacklist: (token) => blacklist.add(token),
    isBlacklisted: (token) => blacklist.has(token),
    removeFromBlacklist: (token)=> blacklist.delete(token)
};
