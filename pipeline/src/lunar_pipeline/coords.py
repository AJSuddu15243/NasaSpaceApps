"""PIPE-4: lat/lon (MOON_ME, degrees, east-positive) <-> south polar stereographic metres.

Sphere R = 1737400 m, origin at the south pole, true scale at the pole (k0 = 1), +y along 0 E
and +x along 90 E (contracts/schemas/common.schema.json crs_params; PGDA IAU 30135).
"""

import numpy as np

RADIUS_M = 1_737_400.0


def to_xy(lat, lon, radius_m=RADIUS_M):
    """(x, y) in metres; rho = 2 R tan(pi/4 + lat/2), x = rho sin lon, y = rho cos lon."""
    lat, lon = np.radians(lat), np.radians(lon)
    if np.any(lat > 0):
        raise ValueError("lat: south polar stereographic needs lat <= 0")
    rho = 2 * radius_m * np.tan(np.pi / 4 + lat / 2)
    return rho * np.sin(lon), rho * np.cos(lon)


def to_latlon(x, y, radius_m=RADIUS_M):
    """(lat, lon) in degrees, lon in (-180, 180]; the pole returns lon 0."""
    rho = np.hypot(x, y)
    lat = np.degrees(2 * np.arctan(rho / (2 * radius_m)) - np.pi / 2)
    return lat, np.degrees(np.arctan2(x, y))
