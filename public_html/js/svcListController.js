
'use strict';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var module=angular.module('myApp.controllers', [])
  .controller('SvcListCtrl', ['$scope', SvcListCtrl]);
var _scope;
function isSelected(tabNum)
{
    return _scope.tabsStatus.selected===tabNum;
}
function selectTab(tabNum)
{
    _scope.tabsStatus.selected=tabNum;
}
function SvcListCtrl($scope) 
{
    _scope=$scope;
    $scope.tabsStatus={
        selected: 1,
        collapsed: 'false'
    };
    
    $scope.isSelected=isSelected;
    $scope.selectTab=selectTab;
        $scope.mySelections =[];
        $scope.testListDataMOCK = 
         [
            {svcName: "s-1", svcId: 1, svcType: 1, svcStatus: "Aborted", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
            {svcName: "s-2", svcId: 2, svcType: 1, svcStatus: "Aborted", data: {svcName: "Moroni", svcId: 50, testId: 1, testStatus: "Aborted"}},
        ];
         $scope.testListOptionsMOCK = {
            data: 'testListDataMOCK',
              showGroupPanel: true,
            showColumnMenu: true,
            showFooter:     true,
            columnDefs: [ {field: 'svcName',displayName: 'Name'}, {field: 'svcId',displayName: 'ID'}, {field: 'svcType',displayName: 'Type'}, {field: 'svcStatus',displayName: 'Status'}, {field: 'data', visible: false}],
            afterSelectionChange: onSelect,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            rowTemplate: '<div ng-dblclick="onDblClickRow(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'
        };
    
    
    
    
    
$scope.scopeVal=$scope.valueOf();
        var j4p = new Jolokia({url: "http://127.0.0.1:7777/jolokia/"});
        console.log("before request");
        var req2 = { type: "EXEC", mbean: "com.rad.ems.svc.snapshot.jmx:type=ThreadsMonitorMBean", operation: "getAgentDescriptorByNerId", arguments:[228] };
        var reqAllTests = { type: "read", mbean: "com.rad.mtsc.abm.server.jmx:type=AbmMonitorMBean", attribute: "AllServices"};
        $scope.resp = j4p.request(reqAllTests);
        $scope.customObj= $scope.resp===null? null:$scope.resp.value;
        $scope.svcListData=[]; //for real get
        if($scope.customObj!==null)
        {
        createSvcListDataFromResponseValue($scope.resp.value,$scope.svcListData);
        /*$scope.testListData = [{param1: $scope.customObj.someList[0].param1, param2: $scope.customObj.someList[0].param2},
            {param1: $scope.customObj.someList[1].param1, param2: $scope.customObj.someList[1].param2}]
            ;*/
        $scope.selectedRows=[{name:"no selection"}] ;    
        $scope.gridOptionsSvc=
        {
            data: 'svcListData',
            showGroupPanel: true,
            showColumnMenu: true,
            showFooter:     true,
           columnDefs: [ {field: 'svcName',displayName: 'Name'}, {field: 'svcId',displayName: 'ID'}, {field: 'svcType',displayName: 'Type'}, {field: 'svcStatus',displayName: 'Status'}, {field: 'data', visible: false}],
            afterSelectionChange: onSelect,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            rowTemplate: '<div ng-dblclick="onDblClickRow(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'
        };
        }
        else
            $scope.gridOptionsSvc=$scope.testListOptionsMOCK;
        
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


}

function createSvcListDataFromResponseValue(respVal, svcListData)
{


    for(var i = 0; i < respVal.length; i++)
    {
       var svc=respVal[i];
       var data=new Object();
        data.svcName=svc.serviceName;
        data.svcId=svc.serviceId;
        data.svcType=svc.serviceType;
        data.svcStatus=svc.serviceState;
        data.data=svc;//hidden data, the testInstancedata itself
        svcListData.push(data);
    }
}