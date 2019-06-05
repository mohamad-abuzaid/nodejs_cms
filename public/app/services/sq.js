/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function () {
    'use strict';

    angular
            .module('MainAppController').factory('sq', sq);

    function sq() {
        var selectedMember;

        var sq = {
            getSelectedMember: getSelectedMember,
            setSelectedMember: setSelectedMember
        };

        return sq;

        function getSelectedMember() {
            return selectedMember;
        }
        function setSelectedMember(value) {
            selectedMember = value;
        }
    }

})();