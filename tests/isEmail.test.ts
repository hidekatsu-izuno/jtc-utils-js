import { describe, expect, test } from "vitest";
import { isEmail } from "../src/isEmail.js";

describe("isEmail", () => {
	test("test empty", () => {
		expect(isEmail(undefined)).toBe(false);
		expect(isEmail(null)).toBe(false);
		expect(isEmail("")).toBe(false);
	});

	test("test basic", () => {
		expect(isEmail("test@domain.com")).toBe(true);
		expect(isEmail("test.sample@domain_domain.co.jp")).toBe(false);
		expect(isEmail("test.sample@domain-domain.co.jp")).toBe(true);
		expect(isEmail("test.@domain.ne.fr")).toBe(true);
		expect(isEmail(".test@example")).toBe(true);
		expect(isEmail("あいう@example")).toBe(false);
	});
});
