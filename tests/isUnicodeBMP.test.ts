import { describe, expect, test } from "vitest"
import { isUnicodeBMP } from "../src/isUnicodeBMP.js"

describe("isUnicodeBMP", () => {

  test("test no string", () => {
    expect(isUnicodeBMP(undefined)).toBe(false)
    expect(isUnicodeBMP(null)).toBe(false)
    expect(isUnicodeBMP("")).toBe(true)
  })

  test("test basic sequcence", () => {
    expect(isUnicodeBMP("ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ")).toBe(true)
    expect(isUnicodeBMP("あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ")).toBe(true)
    expect(isUnicodeBMP("ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ")).toBe(true)
    expect(isUnicodeBMP("亜いｳエｵガｷﾞ具ｹﾞゴﾊﾟぴプﾎﾟ")).toBe(true)
    expect(isUnicodeBMP("𠮟")).toBe(false)
  })
})
