import { module, test } from 'qunit';
import { setupRenderingTest } from 'proyecto/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | add-client-modal', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<AddClientModal />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <AddClientModal>
        template block text
      </AddClientModal>
    `);

    assert.dom().hasText('template block text');
  });
});
