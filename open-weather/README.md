# OpenWeather

API tests for the [Current weather API](https://openweathermap.org/api/current).

## Setup

Copy `.env.example` to `.env` and fill in one of the shared App IDs at `APPID`. Run the tests from the project root:

```
npx playwright test -c open-weather
```

## Design decisions

### Location through the Geocoding API

The tests look up the coordinates of Utrecht with the [Geocoding API](https://openweathermap.org/api/geocoding-api) and request the weather by `lat` and `lon`. Requesting the weather by city name (`q=Utrecht`) uses the built-in geocoding of the weather API, which is deprecated.

Because the coordinates are looked up first, the 401 test also needs a valid `APPID`: only the weather request itself is sent without it.

### `name` is "Utrecht", not "Provincie Utrecht"

The assignment expects the field `name` to contain "Provincie Utrecht". That value is only returned for the deprecated `q=Utrecht` request (coordinates 52.00, 5.25). For the coordinates from the Geocoding API (the city, 52.08, 5.13), the weather API returns "Utrecht", so the test checks that value.

### City IDs

The city IDs in `city-id.spec.ts` were collected by looking up each city with the Geocoding API and reading `id` from the weather response for those coordinates. The test performs the same lookup by city name and checks that the response contains the expected ID.

### Temperature range when comparing units

The units test requests the temperature in Kelvin (default) and in Celsius (`units=metric`). The two values are not compared by converting one into the other, because the two requests do not always return the same measurement: in repeated calls the Celsius value was consistently 0.14 °C higher than the converted Kelvin value.

Instead, each value is checked against the expected temperature range for Utrecht: -20 °C to +45 °C, which is 253.15 K to 318.15 K. The ranges do not overlap, so a temperature in the wrong unit always fails the check.
