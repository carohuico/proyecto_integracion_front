import { module, test } from 'qunit';
import { setupRenderingTest } from 'proyecto/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pagos-atrasados', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<PagosAtrasados />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <PagosAtrasados>
        template block text
      </PagosAtrasados>
    `);

    assert.dom().hasText('template block text');
  });
});
