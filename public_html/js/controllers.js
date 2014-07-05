'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])
    //Test List Controller!
    .controller('TestListCtrl', ['$scope','$modal', function($scope,$modal)
    {
        $scope.mySelections =[];
        $scope.testListDataMOCK = 
         [
            {svcName: "s-1", svcId: 1, testId: 1, testStatus: "Aborted", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-1", svcId: 1, testId: 2, testStatus: "Idle", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-3", svcId: 3, testId: 3, testStatus: "Idle", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-4", svcId: 4, testId: 4, testStatus: "Idle", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-5", svcId: 5, testId: 5, testStatus: "Idle", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-6", svcId: 6, testId: 6, testStatus: "Failed", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}}
        ];
         $scope.testListOptionsMOCK = {
            data: 'testListDataMOCK',
              showGroupPanel: true,
            showColumnMenu: true,
            showFooter:     true,
            columnDefs: [ {field: 'svcName'}, {field: 'svcId'}, {field: 'testId'}, {field: 'testStatus'}, {field: 'data', visible: false}],
            afterSelectionChange: onSelect,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            rowTemplate: '<div ng-dblclick="onDblClickRow(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'
        };
        $scope.scopeVal=$scope.valueOf();
        var j4p = new Jolokia({url: "http://127.0.0.1:7777/jolokia/"});
        console.log("before request");
        var req2 = { type: "EXEC", mbean: "com.rad.ems.svc.snapshot.jmx:type=ThreadsMonitorMBean", operation: "getAgentDescriptorByNerId", arguments:[228] };
        var reqAllTests = { type: "read", mbean: "com.rad.mtsc.y1564.server.jmx:type=Y1564MonitorMBean", attribute: "AllTests"};
        $scope.resp = j4p.request(reqAllTests);
        $scope.customObj= $scope.resp===null? null:$scope.resp.value;
        
        if($scope.customObj!==null)
        {
        createTestListDataFromResponseValue($scope.resp.value,$scope.testListData);
        /*$scope.testListData = [{param1: $scope.customObj.someList[0].param1, param2: $scope.customObj.someList[0].param2},
            {param1: $scope.customObj.someList[1].param1, param2: $scope.customObj.someList[1].param2}]
            ;*/
        $scope.selectedRows=[{name:"no selection"}] ;    
        $scope.gridOptions=
        {
            data: 'testListData',
            showGroupPanel: true,
            showColumnMenu: true,
            showFooter:     true,
            columnDefs: [ {field: 'svcName'}, {field: 'svcId'}, {field: 'testId'}, {field: 'testStatus'}, {field: 'data', visible: false}],
            afterSelectionChange: onSelect,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            rowTemplate: '<div ng-dblclick="onDblClickRow(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'

//          ,  rowTemplate: '<div ng-dblclick="onDblClick(row.entity)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
//                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
//                'class="ngCell {{col.cellClass}}" ng-cell></div>'
        };
        }
        else
            $scope.gridOptions=$scope.testListOptionsMOCK;

        $scope.onDblClickRow= function onDblClickCallbackFun(row)
        {
            row;
            console.log("GOT DBL CLICK!!!");
            $scope.open('lg');
        };
        function onSelect(rowItem, event)
        {
            if(!rowItem.selected)
                return;
            console.log("ON SELECT!!! selection:"+$scope.mySelections[0].svcName);
        }

        //open popup dialog (according template)
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'partials/testlistItuParams.html',// 'myModalContent.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    },
                    selection: function () {
                        return $scope.mySelections;
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
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items, selection) 
{
console.log("selected on dbl click: "+selection[0].svcName);
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
    $scope.testInstanceNameValuesData=createNameValueDataFromTestInstanceObject(selection[0]);
          $scope.testListDataMOCK = 
         [
            {svcName: "s-1", svcId: 1, testId: 1, testStatus: "Aborted", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-1", svcId: 1, testId: 2, testStatus: "Idle", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-3", svcId: 3, testId: 3, testStatus: "Idle", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-4", svcId: 4, testId: 4, testStatus: "Idle", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-5", svcId: 5, testId: 5, testStatus: "Idle", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-6", svcId: 6, testId: 6, testStatus: "Failed", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}}
        ];
         $scope.gridOption = {
            data: 'testInstanceNameValuesData',
            showGroupPanel: true,
            showColumnMenu: true,
            showFooter:     true,
            //columnDefs: [ {field: 'svcName'}, {field: 'svcId'}, {field: 'testId'}, {field: 'testStatus'}, {field: 'data', visible: false}],
        };
        
};
function createNameValueDataFromTestInstanceObject(tst)
{
    var nameValList=[];
    for(var p in tst.data)
    {
        var obj={name: p,  value: tst[p]};
        nameValList.push(obj);
    }
    return nameValList;
}