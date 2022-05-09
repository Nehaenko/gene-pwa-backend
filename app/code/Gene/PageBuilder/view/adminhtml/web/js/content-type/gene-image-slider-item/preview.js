define([
    'jquery',
    'underscore',
    'knockout',
    'mage/translate',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/content-type/preview',
    'Magento_PageBuilder/js/uploader',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/wysiwyg/factory'
], function ($, _, ko, $t, events, PreviewBase, uploader, config, wysiwygFactory) {
    'use strict';

    /**
     * @param parent
     * @param config
     * @param stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewBase.call(this, parent, config, stageId);
    }

    Preview.prototype = Object.create(PreviewBase.prototype);

    Preview.prototype.uploader = null;

    /**
     * Bind events for image uploading API
     */
    Preview.prototype.bindEvents = function bindEvents() {
        var self = this;

        PreviewBase.prototype.bindEvents.call(this);

        events.on(this.config.name + ":" + this.contentType.id + ":updateAfter", function () {
            var dataStore = self.contentType.dataStore.getState();

            var files = dataStore[self.config.additional_data.uploaderConfig.dataScope];
            var imageObject = files ? files[0] : {};

            events.trigger("image:" + self.contentType.id + ":assignAfter", imageObject);
        });

        events.on(this.config.name + ":mountAfter", function () {
            var dataStore = self.contentType.dataStore.getState();

            var initialImageValue = dataStore[self.config.additional_data.uploaderConfig.dataScope] || "";

            self.uploader = new uploader(
                "imageuploader_" + self.contentType.id,
                self.config.additional_data.uploaderConfig,
                self.contentType.id,
                self.contentType.dataStore,
                initialImageValue
            );
        });
    };

    /**
     * @returns {boolean}
     */
    Preview.prototype.isWysiwygSupported = function isWysiwygSupported() {
        return config.getConfig("can_use_inline_editing_on_stage");
    };

    /**
     * @param {HTMLElement} element
     */
    Preview.prototype.initWysiwyg = function (element) {
        var self = this;

        this.element = element;
        element.id = this.contentType.id + "-editor";
        wysiwygFactory(
            this.contentType.id,
            element.id,
            this.config.name,
            this.config.additional_data.wysiwygConfig.wysiwygConfigData,
            this.contentType.dataStore, "content"
        ).then(function (wysiwyg) {
            self.wysiwyg = wysiwyg;
        });
    };


    return Preview;
});
