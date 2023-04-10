import { describe, expect, test } from 'vitest'
import isWindows31J from '../src/isWindows31J.js'

describe('isWindows31J', () => {
    test("test ascii", () => {
        for (let i = 0x00; i <= 0x7F; i++) {
            expect(isWindows31J(String.fromCharCode(i))).toBe(true)
        }
    })

    test("test fullwidth symbol", () => {
        expect(isWindows31J("　")).toBe(true)
        expect(isWindows31J("、")).toBe(true)
        expect(isWindows31J("、")).toBe(true)
    })

    test("test fullwidth kanji", () => {
        expect(isWindows31J("亜")).toBe(true)
        expect(isWindows31J("腕")).toBe(true)
    })
})