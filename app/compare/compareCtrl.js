;(function () {
    'use strict';

    angular.module('app.compare')
        .controller('CompareController', ['$scope', '$log', '$routeParams', '$filter', 'commonService', function($scope, $log, $routeParams, $filter, commonService) {
            var vm = this;

            vm.fillInBlanks = fillInBlanks;
            vm.isShowing = isShowing;
            vm.sortAllCerts = sortAllCerts;
            vm.sortAllCqms = sortAllCqms;
            vm.sortCerts = sortCerts;
            vm.sortCqms = sortCqms;
            vm.toggle = toggle;
            vm.updateCerts = updateCerts;
            vm.updateCqms = updateCqms;
            vm.updateProductList = updateProductList;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                var compareString = $routeParams.compareIds;
                vm.products = [];
                vm.productList = [];
                vm.allCerts = {};
                vm.allCqms = {};
                if (compareString && compareString.length > 0) {
                    vm.compareIds = compareString.split('&');

                    for (var i = 0; i < vm.compareIds.length; i++) {
                        commonService.getProduct(vm.compareIds[i])
                            .then(function (product) {
                                vm.updateProductList(product);
                                vm.updateCerts(product);
                                vm.updateCqms(product);
                                vm.fillInBlanks();
                                vm.sortAllCerts();
                                vm.sortAllCqms();
                                vm.products.push(product);
                            }, function (error) { $log.error(error); });
                    }
                }
            }

            function fillInBlanks () {
                var needToAddBlank, product;
                for (var i = 0; i < vm.productList.length; i++) {
                    product = vm.productList[i];
                    for (var cert in vm.allCerts) {
                        needToAddBlank = true;
                        for (var k = 0; k < vm.allCerts[cert].values.length; k++) {
                            if (vm.allCerts[cert].values[k].productId === product.id) {
                                needToAddBlank = false;
                            }
                        }
                        if (needToAddBlank) {
                            vm.allCerts[cert].values.push({
                                productId: product.id,
                                allowed: false,
                                certificationDate: product.certificationDate
                            });
                        }
                    }
                    for (var cqm in vm.allCqms) {
                        needToAddBlank = true;
                        for (var k = 0; k < vm.allCqms[cqm].values.length; k++) {
                            if (vm.allCqms[cqm].values[k].productId === product.id) {
                                needToAddBlank = false;
                            }
                        }
                        if (needToAddBlank) {
                            vm.allCqms[cqm].values.push({
                                productId: product.id,
                                allowed: false,
                                certificationDate: product.certificationDate
                            });
                        }
                    }
                }
            }

            function isShowing (elem) {
                return vm.openCert === elem;
            }

            function sortAllCerts () {
                vm.sortedCerts = [];
                for (var cert in vm.allCerts) {
                    vm.sortedCerts.push(cert);
                }
                vm.sortedCerts = $filter('orderBy')(vm.sortedCerts,vm.sortCerts);
            }

            function sortAllCqms () {
                vm.sortedCqms = [];
                for (var cqm in vm.allCqms) {
                    vm.sortedCqms.push(cqm);
                }
                vm.sortedCqms = $filter('orderBy')(vm.sortedCqms,vm.sortCqms);
            }

            function sortCerts (cert) {
                var edition = parseInt(cert.substring(4,7));
                var letter = parseInt(cert.substring(9,10).charCodeAt(0)) - 96;
                var number = cert.length > 11 ? parseInt(cert.split(')')[1].substring(1)) : 0;
                var ret = edition * 10000 +
                    letter * 100 +
                    number;
                return ret;
            }

            function sortCqms (cqm) {
                var edition = -1000 * cqm.indexOf('-');
                var num = parseInt(edition < 0 ? cqm.substring(4) : cqm.substring(3));
                var ret = edition + num;
                return ret;
            }

            function toggle (elem) {
                vm.openCert = vm.openCert === elem ? '' : elem;
            }

            function updateCerts (product) {
                var cert;
                for (var i = 0; i < product.certificationResults.length; i++) {
                    cert = product.certificationResults[i];
                    if (vm.allCerts[cert.number] === undefined)
                        vm.allCerts[cert.number] = {number: cert.number, title: cert.title, values: []};
                    if (cert.success) {
                        vm.allCerts[cert.number].atLeastOne = true;
                    }
                    vm.allCerts[cert.number].values.push({
                        productId: product.id,
                        allowed: true,
                        success: cert.success,
                        certificationDate: product.certificationDate
                    });
                }
            }

            function updateCqms (product) {
                var cqm;
                for (var i = 0; i < product.cqmResults.length; i++) {
                    cqm = product.cqmResults[i];
                    if (cqm.cmsId) {
                        cqm.displayId = cqm.cmsId;
                    } else {
                        cqm.displayId = 'NQF-' + cqm.nqfNumber;
                    }
                    if (vm.allCqms[cqm.displayId] === undefined)
                        vm.allCqms[cqm.displayId] = {displayId: cqm.displayId, title: cqm.title, values: []};
                    if (cqm.success) {
                        vm.allCqms[cqm.displayId].atLeastOne = true;
                    }
                    vm.allCqms[cqm.displayId].values.push({
                        productId: product.id,
                        allowed: true,
                        success: cqm.success,
                        certificationDate: product.certificationDate,
                        successVersions: cqm.successVersions
                    });
                }
            }

            function updateProductList (product) {
                vm.hasNon2015 = vm.hasNon2015 || product.certificationEdition.name !== '2015';
                vm.productList.push({
                    id: product.id,
                    certificationDate: product.certificationDate
                });
            }
        }]);
})();
