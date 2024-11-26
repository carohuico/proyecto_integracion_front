import { module, test } from 'qunit';
import { setupRenderingTest } from 'proyecto/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | clientes-activos', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ClientesActivos />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <ClientesActivos>
        template block text
      </ClientesActivos>
    `);

    assert.dom().hasText('template block text');
  });
});
