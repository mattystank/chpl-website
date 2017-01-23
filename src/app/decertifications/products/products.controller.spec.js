(function() {
    'use strict';

    describe('decertifications.products.controller', function() {
        var vm, scope, $log, $q, commonService, mock;
        mock = {
            decertifiedProducts: {"recordCount":2,"pageSize":2,"pageNumber":0,"results":[{"id":6571,"testingLabId":null,"testingLabName":null,"chplProductNumber":"CHP-023867","reportFileLocation":"https://www.icsalabs.com/sites/default/files/2014-EHRA314940-2014-0904-00.pdf","sedReportFileLocation":null,"sedIntendedUserDescription":null,"sedTestingEnd":null,"acbCertificationId":"140238R00","classificationType":{"name":"Complete EHR","id":2},"otherAcb":null,"certificationStatus":{"name":"Withdrawn by Developer","id":3},"developer":{"name":"Nemo Capital Partners","id":1036},"product":{"versionId":3981,"name":"1 Connect BuildYourEMR","id":1736,"version":"5.0"},"certificationEdition":{"name":"2014","id":2},"practiceType":{"name":"Ambulatory","id":1},"certifyingBody":{"name":"ICSA Labs","id":6},"certificationDate":1409803200000,"decertificationDate":1409803200000,"ics":null,"sedTesting":null,"qmsTesting":null,"accessibilityCertified":null,"productAdditionalSoftware":"Microsoft HealthVault, Windows Operating System","transparencyAttestation":null,"transparencyAttestationUrl":null,"countCerts":43,"countCqms":14,"countCorrectiveActionPlans":0,"countCurrentCorrectiveActionPlans":0,"countClosedCorrectiveActionPlans":0,"numMeaningfulUse":null},
                                                                                         {"id":6993,"testingLabId":null,"testingLabName":null,"chplProductNumber":"CHP-028100","reportFileLocation":"https://icsalabs.s3.amazonaws.com/TRS/2014-EHRA149577-2015-0908-00.pdf","sedReportFileLocation":null,"sedIntendedUserDescription":null,"sedTestingEnd":0,"acbCertificationId":"150107R00","classificationType":{"name":"Complete EHR","id":2},"otherAcb":null,"certificationStatus":{"name":"Suspended by ONC","id":7},"developer":{"name":"4medica, Inc.","id":4},"product":{"versionId":934,"name":"4medica iEHR Cloud Ambulatory Suite","id":29,"version":"15.10"},"certificationEdition":{"name":"2014","id":2},"practiceType":{"name":"Ambulatory","id":1},"certifyingBody":{"name":"ICSA Labs","id":6},"certificationDate":1441944000000,"decertificationDate":1409803200000,"ics":null,"sedTesting":null,"qmsTesting":null,"accessibilityCertified":null,"productAdditionalSoftware":"Nitor - HISPDirect, ntpd, Lexicomp, Medline Plus, Surescripts, Adobe Acrobat v10","transparencyAttestation":"Affirmative","transparencyAttestationUrl":"http://4medica.com/pdf/4medica_iehr_mu_stage2certified_2016.pdf","countCerts":41,"countCqms":10,"countCorrectiveActionPlans":1,"countCurrentCorrectiveActionPlans":1,"countClosedCorrectiveActionPlans":0,"numMeaningfulUse":50}]},

            muuAccurateAsOfDate: new Date('2017-01-13'),
            modifiedDecertifiedProducts: [
                {
                    acb: 'ICSA Labs',
                    certificationDate: 1409803200000,
                    chplProductNumber: 'CHP-023867',
                    decertificationDate: 1409803200000,
                    developer: 'Nemo Capital Partners',
                    edition: '2014',
                    estimatedUsers: null,
                    id: 6571,
                    product: '1 Connect BuildYourEMR',
                    status: 'Withdrawn by Developer',
                    version: '5.0'
                },{
                    acb: 'ICSA Labs',
                    certificationDate: 1441944000000,
                    chplProductNumber: 'CHP-028100',
                    decertificationDate: 1409803200000,
                    developer: '4medica, Inc.',
                    edition: '2014',
                    estimatedUsers: 50,
                    id: 6993,
                    product: '4medica iEHR Cloud Ambulatory Suite',
                    status: 'Suspended by ONC',
                    version: '15.10'
                }
            ],
            filter: { acb: 'Drummond', product: 'epic', status: 'broke'},
            searchOptions: {
                certBodyNames: [{name: 'ICSA Labs'}, {name: 'Drummond Group'}, {name: 'Infogard'}],
                certificationStatuses: [{name: 'Active'},{name: 'Withdrawn by Developer'},{name: 'Retired'},{name: 'Withdrawn by ONC-ACB'},{name: 'Suspended by ONC-ACB'},{name: 'Pending'}]
            }
        };

        beforeEach(function () {
            module('chpl.decertifications', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getDecertifiedProducts = jasmine.createSpy('getDecertifiedProducts');
                    $delegate.getMeaningfulUseUsersAccurateAsOfDate = jasmine.createSpy('getMeaningfulUseUsersAccurateAsOfDate');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function($controller, $rootScope, _$log_, _$q_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.getDecertifiedProducts.and.returnValue($q.when(mock.decertifiedProducts));
                commonService.getMeaningfulUseUsersAccurateAsOfDate.and.returnValue($q.when({data: mock.muuAccurateAsOfDate}));
                commonService.getSearchOptions.and.returnValue($q.when(mock.searchOptions));

                scope = $rootScope.$new();
                vm = $controller('DecertifiedProductsController', {
                    $scope: scope
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have called the commonService to load decertified Products', function () {
            expect(commonService.getDecertifiedProducts).toHaveBeenCalled();
        });

        it('should know how many decertified Products there are', function () {
            expect(vm.decertifiedProducts.length).toBe(2);
        });

        it('should set the displayed Products to match the found ones', function () {
            expect(vm.displayedProducts).toEqual(mock.decertifiedProducts.results);
        });

        it('should load the ACBs at page load', function () {
            expect(vm.acbs).toEqual(mock.searchOptions.certBodyNames);
        });

        it('should load the product statuses at page load', function () {
            expect(vm.statuses).toEqual(mock.searchOptions.certificationStatuses);
        });

        it('should generate the smart-table fields', function () {
            expect(vm.modifiedDecertifiedProducts).toEqual(mock.modifiedDecertifiedProducts);
        });

        it('should know what the muu_accurate_as_of_date is', function () {
            expect(vm.muuAccurateAsOf).toEqual(mock.muuAccurateAsOfDate);
        });
    });
})();