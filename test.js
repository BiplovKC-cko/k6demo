import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";

const failures = new Rate("failed requests");

export const options = {
  thresholds: {
    failed_requests: ["rate<=0"],
    http_req_duration: ["p(95)<100"],
  },
};
export default function () {
  const result = http.get("https://test-api.k6.io");

  check(result, {
    "Response code is 200": (r) => r.status === 200,
  });
  failures.add(result.status != 200);
}
