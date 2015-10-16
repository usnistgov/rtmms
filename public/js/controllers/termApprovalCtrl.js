angular.module('rtmms.authentication').controller('TermApprovalController', ['$scope', 'AuthService', 'RosettaService', 'UnitService', 'dialogs', 'uiGridConstants', function($scope, AuthService, RosettaService, UnitService, dialogs, uiGridConstants) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });

    $scope.user = AuthService.isLoggedIn();
    $scope.proposedTerms = function() {
        paginationOptions.Status = "proposed";
        $scope.state = "proposed";
        getPage();
    };
    $scope.readyTerms = function() {
        // paginationOptions.Status = "unregistered";
        $scope.state = "ready";
        getPage0();
    };
    $scope.mappedTerms = function() {
        paginationOptions.Status = "mapped";
        $scope.state = "mapped";
        getPage();
    };
    $scope.proposedUnits = function() {
        paginationOptions.Status = "proposed";
        $scope.state = "proposedU";
        getPage();
    };
    $scope.approve = function(rosetta) {
        if (rosetta.term.status !== undefined) {
            if (rosetta.term.status == "registered") {
                rosetta.term.status = "approved";
                RosettaService.editRosetta(rosetta);
            } else if (rosetta.term.status == "unregistered") {
                alert("Please register the refid before approving the term");

            } else if (rosetta.term.status == "mapped") {
                rosetta.term.status = "approved";
                RosettaService.editRosetta(rosetta);
            }


        }




    };

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        filters: null,
        Status: ''
    };
    var paginationOptions0 = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        filters: null,
        Status: ''
    };

    $scope.gridOptions = {
        enableFiltering: true,
        enableColumnResizing: true,
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        columnDefs: [{
            name: 'groups',
            field: 'groups',
            cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity.groups | ArrayAsString }}</span></div>'
        }, {
            name: 'refid',
            field: 'term.refid',
            cellTemplate: '<div class="ui-grid-cell-contents" data-toggle="tooltip" data-placement="top" title={{row.entity.term.status}}><span>{{row.entity.term.refid}}</span></div>',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {

                if (row.entity.term !== undefined) {
                    if (row.entity.term.status === undefined) {

                        return 'red';
                    }
                    if (row.entity.term.status === "proposed") {
                        return 'blue';
                    }
                    if (row.entity.term.status === "registered") {
                        return 'green';
                    }
                    if (row.entity.term.status === "unregistered") {
                        return 'purple';
                    }
                    if (row.entity.term.status === "mapped") {
                        return 'orange';
                    }
                }
            }
        }, {
            name: 'cfCode10',
            field: 'term.cfCode10'
        }, {
            name: 'systematicName',
            field: 'term.systematicName'
        }, {
            name: 'commonTerm',
            field: 'term.commonTerm'
        }, {
            name: 'acronym',
            field: 'term.acronym'
        }, {
            name: 'termDescription',
            field: 'term.termDescription'
        }, {
            name: 'partition',
            field: 'term.partition'
        }, {
            name: 'units',
            field: 'units',
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.unitGroups | EnumOrUnitGroupsAsString }}</span> <span>{{row.entity.units | UnitsAsString }}</span></div>',
            enableSorting: false
        }, {
            name: 'ucums',
            field: 'ucums',
            cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity | UcumsAsStringFromRosetta }}</div>',
            enableSorting: false
        }, {
            name: 'enums',
            field: 'enums',
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.enumGroups | EnumOrUnitGroupsAsString }}</span> <span>{{row.entity.enums | EnumsAsString }}</span></div>',
            enableSorting: false
        }, {
            name: 'code10',
            field: 'term.code10'
        }, {
            name: 'contributingOrganization',
            field: 'contributingOrganization.name'
        }, {
            name: 'vendorDescription',
            field: 'vendorDescription'
        }, {
            name: 'displayName',
            field: 'displayName'
        }, {
            name: 'vendorVmd',
            field: 'vendorVmd'
        }],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {




                if ($scope.state == 'ready') {
                    if (sortColumns.length === 0) {
                        paginationOptions0.sort = null;
                    } else {
                        paginationOptions0.sort = {
                            column: sortColumns[0].colDef.field,
                            value: sortColumns[0].sort.direction
                        };
                    }
                    getPage0();
                } else {
                    if (sortColumns.length === 0) {
                        paginationOptions.sort = null;
                    } else {
                        paginationOptions.sort = {
                            column: sortColumns[0].colDef.field,
                            value: sortColumns[0].sort.direction
                        };
                    }
                    getPage();

                }
            });

            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {

                if ($scope.state == 'ready') {
                    paginationOptions0.pageNumber = newPage;
                    paginationOptions0.pageSize = pageSize;
                    getPage0();
                } else {
                    paginationOptions.pageNumber = newPage;
                    paginationOptions.pageSize = pageSize;
                    getPage();

                }
            });

            gridApi.core.on.filterChanged($scope, function() {
                var grid = this.grid;
                if ($scope.state == 'ready') {

                    paginationOptions0.filters = [];
                    angular.forEach(grid.columns, function(value, key) {
                        if (value.filters[0].term) {
                            paginationOptions0.filters.push({
                                column: value.colDef.field,
                                value: value.filters[0].term
                            });
                        }
                    });
                    getPage0();
                } else {

                    paginationOptions.filters = [];
                    angular.forEach(grid.columns, function(value, key) {
                        if (value.filters[0].term) {
                            paginationOptions.filters.push({
                                column: value.colDef.field,
                                value: value.filters[0].term
                            });
                        }
                    });
                    getPage();

                }
            });
            $scope.test = [];

            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                $scope.test.push(row);
                console.log($scope.test);
                if (row.isSelected) {
                    $scope.selectedEntity = row.entity;
                } else {
                    $scope.selectedEntity = null;
                }
            });
        }
    };
    var getPage = function() {

        RosettaService.getMyRosettas({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort,
            status: paginationOptions.Status
        }).then(function(result) {
            if (result !== null) {


                $scope.gridOptions.data = result.rosettas;
                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };
    if ($scope.state == 'ready') {
        getPage0();
    } else {
        getPage();

    }


    var getPage0 = function() {

        RosettaService.getMyRosettas({
            limit: paginationOptions0.pageSize,
            skip: (paginationOptions0.pageNumber - 1) * paginationOptions0.pageSize,
            filters: paginationOptions0.filters,
            sort: paginationOptions0.sort,
            status: "unregistered"
        }).then(function(result) {
            if (result !== null) {


                unregistered = result.rosettas;
                unregisteredCount = result.totalItems;
                RosettaService.getMyRosettas({
                    limit: paginationOptions0.pageSize,
                    skip: (paginationOptions0.pageNumber - 1) * paginationOptions0.pageSize,
                    filters: paginationOptions0.filters,
                    sort: paginationOptions0.sort,
                    status: "registered"
                }).then(function(result) {
                    if (result !== null) {


                        $scope.gridOptions.data = result.rosettas.concat(unregistered);
                        $scope.gridOptions.totalItems = result.totalItems + unregisteredCount;

                    }
                });
            }
        });

    };
    //    getPage0();


    $scope.gridOptions1 = {
        enableFiltering: true,
        enableColumnResizing: true,
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        columnDefs: [{
            name: 'unitGroups',
            field: 'unitGroups',
            cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity.unitGroups | EnumOrUnitGroupsAsString }}</span></div>'
        }, {
            name: 'refid',
            field: 'term.refid',
            cellTemplate: '<div class="ui-grid-cell-contents" data-toggle="tooltip" data-placement="top" title={{row.entity.term.status}}><span>{{row.entity.term.refid}}</span></div>',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {

                if (row.entity.term !== undefined) {
                    if (row.entity.term.status === undefined) {

                        return 'red';
                    }
                    if (row.entity.term.status === "proposed") {
                        return 'blue';
                    }
                    if (row.entity.term.status === "unregistered") {
                        return 'purple';
                    }
                    if (row.entity.term.status === "registered") {
                        return 'green';
                    }
                    if (row.entity.term.status === "mapped") {
                        return 'orange';
                    }
                }
            }
        }, {
            name: 'ucode10',
            field: 'term.code10'
        }, {
            name: 'cfUcode10',
            field: 'term.cfCode10'
        }, {
            name: 'partition',
            field: 'term.partition'
        }, {
            name: 'unitOfMeasure',
            field: 'unitOfMeasure'
        }, {
            name: 'ucums',
            field: 'ucums',
            cellTemplate: '<div class="ui-grid-cell-contents"> <span>{{row.entity.ucums | UcumsAsString }} </span></div>',
            enableSorting: false
        }, {
            name: 'systematicName',
            field: 'term.systematicName'
        }, {
            name: 'commonTerm',
            field: 'term.commonTerm'
        }, {
            name: 'acronym',
            field: 'term.acronym'
        }, {
            name: 'termDescription',
            field: 'term.termDescription'
        }],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    paginationOptions.sort = null;
                } else {
                    paginationOptions.sort = {
                        column: sortColumns[0].colDef.field,
                        value: sortColumns[0].sort.direction
                    };
                }
                getPage1();
            });

            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                getPage1();
            });

            gridApi.core.on.filterChanged($scope, function() {
                var grid = this.grid;
                paginationOptions.filters = [];
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        paginationOptions.filters.push({
                            column: value.colDef.field,
                            value: value.filters[0].term
                        });
                    }
                });
                getPage1();
            });


            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (row.isSelected) {
                    $scope.selectedEntity = row.entity;
                } else {
                    $scope.selectedEntity = null;
                }
            });
        }
    };

    var getPage1 = function() {
        UnitService.getUnits({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort
        }).then(function(result) {
            if (result !== null) {
                $scope.gridOptions1.data = result.units;
                $scope.gridOptions1.totalItems = result.totalItems;
            }
        });

    };
    getPage1();




    $scope.getCOs = function() {

        AuthService.getCOs().then(function(cos) {
            $scope.cos = cos;
        });
    };

    $scope.showAssignRefidModal = function(rosetta) {
        RosettaService.showAssignRefidModal(rosetta).then(function() {

        });
    };
    $scope.showReadyRefidModal = function(rosetta) {
        RosettaService.showReadyRefidModal(rosetta).then(function() {

        });
    };

    $scope.showRegisterRefidModal = function(rosetta) {
        RosettaService.showRegisterRefidModal(rosetta).then(function() {

        });
    };
    $scope.showEditUnitModal = function(unitValue) {
        UnitService.showEditUnitModal(unitValue).then(function() {

        });
    };

}]);



