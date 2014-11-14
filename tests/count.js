module( "op")

QUnit.test( "opQuery count()", function( assert ) {
  expect(1);


  assert.ok(opQuery('.testDiv').count() === 3, "Passed!" );
});
