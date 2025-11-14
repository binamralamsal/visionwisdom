import path from "path";
import maxmind, { CityResponse } from "maxmind";

export const openMaxmind = () =>
  maxmind.open<CityResponse>(
    path.join(process.cwd(), ".maxmind", "GeoLite2-City.mmdb"),
  );