angular.module('rtmms.rosetta').controller('RefidModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'rosetta', 'RosettaService', 'UnitService', 'AuthService', function($scope, $modalInstance, Restangular, rosetta, RosettaService, UnitService, AuthService) {

    var formDataInitial;
    $scope.user = AuthService.isLoggedIn();
    $scope.constraintType = 'units';


    $scope.refid = [];






    $scope.$watch('formData', function() {

        if ($scope.formData.term.refid !== undefined && $scope.formData.term.partition === undefined) {
            $scope.refidType = 'new';

        }


    }, true);



    if (rosetta) {
        $scope.formData = rosetta;
        formDataInitial = Restangular.copy(rosetta);
        if (rosetta.term.status == "proposed") {
            if ($scope.formData.term.refid !== undefined) {
                $scope.formData.term.refid = $scope.formData.term.refid.replace("MDCX", "MDC");
            } else {
                console.log("Empty REFID");
            }
        } else if (rosetta.term.status == "unregistered" || rosetta.term.status == "registered") {
            $scope.$watch('formData.term.partition', function() {
                console.log("partition=" + $scope.formData.term.partition);
                if ($scope.formData.term.partition !== undefined) {
                    RosettaService.getMyRosettas({
                        partition: $scope.formData.term.partition
                    }).then(function(res) {
                        if(res.next===undefined){
                            alert(res);
                        } else {
                            $scope.avCode10=res.next;
                            $scope.formData.term.cfCode10=$scope.formData.term.partition * Math.pow(2,16)+$scope.formData.term.code10;
                        }

                        
                       
                    });
                }





            }, true);
        }






    }


    $scope.assignRefid = function() {
        console.log("here");
        if ($scope.formrosetta.$invalid) {
            return;
        }
        $scope.formData.term.status = "unregistered";
        //$scope.formData.term.status = "approved";
        $modalInstance.close($scope.formData);
    };
    $scope.registerRefid = function() {
        if ($scope.formrosetta.$invalid) {
            return;
        }

        $scope.formData.term.status = "registered";
        //$scope.formData.term.status = "approved";
        $modalInstance.close($scope.formData);
    };


    $scope.cancel = function() {

        $scope.formData = formDataInitial;

        $modalInstance.dismiss('cancel');
    };



    $scope.removeTerm = function(index, term) {




        delete $scope.formData.term.refid;
        delete $scope.formData.term.partition;
        delete $scope.formData.term.code10;
        delete $scope.formData.term.cfCode10;
        delete $scope.formData.term.status;
        //    delete $scope.formData.term;


    };


}]);
