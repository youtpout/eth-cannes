// Palais des festivals Cannes Latitude : 43,5513755 Longitude : 7,017384

fn main(lat: i64, long: i64) {
    // coord x 1_000_000
    let latCannes: i64 = 43_551_375;
    let longCannes: i64 = 7_017_384;

    let delta_lat = lat - latCannes; // in milli-degrees
    let delta_lon = long - longCannes;

    // 1 microdegree around 0.11132 meters
    // To keep integers: multiply delta by 11132 and divide by 100000 (i.e. 0.11132 = 11132/100000)
    let dy = (delta_lat * 11132) / 100000;
    let dx = (delta_lon * 11132) / 100000;

    // Compute squared distance
    let square_distance = dx * dx + dy * dy;

    // Return approximate square root (distance in meters)
    // Noir has no built-in sqrt, so we use an integer approximation
    let dist: i64 = sqrt_approx(square_distance);

    println(f"distance: {dist} m");

    // due to calculation precision and gps phone precision, we use 500m as max distance
    assert(dist < 500, "You are too far from Palais des congrès");
}

/// Approximate square root using Newton's method (on i64)
fn sqrt_approx(x: i64) -> i64 {
    let mut guess = x / 2;
    for i in 0..20 {
        guess = (guess + x / guess) / 2;
    }
    guess
}

#[test]
fn test_main() {
    main(43_549_755, 7_018_199);

    // Uncomment to make test fail
    // main(1, 1);
}

#[test(should_fail_with = "You are too far from Palais des congrès")]
fn test_fail_distance() {
    main(42_549_755, 6_018_199);

    // Uncomment to make test fail
    // main(1, 1);
}
