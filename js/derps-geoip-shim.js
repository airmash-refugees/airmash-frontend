
/**
 * Fetch our GeoIP from geojs.io (free service), since /game is currently a
 * static file.
 */
$(function()
{
    $.get('https://get.geojs.io/v1/ip/country.json', null, function(response)
    {
        if(response && response.country) {
            window.game.myFlag = response.country;
        }
    });
});
