var glength, gaccesstoken;
(function() {
    function u(b, a, d, c, f) {
        this.fromSampleRate = b;
        this.toSampleRate = a;
        this.channels = d | 0;
        this.outputBufferSize = c;
        this.noReturn = !!f;
        this.initialize()
    }
    var r;
    r = this;
    var e;
    e = {};
    var h = {}.hasOwnProperty
      , m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
      , w = [].indexOf || function(b) {
        for (var a = 0, d = this.length; a < d; a++)
            if (a in this && this[a] === b)
                return a;
        return -1
    }
    ;
    e.Base = function() {
        function b() {}
        var a;
        a = /\b_super\b/;
        b.extend = function(b) {
            var c, f, k, g, l, e;
            c = function(a) {
                function c() {
                    return c.__super__.constructor.apply(this, arguments)
                }
                m(c, a);
                return c
            }(this);
            if ("function" === typeof b)
                for (k in g = Object.keys(c.prototype),
                b.call(c, c),
                b = {},
                l = c.prototype,
                l)
                    f = l[k],
                    0 > w.call(g, k) && (b[k] = f);
            e = c.__super__;
            for (k in b)
                f = b[k],
                "function" === typeof f && a.test(f) ? function(a, b) {
                    return c.prototype[a] = function() {
                        var c, d;
                        d = this._super;
                        this._super = e[a];
                        c = b.apply(this, arguments);
                        this._super = d;
                        return c
                    }
                }(k, f) : c.prototype[k] = f;
            return c
        }
        ;
        return b
    }();
    e.Buffer = function() {
        function b(a) {
            var b;
            if (a instanceof Uint8Array)
                this.data = a;
            else if (a instanceof ArrayBuffer || Array.isArray(a) || "number" === typeof a || e.isNode && null != (b = r.Buffer) && b.isBuffer(a))
                this.data = new Uint8Array(a);
            else if (a.buffer instanceof ArrayBuffer)
                this.data = new Uint8Array(a.buffer,a.byteOffset,a.length * a.BYTES_PER_ELEMENT);
            else if (a instanceof e.Buffer)
                this.data = a.data;
            else
                throw Error("Constructing buffer with unknown type.");
            this.length = this.data.length;
            this.prev = this.next = null
        }
        var a, d;
        b.allocate = function(a) {
            return new e.Buffer(a)
        }
        ;
        b.prototype.copy = function() {
            return new e.Buffer(new Uint8Array(this.data))
        }
        ;
        b.prototype.slice = function(a, b) {
            null == b && (b = this.length);
            return 0 === a && b >= this.length ? new e.Buffer(this.data) : new e.Buffer(this.data.subarray(a, a + b))
        }
        ;
        a = r.BlobBuilder || r.MozBlobBuilder || r.WebKitBlobBuilder;
        d = r.URL || r.webkitURL || r.mozURL;
        b.makeBlob = function(c, b) {
            var d;
            null == b && (b = "application/octet-stream");
            try {
                return new Blob([c],{
                    type: b
                })
            } catch (g) {}
            return null != a ? (d = new a,
            d.append(c),
            d.getBlob(b)) : null
        }
        ;
        b.makeBlobURL = function(a, b) {
            return null != d ? d.createObjectURL(this.makeBlob(a, b)) : void 0
        }
        ;
        b.revokeBlobURL = function(a) {
            return null != d ? d.revokeObjectURL(a) : void 0
        }
        ;
        b.prototype.toBlob = function() {
            return b.makeBlob(this.data.buffer)
        }
        ;
        b.prototype.toBlobURL = function() {
            return b.makeBlobURL(this.data.buffer)
        }
        ;
        return b
    }();
    e.BufferList = function() {
        function b() {
            this.last = this.first = null;
            this.availableBuffers = this.availableBytes = this.numBuffers = 0
        }
        b.prototype.copy = function() {
            var a;
            a = new e.BufferList;
            a.first = this.first;
            a.last = this.last;
            a.numBuffers = this.numBuffers;
            a.availableBytes = this.availableBytes;
            a.availableBuffers = this.availableBuffers;
            return a
        }
        ;
        b.prototype.append = function(a) {
            var b;
            a.prev = this.last;
            null != (b = this.last) && (b.next = a);
            this.last = a;
            null == this.first && (this.first = a);
            this.availableBytes += a.length;
            this.availableBuffers++;
            return this.numBuffers++
        }
        ;
        b.prototype.advance = function() {
            return this.first ? (this.availableBytes -= this.first.length,
            this.availableBuffers--,
            this.first = this.first.next,
            null != this.first) : !1
        }
        ;
        b.prototype.rewind = function() {
            var a;
            if (this.first && !this.first.prev)
                return !1;
            if (this.first = (null != (a = this.first) ? a.prev : void 0) || this.last)
                this.availableBytes += this.first.length,
                this.availableBuffers++;
            return null != this.first
        }
        ;
        b.prototype.reset = function() {
            for (; this.rewind(); )
                ;
            return []
        }
        ;
        return b
    }();
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.Stream = function() {
        function b(a) {
            this.list = a;
            this.offset = this.localOffset = 0
        }
        var a, d, c, f, k, g, l, t, n, s, q, v, h;
        a = new ArrayBuffer(16);
        h = new Uint8Array(a);
        n = new Int8Array(a);
        q = new Uint16Array(a);
        l = new Int16Array(a);
        v = new Uint32Array(a);
        t = new Int32Array(a);
        c = new Float32Array(a);
        "undefined" !== typeof Float64Array && null !== Float64Array && (f = new Float64Array(a));
        s = 13330 === (new Uint16Array((new Uint8Array([18, 52])).buffer))[0];
        e.UnderflowError = function(a) {
            function c() {
                this.name = "AV.UnderflowError"
            }
            m(c, a);
            return c
        }(Error);
        b.fromBuffer = function(a) {
            var c;
            c = new e.BufferList;
            c.append(a);
            return new e.Stream(c)
        }
        ;
        b.prototype.copy = function() {
            var a;
            a = new e.Stream(this.list.copy());
            a.localOffset = this.localOffset;
            a.offset = this.offset;
            return a
        }
        ;
        b.prototype.available = function(a) {
            return a <= this.list.availableBytes - this.localOffset
        }
        ;
        b.prototype.remainingBytes = function() {
            return this.list.availableBytes - this.localOffset
        }
        ;
        b.prototype.advance = function(a) {
            if (!this.available(a))
                throw window.proc_error2 && proc_error2("Underflow Error"),
                new e.UnderflowError;
            this.localOffset += a;
            for (this.offset += a; this.list.first && this.localOffset >= this.list.first.length; )
                this.localOffset -= this.list.first.length,
                this.list.advance();
            return this
        }
        ;
        b.prototype.rewind = function(a) {
            if (a > this.offset)
                throw window.proc_error2 && proc_error2("Underflow Error"),
                new e.UnderflowError;
            this.list.first || (this.list.rewind(),
            this.localOffset = this.list.first.length);
            this.localOffset -= a;
            for (this.offset -= a; this.list.first.prev && 0 > this.localOffset; )
                this.list.rewind(),
                this.localOffset += this.list.first.length;
            return this
        }
        ;
        b.prototype.seek = function(a) {
            if (a > this.offset)
                return this.advance(a - this.offset);
            if (a < this.offset)
                return this.rewind(this.offset - a)
        }
        ;
        b.prototype.readUInt8 = function() {
            var a;
            if (!this.available(1))
                throw window.proc_error2 && proc_error2("Underflow Error"),
                new e.UnderflowError;
            a = this.list.first.data[this.localOffset];
            this.localOffset += 1;
            this.offset += 1;
            this.localOffset === this.list.first.length && (this.localOffset = 0,
            this.list.advance());
            return a
        }
        ;
        b.prototype.peekUInt8 = function(a) {
            var c;
            null == a && (a = 0);
            if (!this.available(a + 1))
                throw window.proc_error2 && proc_error2("Underflow Error"),
                new e.UnderflowError;
            a = this.localOffset + a;
            for (c = this.list.first; c; ) {
                if (c.length > a)
                    return c.data[a];
                a -= c.length;
                c = c.next
            }
            return 0
        }
        ;
        b.prototype.read = function(a, c) {
            var b, d;
            null == c && (c = !1);
            if (c === s)
                for (b = d = 0; d < a; b = d += 1)
                    h[b] = this.readUInt8();
            else
                for (b = d = a - 1; 0 <= d; b = d += -1)
                    h[b] = this.readUInt8()
        }
        ;
        b.prototype.peek = function(a, c, b) {
            var d;
            null == b && (b = !1);
            if (b === s)
                for (b = d = 0; d < a; b = d += 1)
                    h[b] = this.peekUInt8(c + b);
            else
                for (b = d = 0; d < a; b = d += 1)
                    h[a - b - 1] = this.peekUInt8(c + b)
        }
        ;
        b.prototype.readInt8 = function() {
            this.read(1);
            return n[0]
        }
        ;
        b.prototype.peekInt8 = function(a) {
            null == a && (a = 0);
            this.peek(1, a);
            return n[0]
        }
        ;
        b.prototype.readUInt16 = function(a) {
            this.read(2, a);
            return q[0]
        }
        ;
        b.prototype.peekUInt16 = function(a, c) {
            null == a && (a = 0);
            this.peek(2, a, c);
            return q[0]
        }
        ;
        b.prototype.readInt16 = function(a) {
            this.read(2, a);
            return l[0]
        }
        ;
        b.prototype.peekInt16 = function(a, c) {
            null == a && (a = 0);
            this.peek(2, a, c);
            return l[0]
        }
        ;
        b.prototype.readUInt24 = function(a) {
            return a ? this.readUInt16(!0) + (this.readUInt8() << 16) : (this.readUInt16() << 8) + this.readUInt8()
        }
        ;
        b.prototype.peekUInt24 = function(a, c) {
            null == a && (a = 0);
            return c ? this.peekUInt16(a, !0) + (this.peekUInt8(a + 2) << 16) : (this.peekUInt16(a) << 8) + this.peekUInt8(a + 2)
        }
        ;
        b.prototype.readInt24 = function(a) {
            return a ? this.readUInt16(!0) + (this.readInt8() << 16) : (this.readInt16() << 8) + this.readUInt8()
        }
        ;
        b.prototype.peekInt24 = function(a, c) {
            null == a && (a = 0);
            return c ? this.peekUInt16(a, !0) + (this.peekInt8(a + 2) << 16) : (this.peekInt16(a) << 8) + this.peekUInt8(a + 2)
        }
        ;
        b.prototype.readUInt32 = function(a) {
            this.read(4, a);
            return v[0]
        }
        ;
        b.prototype.peekUInt32 = function(a, c) {
            null == a && (a = 0);
            this.peek(4, a, c);
            return v[0]
        }
        ;
        b.prototype.readInt32 = function(a) {
            this.read(4, a);
            return t[0]
        }
        ;
        b.prototype.peekInt32 = function(a, c) {
            null == a && (a = 0);
            this.peek(4, a, c);
            return t[0]
        }
        ;
        b.prototype.readFloat32 = function(a) {
            this.read(4, a);
            return c[0]
        }
        ;
        b.prototype.peekFloat32 = function(a, b) {
            null == a && (a = 0);
            this.peek(4, a, b);
            return c[0]
        }
        ;
        b.prototype.readFloat64 = function(a) {
            this.read(8, a);
            return f ? f[0] : k()
        }
        ;
        k = function() {
            var a, c, b, d;
            b = v[0];
            c = v[1];
            if (!c || 2147483648 === c)
                return 0;
            d = 1 - 2 * (c >>> 31);
            a = c >>> 20 & 2047;
            c &= 1048575;
            if (2047 === a)
                return c ? NaN : Infinity * d;
            a -= 1023;
            c = (c | 1048576) * Math.pow(2, a - 20);
            c += b * Math.pow(2, a - 52);
            return d * c
        }
        ;
        b.prototype.peekFloat64 = function(a, c) {
            null == a && (a = 0);
            this.peek(8, a, c);
            return f ? f[0] : k()
        }
        ;
        b.prototype.readFloat80 = function(a) {
            this.read(10, a);
            return g()
        }
        ;
        g = function() {
            var a, c, b, d, f;
            b = v[0];
            d = v[1];
            a = h[9];
            c = h[8];
            f = 1 - 2 * (a >>> 7);
            a = (a & 127) << 8 | c;
            if (0 === a && 0 === d && 0 === b)
                return 0;
            if (32767 === a)
                return 0 === d && 0 === b ? Infinity * f : NaN;
            a -= 16383;
            d *= Math.pow(2, a - 31);
            d += b * Math.pow(2, a - 63);
            return f * d
        }
        ;
        b.prototype.peekFloat80 = function(a, c) {
            null == a && (a = 0);
            this.peek(10, a, c);
            return g()
        }
        ;
        b.prototype.readBuffer = function(a) {
            var c, b, d, f;
            b = e.Buffer.allocate(a);
            d = b.data;
            for (c = f = 0; f < a; c = f += 1)
                d[c] = this.readUInt8();
            return b
        }
        ;
        b.prototype.peekBuffer = function(a, c) {
            var b, d, f, k;
            null == a && (a = 0);
            d = e.Buffer.allocate(c);
            f = d.data;
            for (b = k = 0; k < c; b = k += 1)
                f[b] = this.peekUInt8(a + b);
            return d
        }
        ;
        b.prototype.readSingleBuffer = function(a) {
            a = this.list.first.slice(this.localOffset, a);
            this.advance(a.length);
            return a
        }
        ;
        b.prototype.peekSingleBuffer = function(a, c) {
            return this.list.first.slice(this.localOffset + a, c)
        }
        ;
        b.prototype.readString = function(a, c) {
            null == c && (c = "ascii");
            return d.call(this, 0, a, c, !0)
        }
        ;
        b.prototype.peekString = function(a, c, b) {
            null == a && (a = 0);
            null == b && (b = "ascii");
            return d.call(this, a, c, b, !1)
        }
        ;
        d = function(a, c, b, d) {
            var f, k, n, g, l, e, s, q;
            b = b.toLowerCase();
            s = null === c ? 0 : -1;
            null == c && (c = Infinity);
            e = a + c;
            q = "";
            switch (b) {
            case "ascii":
            case "latin1":
                for (; a < e && (l = this.peekUInt8(a++)) !== s; )
                    q += String.fromCharCode(l);
                break;
            case "utf8":
            case "utf-8":
                for (; a < e && (f = this.peekUInt8(a++)) !== s; )
                    0 === (f & 128) ? q += String.fromCharCode(f) : 192 === (f & 224) ? (k = this.peekUInt8(a++) & 63,
                    q += String.fromCharCode((f & 31) << 6 | k)) : 224 === (f & 240) ? (k = this.peekUInt8(a++) & 63,
                    n = this.peekUInt8(a++) & 63,
                    q += String.fromCharCode((f & 15) << 12 | k << 6 | n)) : 240 === (f & 248) && (k = this.peekUInt8(a++) & 63,
                    n = this.peekUInt8(a++) & 63,
                    c = this.peekUInt8(a++) & 63,
                    k = ((f & 15) << 18 | k << 12 | n << 6 | c) - 65536,
                    q += String.fromCharCode(55296 + (k >> 10), 56320 + (k & 1023)));
                break;
            case "utf16-be":
            case "utf16be":
            case "utf16le":
            case "utf16-le":
            case "utf16bom":
            case "utf16-bom":
                switch (b) {
                case "utf16be":
                case "utf16-be":
                    k = !1;
                    break;
                case "utf16le":
                case "utf16-le":
                    k = !0;
                    break;
                case "utf16bom":
                case "utf16-bom":
                    if (2 > c || (g = this.peekUInt16(a)) === s)
                        return d && this.advance(a + 2),
                        q;
                    k = 65534 === g;
                    a += 2
                }
                for (; a < e && (n = this.peekUInt16(a, k)) !== s; )
                    if (a += 2,
                    55296 > n || 57343 < n)
                        q += String.fromCharCode(n);
                    else {
                        if (56319 < n)
                            throw Error("Invalid utf16 sequence.");
                        f = this.peekUInt16(a, k);
                        if (56320 > f || 57343 < f)
                            throw Error("Invalid utf16 sequence.");
                        q += String.fromCharCode(n, f);
                        a += 2
                    }
                n === s && (a += 2);
                break;
            default:
                throw Error("Unknown encoding: " + b);
            }
            d && this.advance(a);
            return q
        }
        ;
        return b
    }();
    e.Bitstream = function() {
        function b(a) {
            this.stream = a;
            this.bitPosition = 0
        }
        b.prototype.copy = function() {
            var a;
            a = new e.Bitstream(this.stream.copy());
            a.bitPosition = this.bitPosition;
            return a
        }
        ;
        b.prototype.offset = function() {
            return 8 * this.stream.offset + this.bitPosition
        }
        ;
        b.prototype.available = function(a) {
            return this.stream.available((a + 8 - this.bitPosition) / 8)
        }
        ;
        b.prototype.advance = function(a) {
            a = this.bitPosition + a;
            this.stream.advance(a >> 3);
            return this.bitPosition = a & 7
        }
        ;
        b.prototype.rewind = function(a) {
            a = this.bitPosition - a;
            this.stream.rewind(Math.abs(a >> 3));
            return this.bitPosition = a & 7
        }
        ;
        b.prototype.seek = function(a) {
            var b;
            b = this.offset();
            if (a > b)
                return this.advance(a - b);
            if (a < b)
                return this.rewind(b - a)
        }
        ;
        b.prototype.align = function() {
            if (0 !== this.bitPosition)
                return this.bitPosition = 0,
                this.stream.advance(1)
        }
        ;
        b.prototype.read = function(a, b) {
            var c, f, k, g, l, e;
            if (0 === a)
                return 0;
            e = a + this.bitPosition;
            if (8 >= e)
                c = (this.stream.peekUInt8() << this.bitPosition & 255) >>> 8 - a;
            else if (16 >= e)
                c = (this.stream.peekUInt16() << this.bitPosition & 65535) >>> 16 - a;
            else if (24 >= e)
                c = (this.stream.peekUInt24() << this.bitPosition & 16777215) >>> 24 - a;
            else if (32 >= e)
                c = this.stream.peekUInt32() << this.bitPosition >>> 32 - a;
            else if (40 >= e)
                c = 4294967296 * this.stream.peekUInt8(0),
                f = this.stream.peekUInt8(1) << 24 >>> 0,
                k = this.stream.peekUInt8(2) << 16,
                g = this.stream.peekUInt8(3) << 8,
                l = this.stream.peekUInt8(4),
                c = (c + f + k + g + l) % Math.pow(2, 40 - this.bitPosition),
                c = Math.floor(c / Math.pow(2, 40 - this.bitPosition - a));
            else
                throw Error("Too many bits!");
            b && (32 > e ? c >>> a - 1 && (c = -1 * ((1 << a >>> 0) - c)) : c / Math.pow(2, a - 1) | 0 && (c = -1 * (Math.pow(2, a) - c)));
            this.advance(a);
            return c
        }
        ;
        b.prototype.peek = function(a, b) {
            var c, f, k, g, e, t;
            if (0 === a)
                return 0;
            t = a + this.bitPosition;
            if (8 >= t)
                c = (this.stream.peekUInt8() << this.bitPosition & 255) >>> 8 - a;
            else if (16 >= t)
                c = (this.stream.peekUInt16() << this.bitPosition & 65535) >>> 16 - a;
            else if (24 >= t)
                c = (this.stream.peekUInt24() << this.bitPosition & 16777215) >>> 24 - a;
            else if (32 >= t)
                c = this.stream.peekUInt32() << this.bitPosition >>> 32 - a;
            else if (40 >= t)
                c = 4294967296 * this.stream.peekUInt8(0),
                f = this.stream.peekUInt8(1) << 24 >>> 0,
                k = this.stream.peekUInt8(2) << 16,
                g = this.stream.peekUInt8(3) << 8,
                e = this.stream.peekUInt8(4),
                c = (c + f + k + g + e) % Math.pow(2, 40 - this.bitPosition),
                c = Math.floor(c / Math.pow(2, 40 - this.bitPosition - a));
            else
                throw Error("Too many bits!");
            b && (32 > t ? c >>> a - 1 && (c = -1 * ((1 << a >>> 0) - c)) : c / Math.pow(2, a - 1) | 0 && (c = -1 * (Math.pow(2, a) - c)));
            return c
        }
        ;
        b.prototype.readLSB = function(a, b) {
            var c, f;
            if (0 === a)
                return 0;
            if (40 < a)
                throw Error("Too many bits!");
            f = a + this.bitPosition;
            c = this.stream.peekUInt8(0) >>> this.bitPosition;
            8 < f && (c |= this.stream.peekUInt8(1) << 8 - this.bitPosition);
            16 < f && (c |= this.stream.peekUInt8(2) << 16 - this.bitPosition);
            24 < f && (c += this.stream.peekUInt8(3) << 24 - this.bitPosition >>> 0);
            32 < f && (c += this.stream.peekUInt8(4) * Math.pow(2, 32 - this.bitPosition));
            c = 32 <= f ? c % Math.pow(2, a) : c & (1 << a) - 1;
            b && (32 > f ? c >>> a - 1 && (c = -1 * ((1 << a >>> 0) - c)) : c / Math.pow(2, a - 1) | 0 && (c = -1 * (Math.pow(2, a) - c)));
            this.advance(a);
            return c
        }
        ;
        b.prototype.peekLSB = function(a, b) {
            var c, f;
            if (0 === a)
                return 0;
            if (40 < a)
                throw Error("Too many bits!");
            f = a + this.bitPosition;
            c = this.stream.peekUInt8(0) >>> this.bitPosition;
            8 < f && (c |= this.stream.peekUInt8(1) << 8 - this.bitPosition);
            16 < f && (c |= this.stream.peekUInt8(2) << 16 - this.bitPosition);
            24 < f && (c += this.stream.peekUInt8(3) << 24 - this.bitPosition >>> 0);
            32 < f && (c += this.stream.peekUInt8(4) * Math.pow(2, 32 - this.bitPosition));
            c = 32 <= f ? c % Math.pow(2, a) : c & (1 << a) - 1;
            b && (32 > f ? c >>> a - 1 && (c = -1 * ((1 << a >>> 0) - c)) : c / Math.pow(2, a - 1) | 0 && (c = -1 * (Math.pow(2, a) - c)));
            return c
        }
        ;
        return b
    }();
    var h = {}.hasOwnProperty
      , m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
      , y = [].slice;
    e.EventEmitter = function(b) {
        function a() {
            return a.__super__.constructor.apply(this, arguments)
        }
        m(a, b);
        a.prototype.on = function(a, c) {
            var b;
            null == this.events && (this.events = {});
            null == (b = this.events)[a] && (b[a] = []);
            return this.events[a].push(c)
        }
        ;
        a.prototype.off = function(a, c) {
            var b;
            if (null != (b = this.events) && b[a] && (b = this.events[a].indexOf(c),
            ~b))
                return this.events[a].splice(b, 1)
        }
        ;
        a.prototype.once = function(a, c) {
            var b;
            return this.on(a, b = function() {
                this.off(a, b);
                return c.apply(this, arguments)
            }
            )
        }
        ;
        a.prototype.emit = function() {
            var a, c, b, k, g;
            c = arguments[0];
            a = 2 <= arguments.length ? y.call(arguments, 1) : [];
            if (null != (b = this.events) && b[c])
                for (g = this.events[c].slice(),
                b = 0,
                k = g.length; b < k; b++)
                    c = g[b],
                    c.apply(this, a)
        }
        ;
        return a
    }(e.Base);
    var p = function(b, a) {
        return function() {
            return b.apply(a, arguments)
        }
    }
      , h = {}.hasOwnProperty
      , m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    };
    e.BufferSource = function(b) {
        function a(a) {
            this.loop = p(this.loop, this);
            a instanceof e.BufferList ? this.list = a : (this.list = new e.BufferList,
            this.list.append(new e.Buffer(a)));
            this.paused = !0
        }
        var d, c;
        m(a, b);
        c = r.setImmediate || function(a) {
            return r.setTimeout(a, 0)
        }
        ;
        d = r.clearImmediate || function(a) {
            return r.clearTimeout(a)
        }
        ;
        a.prototype.start = function() {
            this.paused = !1;
            return this._timer = c(this.loop)
        }
        ;
        a.prototype.loop = function() {
            this.emit("progress", (this.list.numBuffers - this.list.availableBuffers + 1) / this.list.numBuffers * 100 | 0);
            this.emit("data", this.list.first);
            return this.list.advance() ? c(this.loop) : this.emit("end")
        }
        ;
        a.prototype.pause = function() {
            d(this._timer);
            return this.paused = !0
        }
        ;
        a.prototype.reset = function() {
            this.pause();
            return this.list.rewind()
        }
        ;
        return a
    }(e.EventEmitter);
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.Demuxer = function(b) {
        function a(a, b) {
            var d, g;
            d = new e.BufferList;
            d.append(b);
            this.stream = new e.Stream(d);
            g = !1;
            a.on("data", function(a) {
                return function(c) {
                    g = !0;
                    d.append(c);
                    return a.readChunk(c)
                }
            }(this));
            a.on("error", function(a) {
                return function(c) {
                    return a.emit("error", c)
                }
            }(this));
            a.on("end", function(a) {
                return function() {
                    g || a.readChunk(b);
                    return a.emit("end")
                }
            }(this));
            this.seekPoints = [];
            this.init()
        }
        var d;
        m(a, b);
        a.probe = function(a) {
            return !1
        }
        ;
        a.prototype.init = function() {}
        ;
        a.prototype.readChunk = function(a) {}
        ;
        a.prototype.addSeekPoint = function(a, b) {
            var d;
            d = this.searchTimestamp(b);
            return this.seekPoints.splice(d, 0, {
                offset: a,
                timestamp: b
            })
        }
        ;
        a.prototype.searchTimestamp = function(a, b) {
            var d, g, e, h;
            g = 0;
            d = this.seekPoints.length;
            if (0 < d && this.seekPoints[d - 1].timestamp < a)
                return d;
            for (; g < d; )
                e = g + d >> 1,
                h = this.seekPoints[e].timestamp,
                h < a ? g = e + 1 : h >= a && (d = e);
            d > this.seekPoints.length && (d = this.seekPoints.length);
            return d
        }
        ;
        a.prototype.seek = function(a) {
            if (this.format && 0 < this.format.framesPerPacket && 0 < this.format.bytesPerPacket)
                return a = {
                    timestamp: a,
                    offset: this.format.bytesPerPacket * a / this.format.framesPerPacket
                };
            a = this.searchTimestamp(a);
            return this.seekPoints[a]
        }
        ;
        d = [];
        a.register = function(a) {
            return d.push(a)
        }
        ;
        a.find = function(a) {
            var b, k, g;
            b = e.Stream.fromBuffer(a);
            k = 0;
            for (g = d.length; k < g; k++)
                if (a = d[k],
                a.probe(b))
                    return a;
            return null
        }
        ;
        return a
    }(e.EventEmitter);
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.Decoder = function(b) {
        function a(a, b) {
            var d;
            this.demuxer = a;
            this.format = b;
            d = new e.BufferList;
            this.stream = new e.Stream(d);
            this.bitstream = new e.Bitstream(this.stream);
            this.waiting = this.receivedFinalBuffer = !1;
            this.demuxer.on("cookie", function(a) {
                return function(b) {
                    try {
                        return a.setCookie(b)
                    } catch (c) {
                        return a.emit("error", c)
                    }
                }
            }(this));
            this.demuxer.on("data", function(a) {
                return function(b) {
                    d.append(b);
                    if (a.waiting)
                        return a.decode()
                }
            }(this));
            this.demuxer.on("end", function(a) {
                return function() {
                    a.receivedFinalBuffer = !0;
                    if (a.waiting)
                        return a.decode()
                }
            }(this));
            this.init()
        }
        var d;
        m(a, b);
        a.prototype.init = function() {}
        ;
        a.prototype.setCookie = function(a) {}
        ;
        a.prototype.readChunk = function() {}
        ;
        a.prototype.decode = function() {
            var a, b;
            this.waiting = !1;
            a = this.bitstream.offset();
            try {
                b = this.readChunk()
            } catch (d) {
                if (!(d instanceof e.UnderflowError))
                    return this.emit("error", d),
                    !1
            }
            if (b)
                return this.emit("data", b),
                !0;
            this.receivedFinalBuffer ? this.emit("end") : (this.bitstream.seek(a),
            this.waiting = !0);
            return !1
        }
        ;
        a.prototype.seek = function(a) {
            return (a = this.demuxer.seek(a)) ? (this.stream.seek(a.offset),
            a.timestamp) : -1
        }
        ;
        d = {};
        a.register = function(a, b) {
            return d[a] = b
        }
        ;
        a.find = function(a) {
            return d[a] || null
        }
        ;
        return a
    }(e.EventEmitter);
    p = function(b, a) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    ;
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.Queue = function(b) {
        function a(a) {
            this.asset = a;
            this.write = p(this.write, this);
            this.readyMark = 64;
            this.finished = !1;
            this.buffering = !0;
            this.ended = !1;
            this.buffers = [];
            this.asset.on("data", this.write);
            this.asset.on("end", function(a) {
                return function() {
                    return a.ended = !0
                }
            }(this));
            this.asset.decodePacket()
        }
        m(a, b);
        a.prototype.write = function(a) {
            a && this.buffers.push(a);
            if (this.buffering)
                return this.buffers.length >= this.readyMark || this.ended ? (this.buffering = !1,
                this.emit("ready")) : this.asset.decodePacket()
        }
        ;
        a.prototype.read = function() {
            if (0 === this.buffers.length)
                return null;
            this.asset.decodePacket();
            return this.buffers.shift()
        }
        ;
        a.prototype.reset = function() {
            this.buffers.length = 0;
            this.buffering = !0;
            return this.asset.decodePacket()
        }
        ;
        return a
    }(e.EventEmitter);
    p = function(b, a) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    ;
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.AudioDevice = function(b) {
        function a(a, b) {
            this.sampleRate = a;
            this.channels = b;
            this.updateTime = p(this.updateTime, this);
            this.playing = !1;
            this._lastTime = this.currentTime = 0
        }
        var d;
        m(a, b);
        a.prototype.start = function() {
            if (!this.playing) {
                this.playing = !0;
                null == this.device && (this.device = e.AudioDevice.create(this.sampleRate, this.channels));
                if (!this.device)
                    throw Error("No supported audio device found.");
                this._lastTime = this.device.getDeviceTime();
                this._timer = setInterval(this.updateTime, 200);
                return this.device.on("refill", this.refill = function(a) {
                    return function(b) {
                        return a.emit("refill", b)
                    }
                }(this))
            }
        }
        ;
        a.prototype.stop = function() {
            if (this.playing)
                return this.playing = !1,
                this.device.off("refill", this.refill),
                clearInterval(this._timer)
        }
        ;
        a.prototype.destroy = function() {
            this.stop();
            if (this.device)
                return this.device.destroy()
        }
        ;
        a.prototype.seek = function(a) {
            this.currentTime = a;
            this.playing && (this._lastTime = this.device.getDeviceTime());
            return this.emit("timeUpdate", this.currentTime)
        }
        ;
        a.prototype.updateTime = function() {
            var a;
            a = this.device.getDeviceTime();
            this.currentTime += (a - this._lastTime) / this.device.sampleRate * 1E3 | 0;
            this._lastTime = a;
            return this.emit("timeUpdate", this.currentTime)
        }
        ;
        d = [];
        a.register = function(a) {
            return d.push(a)
        }
        ;
        a.create = function(a, b) {
            var k, g, e;
            g = 0;
            for (e = d.length; g < e; g++)
                if (k = d[g],
                k.supported)
                    return new k(a,b);
            return null
        }
        ;
        return a
    }(e.EventEmitter);
    p = function(b, a) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    ;
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.Asset = function(b) {
        function a(a) {
            this.source = a;
            this._decode = p(this._decode, this);
            this.findDecoder = p(this.findDecoder, this);
            this.probe = p(this.probe, this);
            this.buffered = 0;
            this.metadata = this.format = this.duration = null;
            this.active = !1;
            this.decoder = this.demuxer = null;
            this.source.once("data", this.probe);
            this.source.on("error", function(a) {
                return function(b) {
                    a.emit("error", b);
                    return a.stop()
                }
            }(this));
            this.source.on("progress", function(a) {
                return function(b) {
                    a.buffered = b;
                    return a.emit("buffer", a.buffered)
                }
            }(this))
        }
        m(a, b);
        a.fromURL = function(a) {
            return new e.Asset(new e.HTTPSource(a))
        }
        ;
        a.fromFile = function(a) {
            return new e.Asset(new e.FileSource(a))
        }
        ;
        a.fromBuffer = function(a) {
            return new e.Asset(new e.BufferSource(a))
        }
        ;
        a.prototype.start = function(a) {
            if (!this.active && (null != a && (this.shouldDecode = a),
            null == this.shouldDecode && (this.shouldDecode = !0),
            this.active = !0,
            this.source.start(),
            this.decoder && this.shouldDecode))
                return this._decode()
        }
        ;
        a.prototype.stop = function() {
            if (this.active)
                return this.active = !1,
                this.source.pause()
        }
        ;
        a.prototype.get = function(a, b) {
            if ("format" === a || "duration" === a || "metadata" === a) {
                if (null != this[a])
                    return b(this[a]);
                this.once(a, function(a) {
                    return function(d) {
                        a.stop();
                        return b(d)
                    }
                }(this));
                return this.start()
            }
        }
        ;
        a.prototype.decodePacket = function() {
            return this.decoder.decode()
        }
        ;
        a.prototype.decodeToBuffer = function(a) {
            var b, f, k;
            k = 0;
            b = [];
            this.on("data", f = function(a) {
                k += a.length;
                return b.push(a)
            }
            );
            this.once("end", function() {
                var g, e, h, n, s;
                g = new Float32Array(k);
                n = h = 0;
                for (s = b.length; n < s; n++)
                    e = b[n],
                    g.set(e, h),
                    h += e.length;
                this.off("data", f);
                return a(g)
            });
            return this.start()
        }
        ;
        a.prototype.probe = function(a) {
            var b;
            if (this.active) {
                b = e.Demuxer.find(a);
                if (!b)
                    return this.emit("error", "A demuxer for this container was not found.");
                this.demuxer = new b(this.source,a);
                this.demuxer.on("format", this.findDecoder);
                this.demuxer.on("duration", function(a) {
                    return function(b) {
                        a.duration = b;
                        return a.emit("duration", a.duration)
                    }
                }(this));
                this.demuxer.on("metadata", function(a) {
                    return function(b) {
                        a.metadata = b;
                        return a.emit("metadata", a.metadata)
                    }
                }(this));
                return this.demuxer.on("error", function(a) {
                    return function(b) {
                        a.emit("error", b);
                        return a.stop()
                    }
                }(this))
            }
        }
        ;
        a.prototype.findDecoder = function(a) {
            var b;
            this.format = a;
            if (this.active) {
                this.emit("format", this.format);
                a = e.Decoder.find(this.format.formatID);
                if (!a)
                    return this.emit("error", "A decoder for " + this.format.formatID + " was not found.");
                this.decoder = new a(this.demuxer,this.format);
                if (this.format.floatingPoint)
                    this.decoder.on("data", function(a) {
                        return function(b) {
                            return a.emit("data", b)
                        }
                    }(this));
                else
                    b = Math.pow(2, this.format.bitsPerChannel - 1),
                    this.decoder.on("data", function(a) {
                        return function(d) {
                            var g, e, h, n, s;
                            g = new Float32Array(d.length);
                            e = n = 0;
                            for (s = d.length; n < s; e = ++n)
                                h = d[e],
                                g[e] = h / b;
                            return a.emit("data", g)
                        }
                    }(this));
                this.decoder.on("error", function(a) {
                    return function(b) {
                        a.emit("error", b);
                        return a.stop()
                    }
                }(this));
                this.decoder.on("end", function(a) {
                    return function() {
                        return a.emit("end")
                    }
                }(this));
                this.emit("decodeStart");
                if (this.shouldDecode)
                    return this._decode()
            }
        }
        ;
        a.prototype._decode = function() {
            for (; this.decoder.decode() && this.active; )
                ;
            if (this.active)
                return this.decoder.once("data", this._decode)
        }
        ;
        return a
    }(e.EventEmitter);
    p = function(b, a) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    ;
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.Player = function(b) {
        function a(a) {
            this.asset = a;
            this.startPlaying = p(this.startPlaying, this);
            this.playing = !1;
            this.duration = this.currentTime = this.buffered = 0;
            this.volume = 100;
            this.pan = 0;
            this.metadata = {};
            this.filters = [new e.VolumeFilter(this,"volume"), new e.BalanceFilter(this,"pan")];
            this.asset.on("buffer", function(a) {
                return function(b) {
                    a.buffered = b;
                    return a.emit("buffer", a.buffered)
                }
            }(this));
            this.asset.on("decodeStart", function(a) {
                return function() {
                    a.queue = new e.Queue(a.asset);
                    return a.queue.once("ready", a.startPlaying)
                }
            }(this));
            this.asset.on("format", function(a) {
                return function(b) {
                    a.format = b;
                    return a.emit("format", a.format)
                }
            }(this));
            this.asset.on("metadata", function(a) {
                return function(b) {
                    a.metadata = b;
                    return a.emit("metadata", a.metadata)
                }
            }(this));
            this.asset.on("duration", function(a) {
                return function(b) {
                    a.duration = b;
                    return a.emit("duration", a.duration)
                }
            }(this));
            this.asset.on("error", function(a) {
                return function(b) {
                    return a.emit("error", b)
                }
            }(this))
        }
        m(a, b);
        a.fromURL = function(a) {
            return new e.Player(e.Asset.fromURL(a))
        }
        ;
        a.fromFile = function(a) {
            return new e.Player(e.Asset.fromFile(a))
        }
        ;
        a.fromBuffer = function(a) {
            return new e.Player(e.Asset.fromBuffer(a))
        }
        ;
        a.prototype.preload = function() {
            if (this.asset)
                return this.startedPreloading = !0,
                this.asset.start(!1)
        }
        ;
        a.prototype.play = function() {
            var a;
            if (!this.playing)
                return this.startedPreloading || this.preload(),
                this.playing = !0,
                null != (a = this.device) ? a.start() : void 0
        }
        ;
        a.prototype.pause = function() {
            var a;
            if (this.playing)
                return this.playing = !1,
                null != (a = this.device) ? a.stop() : void 0
        }
        ;
        a.prototype.togglePlayback = function() {
            return this.playing ? this.pause() : this.play()
        }
        ;
        a.prototype.stop = function() {
            var a;
            this.pause();
            this.asset.stop();
            return null != (a = this.device) ? a.destroy() : void 0
        }
        ;
        a.prototype.seek = function(a) {
            var b;
            null != (b = this.device) && b.stop();
            if (this.queue)
                return this.queue.once("ready", function(a) {
                    return function() {
                        var b, c;
                        null != (b = a.device) && b.seek(a.currentTime);
                        if (a.playing)
                            return null != (c = a.device) ? c.start() : void 0
                    }
                }(this)),
                a = a / 1E3 * this.format.sampleRate,
                a = this.asset.decoder.seek(a),
                -1 != a ? (this.currentTime = a / this.format.sampleRate * 1E3 | 0,
                this.queue.reset(),
                this.currentTime) : -1
        }
        ;
        a.prototype.startPlaying = function() {
            var a, b;
            a = this.queue.read();
            b = 0;
            this.device = new e.AudioDevice(this.format.sampleRate,this.format.channelsPerFrame);
            this.device.on("timeUpdate", function(a) {
                return function(b) {
                    a.currentTime = b;
                    return a.emit("progress", a.currentTime)
                }
            }(this));
            this.refill = function(f) {
                return function(k) {
                    var e, l, h, n;
                    if (f.playing) {
                        a || (a = f.queue.read(),
                        b = 0);
                        for (e = 0; a && e < k.length; ) {
                            l = Math.min(a.length - b, k.length - e);
                            for (h = 0; h < l; h += 1)
                                k[e++] = a[b++];
                            b === a.length && (a = f.queue.read(),
                            b = 0)
                        }
                        n = f.filters;
                        l = 0;
                        for (h = n.length; l < h; l++)
                            e = n[l],
                            e.process(k);
                        a || (f.queue.ended ? (f.currentTime = f.duration,
                        f.emit("progress", f.currentTime),
                        f.emit("end"),
                        f.pause()) : f.device.stop())
                    }
                }
            }(this);
            this.device.on("refill", this.refill);
            this.playing && this.device.start();
            return this.emit("ready")
        }
        ;
        return a
    }(e.EventEmitter);
    e.Filter = function() {
        function b(a, b) {
            a && b && Object.defineProperty(this, "value", {
                get: function() {
                    return a[b]
                }
            })
        }
        b.prototype.process = function(a) {}
        ;
        return b
    }();
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.VolumeFilter = function(b) {
        function a() {
            return a.__super__.constructor.apply(this, arguments)
        }
        m(a, b);
        a.prototype.process = function(a) {
            var b, f, e, g;
            if (!(100 <= this.value))
                for (f = Math.max(0, Math.min(100, this.value)) / 100,
                b = e = 0,
                g = a.length; e < g; b = e += 1)
                    a[b] *= f
        }
        ;
        return a
    }(e.Filter);
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.BalanceFilter = function(b) {
        function a() {
            return a.__super__.constructor.apply(this, arguments)
        }
        m(a, b);
        a.prototype.process = function(a) {
            var b, f, e, g;
            if (0 !== this.value)
                for (f = Math.max(-50, Math.min(50, this.value)),
                b = e = 0,
                g = a.length; e < g; b = e += 2)
                    a[b] *= Math.min(1, (50 - f) / 50),
                    a[b + 1] *= Math.min(1, (50 + f) / 50)
        }
        ;
        return a
    }(e.Filter);
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    (function(b) {
        function a() {
            return a.__super__.constructor.apply(this, arguments)
        }
        m(a, b);
        e.Demuxer.register(a);
        a.probe = function(a) {
            return "caff" === a.peekString(0, 4)
        }
        ;
        a.prototype.readChunk = function() {
            var a, b, f, e, g, l;
            if (!this.format && this.stream.available(64)) {
                if ("caff" !== this.stream.readString(4))
                    return this.emit("error", "Invalid CAF, does not begin with 'caff'");
                this.stream.advance(4);
                if ("desc" !== this.stream.readString(4))
                    return this.emit("error", "Invalid CAF, 'caff' is not followed by 'desc'");
                if (0 !== this.stream.readUInt32() || 32 !== this.stream.readUInt32())
                    return this.emit("error", "Invalid 'desc' size, should be 32");
                this.format = {};
                this.format.sampleRate = this.stream.readFloat64();
                this.format.formatID = this.stream.readString(4);
                a = this.stream.readUInt32();
                "lpcm" === this.format.formatID && (this.format.floatingPoint = Boolean(a & 1),
                this.format.littleEndian = Boolean(a & 2));
                this.format.bytesPerPacket = this.stream.readUInt32();
                this.format.framesPerPacket = this.stream.readUInt32();
                this.format.channelsPerFrame = this.stream.readUInt32();
                this.format.bitsPerChannel = this.stream.readUInt32();
                this.emit("format", this.format)
            }
            for (; this.stream.available(1); ) {
                if (!this.headerCache && (this.headerCache = {
                    type: this.stream.readString(4),
                    oversize: 0 !== this.stream.readUInt32(),
                    size: this.stream.readUInt32()
                },
                this.headerCache.oversize))
                    return this.emit("error", "Holy Shit, an oversized file, not supported in JS");
                switch (this.headerCache.type) {
                case "kuki":
                    this.stream.available(this.headerCache.size) && ("aac " === this.format.formatID ? (a = this.stream.offset + this.headerCache.size,
                    (b = x.readEsds(this.stream)) && this.emit("cookie", b),
                    this.stream.seek(a)) : (a = this.stream.readBuffer(this.headerCache.size),
                    this.emit("cookie", a)),
                    this.headerCache = null);
                    break;
                case "pakt":
                    if (this.stream.available(this.headerCache.size)) {
                        if (0 !== this.stream.readUInt32())
                            return this.emit("error", "Sizes greater than 32 bits are not supported.");
                        this.numPackets = this.stream.readUInt32();
                        if (0 !== this.stream.readUInt32())
                            return this.emit("error", "Sizes greater than 32 bits are not supported.");
                        this.numFrames = this.stream.readUInt32();
                        this.primingFrames = this.stream.readUInt32();
                        this.remainderFrames = this.stream.readUInt32();
                        this.emit("duration", this.numFrames / this.format.sampleRate * 1E3 | 0);
                        this.sentDuration = !0;
                        e = f = a = 0;
                        for (g = this.numPackets; e < g; e += 1)
                            this.addSeekPoint(a, f),
                            a += this.format.bytesPerPacket || x.readDescrLen(this.stream),
                            f += this.format.framesPerPacket || x.readDescrLen(this.stream);
                        this.headerCache = null
                    }
                    break;
                case "info":
                    a = this.stream.readUInt32();
                    e = {};
                    for (l = 0; 0 <= a ? l < a : l > a; 0 <= a ? ++l : --l)
                        f = this.stream.readString(null),
                        g = this.stream.readString(null),
                        e[f] = g;
                    this.emit("metadata", e);
                    this.headerCache = null;
                    break;
                case "data":
                    this.sentFirstDataChunk || (this.stream.advance(4),
                    this.headerCache.size -= 4,
                    0 === this.format.bytesPerPacket || this.sentDuration || (this.numFrames = this.headerCache.size / this.format.bytesPerPacket,
                    this.emit("duration", this.numFrames / this.format.sampleRate * 1E3 | 0)),
                    this.sentFirstDataChunk = !0);
                    a = this.stream.readSingleBuffer(this.headerCache.size);
                    this.headerCache.size -= a.length;
                    this.emit("data", a);
                    0 >= this.headerCache.size && (this.headerCache = null);
                    break;
                default:
                    this.stream.available(this.headerCache.size) && (this.stream.advance(this.headerCache.size),
                    this.headerCache = null)
                }
            }
        }
        ;
        return a
    })(e.Demuxer);
    var x, h = {}.hasOwnProperty, m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }, w = [].indexOf || function(b) {
        for (var a = 0, d = this.length; a < d; a++)
            if (a in this && this[a] === b)
                return a;
        return -1
    }
    ;
    x = function(b) {
        function a() {
            return a.__super__.constructor.apply(this, arguments)
        }
        var d, c, f, k, g, l, h;
        m(a, b);
        e.Demuxer.register(a);
        c = "M4A ;M4P ;M4B ;M4V ;isom;mp42;qt  ".split(";");
        a.probe = function(a) {
            var b;
            return "ftyp" === a.peekString(4, 4) && (b = a.peekString(8, 4),
            0 <= w.call(c, b))
        }
        ;
        a.prototype.init = function() {
            this.atoms = [];
            this.offsets = [];
            this.track = null;
            return this.tracks = []
        }
        ;
        k = {};
        l = {};
        f = function(a, b) {
            var c, d, f, e, g;
            c = [];
            g = a.split(".").slice(0, -1);
            f = 0;
            for (e = g.length; f < e; f++)
                d = g[f],
                c.push(d),
                l[c.join(".")] = !0;
            null == k[a] && (k[a] = {});
            return k[a].fn = b
        }
        ;
        b = function(a, b) {
            null == k[a] && (k[a] = {});
            return k[a].after = b
        }
        ;
        a.prototype.readChunk = function() {
            var a, b;
            for (this["break"] = !1; this.stream.available(1) && !this["break"]; ) {
                if (!this.readHeaders) {
                    if (!this.stream.available(8))
                        break;
                    this.len = this.stream.readUInt32() - 8;
                    this.type = this.stream.readString(4);
                    if (0 === this.len)
                        continue;
                    this.atoms.push(this.type);
                    this.offsets.push(this.stream.offset + this.len);
                    this.readHeaders = !0
                }
                b = this.atoms.join(".");
                a = k[b];
                if (null != a && a.fn) {
                    if (!this.stream.available(this.len) && "mdat" !== b)
                        break;
                    a.fn.call(this);
                    b in l && (this.readHeaders = !1)
                } else if (b in l)
                    this.readHeaders = !1;
                else {
                    if (!this.stream.available(this.len))
                        break;
                    this.stream.advance(this.len)
                }
                for (; this.stream.offset >= this.offsets[this.offsets.length - 1]; )
                    a = k[this.atoms.join(".")],
                    null != a && a.after && a.after.call(this),
                    this.atoms.pop(),
                    this.offsets.pop(),
                    this.readHeaders = !1
            }
        }
        ;
        f("ftyp", function() {
            var a;
            return (a = this.stream.readString(4),
            0 > w.call(c, a)) ? this.emit("error", "Not a valid M4A file.") : this.stream.advance(this.len - 4)
        });
        f("moov.trak", function() {
            this.track = {};
            return this.tracks.push(this.track)
        });
        f("moov.trak.tkhd", function() {
            this.stream.advance(4);
            this.stream.advance(8);
            this.track.id = this.stream.readUInt32();
            return this.stream.advance(this.len - 16)
        });
        f("moov.trak.mdia.hdlr", function() {
            this.stream.advance(4);
            this.stream.advance(4);
            this.track.type = this.stream.readString(4);
            this.stream.advance(12);
            return this.stream.advance(this.len - 24)
        });
        f("moov.trak.mdia.mdhd", function() {
            this.stream.advance(4);
            this.stream.advance(8);
            this.track.timeScale = this.stream.readUInt32();
            this.track.duration = this.stream.readUInt32();
            return this.stream.advance(4)
        });
        d = {
            ulaw: 8,
            alaw: 8,
            in24: 24,
            in32: 32,
            fl32: 32,
            fl64: 64
        };
        f("moov.trak.mdia.minf.stbl.stsd", function() {
            var a, b, c, f;
            this.stream.advance(4);
            a = this.stream.readUInt32();
            if ("soun" !== this.track.type)
                return this.stream.advance(this.len - 8);
            if (1 !== a)
                return this.emit("error", "Only expecting one entry in sample description atom!");
            this.stream.advance(4);
            a = this.track.format = {};
            a.formatID = this.stream.readString(4);
            this.stream.advance(6);
            this.stream.advance(2);
            b = this.stream.readUInt16();
            this.stream.advance(6);
            a.channelsPerFrame = this.stream.readUInt16();
            a.bitsPerChannel = this.stream.readUInt16();
            this.stream.advance(4);
            a.sampleRate = this.stream.readUInt16();
            this.stream.advance(2);
            1 === b ? (a.framesPerPacket = this.stream.readUInt32(),
            this.stream.advance(4),
            a.bytesPerFrame = this.stream.readUInt32(),
            this.stream.advance(4)) : 0 !== b && this.emit("error", "Unknown version in stsd atom");
            null != d[a.formatID] && (a.bitsPerChannel = d[a.formatID]);
            a.floatingPoint = "fl32" === (c = a.formatID) || "fl64" === c;
            a.littleEndian = "sowt" === a.formatID && 8 < a.bitsPerChannel;
            if ("twos" === (f = a.formatID) || "sowt" === f || "in24" === f || "in32" === f || "fl32" === f || "fl64" === f || "raw " === f || "NONE" === f)
                return a.formatID = "lpcm"
        });
        f("moov.trak.mdia.minf.stbl.stsd.alac", function() {
            this.stream.advance(4);
            return this.track.cookie = this.stream.readBuffer(this.len - 4)
        });
        f("moov.trak.mdia.minf.stbl.stsd.esds", function() {
            var b;
            b = this.stream.offset + this.len;
            this.track.cookie = a.readEsds(this.stream);
            return this.stream.seek(b)
        });
        f("moov.trak.mdia.minf.stbl.stsd.wave.enda", function() {
            return this.track.format.littleEndian = !!this.stream.readUInt16()
        });
        a.readDescrLen = function(a) {
            var b, c, d;
            d = 0;
            for (c = 4; c-- && (b = a.readUInt8(),
            d = d << 7 | b & 127,
            b & 128); )
                ;
            return d
        }
        ;
        a.readEsds = function(b) {
            var c, d;
            b.advance(4);
            d = b.readUInt8();
            a.readDescrLen(b);
            3 === d ? (b.advance(2),
            c = b.readUInt8(),
            c & 128 && b.advance(2),
            c & 64 && b.advance(b.readUInt8()),
            c & 32 && b.advance(2)) : b.advance(2);
            d = b.readUInt8();
            a.readDescrLen(b);
            return 4 === d && (b.readUInt8(),
            b.advance(1),
            b.advance(3),
            b.advance(4),
            b.advance(4),
            d = b.readUInt8(),
            c = a.readDescrLen(b),
            5 === d) ? b.readBuffer(c) : null
        }
        ;
        f("moov.trak.mdia.minf.stbl.stts", function() {
            var a, b, c;
            this.stream.advance(4);
            a = this.stream.readUInt32();
            this.track.stts = [];
            for (b = c = 0; c < a; b = c += 1)
                this.track.stts[b] = {
                    count: this.stream.readUInt32(),
                    duration: this.stream.readUInt32()
                };
            return this.setupSeekPoints()
        });
        f("moov.trak.mdia.minf.stbl.stsc", function() {
            var a, b, c;
            this.stream.advance(4);
            a = this.stream.readUInt32();
            this.track.stsc = [];
            for (b = c = 0; c < a; b = c += 1)
                this.track.stsc[b] = {
                    first: this.stream.readUInt32(),
                    count: this.stream.readUInt32(),
                    id: this.stream.readUInt32()
                };
            return this.setupSeekPoints()
        });
        f("moov.trak.mdia.minf.stbl.stsz", function() {
            var a, b, c;
            this.stream.advance(4);
            this.track.sampleSize = this.stream.readUInt32();
            a = this.stream.readUInt32();
            if (0 === this.track.sampleSize && 0 < a)
                for (this.track.sampleSizes = [],
                b = c = 0; c < a; b = c += 1)
                    this.track.sampleSizes[b] = this.stream.readUInt32();
            return this.setupSeekPoints()
        });
        f("moov.trak.mdia.minf.stbl.stco", function() {
            var a, b, c;
            this.stream.advance(4);
            a = this.stream.readUInt32();
            this.track.chunkOffsets = [];
            for (b = c = 0; c < a; b = c += 1)
                this.track.chunkOffsets[b] = this.stream.readUInt32();
            return this.setupSeekPoints()
        });
        f("moov.trak.tref.chap", function() {
            var a, b, c;
            a = this.len >> 2;
            this.track.chapterTracks = [];
            for (b = c = 0; c < a; b = c += 1)
                this.track.chapterTracks[b] = this.stream.readUInt32()
        });
        a.prototype.setupSeekPoints = function() {
            var a, b, c, d, f, e, g, k, l, h, m, t, p, r, u;
            if (null != this.track.chunkOffsets && null != this.track.stsc && null != this.track.sampleSize && null != this.track.stts) {
                l = b = d = k = g = e = 0;
                this.track.seekPoints = [];
                p = this.track.chunkOffsets;
                u = [];
                a = h = 0;
                for (t = p.length; h < t; a = ++h) {
                    c = p[a];
                    m = 0;
                    for (r = this.track.stsc[e].count; m < r; m += 1)
                        this.track.seekPoints.push({
                            offset: b,
                            position: c,
                            timestamp: l
                        }),
                        f = this.track.sampleSize || this.track.sampleSizes[d++],
                        b += f,
                        c += f,
                        l += this.track.stts[g].duration,
                        g + 1 < this.track.stts.length && ++k === this.track.stts[g].count && (k = 0,
                        g++);
                    e + 1 < this.track.stsc.length && a + 1 === this.track.stsc[e + 1].first ? u.push(e++) : u.push(void 0)
                }
                return u
            }
        }
        ;
        b("moov", function() {
            var a, b, c, d;
            null != this.mdatOffset && this.stream.seek(this.mdatOffset - 8);
            d = this.tracks;
            b = 0;
            for (c = d.length; b < c; b++)
                if (a = d[b],
                "soun" === a.type) {
                    this.track = a;
                    break
                }
            if ("soun" !== this.track.type)
                return this.track = null,
                this.emit("error", "No audio tracks in m4a file.");
            this.emit("format", this.track.format);
            this.emit("duration", this.track.duration / this.track.timeScale * 1E3 | 0);
            this.track.cookie && this.emit("cookie", this.track.cookie);
            return this.seekPoints = this.track.seekPoints
        });
        f("mdat", function() {
            var a, b, c, d, f, e, g;
            if (!this.startedData) {
                null == this.mdatOffset && (this.mdatOffset = this.stream.offset);
                if (0 === this.tracks.length) {
                    a = Math.min(this.stream.remainingBytes(), this.len);
                    this.stream.advance(a);
                    this.len -= a;
                    return
                }
                this.tailSamples = this.tailOffset = this.sampleIndex = this.stscIndex = this.chunkIndex = 0;
                this.startedData = !0
            }
            if (!this.readChapters) {
                this.readChapters = this.parseChapters();
                if (this["break"] = !this.readChapters)
                    return;
                this.stream.seek(this.mdatOffset)
            }
            d = this.track.chunkOffsets[this.chunkIndex] + this.tailOffset;
            b = 0;
            if (this.stream.available(d - this.stream.offset)) {
                for (this.stream.seek(d); this.chunkIndex < this.track.chunkOffsets.length; ) {
                    c = this.track.stsc[this.stscIndex].count - this.tailSamples;
                    for (f = g = a = 0; g < c; f = g += 1) {
                        e = this.track.sampleSize || this.track.sampleSizes[this.sampleIndex];
                        if (!this.stream.available(b + e))
                            break;
                        b += e;
                        a += e;
                        this.sampleIndex++
                    }
                    if (f < c) {
                        this.tailOffset += a;
                        this.tailSamples += f;
                        break
                    } else if (this.chunkIndex++,
                    this.tailSamples = this.tailOffset = 0,
                    this.stscIndex + 1 < this.track.stsc.length && this.chunkIndex + 1 === this.track.stsc[this.stscIndex + 1].first && this.stscIndex++,
                    d + b !== this.track.chunkOffsets[this.chunkIndex])
                        break
                }
                return 0 < b ? (this.emit("data", this.stream.readBuffer(b)),
                this["break"] = this.chunkIndex === this.track.chunkOffsets.length) : this["break"] = !0
            }
            this["break"] = !0
        });
        a.prototype.parseChapters = function() {
            var a, b, c, d, f, e, g;
            if (!(0 < (null != (b = this.track.chapterTracks) ? b.length : void 0)))
                return !0;
            b = this.track.chapterTracks[0];
            c = this.tracks;
            d = 0;
            for (a = c.length; d < a && (f = c[d],
            f.id !== b); d++)
                ;
            f.id !== b && this.emit("error", "Chapter track does not exist.");
            null == this.chapters && (this.chapters = []);
            for (; this.chapters.length < f.seekPoints.length; ) {
                b = f.seekPoints[this.chapters.length];
                if (!this.stream.available(b.position - this.stream.offset + 32))
                    return !1;
                this.stream.seek(b.position);
                c = this.stream.readUInt16();
                d = null;
                if (!this.stream.available(c))
                    return !1;
                2 < c && (a = this.stream.peekUInt16(),
                65279 === a || 65534 === a) && (d = this.stream.readString(c, "utf16-bom"));
                null == d && (d = this.stream.readString(c, "utf8"));
                a = null != (e = null != (g = f.seekPoints[this.chapters.length + 1]) ? g.timestamp : void 0) ? e : f.duration;
                this.chapters.push({
                    title: d,
                    timestamp: b.timestamp / f.timeScale * 1E3 | 0,
                    duration: (a - b.timestamp) / f.timeScale * 1E3 | 0
                })
            }
            this.emit("chapters", this.chapters);
            return !0
        }
        ;
        f("moov.udta.meta", function() {
            this.metadata = {};
            return this.stream.advance(4)
        });
        b("moov.udta.meta", function() {
            return this.emit("metadata", this.metadata)
        });
        b = function(a, b, c) {
            return f("moov.udta.meta.ilst." + a + ".data", function() {
                this.stream.advance(8);
                this.len -= 8;
                return c.call(this, b)
            })
        }
        ;
        g = function(a) {
            return this.metadata[a] = this.stream.readString(this.len, "utf8")
        }
        ;
        b("\u00a9alb", "album", g);
        b("\u00a9arg", "arranger", g);
        b("\u00a9art", "artist", g);
        b("\u00a9ART", "artist", g);
        b("aART", "albumArtist", g);
        b("catg", "category", g);
        b("\u00a9com", "composer", g);
        b("\u00a9cpy", "copyright", g);
        b("cprt", "copyright", g);
        b("\u00a9cmt", "comments", g);
        b("\u00a9day", "releaseDate", g);
        b("desc", "description", g);
        b("\u00a9gen", "genre", g);
        b("\u00a9grp", "grouping", g);
        b("\u00a9isr", "ISRC", g);
        b("keyw", "keywords", g);
        b("\u00a9lab", "recordLabel", g);
        b("ldes", "longDescription", g);
        b("\u00a9lyr", "lyrics", g);
        b("\u00a9nam", "title", g);
        b("\u00a9phg", "recordingCopyright", g);
        b("\u00a9prd", "producer", g);
        b("\u00a9prf", "performers", g);
        b("purd", "purchaseDate", g);
        b("purl", "podcastURL", g);
        b("\u00a9swf", "songwriter", g);
        b("\u00a9too", "encoder", g);
        b("\u00a9wrt", "composer", g);
        b("covr", "coverArt", function(a) {
            return this.metadata[a] = this.stream.readBuffer(this.len)
        });
        h = "Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk/Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;A Capella;Euro-House;Dance Hall".split(";");
        b("gnre", "genre", function(a) {
            return this.metadata[a] = h[this.stream.readUInt16() - 1]
        });
        b("tmpo", "tempo", function(a) {
            return this.metadata[a] = this.stream.readUInt16()
        });
        b("rtng", "rating", function(a) {
            var b;
            b = this.stream.readUInt8();
            return this.metadata[a] = 2 === b ? "Clean" : 0 !== b ? "Explicit" : "None"
        });
        g = function(a) {
            this.stream.advance(2);
            this.metadata[a] = this.stream.readUInt16() + " of " + this.stream.readUInt16();
            return this.stream.advance(this.len - 6)
        }
        ;
        b("disk", "diskNumber", g);
        b("trkn", "trackNumber", g);
        g = function(a) {
            return this.metadata[a] = 1 === this.stream.readUInt8()
        }
        ;
        b("cpil", "compilation", g);
        b("pcst", "podcast", g);
        b("pgap", "gapless", g);
        return a
    }(e.Demuxer);
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    (function(b) {
        function a() {
            return a.__super__.constructor.apply(this, arguments)
        }
        m(a, b);
        e.Demuxer.register(a);
        a.probe = function(a) {
            var b;
            return "FORM" === a.peekString(0, 4) && ("AIFF" === (b = a.peekString(8, 4)) || "AIFC" === b)
        }
        ;
        a.prototype.readChunk = function() {
            var a;
            if (!this.readStart && this.stream.available(12)) {
                if ("FORM" !== this.stream.readString(4))
                    return this.emit("error", "Invalid AIFF.");
                this.fileSize = this.stream.readUInt32();
                this.fileType = this.stream.readString(4);
                this.readStart = !0;
                if ("AIFF" !== (a = this.fileType) && "AIFC" !== a)
                    return this.emit("error", "Invalid AIFF.")
            }
            for (; this.stream.available(1); ) {
                !this.readHeaders && this.stream.available(8) && (this.type = this.stream.readString(4),
                this.len = this.stream.readUInt32());
                switch (this.type) {
                case "COMM":
                    if (!this.stream.available(this.len))
                        return;
                    this.format = {
                        formatID: "lpcm",
                        channelsPerFrame: this.stream.readUInt16(),
                        sampleCount: this.stream.readUInt32(),
                        bitsPerChannel: this.stream.readUInt16(),
                        sampleRate: this.stream.readFloat80(),
                        framesPerPacket: 1,
                        littleEndian: !1,
                        floatingPoint: !1
                    };
                    this.format.bytesPerPacket = this.format.bitsPerChannel / 8 * this.format.channelsPerFrame;
                    if ("AIFC" === this.fileType) {
                        a = this.stream.readString(4);
                        this.format.littleEndian = "sowt" === a && 8 < this.format.bitsPerChannel;
                        this.format.floatingPoint = "fl32" === a || "fl64" === a;
                        if ("twos" === a || "sowt" === a || "fl32" === a || "fl64" === a || "NONE" === a)
                            a = "lpcm";
                        this.format.formatID = a;
                        this.len -= 4
                    }
                    this.stream.advance(this.len - 18);
                    this.emit("format", this.format);
                    this.emit("duration", this.format.sampleCount / this.format.sampleRate * 1E3 | 0);
                    break;
                case "SSND":
                    this.readSSNDHeader && this.stream.available(4) || (a = this.stream.readUInt32(),
                    this.stream.advance(4),
                    this.stream.advance(a),
                    this.readSSNDHeader = !0);
                    a = this.stream.readSingleBuffer(this.len);
                    this.len -= a.length;
                    this.readHeaders = 0 < this.len;
                    this.emit("data", a);
                    break;
                default:
                    if (!this.stream.available(this.len))
                        return;
                    this.stream.advance(this.len)
                }
                "SSND" !== this.type && (this.readHeaders = !1)
            }
        }
        ;
        return a
    })(e.Demuxer);
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    (function(b) {
        function a() {
            return a.__super__.constructor.apply(this, arguments)
        }
        var d;
        m(a, b);
        e.Demuxer.register(a);
        a.probe = function(a) {
            return "RIFF" === a.peekString(0, 4) && "WAVE" === a.peekString(8, 4)
        }
        ;
        d = {
            1: "lpcm",
            3: "lpcm",
            6: "alaw",
            7: "ulaw"
        };
        a.prototype.readChunk = function() {
            var a;
            if (!this.readStart && this.stream.available(12)) {
                if ("RIFF" !== this.stream.readString(4))
                    return this.emit("error", "Invalid WAV file.");
                this.fileSize = this.stream.readUInt32(!0);
                this.readStart = !0;
                if ("WAVE" !== this.stream.readString(4))
                    return this.emit("error", "Invalid WAV file.")
            }
            for (; this.stream.available(1); ) {
                !this.readHeaders && this.stream.available(8) && (this.type = this.stream.readString(4),
                this.len = this.stream.readUInt32(!0));
                switch (this.type) {
                case "fmt ":
                    a = this.stream.readUInt16(!0);
                    if (!(a in d))
                        return this.emit("error", "Unsupported format in WAV file.");
                    this.format = {
                        formatID: d[a],
                        floatingPoint: 3 === a,
                        littleEndian: "lpcm" === d[a],
                        channelsPerFrame: this.stream.readUInt16(!0),
                        sampleRate: this.stream.readUInt32(!0),
                        framesPerPacket: 1
                    };
                    this.stream.advance(4);
                    this.stream.advance(2);
                    this.format.bitsPerChannel = this.stream.readUInt16(!0);
                    this.format.bytesPerPacket = this.format.bitsPerChannel / 8 * this.format.channelsPerFrame;
                    this.emit("format", this.format);
                    this.stream.advance(this.len - 16);
                    break;
                case "data":
                    this.sentDuration || (a = this.format.bitsPerChannel / 8,
                    this.emit("duration", this.len / a / this.format.channelsPerFrame / this.format.sampleRate * 1E3 | 0),
                    this.sentDuration = !0);
                    a = this.stream.readSingleBuffer(this.len);
                    this.len -= a.length;
                    this.readHeaders = 0 < this.len;
                    this.emit("data", a);
                    break;
                default:
                    if (!this.stream.available(this.len))
                        return;
                    this.stream.advance(this.len)
                }
                "data" !== this.type && (this.readHeaders = !1)
            }
        }
        ;
        return a
    })(e.Demuxer);
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    (function(b) {
        function a() {
            return a.__super__.constructor.apply(this, arguments)
        }
        var d, c;
        m(a, b);
        e.Demuxer.register(a);
        a.probe = function(a) {
            return ".snd" === a.peekString(0, 4)
        }
        ;
        d = [8, 8, 16, 24, 32, 32, 64];
        d[26] = 8;
        c = {
            1: "ulaw",
            27: "alaw"
        };
        a.prototype.readChunk = function() {
            var a, b;
            if (!this.readHeader && this.stream.available(24)) {
                if (".snd" !== this.stream.readString(4))
                    return this.emit("error", "Invalid AU file.");
                this.stream.readUInt32();
                b = this.stream.readUInt32();
                a = this.stream.readUInt32();
                this.format = {
                    formatID: c[a] || "lpcm",
                    littleEndian: !1,
                    floatingPoint: 6 === a || 7 === a,
                    bitsPerChannel: d[a - 1],
                    sampleRate: this.stream.readUInt32(),
                    channelsPerFrame: this.stream.readUInt32(),
                    framesPerPacket: 1
                };
                if (null == this.format.bitsPerChannel)
                    return this.emit("error", "Unsupported encoding in AU file.");
                this.format.bytesPerPacket = this.format.bitsPerChannel / 8 * this.format.channelsPerFrame;
                4294967295 !== b && (a = this.format.bitsPerChannel / 8,
                this.emit("duration", b / a / this.format.channelsPerFrame / this.format.sampleRate * 1E3 | 0));
                this.emit("format", this.format);
                this.readHeader = !0
            }
            if (this.readHeader)
                for (; this.stream.available(1); )
                    this.emit("data", this.stream.readSingleBuffer(this.stream.remainingBytes()))
        }
        ;
        return a
    })(e.Demuxer);
    p = function(b, a) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    ;
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    (function(b) {
        function a() {
            this.readChunk = p(this.readChunk, this);
            return a.__super__.constructor.apply(this, arguments)
        }
        m(a, b);
        e.Decoder.register("lpcm", a);
        a.prototype.readChunk = function() {
            var a, b, f, e, g, l;
            g = this.stream;
            b = this.format.littleEndian;
            a = Math.min(4096, g.remainingBytes());
            e = a / (this.format.bitsPerChannel / 8) | 0;
            if (a < this.format.bitsPerChannel / 8)
                return null;
            if (this.format.floatingPoint)
                switch (this.format.bitsPerChannel) {
                case 32:
                    f = new Float32Array(e);
                    for (a = l = 0; l < e; a = l += 1)
                        f[a] = g.readFloat32(b);
                    break;
                case 64:
                    f = new Float64Array(e);
                    for (a = l = 0; l < e; a = l += 1)
                        f[a] = g.readFloat64(b);
                    break;
                default:
                    throw Error("Unsupported bit depth.");
                }
            else
                switch (this.format.bitsPerChannel) {
                case 8:
                    f = new Int8Array(e);
                    for (a = b = 0; b < e; a = b += 1)
                        f[a] = g.readInt8();
                    break;
                case 16:
                    f = new Int16Array(e);
                    for (a = l = 0; l < e; a = l += 1)
                        f[a] = g.readInt16(b);
                    break;
                case 24:
                    f = new Int32Array(e);
                    for (a = l = 0; l < e; a = l += 1)
                        f[a] = g.readInt24(b);
                    break;
                case 32:
                    f = new Int32Array(e);
                    for (a = l = 0; l < e; a = l += 1)
                        f[a] = g.readInt32(b);
                    break;
                default:
                    throw Error("Unsupported bit depth.");
                }
            return f
        }
        ;
        return a
    })(e.Decoder);
    p = function(b, a) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    ;
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    (function(b) {
        function a() {
            this.readChunk = p(this.readChunk, this);
            return a.__super__.constructor.apply(this, arguments)
        }
        m(a, b);
        e.Decoder.register("ulaw", a);
        e.Decoder.register("alaw", a);
        a.prototype.init = function() {
            var a, b, f, e, g, l;
            this.format.bitsPerChannel = 16;
            this.table = e = new Int16Array(256);
            if ("ulaw" === this.format.formatID)
                for (a = b = 0; 256 > b; a = ++b)
                    g = ~a,
                    f = ((g & 15) << 3) + 132,
                    f <<= (g & 112) >>> 4,
                    e[a] = g & 128 ? 132 - f : f - 132;
            else
                for (a = l = 0; 256 > l; a = ++l)
                    g = a ^ 85,
                    f = g & 15,
                    f = (b = (g & 112) >>> 4) ? f + f + 1 + 32 << b + 2 : f + f + 1 << 3,
                    e[a] = g & 128 ? f : -f
        }
        ;
        a.prototype.readChunk = function() {
            var a, b, f, e, g, l;
            e = this.stream;
            g = this.table;
            f = Math.min(4096, this.stream.remainingBytes());
            if (0 !== f) {
                b = new Int16Array(f);
                for (a = l = 0; l < f; a = l += 1)
                    b[a] = g[e.readUInt8()];
                return b
            }
        }
        ;
        return a
    })(e.Decoder);
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.HTTPSource = function(b) {
        function a(a) {
            this.url = a;
            this.chunkSize = 1048576;
            this.inflight = !1;
            this.reset()
        }
        m(a, b);
        a.prototype.start = function() {
            if (this.length && !this.inflight)
                return this.loop();
            this.length = glength;
            this.inflight = !1;
            return this.loop()
        }
        ;
        a.prototype.loop = function() {
            var a;
            if (this.inflight || !this.length)
                return this.emit("error", "Something is wrong in HTTPSource.loop");
            this.inflight = !0;
            this.xhr = new XMLHttpRequest;
            this.xhr.onload = function(a) {
                return function(b) {
                    b = a.xhr.status;
                    if (200 != b && 206 != b)
                        return a.emit("error", "Error (status) " + b + "(" + (a.xhr.statusText || "Unknown") + ") occurred while receiving the file."),
                        a.pause();
                    var d, g, l, h;
                    if (a.xhr.response)
                        b = new Uint8Array(a.xhr.response);
                    else
                        for (g = a.xhr.responseText,
                        b = new Uint8Array(g.length),
                        d = l = 0,
                        h = g.length; 0 <= h ? l < h : l > h; d = 0 <= h ? ++l : --l)
                            b[d] = g.charCodeAt(d) & 255;
                    b = new e.Buffer(b);
                    a.offset += b.length;
                    a.emit("data", b);
                    a.offset >= a.length && a.emit("end");
                    a.inflight = !1;
                    if (!(a.offset >= a.length))
                        return a.loop()
                }
            }(this);
            this.xhr.onprogress = function(a) {
                return function(b) {
                    return a.emit("progress", (a.offset + b.loaded) / a.length * 100)
                }
            }(this);
            this.xhr.onerror = function(a) {
                return function(b) {
                    a.emit("error", b);
                    return a.pause()
                }
            }(this);
            this.xhr.onabort = function(a) {
                return function(b) {
                    return a.inflight = !1
                }
            }(this);
            this.xhr.open("GET", this.url, !0);
            this.xhr.responseType = "arraybuffer";
            gaccesstoken && this.xhr.setRequestHeader("Authorization", "Bearer " + gaccesstoken);
            a = Math.min(this.offset + this.chunkSize, this.length);
            this.xhr.setRequestHeader("Range", "bytes=" + this.offset + "-" + a);
            this.xhr.overrideMimeType && this.xhr.overrideMimeType("text/plain; charset=x-user-defined");
            return this.xhr.send(null)
        }
        ;
        a.prototype.pause = function() {
            var a;
            this.inflight = !1;
            return null != (a = this.xhr) ? a.abort() : void 0
        }
        ;
        a.prototype.reset = function() {
            this.pause();
            return this.offset = 0
        }
        ;
        return a
    }(e.EventEmitter);
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    e.FileSource = function(b) {
        function a(a) {
            this.file = a;
            if ("undefined" === typeof FileReader || null === FileReader)
                return this.emit("error", "This browser does not have FileReader support.");
            this.offset = 0;
            this.length = this.file.size;
            this.chunkSize = 1048576;
            this.file[this.slice = "slice"] || this.file[this.slice = "webkitSlice"] || this.file[this.slice = "mozSlice"]
        }
        m(a, b);
        a.prototype.start = function() {
            if (this.reader && !this.active)
                return this.loop();
            this.reader = new FileReader;
            this.active = !0;
            this.reader.onload = function(a) {
                return function(b) {
                    b = new e.Buffer(new Uint8Array(b.target.result));
                    a.offset += b.length;
                    a.emit("data", b);
                    a.active = !1;
                    if (a.offset < a.length)
                        return a.loop()
                }
            }(this);
            this.reader.onloadend = function(a) {
                return function() {
                    if (a.offset === a.length)
                        return a.emit("progress", 100),
                        a.emit("end"),
                        a.reader = null
                }
            }(this);
            this.reader.onerror = function(a) {
                return function(b) {
                    return a.emit("error", b)
                }
            }(this);
            this.reader.onprogress = function(a) {
                return function(b) {
                    return a.emit("progress", (a.offset + b.loaded) / a.length * 100)
                }
            }(this);
            return this.loop()
        }
        ;
        a.prototype.loop = function() {
            var a;
            this.active = !0;
            a = Math.min(this.offset + this.chunkSize, this.length);
            a = this.file[this.slice](this.offset, a);
            return this.reader.readAsArrayBuffer(a)
        }
        ;
        a.prototype.pause = function() {
            var a;
            this.active = !1;
            try {
                return null != (a = this.reader) ? a.abort() : void 0
            } catch (b) {}
        }
        ;
        a.prototype.reset = function() {
            this.pause();
            return this.offset = 0
        }
        ;
        return a
    }(e.EventEmitter);
    u.prototype.initialize = function() {
        if (0 < this.fromSampleRate && 0 < this.toSampleRate && 0 < this.channels)
            this.fromSampleRate == this.toSampleRate ? (this.resampler = this.bypassResampler,
            this.ratioWeight = 1) : (this.fromSampleRate < this.toSampleRate ? (this.compileLinearInterpolationFunction(),
            this.lastWeight = 1) : (this.compileMultiTapFunction(),
            this.tailExists = !1,
            this.lastWeight = 0),
            this.ratioWeight = this.fromSampleRate / this.toSampleRate,
            this.initializeBuffers());
        else
            throw Error("Invalid settings specified for the resampler.");
    }
    ;
    u.prototype.compileLinearInterpolationFunction = function() {
        for (var b = "var bufferLength = buffer.length;\tvar outLength = this.outputBufferSize;\tif ((bufferLength % " + this.channels + ") == 0) {\t\tif (bufferLength > 0) {\t\t\tvar ratioWeight = this.ratioWeight;\t\t\tvar weight = this.lastWeight;\t\t\tvar firstWeight = 0;\t\t\tvar secondWeight = 0;\t\t\tvar sourceOffset = 0;\t\t\tvar outputOffset = 0;\t\t\tvar outputBuffer = this.outputBuffer;\t\t\tfor (; weight < 1; weight += ratioWeight) {\t\t\t\tsecondWeight = weight % 1;\t\t\t\tfirstWeight = 1 - secondWeight;", a = 0; a < this.channels; ++a)
            b += "outputBuffer[outputOffset++] = (this.lastOutput[" + a + "] * firstWeight) + (buffer[" + a + "] * secondWeight);";
        b += "}\t\t\tweight -= 1;\t\t\tfor (bufferLength -= " + this.channels + ", sourceOffset = Math.floor(weight) * " + this.channels + "; outputOffset < outLength && sourceOffset < bufferLength;) {\t\t\t\tsecondWeight = weight % 1;\t\t\t\tfirstWeight = 1 - secondWeight;";
        for (a = 0; a < this.channels; ++a)
            b += "outputBuffer[outputOffset++] = (buffer[sourceOffset" + (0 < a ? " + " + a : "") + "] * firstWeight) + (buffer[sourceOffset + " + (this.channels + a) + "] * secondWeight);";
        b += "weight += ratioWeight;\t\t\t\tsourceOffset = Math.floor(weight) * " + this.channels + ";\t\t\t}";
        for (a = 0; a < this.channels; ++a)
            b += "this.lastOutput[" + a + "] = buffer[sourceOffset++];";
        this.resampler = Function("buffer", b + 'this.lastWeight = weight % 1;\t\t\treturn this.bufferSlice(outputOffset);\t\t}\t\telse {\t\t\treturn (this.noReturn) ? 0 : [];\t\t}\t}\telse {\t\tthrow(new Error("Buffer was of incorrect sample length."));\t}')
    }
    ;
    u.prototype.compileMultiTapFunction = function() {
        for (var b = "var bufferLength = buffer.length;\tvar outLength = this.outputBufferSize;\tif ((bufferLength % " + this.channels + ") == 0) {\t\tif (bufferLength > 0) {\t\t\tvar ratioWeight = this.ratioWeight;\t\t\tvar weight = 0;", a = 0; a < this.channels; ++a)
            b += "var output" + a + " = 0;";
        b += "var actualPosition = 0;\t\t\tvar amountToNext = 0;\t\t\tvar alreadyProcessedTail = !this.tailExists;\t\t\tthis.tailExists = false;\t\t\tvar outputBuffer = this.outputBuffer;\t\t\tvar outputOffset = 0;\t\t\tvar currentPosition = 0;\t\t\tdo {\t\t\t\tif (alreadyProcessedTail) {\t\t\t\t\tweight = ratioWeight;";
        for (a = 0; a < this.channels; ++a)
            b += "output" + a + " = 0;";
        b += "}\t\t\t\telse {\t\t\t\t\tweight = this.lastWeight;";
        for (a = 0; a < this.channels; ++a)
            b += "output" + a + " = this.lastOutput[" + a + "];";
        b += "alreadyProcessedTail = true;\t\t\t\t}\t\t\t\twhile (weight > 0 && actualPosition < bufferLength) {\t\t\t\t\tamountToNext = 1 + actualPosition - currentPosition;\t\t\t\t\tif (weight >= amountToNext) {";
        for (a = 0; a < this.channels; ++a)
            b += "output" + a + " += buffer[actualPosition++] * amountToNext;";
        b += "currentPosition = actualPosition;\t\t\t\t\t\tweight -= amountToNext;\t\t\t\t\t}\t\t\t\t\telse {";
        for (a = 0; a < this.channels; ++a)
            b += "output" + a + " += buffer[actualPosition" + (0 < a ? " + " + a : "") + "] * weight;";
        b += "currentPosition += weight;\t\t\t\t\t\tweight = 0;\t\t\t\t\t\tbreak;\t\t\t\t\t}\t\t\t\t}\t\t\t\tif (weight == 0) {";
        for (a = 0; a < this.channels; ++a)
            b += "outputBuffer[outputOffset++] = output" + a + " / ratioWeight;";
        b += "}\t\t\t\telse {\t\t\t\t\tthis.lastWeight = weight;";
        for (a = 0; a < this.channels; ++a)
            b += "this.lastOutput[" + a + "] = output" + a + ";";
        this.resampler = Function("buffer", b + 'this.tailExists = true;\t\t\t\t\tbreak;\t\t\t\t}\t\t\t} while (actualPosition < bufferLength && outputOffset < outLength);\t\t\treturn this.bufferSlice(outputOffset);\t\t}\t\telse {\t\t\treturn (this.noReturn) ? 0 : [];\t\t}\t}\telse {\t\tthrow(new Error("Buffer was of incorrect sample length."));\t}')
    }
    ;
    u.prototype.bypassResampler = function(b) {
        return this.noReturn ? (this.outputBuffer = b,
        b.length) : b
    }
    ;
    u.prototype.bufferSlice = function(b) {
        if (this.noReturn)
            return b;
        try {
            return this.outputBuffer.subarray(0, b)
        } catch (a) {
            try {
                return this.outputBuffer.length = b,
                this.outputBuffer
            } catch (d) {
                return this.outputBuffer.slice(0, b)
            }
        }
    }
    ;
    u.prototype.initializeBuffers = function() {
        try {
            this.outputBuffer = new Float32Array(this.outputBufferSize),
            this.lastOutput = new Float32Array(this.channels)
        } catch (b) {
            this.outputBuffer = [],
            this.lastOutput = []
        }
    }
    ;
    p = function(b, a) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    ;
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    (function(b) {
        function a(a, b) {
            this.sampleRate = a;
            this.channels = b;
            this.refill = p(this.refill, this);
            this.context = null != f ? f : f = new d;
            this.deviceSampleRate = this.context.sampleRate;
            this.bufferSize = Math.ceil(4096 / (this.deviceSampleRate / this.sampleRate) * this.channels);
            this.bufferSize += this.bufferSize % this.channels;
            this.deviceSampleRate !== this.sampleRate && (this.resampler = new u(this.sampleRate,this.deviceSampleRate,this.channels,4096 * this.channels));
            this.node = this.context[c](4096, this.channels, this.channels);
            this.node.onaudioprocess = this.refill;
            this.node.connect(this.context.destination)
        }
        var d, c, f;
        m(a, b);
        e.AudioDevice.register(a);
        d = r.AudioContext || r.webkitAudioContext;
        a.supported = d && ("function" === typeof d.prototype[c = "createScriptProcessor"] || "function" === typeof d.prototype[c = "createJavaScriptNode"]);
        f = null;
        a.prototype.refill = function(a) {
            var b, c, d, f, e, h, m;
            f = a.outputBuffer;
            a = f.numberOfChannels;
            b = Array(a);
            for (d = c = 0; c < a; d = c += 1)
                b[d] = f.getChannelData(d);
            c = new Float32Array(this.bufferSize);
            this.emit("refill", c);
            this.resampler && (c = this.resampler.resampler(c));
            d = e = 0;
            for (m = f.length; e < m; d = e += 1)
                for (f = h = 0; h < a; f = h += 1)
                    b[f][d] = c[d * a + f]
        }
        ;
        a.prototype.destroy = function() {
            return this.node.disconnect(0)
        }
        ;
        a.prototype.getDeviceTime = function() {
            return this.context.currentTime * this.sampleRate
        }
        ;
        return a
    })(e.EventEmitter);
    p = function(b, a) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    ;
    h = {}.hasOwnProperty;
    m = function(b, a) {
        function d() {
            this.constructor = b
        }
        for (var c in a)
            h.call(a, c) && (b[c] = a[c]);
        d.prototype = a.prototype;
        b.prototype = new d;
        b.__super__ = a.prototype;
        return b
    }
    ;
    (function(b) {
        function a(a, b) {
            this.sampleRate = a;
            this.channels = b;
            this.refill = p(this.refill, this);
            this.audio = new Audio;
            this.audio.mozSetup(this.channels, this.sampleRate);
            this.writePosition = 0;
            this.prebufferSize = this.sampleRate / 2;
            this.tail = null;
            this.timer = d(this.refill, 100)
        }
        var d, c;
        m(a, b);
        e.AudioDevice.register(a);
        a.supported = "undefined" !== typeof Audio && null !== Audio && "mozWriteAudio"in new Audio;
        a.prototype.refill = function() {
            var a, b;
            this.tail && (b = this.audio.mozWriteAudio(this.tail),
            this.writePosition += b,
            this.tail = this.writePosition < this.tail.length ? this.tail.subarray(b) : null);
            a = this.audio.mozCurrentSampleOffset() + this.prebufferSize - this.writePosition;
            0 < a && (a = new Float32Array(a),
            this.emit("refill", a),
            b = this.audio.mozWriteAudio(a),
            b < a.length && (this.tail = a.subarray(b)),
            this.writePosition += b)
        }
        ;
        a.prototype.destroy = function() {
            return c(this.timer)
        }
        ;
        a.prototype.getDeviceTime = function() {
            return this.audio.mozCurrentSampleOffset() / this.channels
        }
        ;
        d = function(a, b) {
            var c, d;
            c = e.Buffer.makeBlobURL("setInterval(function() { postMessage('ping'); }, " + b + ");");
            if (null == c)
                return setInterval(a, b);
            d = new Worker(c);
            d.onmessage = a;
            d.url = c;
            return d
        }
        ;
        c = function(a) {
            return a.terminate ? (a.terminate(),
            URL.revokeObjectURL(a.url)) : clearInterval(a)
        }
        ;
        return a
    })(e.EventEmitter);
    return r.AV = e
})();
