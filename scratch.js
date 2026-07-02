const bcrypt = require('bcrypt');
const hash = '$2b$10$m2uZ6S0yz6gKVKBWC7qQ3uW08yVrhqxXIXFDj8e4CrgPuBY2X63gG';
bcrypt.compare('Admin@1234', hash).then(res => console.log('Match?', res));
