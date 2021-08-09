import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";

const failures = new Rate("failed requests");

export const options = {
  ext: {
    loadimpact: {
      projectID: 3456059,
      name: `Biplov Test`,
      note: "Toxiproxy latency was set to 1 seconds and jitter was set to 500 milliseconds", // this does not work atm
    },
  },
  vus: 10,
  duration: "5s",
  thresholds: {
    failed_requests: ["rate<=0"],
    http_req_duration: ["p(95)<500", "p(99)<700"],
  },
};
export default function () {
  const result = http.get("https://test-api.k6.io");

  check(result, {
    "Response code is 200": (r) => r.status === 200,
  });
  failures.add(result.status != 200);
}
