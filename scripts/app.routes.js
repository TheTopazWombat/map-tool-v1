(function () {
    "use strict";

    angular.module('app')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: '../views/home.html'
                })
                .state('divmap', {
                    url: '/divmap',
                    templateUrl: '../views/divmap.html',
                    controller: 'divmapCtrl'
                })
                .state('divmapMaker', {
                    url: '/divmapMaker',
                    templateUrl: '../views/divmapMaker.html',
                    controller: 'divmapMakerCtrl'
                })
        });


} ());