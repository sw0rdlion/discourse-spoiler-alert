import { withPluginApi, decorateCooked } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

function spoil($elem) {
  $('.spoiler', $elem).removeClass('spoiler').addClass('spoiled').spoil();
}

function initializeSpoiler(api) {
  api.decorateCooked(spoil);

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: 'insertSpoiler',
      icon: 'magic',
      label: 'spoiler.title'
    };
  });

  ComposerController.reopen({
    actions: {
      insertSpoiler() {
        this.get("toolbarEvent").applySurround(
          "[gizli]",
          "[/gizli]",
          "spoiler_text",
          { multiline: false }
        );
      }
    }
  });
}

export default {
  name: "apply-spoilers",
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    if (siteSettings.spoiler_enabled) {
      withPluginApi('0.5', initializeSpoiler, { noApi: () => decorateCooked(container, spoil) });
    }
  }
};
