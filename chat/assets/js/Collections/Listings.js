define([
    'backbone',
    'Collections/Base',
    'Models/Listing',
    'DataLayer/ModelSyncExtension',
    'DataLayer/ServerCommandExecutor',
    'DataLayer/ServerInteractionSerializersHash'

], function (Backbone, BaseCollection, Listing, ModelSyncExtension, ServerCommandExecutor, ServerInteractionSerializersHash) {
    'use strict';

    var ListingCollection = BaseCollection.extend({
        model: Listing,

        // comparator: function (model) {
        //     return model.get('Title');
        // }

        getCalendar: function (data) {
          ServerCommandExecutor.execute(this, ServerInteractionSerializersHash.ListingManager.getCalendar, data);
        }
    });

    ModelSyncExtension.extend(ListingCollection.prototype, {
        'read': ServerInteractionSerializersHash.ListingManager.getAll
    });

    return ListingCollection;
}); 