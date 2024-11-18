import { module, test } from 'qunit';
import { setupTest } from 'proyecto/tests/helpers';

module('Unit | Route | creditos', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:creditos');
    assert.ok(route);
  });
});
