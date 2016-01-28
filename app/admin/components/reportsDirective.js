;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('ReportController', ['$log', 'commonService', 'authService', function($log, commonService, authService) {
            var vm = this;
            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.isChplAdmin = authService.isChplAdmin();
            vm.tab = 'cp';

            vm.refreshActivity = refreshActivity;
            vm.changeTab = changeTab;
            vm.refreshCp = refreshCp;
            vm.refreshDeveloper = refreshDeveloper;
            vm.refreshProduct = refreshProduct;
            vm.refreshAcb = refreshAcb;
            vm.refreshAtl = refreshAtl;
            vm.refreshUser = refreshUser;
            vm.refreshApi = refreshApi;
            vm.refreshVisitors = refreshVisitors;

            activate();

            ////////////////////////////////////////////////////////////////////
            // Functions

            function activate () {
                vm.visibleApiPage = 1;
                vm.apiKeyPageSize = 100;
                vm.refreshActivity();
                vm.refreshVisitors();
            }

            function refreshActivity () {
                vm.refreshCp();
                vm.refreshDeveloper();
                vm.refreshProduct();
                vm.refreshAcb();
                vm.refreshAtl();
                vm.refreshUser();
                vm.refreshApi();
            }

            function refreshCp () {
                commonService.getCertifiedProductActivity(7)
                    .then(function (data) {
                        vm.searchedCertifiedProducts = vm.interpretCps(data);
                        vm.displayedCertifiedProducts = [].concat(vm.searchedCertifiedProducts);
                    });
            }

            function refreshDeveloper () {
                commonService.getDeveloperActivity(7)
                    .then(function (data) {
                        vm.searchedDevelopers = vm.interpretDevelopers(data);
                        vm.displayedDevelopers = [].concat(vm.searchedDevelopers);
                    });
            }

            function refreshProduct () {
                commonService.getProductActivity(7)
                    .then(function (data) {
                        vm.searchedProducts = vm.interpretProducts(data);
                        vm.displayedProducts = [].concat(vm.searchedProducts);
                    });
            }

            function refreshAcb () {
                commonService.getAcbActivity(7)
                    .then(function (data) {
                        vm.searchedACBs = vm.interpretAcbs(data);
                        vm.displayedACBs = [].concat(vm.searchedACBs);
                    });
            }

            function refreshAtl () {
                commonService.getAtlActivity(7)
                    .then(function (data) {
                        vm.searchedATLs = vm.interpretAtls(data);
                        vm.displayedATLs = [].concat(vm.searchedATLs);
                    });
            }

            function refreshUser () {
                if (vm.isChplAdmin) {
                    commonService.getUserActivity(7)
                        .then(function (data) {
                            vm.searchedUsers = vm.interpretUsers(data);
                            vm.displayedUsers = [].concat(vm.searchedUsers);
                        });
                    commonService.getUserActivities(7)
                        .then(function (data) {
                            vm.searchedUserActivities = vm.interpretUserActivities(data);
                            vm.displayedUserActivities = [].concat(vm.searchedUserActivities);
                        });
                }
            }

            function refreshApi () {
                if (vm.isChplAdmin) {
                    commonService.getApiUserActivity(7)
                        .then(function (data) {
                            vm.searchedApiActivity = data;
                            vm.displayedApiActivity = [].concat(vm.searchedApiActivity);
                        });
                    vm.apiKeyPageNum = vm.visibleApiPage - 1;
                    commonService.getApiActivity(vm.apiKeyPageNum,vm.apiKeyPageSize)
                        .then(function (data) {
                            vm.searchedApi = data;
                        });
                }
            }

            function refreshVisitors () {
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAvKGCCgw&format=data-table','')
                    .then(function (data) {
                        vm.browserVariety.data = data;
                    });
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA2uOGCgw&format=data-table','')
                    .then(function (data) {
                        vm.country.data = data;
                        vm.map.data = data;
                    });
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAmdKFCgw&format=data-table','')
                    .then(function (data) {
                        vm.cities.data = data;
                        vm.cityMap.data = data;
                    });
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA7bGDCgw&format=data-table','')
                    .then(function (data) {
                        data.cols[0].type = 'date';
                        var date;
                        for (var i = 0; i < data.rows.length; i++) {
                            date = data.rows[i].c[0].v;
                            data.rows[i].c[0].v = new Date(date.substring(0,4),
                                                           parseInt(date.substring(4,6)) - 1,
                                                           date.substring(6,8));
                        }
                        vm.traffic.data = data;
                    });
            }

            function changeTab(newTab) {
                switch (newTab) {
                case 'cp':
                    vm.refreshCp();
                    break;
                case 'dev':
                    vm.refreshDeveloper();
                    break;
                case 'prod':
                    vm.refreshProduct();
                    break;
                case 'acb':
                    vm.refreshAcb();
                    break;
                case 'users':
                    vm.refreshUser();
                    break;
                case 'visitors':
                    vm.refreshVisitors();
                    break;
                }
                vm.tab = newTab;
            }

            ////////////////////////////////////////////////////////////////////
            // Chart options

            vm.browserVariety = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by browser (last 7 days)'
                }
            };
            vm.cities = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by city (last 7 days)'
                }
            };
            vm.country = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by country (last 7 days)'
                }
            };
            vm.traffic = {
                type: 'LineChart',
                options: {
                    legend: { position: 'none' },
                    hAxis: {
                        slantedText: true
                    },
                    title: 'Visitors for the last 14 days'
                }
            };
            vm.map = {
                type: 'GeoChart',
                options: {
                }
            };
            vm.cityMap = {
                type: 'GeoChart',
                options: {
                    region: 'US',
                    displayMode: 'markers'
                }
            };

            ////////////////////////////////////////////////////////////////////
            // Helper functions

            vm.simpleCpFields = [{key: 'acbCertificationId', display: 'ACB Certification ID'},
                                 {key: 'certificationDate', display: 'Certification Date'},
                                 {key: 'chplProductNumber', display: 'CHPL Product Number'},
                                 {key: 'reportFileLocation', display: 'ATL Test Report File Location'},
                                 {key: 'visibleOnChpl', display: 'Visible on CHPL'}];
            vm.interpretCps = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {
                        date: data[i].activityDate,
                        description: data[i].description
                    };
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretDevelopers = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        activity.action = 'Update:<ul>';
                        change = vm.compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                        if (change) activity.action += '<li>' + change + '</li>';
                        change = vm.compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                        if (change) activity.action += '<li>' + change + '</li>';
                        vm.analyzeAddress(activity, data[i]);
                        activity.action += '</ul>';
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'developer');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretProducts = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        activity.action = 'Update:<ul>';
                        change = vm.compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                        if (change) activity.action += '<li>' + change + '</li>';
                        // check on developerId change
                        activity.action += '</ul>';
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'product');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretAcbs = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        if (data[i].originalData.deleted !== data[i].newData.deleted) {
                            activity.action = data[i].newData.deleted ? 'ACB was deleted' : 'ACB was restored';
                        } else {
                            activity.action = 'Update:<ul>';
                            change = vm.compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                            if (change) activity.action += '<li>' + change + '</li>';
                            change = vm.compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                            if (change) activity.action += '<li>' + change + '</li>';
                            vm.analyzeAddress(activity, data[i]);
                            activity.action += '</ul>';
                        }
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'ACB');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretAtls = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        if (data[i].originalData.deleted !== data[i].newData.deleted) {
                            activity.action = data[i].newData.deleted ? 'ATL was deleted' : 'ATL was restored';
                        } else {
                            activity.action = 'Update:<ul>';
                            change = vm.compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                            if (change) activity.action += '<li>' + change + '</li>';
                            change = vm.compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                            if (change) activity.action += '<li>' + change + '</li>';
                            vm.analyzeAddress(activity, data[i]);
                            activity.action += '</ul>';
                        }
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'ATL');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretUsers = function (data) {
                var ret = data;
                return ret;
            };

            vm.interpretUserActivities = function (data) {
                return data;
            };

            vm.interpretNonUpdate = function (activity, data, text) {
                if (data.originalData && !data.newData) { // no new data: deleted
                    activity.name = data.originalData.name;
                    activity.action = [activity.name + ' has been deleted'];
                }
                if (!data.originalData && data.newData) { // no old data: created
                    activity.name = data.newData.name;
                    activity.action = [activity.name + ' has been created'];
                }
                if (data.originalData && data.originalData.length > 1 && data.newData) { // both exist, more than one originalData: merge
                    activity.name = data.newData.name;
                    activity.action = ['Merged ' + data.originalData.length + ' ' + text + 's to form ' + text + ': ' + activity.name];
                }
            };

            vm.analyzeAddress = function (activity, data) {
                if (data.originalData.address !== data.newData.address) {
                    var change;
                    activity.action += '<li>Address changed:<ul>';
                    change = vm.compareItem(data.originalData.address, data.newData.address, 'streetLineOne', 'Street Line 1');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = vm.compareItem(data.originalData.address, data.newData.address, 'streetLineTwo', 'Street Line 2');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = vm.compareItem(data.originalData.address, data.newData.address, 'city', 'City');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = vm.compareItem(data.originalData.address, data.newData.address, 'state', 'State');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = vm.compareItem(data.originalData.address, data.newData.address, 'zipcode', 'Zipcode');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = vm.compareItem(data.originalData.address, data.newData.address, 'country', 'Country');
                    if (change) activity.action += '<li>' + change + '</li>';
                    activity.action += '</ul></li>';
                }
            };

            vm.compareItem = function (oldData, newData, key, display) {
                if (oldData && oldData[key] && newData && newData[key] && oldData[key] !== newData[key]) {
                    return display + ' changed from ' + oldData[key] + ' to ' + newData[key];
                }
                if ((!oldData || !oldData[key]) && newData && newData[key]) {
                    return display + ' added: ' + newData[key];
                }
                if (oldData && oldData[key] && (!newData || !newData[key])) {
                    return display + ' removed. Was: ' + oldData[key];
                }
            };

        }])
        .directive('aiReports', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/reports.html',
                bindToController: { workType: '='},
                scope: {triggerRefresh: '&'},
                controllerAs: 'vm',
                controller: 'ReportController',
                link: function (scope, element, attr, ctrl) {
                    var handler = scope.triggerRefresh({
                        handler: function () {
                            ctrl.refreshActivity();
                        }
                    });
                    scope.$on('$destroy', handler);
                }
            };
        });
})();
