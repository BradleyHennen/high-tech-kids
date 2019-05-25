// This funciton tests if the user input is a valid input on the LoginPage
// 1. if username is '' or undefined

function validate( input ) {
  if ( input.username === '' || input.username === undefined ) {
    return false;
  } else if ( input.password === '' || input.password === undefined ) {
    return false;
  }
}

module.exports = validate;