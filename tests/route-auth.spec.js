
describe( "RouteAuth Provider", function ()
{
    "use strict";

    var RouteAuth, $rootScope, $location;

    beforeEach( function ()
    {
        var mockModule = angular.module( "test.vokal.RouteAuth", function () {} );
        mockModule.config( function ( RouteAuthProvider )
        {
            RouteAuthProvider.setRedirectPath( "/login" );
        } );

        module( "vokal.RouteAuth", "test.vokal.RouteAuth" );

        inject( function ( $injector )
        {
            RouteAuth = $injector.get( "RouteAuth" );
            $rootScope = $injector.get( "$rootScope" );
            $location = $injector.get( "$location" );
        } );
    } );

    it( "should start with no roles", function ()
    {
        expect( RouteAuth.hasNoRoles() ).toBe( true );
        expect( RouteAuth.hasRoles( [ "user" ] ) ).toBe( false );
    } );

    it( "should store and load roles", function ()
    {
        RouteAuth.storeRoles( [ "user" ] );
        expect( RouteAuth.hasRoles( [ "user" ] ) ).toBe( true );
    } );

    it( "should allow the adding of a role to the existing set", function ()
    {
        RouteAuth.storeRoles( [ "user" ] );
        RouteAuth.addRole( "admin" );

        expect( RouteAuth.hasRoles( [ "user" ] ) ).toBe( true );
        expect( RouteAuth.hasRoles( [ "admin" ] ) ).toBe( true );
    } );

    it( "should resolve promise when has roles", function ()
    {
        RouteAuth.storeRoles( [ "user" ] );

        var result;

        RouteAuth.auth( [ "user" ] )
            .then( function ()
            {
                result = true;
            } );

        $rootScope.$apply();

        expect( result ).toBe( true );
    } );

    it( "should cause redirect when has no roles", function ()
    {
        RouteAuth.storeRoles( [] );

        var result;

        RouteAuth.auth( [ "user" ] )
            .then( function () { },
            function ()
            {
                result = true;
            } );

        $rootScope.$apply();

        expect( result ).toBe( true );
        expect( $location.path() ).toBe( "/login" );
    } );

    it( "should allow when route requires no roles and auth has no roles", function ()
    {
        var result;

        RouteAuth.auth( [] )
            .then( function ()
            {
                result = true;
            } );

        $rootScope.$apply();

        expect( result ).toBe( true );
    } );

} );
