module( "op")

QUnit.test( "opQuery html()", function( assert ) {
  expect(1);
  assert.ok(opQuery('.testDiv').html()[0] === '', "Passed!" );
});
