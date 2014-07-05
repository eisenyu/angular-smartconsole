'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])
    //Test List Controller!
    .controller('TestListCtrl', ['$scope', function($scope,$modal)
    {
//        $scope.myData = [{name: "Moroni", age: 50},
//            {name: "Tiancum", age: 43},
//            {name: "Jacob", age: 27},
//            {name: "Nephi", age: 29},
//            {name: "Enos", age: 34}];
//        $scope.gridOptions = { data: 'myData' };
//
//
//        $scope.testListData = [{name: "Moroni", age: 50},
//            {name: "Tiancum", age: 43},
//            {name: "Jacob", age: 27},
//            {name: "Nephi", age: 29},
//            {name: "Enos", age: 34}];
//        $scope.testListOptions = {
//            data: 'testListData',
//            showGroupPanel: true
//        };
        $scope.scopeVal=$scope.valueOf();
        var j4p = new Jolokia({url: "http://127.0.0.1:7777/jolokia/"});
        console.log("before request");
        var req2 = { type: "EXEC", mbean: "com.rad.ems.svc.snapshot.jmx:type=ThreadsMonitorMBean", operation: "getAgentDescriptorByNerId", arguments:[228] };
        var reqAllTests = { type: "read", mbean: "com.rad.mtsc.y1564.server.jmx:type=Y1564MonitorMBean", attribute: "AllTests"};
        $scope.resp = j4p.request(reqAllTests);
        $scope.customObj=$scope.resp.value;
        $scope.testListData =[];
        createTestListDataFromResponseValue($scope.resp.value,$scope.testListData);
        /*$scope.testListData = [{param1: $scope.customObj.someList[0].param1, param2: $scope.customObj.someList[0].param2},
            {param1: $scope.customObj.someList[1].param1, param2: $scope.customObj.someList[1].param2}]
            ;*/
        $scope.gridOptions=
        {
            data: 'testListData',
            showGroupPanel: true,
            showColumnMenu: true,
            showFooter:     true,
            columnDefs: [ {field: 'svcName'}, {field: 'svcId'}, {field: 'testId'}, {field: 'testStatus'}, {field: 'data', visible: false}],
            afterSelectionChange: onSelect,
            rowTemplate: '<div ng-dblclick="onDblClickRow(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'

//          ,  rowTemplate: '<div ng-dblclick="onDblClick(row.entity)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
//                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
//                'class="ngCell {{col.cellClass}}" ng-cell></div>'
        };


        $scope.onDblClickRow= function onDblClickCallbackFun(row)
        {
            row;
            console.log("GOT DBL CLICK!!!");
            $scope.open('lg');
        }
        function onSelect(rowItem, event)
        {
            if(!rowItem.selected)
                return;
            console.log("ON SELECT!!!");
        }

        //open popup dialog (according template)
        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);








function createTestListDataFromResponseValue(respVal, testListData)
{


    for(var i = 0; i < respVal.length; i++)
    {
       var test=respVal[i];
       var data=new Object();
        data.svcName="Svc-"+test.serviceId;
        data.svcId=test.serviceId;
        data.testId=test.testInstanceId;
        data.testStatus=test.testInstanceMibAccessData.ituSatGeneratorStatusAsEStatus;
        data.data=test;//hidden data, the testInstancedata itself
        testListData.push(data);
    }
}
function AlertDemoCtrl($scope) {
    $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

}