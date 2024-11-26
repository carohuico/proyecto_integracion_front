import { module, test } from 'qunit';
import { setupRenderingTest } from 'proyecto/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | creditos-activos', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CreditosActivos />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <CreditosActivos>
        template block text
      </CreditosActivos>
    `);

    assert.dom().hasText('template block text');
  });
});
