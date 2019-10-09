export const DashboardComponent = {
    templateUrl: 'chpl.dashboard/dashboard.html',
    bindings: {
        changeRequests: '<',
        changeRequestTypes: '<',
        developerId: '<',
    },
    controller: class DashboardComponent {
        constructor ($log, $scope, $state, authService, networkService, toaster) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.$state = $state;
            this.backup = {};
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
            this.roles = ['ROLE_DEVELOPER'];
        }

        $onInit () {
            let that = this;
            this.loggedIn = this.$scope.$on('loggedIn', () => that.loadData());
        }

        $onChanges (changes) {
            if (changes.changeRequests.currentValue) {
                this.changeRequests = changes.changeRequests.currentValue;
            }
            if (changes.changeRequestTypes.currentValue) {
                this.changeRequestTypes = changes.changeRequestTypes.currentValue;
            }
            if (changes.developerId.currentValue) {
                this.developerId = changes.developerId.currentValue;
            }
            this.loadData();
        }

        $onDestroy () {
            this.loggedIn();
        }

        loadData () {
            let that = this;
            if (this.developerId) {
                this.networkService.getUsersAtDeveloper(this.developerId).then(response => that.users = response.users);
                this.networkService.getDeveloper(this.developerId).then(response => {
                    that.developer = response;
                    that.backup.developer = angular.copy(response);
                });
            }
        }

        takeAction (action, data) {
            let that = this;
            switch (action) {
            case 'edit':
                this.action = 'editDeveloper';
                break;
            case 'delete':
                this.networkService.removeUserFromDeveloper(data, this.developerId)
                    .then(() => that.networkService.getUsersAtDeveloper(that.developerId).then(response => that.users = response.users));
                break;
            case 'invite':
                this.networkService.inviteUser({
                    role: data.role,
                    emailAddress: data.email,
                    permissionObjectId: this.developer.developerId,
                }).then(() => that.toaster.pop({
                    type: 'success',
                    title: 'Email sent',
                    body: 'Email sent successfully to ' + data.email,
                }));
                break;
            case 'refresh':
                this.networkService.getUsersAtDeveloper(this.developerId)
                    .then(response => that.users = response.users);
                break;
            case 'impersonate':
                this.$state.reload();
                break;
                //no default
            }
        }

        cancel () {
            this.action = '';
            this.developer = angular.copy(this.backup.developer);
        }

        save (developer) {
            let that = this;
            let request = {
                developer: this.developer,
                submitted: false,
            };
            if (developer.website !== this.developer.website) {
                request.changeRequestType = this.changeRequestTypes.data.find(t => t.name === 'Website Change Request');
                request.details = { website: developer.website };
                request.submitted = true;
                this.networkService.submitChangeRequest(request)
                    .then(response => {
                        that.$log.info(response);
                        that.cancel();
                    }, error => {
                        that.toaster.pop({
                            type: 'error',
                            title: 'Error in submission',
                            body: 'Message' + (error.data.errorMessages.length > 1 ? 's' : '') + ':<ul>' + error.data.errorMessages.map(e => '<li>' + e + '</li>').join('') + '</ul>',
                            bodyOutputType: 'trustedHtml',
                        });
                    });
            }
            if (!request.submitted) {
                this.cancel();
            }
        }
    },
}

angular.module('chpl.dashboard')
    .component('chplDashboard', DashboardComponent);
