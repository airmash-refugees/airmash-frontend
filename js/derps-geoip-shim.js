
/**
 * Fetch our GeoIP from geojs.io (free service), since /game is currently a
 * static file.
 */
$(function()
{
    if(! Cookies.get('cid')) {
        Cookies.set('cid', Math.floor(Math.random()*1e16).toString(36), {
            expires: 3650,
            domain: 'airmash.online'
        });
    }

    $.get('https://get.geojs.io/v1/ip/country.json', null, function(response)
    {
        if(response && response.country) {
            window.game.myFlag = response.country;
        }
    });
});
