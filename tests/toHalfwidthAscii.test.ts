import { describe, expect, test } from "vitest";
import { toHalfwidthAscii } from "../src/toHalfwidthAscii.js";

describe("toHalfwidthAscii", () => {
	test("test converting to half width", () => {
		expect(toHalfwidthAscii("\0")).toBe("\0");
		expect(toHalfwidthAscii("　")).toBe(" ");
		expect(toHalfwidthAscii("！")).toBe("!");
		expect(toHalfwidthAscii("０")).toBe("0");
		expect(toHalfwidthAscii("Ａ")).toBe("A");
		expect(toHalfwidthAscii("ａ")).toBe("a");
		expect(toHalfwidthAscii("～")).toBe("~");
		expect(toHalfwidthAscii("亜")).toBe("亜");
		expect(toHalfwidthAscii("ア")).toBe("ア");
		expect(toHalfwidthAscii("ｱ")).toBe("ｱ");
		expect(toHalfwidthAscii("ガ")).toBe("ガ");
		expect(toHalfwidthAscii("ｶﾞ")).toBe("ｶﾞ");
		expect(toHalfwidthAscii("パ")).toBe("パ");
		expect(toHalfwidthAscii("ﾊﾟ")).toBe("ﾊﾟ");
		expect(toHalfwidthAscii("「")).toBe("「");
		expect(toHalfwidthAscii("」")).toBe("」");
	});

	test("test basic sequences", () => {
		expect(toHalfwidthAscii("０Ａアガパー")).toBe("0Aアガパー");
	});
});
