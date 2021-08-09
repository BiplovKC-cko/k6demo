import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";

const failures = new Rate("failed requests");

export const options = {
  ext: {
    loadimpact: {
      projectID: 3456059,
      name: `Biplov Test`,
      note: "Hello world", // this does not work atm
    },
  },
  scenarios: {
    test: {
      executor: "constant-arrival-rate",
      rate: 10,
      timeUnit: "2s",
      duration: "10s",
      preAllocatedVUs: 1,
      maxVUs: 10,
    },
  },
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
