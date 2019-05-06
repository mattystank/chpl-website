import { Visualizer } from '@uirouter/visualizer';
import { states as listingStates } from './pages/listing/listing.state.js';
import { states as organizationsStates } from './pages/organizations/organizations.state.js';

(function () {
    'use strict';

    angular
        .module('chpl')
        .run(runBlock);

    /** @ngInject */
    function runBlock ($anchorScroll, $location, $log, $rootScope, $timeout, $transitions, $uiRouter, $window, featureFlags) {

        // Update page title on state change
        $transitions.onSuccess({}, transition => {
            let title = transition.to().data.title;
            if (title) {
                if (title instanceof Function) {
                    title = title.call(transition.to(), transition.params());
                }
                $window.document.title = title;

                // Set currentPage for internal page links
                $rootScope.currentPage = $location.path();
            }
        });

        // If there's an anchor, scroll to it
        if ($location.hash()) {
            $anchorScroll();
            $timeout(function () {
                var element = $window.document.getElementById('main-content');
                var elementAng = angular.element($window.document.getElementById('main-content'));
                if (element && elementAng) {
                    elementAng.attr('tabindex', '-1');
                    element.focus();
                }
            });
        }

        // load states dependent on features
        if (featureFlags.isOn('listing-edit')) {
            listingStates['listing-edit-on'].forEach(state => {
                $uiRouter.stateRegistry.register(state);
            });
        } else {
            listingStates['listing-edit-off'].forEach(state => {
                $uiRouter.stateRegistry.register(state);
            });
        }
        if (featureFlags.isOn('developer-page')) {
            organizationsStates.forEach(state => {
                $uiRouter.stateRegistry.register(state);
            });
        }

        // Display ui-router state changes
        if (featureFlags.isOn('states')) {
            $uiRouter.plugin(Visualizer);
        }
    }
})();
