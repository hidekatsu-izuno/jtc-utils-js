export interface PackedMapSetter {
	set(key: number, value: number): void;
}

export class PackedMap {
	private map: Map<number, Uint8Array | Uint16Array | Uint32Array>;
	private init?: (setter: PackedMapSetter) => void;

	constructor(
		init: (
			setter: PackedMapSetter,
		) => void | Map<number, Uint8Array | Uint16Array | Uint32Array>,
	) {
		if (init instanceof Map) {
			this.map = init;
		} else {
			this.map = new Map<number, Uint8Array | Uint16Array | Uint32Array>();
			this.init = init;
		}
	}

	initialize() {
		if (!this.init) {
			return;
		}

		const map = new Map<number, number[]>();

		this.init(<PackedMapSetter>{
			set(key: number, value: number) {
				const key1 = key >>> 5;
				const key2 = key & 0b11111;

				let array = map.get(key1);
				if (!array) {
					array = new Array<number>();
					map.set(key1, array);
				}
				if (!array[key2]) {
					array[key2] = value;
				}
			},
		});

		for (const [key, value] of map.entries()) {
			let flags = 0;
			let max = 1;
			const filtered = value.filter((item, index) => {
				if (item != null) {
					flags |= 1 << (31 - index);
					if ((item & 0xffff0000) !== 0) {
						max = Math.max(max, 4);
					} else if ((item & 0xffffff00) !== 0) {
						max = Math.max(max, 2);
					}
					return true;
				}
				return false;
			});
			if (max === 1) {
				const array = new Uint8Array(filtered.length + 4);
				array[0] = (flags >>> 24) & 0xff;
				array[1] = (flags >>> 16) & 0xff;
				array[2] = (flags >>> 8) & 0xff;
				array[3] = flags & 0xff;
				array.set(filtered, 4);
				this.map.set(key, array);
			} else if (max === 2) {
				const array = new Uint16Array(filtered.length + 2);
				array[0] = (flags >>> 16) & 0xffff;
				array[1] = flags & 0xffff;
				array.set(filtered, 2);
				this.map.set(key, array);
			} else {
				const array = new Uint32Array(filtered.length + 1);
				array[0] = flags;
				array.set(filtered, 1);
				this.map.set(key, array);
			}
		}

		this.init = undefined;
	}

	get(key: number): number | undefined {
		this.initialize();

		const key1 = key >>> 5;
		const key2 = key & 0b11111;
		const array = this.map?.get(key1);
		if (array) {
			if (array.BYTES_PER_ELEMENT === 1) {
				const shifted =
					((array[0] << 24) | (array[1] << 16) | (array[2] << 8) | array[3]) >>>
					(31 - key2);
				if ((shifted & 0x1) !== 0) {
					return array[bitcount(shifted) - 1 + 4];
				}
			} else if (array.BYTES_PER_ELEMENT === 2) {
				const shifted = ((array[0] << 16) | array[1]) >>> (31 - key2);
				if ((shifted & 0x1) !== 0) {
					return array[bitcount(shifted) - 1 + 2];
				}
			} else {
				const shifted = array[0] >>> (31 - key2);
				if ((shifted & 0x1) !== 0) {
					return array[bitcount(shifted) - 1 + 1];
				}
			}
		}
	}

	get size(): number {
		return this.map?.size ?? 0;
	}
}

function bitcount(n: number) {
	n = n - ((n >>> 1) & 0x55555555);
	n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
	n = (n + (n >>> 4)) & 0x0f0f0f0f;
	n = n + (n >>> 8);
	n = n + (n >>> 16);
	return n & 0x3f;
}
