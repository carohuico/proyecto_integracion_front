import { module, test } from 'qunit';
import { setupTest } from 'proyecto/tests/helpers';

module('Unit | Controller | pagos', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:pagos');
    assert.ok(controller);
  });
});
