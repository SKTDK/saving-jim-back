// Regex for sanitizing inputs to prevent SQL injection
const REGEX_USERNAME = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]|[0-9]+$/i;
const REGEX_PASSWORD = /^([0-9]|[a-z]|[A-Z]|[!$.@#;:,])+$/i;
const REGEX_NAME = /^([0-9]|[a-z]|[A-Z])+$/i;

// Length for backend input check to prevent useless DB querries if inputs are not valid
// Those are conceptual limitations Password in DB is hashed and thus longer in DB than its actual size.
const LEN_USERNAME = 25;
const LEN_PASSWORD = 25;
const LEN_NAME = 50;

exports.REGEX_USERNAME = REGEX_USERNAME
exports.REGEX_PASSWORD = REGEX_PASSWORD
exports.LEN_USERNAME = LEN_USERNAME
exports.LEN_PASSWORD = LEN_PASSWORD