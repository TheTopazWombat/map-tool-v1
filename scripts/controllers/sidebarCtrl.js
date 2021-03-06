(function () {
    "use strict";

    angular.module('app')
        .controller('sidebarCtrl', function ($scope, $firebaseAuth, $firebaseArray, $firebaseObject, campaignService, $interval) {

            var fbref = firebase.database().ref();
            $scope.hideMenu = false;

            var auth = $firebaseAuth();
            $scope.signIn = function () {
                $scope.firebaseUser = null;
                $scope.error = null;

                auth.$signInWithPopup('google').then(function (firebaseUser) {
                    $scope.firebaseUser = firebaseUser;
                    console.log(firebaseUser);
                    localStorage.setItem('firebaseUser', JSON.stringify(firebaseUser));
                }).catch(function (error) {
                    $scope.error = error;
                });
            };

            // Simple auth solution for now
            if (localStorage.getItem("firebaseUser")) {
                $scope.firebaseUser = JSON.parse(localStorage.getItem("firebaseUser"));
            }

            $scope.logout = function () {
                localStorage.removeItem('firebaseUser');
                $scope.firebaseUser = null;
            }

            $scope.hideCard = function (property) {
                $scope[property] = !$scope[property];
            }

            $scope.toggleSidebar = function () {
                $scope.hideMenu = !$scope.hideMenu;
            }
            
            // Functionality for Dicebag
            var recentRolls = [];

            $scope.rollDice = function () {
                var numberOfDice = document.getElementById('dice-number').value;
                var typeOfDice = document.getElementById('dice-type').value;
                var modifier = document.getElementById('dice-modifier').value || 0;
                var dieRolls = [];
                console.log('number', numberOfDice);
                console.log('type', typeOfDice);
                while (numberOfDice > 0) {
                    var dieRoll = rollRandom(typeOfDice);
                    console.log('roll ' + numberOfDice, dieRoll);
                    dieRolls.push(dieRoll);
                    numberOfDice--;
                }

                // Display each roll 
                var rollsString = dieRolls.join(", ");
                rollsString = "(" + rollsString + ")";
                if (rollsString.length < 50) document.getElementById('individual-rolls').textContent = rollsString;

                // Sum and display Total
                dieRolls.push(parseInt(modifier)); //add the mod to the roll
                var totalRoll = (dieRolls.reduce(function (x, y) { return x + y; })).toString();
                trackRecentRolls(totalRoll);
                document.getElementById('roll').textContent = totalRoll;
            };

            function rollRandom(dieNum) {
                return Math.floor(Math.random() * dieNum) + 1;
            }

            function trackRecentRolls(roll) {
                if (recentRolls.length >= 12) {
                    recentRolls.shift();
                }
                recentRolls.push(roll);
                var rollString = '';
                recentRolls.forEach(function (e, i, a) {
                    if (i === 0) {
                        rollString += e;
                    } else {
                        rollString += (", " + e);
                    }
                    console.log("recent rolls", rollString);
                });
                document.getElementById('recent-rolls').textContent = rollString;
            }

            // Crappy temp log book solution
            $scope.notePad = localStorage.getItem('notePad');

            $scope.saveNotePad = function () {
                console.log('saving notes');
                localStorage.setItem('notePad', $scope.notePad);
            };

            $scope.activeCampaign = null;

            $scope.newPartyJournalNote = {};

            $scope.addPartyJournalNote = function () {
                console.log($scope.newPartyJournalNote);
                if (!$scope.newPartyJournalNote.characterName || !$scope.newPartyJournalNote.text) {
                    toastr.warning('Must have a Name and Note text', 'Hold up');
                    return;
                }
                $scope.newPartyJournalNote.user = $scope.firebaseUser.user.displayName;
                if ($scope.activeCampaign && !$scope.activeCampaign.partyJournal) {
                    $scope.activeCampaign.partyJournal = [];
                };
                var time = new Date();
                $scope.newPartyJournalNote.timeStamp = time.toLocaleDateString() + ' - ' + time.toLocaleTimeString();
                $scope.activeCampaign.partyJournal.push($scope.newPartyJournalNote);

                campaignService.saveCampaign($scope.activeCampaign);

                $scope.newPartyJournalNote = {};
            };

        });

} ());