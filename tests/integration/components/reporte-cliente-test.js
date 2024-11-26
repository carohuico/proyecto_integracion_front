import { module, test } from 'qunit';
import { setupRenderingTest } from 'proyecto/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | reporte-cliente', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ReporteCliente />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <ReporteCliente>
        template block text
      </ReporteCliente>
    `);

    assert.dom().hasText('template block text');
  });
});
