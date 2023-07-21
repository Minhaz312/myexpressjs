function randomStringGenerator(length) {
    if (!Number.isInteger(length) || length <= 0) {
      throw new Error("Length must be a positive integer");
    }
  
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomString += alphabet.charAt(randomIndex);
    }
    return randomString;
  }

  module.exports = randomStringGenerator