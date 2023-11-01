function skillsMember() {
    return {
        restrict: 'E',
        scope: {
            member: '='
        },
        templateUrl: 'app/directives/member/member.html',
        controller: function ($scope) {
            $scope.skills = $scope.member.skills;
        }
    };
}