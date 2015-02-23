angular.module('rtmms.rosetta').controller('RosettaController', ['$scope', 'AuthService', 'RosettaService', 'dialogs', 'uiGridConstants', function($scope, AuthService, RosettaService, dialogs, uiGridConstants) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });



    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        filters: null,
    };

    $scope.gridOptions = {
        enableFiltering: true,
        useExternalFilter: true,
        enableColumnResizing: true,
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enableRowSelection: true,
        columnDefs: [{
            name: 'groups',
            cellFilter: 'ArrayAsString',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'refid',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'cfCode10',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'systematicName',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'commonTerm',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'acronym',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'termDescription',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'partition',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'units',
            field: 'units',
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.unitGroups | UnitGroupsAsString }}</span> <span class="bold">{{row.entity.units | UnitsAsString }}</span></div>',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'enums',
            field: 'enums',
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.enumGroups | EnumGroupsAsString }}</span> <span class="bold">{{row.entity.enums | EnumsAsString }}</span></div>',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'code10',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'vendorDescription',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'displayName',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'vendorVmd',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    paginationOptions.sort = null;
                } else {
                    paginationOptions.sort = {column:sortColumns[0].colDef.name,value:sortColumns[0].sort.direction};
                }
                getPage();
            });

            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                getPage();
            });

            gridApi.core.on.filterChanged($scope, function() {
                var grid = this.grid;
                paginationOptions.filters = [];
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        paginationOptions.filters.push({
                            column: value.colDef.name,
                            value: value.filters[0].term
                        });
                    }
                });
                getPage();
            });

        }
    };

    var getPage = function() {
        RosettaService.getRosettas({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort
        }).then(function(result) {
            if (result !== null) {
                $scope.gridOptions.data = result.rosettas;
                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };


    getPage();

}]);

angular.module('rtmms.rosetta').controller('RosettaModalInstanceController', ['$scope', '$modaslInstance', 'rosetta', 'MembersService', 'RosettaService', function($scope, $modalInstance, rosetta, RosettaService) {


    $scope.editmode = false;
    if (result) {

    } else {


    }


    $scope.addResult = function() {
        if ($scope.time.hours === undefined) $scope.time.hours = 0;
        if ($scope.time.minutes === undefined) $scope.time.minutes = 0;
        if ($scope.time.seconds === undefined) $scope.time.seconds = 0;
        $scope.formData.time = $scope.time.hours * 3600 + $scope.time.minutes * 60 + $scope.time.seconds;

        var members = $.map($scope.formData.member, function(value, index) {
            return [value];
        });
        $scope.formData.member = members;


        $modalInstance.close($scope.formData);
    };

    $scope.editResult = function() {
        $modalInstance.close($scope.formData);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };






}]);
