"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Apply_1 = require("./Apply");
var Functor_1 = require("./Functor");
function when(F) {
    return function (condition, fu) { return (condition ? fu : F.of(undefined)); };
}
exports.when = when;
function getApplicativeComposition(F, G) {
    return __assign({}, Functor_1.getFunctorComposition(F, G), { of: function (a) { return F.of(G.of(a)); }, ap: function (fgab, fga) {
            return F.ap(F.map(fgab, function (h) { return function (ga) { return G.ap(h, ga); }; }), fga);
        } });
}
exports.getApplicativeComposition = getApplicativeComposition;
function getMonoid(F, M) {
    var S = Apply_1.getSemigroup(F, M)();
    return function () { return (__assign({}, S, { empty: F.of(M.empty) })); };
}
exports.getMonoid = getMonoid;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function applyFirst(F) {
    return function (fa, fb) { return F.ap(F.map(fa, function_1.constant), fb); };
}
exports.applyFirst = applyFirst;
function applySecond(F) {
    return function (fa, fb) { return F.ap(F.map(fa, function () { return function (b) { return b; }; }), fb); };
}
exports.applySecond = applySecond;
function liftA2(F) {
    return function (f) { return function (fa) { return function (fb) { return F.ap(F.map(fa, f), fb); }; }; };
}
exports.liftA2 = liftA2;
function liftA3(F) {
    return function (f) { return function (fa) { return function (fb) { return function (fc) { return F.ap(F.ap(F.map(fa, f), fb), fc); }; }; }; };
}
exports.liftA3 = liftA3;
function liftA4(F) {
    return function (f) { return function (fa) { return function (fb) { return function (fc) { return function (fd) { return F.ap(F.ap(F.ap(F.map(fa, f), fb), fc), fd); }; }; }; }; };
}
exports.liftA4 = liftA4;
function getSemigroup(F, S) {
    var concatLifted = liftA2(F)(function (a) { return function (b) { return S.concat(a, b); }; });
    return function () { return ({
        concat: function (x, y) { return concatLifted(x)(y); }
    }); };
}
exports.getSemigroup = getSemigroup;
var tupleConstructors = {};
function sequenceT(F) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var f = tupleConstructors[len];
        if (!Boolean(f)) {
            f = tupleConstructors[len] = function_1.curried(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return args;
            }, len - 1, []);
        }
        var r = F.map(args[0], f);
        for (var i = 1; i < len; i++) {
            r = F.ap(r, args[i]);
        }
        return r;
    };
}
exports.sequenceT = sequenceT;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Option_1 = require("./Option");
var Ord_1 = require("./Ord");
var Setoid_1 = require("./Setoid");
exports.URI = 'Array';
/**
 *
 * @example
 * import { getMonoid } from 'fp-ts/lib/Array'
 *
 * const M = getMonoid<number>()
 * assert.deepEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function () {
    return {
        concat: function_1.concat,
        empty: exports.empty
    };
};
/**
 * Derives a Setoid over the Array of a given element type from the Setoid of that type. The derived setoid defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given setoid `S`. In case of
 * arrays of different lengths, the result is non equality.
 *
 *
 * @example
 * import { ordString } from 'fp-ts/lib/Ord'
 *
 * const O = getArraySetoid(ordString)
 * assert.strictEqual(O.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(O.equals(['a'], []), false)
 *
 * @constant
 * @since 1.0.0
 */
exports.getSetoid = Setoid_1.getArraySetoid;
/**
 * Derives an `Ord` over the Array of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 *
 * @example
 * import { getOrd } from 'fp-ts/lib/Array'
 * import { ordString } from 'fp-ts/lib/Ord'
 *
 * const O = getOrd(ordString)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 * @function
 * @since 1.2.0
 */
exports.getOrd = function (O) {
    return __assign({}, exports.getSetoid(O), { compare: function (a, b) {
            var aLen = a.length;
            var bLen = b.length;
            var len = Math.min(aLen, bLen);
            for (var i = 0; i < len; i++) {
                var order = O.compare(a[i], b[i]);
                if (order !== 0) {
                    return order;
                }
            }
            return Ord_1.ordNumber.compare(aLen, bLen);
        } });
};
var map = function (fa, f) {
    return fa.map(function (a) { return f(a); });
};
var mapWithIndex = function (fa, f) {
    return fa.map(function (a, i) { return f(i, a); });
};
var of = function (a) {
    return [a];
};
var ap = function (fab, fa) {
    return exports.flatten(map(fab, function (f) { return map(fa, f); }));
};
var chain = function (fa, f) {
    var resLen = 0;
    var l = fa.length;
    var temp = new Array(l);
    for (var i = 0; i < l; i++) {
        var e = fa[i];
        var arr = f(e);
        resLen += arr.length;
        temp[i] = arr;
    }
    var r = Array(resLen);
    var start = 0;
    for (var i = 0; i < l; i++) {
        var arr = temp[i];
        var l_1 = arr.length;
        for (var j = 0; j < l_1; j++) {
            r[j + start] = arr[j];
        }
        start += l_1;
    }
    return r;
};
var reduce = function (fa, b, f) {
    return reduceWithIndex(fa, b, function (_, b, a) { return f(b, a); });
};
var foldMap = function (M) {
    var foldMapWithIndexM = foldMapWithIndex(M);
    return function (fa, f) { return foldMapWithIndexM(fa, function (_, a) { return f(a); }); };
};
var reduceRight = function (fa, b, f) {
    return foldrWithIndex(fa, b, function (_, a, b) { return f(a, b); });
};
var reduceWithIndex = function (fa, b, f) {
    var l = fa.length;
    var r = b;
    for (var i = 0; i < l; i++) {
        r = f(i, r, fa[i]);
    }
    return r;
};
var foldMapWithIndex = function (M) { return function (fa, f) {
    return fa.reduce(function (b, a, i) { return M.concat(b, f(i, a)); }, M.empty);
}; };
var foldrWithIndex = function (fa, b, f) {
    return fa.reduceRight(function (b, a, i) { return f(i, a, b); }, b);
};
function traverse(F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
}
exports.traverse = traverse;
var sequence = function (F) { return function (ta) {
    return reduce(ta, F.of(zero()), function (fas, fa) { return F.ap(F.map(fas, function (as) { return function (a) { return exports.snoc(as, a); }; }), fa); });
}; };
/**
 * An empty array
 *
 * @constant
 * @since 1.9.0
 */
exports.empty = [];
var zero = function () { return exports.empty; };
var alt = function_1.concat;
var unfoldr = function (b, f) {
    var ret = [];
    var bb = b;
    while (true) {
        var mt = f(bb);
        if (mt.isSome()) {
            var _a = mt.value, a = _a[0], b_1 = _a[1];
            ret.push(a);
            bb = b_1;
        }
        else {
            break;
        }
    }
    return ret;
};
/**
 * Return a list of length `n` with element `i` initialized with `f(i)`
 *
 * @example
 * import { makeBy } from 'fp-ts/lib/Array'
 *
 * const double = (n: number): number => n * 2
 * assert.deepEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @function
 * @since 1.10.0
 */
exports.makeBy = function (n, f) {
    var r = [];
    for (var i = 0; i < n; i++) {
        r.push(f(i));
    }
    return r;
};
/**
 * Create an array containing a range of integers, including both endpoints
 *
 * @example
 * import { range } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @function
 * @since 1.10.0
 */
exports.range = function (start, end) {
    return exports.makeBy(end - start + 1, function (i) { return start + i; });
};
/**
 * Create an array containing a value repeated the specified number of times
 *
 * @example
 * import { replicate } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @function
 * @since 1.10.0
 */
exports.replicate = function (n, a) {
    return exports.makeBy(n, function () { return a; });
};
var extend = function (fa, f) {
    return fa.map(function (_, i, as) { return f(as.slice(i)); });
};
/**
 * Removes one level of nesting
 *
 * @example
 * import { flatten } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(flatten([[1], [2], [3]]), [1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.flatten = function (ffa) {
    var rLen = 0;
    var len = ffa.length;
    for (var i = 0; i < len; i++) {
        rLen += ffa[i].length;
    }
    var r = Array(rLen);
    var start = 0;
    for (var i = 0; i < len; i++) {
        var arr = ffa[i];
        var l = arr.length;
        for (var j = 0; j < l; j++) {
            r[j + start] = arr[j];
        }
        start += l;
    }
    return r;
};
/**
 * Break an array into its first element and remaining elements
 *
 * @example
 * import { fold } from 'fp-ts/lib/Array'
 *
 * const len = <A>(as: Array<A>): number => fold(as, 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @function
 * @since 1.0.0
 */
exports.fold = function (as, b, cons) {
    return exports.isEmpty(as) ? b : cons(as[0], as.slice(1));
};
/**
 * Lazy version of {@link fold}
 * @function
 * @since 1.0.0
 */
exports.foldL = function (as, nil, cons) {
    return exports.isEmpty(as) ? nil() : cons(as[0], as.slice(1));
};
/**
 * Break an array into its initial elements and the last element
 * @function
 * @since 1.7.0
 * @param as
 * @param b
 * @param cons
 */
exports.foldr = function (as, b, cons) {
    return exports.isEmpty(as) ? b : cons(as.slice(0, as.length - 1), as[as.length - 1]);
};
/**
 * Lazy version of {@link foldr}
 * @function
 * @since 1.7.0
 * @param as
 * @param nil
 * @param cons
 */
exports.foldrL = function (as, nil, cons) {
    return exports.isEmpty(as) ? nil() : cons(as.slice(0, as.length - 1), as[as.length - 1]);
};
/**
 * Same as `reduce` but it carries over the intermediate steps
 *
 * ```ts
 * import { scanLeft } from 'fp-ts/lib/Array'
 *
 * scanLeft([1, 2, 3], 10, (b, a) => b - a) // [ 10, 9, 7, 4 ]
 * ```
 *
 * @function
 * @since 1.1.0
 */
exports.scanLeft = function (as, b, f) {
    var l = as.length;
    var r = new Array(l + 1);
    r[0] = b;
    for (var i = 0; i < l; i++) {
        r[i + 1] = f(r[i], as[i]);
    }
    return r;
};
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(scanRight([1, 2, 3], 10, (a, b) => b - a), [ 4, 5, 7, 10 ])
 *
 * @function
 * @since 1.1.0
 */
exports.scanRight = function (as, b, f) {
    var l = as.length;
    var r = new Array(l + 1);
    r[l] = b;
    for (var i = l - 1; i >= 0; i--) {
        r[i] = f(as[i], r[i + 1]);
    }
    return r;
};
/**
 * Test whether an array is empty
 *
 * @example
 * import { isEmpty } from 'fp-ts/lib/Array'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @function
 * @since 1.0.0
 */
exports.isEmpty = function (as) {
    return as.length === 0;
};
/**
 * Test whether an array contains a particular index
 * @function
 * @since 1.0.0
 */
exports.isOutOfBound = function (i, as) {
    return i < 0 || i >= as.length;
};
/**
 * This function provides a safe way to read a value at a particular index from an array
 *
 * @example
 * import { index } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(index(1, [1, 2, 3]), some(2))
 * assert.deepEqual(index(3, [1, 2, 3]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.index = function (i, as) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(as[i]);
};
/**
 * Attaches an element to the front of an array, creating a new array
 *
 * @example
 * import { cons } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(cons(0, [1, 2, 3]), [0, 1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.cons = function (a, as) {
    var len = as.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i + 1] = as[i];
    }
    r[0] = a;
    return r;
};
/**
 * Append an element to the end of an array, creating a new array
 *
 * @example
 * import { snoc } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(snoc([1, 2, 3], 4), [1, 2, 3, 4])
 *
 * @function
 * @since 1.0.0
 */
exports.snoc = function (as, a) {
    var len = as.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = as[i];
    }
    r[len] = a;
    return r;
};
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(head([1, 2, 3]), some(1))
 * assert.deepEqual(head([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.head = function (as) {
    return exports.isEmpty(as) ? Option_1.none : Option_1.some(as[0]);
};
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(last([1, 2, 3]), some(3))
 * assert.deepEqual(last([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.last = function (as) {
    return exports.index(as.length - 1, as);
};
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepEqual(tail([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.tail = function (as) {
    return exports.isEmpty(as) ? Option_1.none : Option_1.some(as.slice(1));
};
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepEqual(init([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.init = function (as) {
    var len = as.length;
    return len === 0 ? Option_1.none : Option_1.some(as.slice(0, len - 1));
};
/**
 * Keep only a number of elements from the start of an array, creating a new array.
 * `n` must be a natural number
 *
 * @example
 * import { take } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(take(2, [1, 2, 3]), [1, 2])
 *
 * @function
 * @since 1.0.0
 */
exports.take = function (n, as) {
    return as.slice(0, n);
};
/**
 * Keep only a number of elements from the end of an array, creating a new array.
 * `n` must be a natural number
 *
 * @example
 * import { takeEnd } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(takeEnd(2, [1, 2, 3, 4, 5]), [4, 5])
 *
 * @function
 * @since 1.10.0
 */
exports.takeEnd = function (n, as) {
    return n === 0 ? exports.empty : as.slice(-n);
};
function takeWhile(as, predicate) {
    var i = spanIndexUncurry(as, predicate);
    var init = Array(i);
    for (var j = 0; j < i; j++) {
        init[j] = as[j];
    }
    return init;
}
exports.takeWhile = takeWhile;
var spanIndexUncurry = function (as, predicate) {
    var l = as.length;
    var i = 0;
    for (; i < l; i++) {
        if (!predicate(as[i])) {
            break;
        }
    }
    return i;
};
function span(as, predicate) {
    var i = spanIndexUncurry(as, predicate);
    var init = Array(i);
    for (var j = 0; j < i; j++) {
        init[j] = as[j];
    }
    var l = as.length;
    var rest = Array(l - i);
    for (var j = i; j < l; j++) {
        rest[j - i] = as[j];
    }
    return { init: init, rest: rest };
}
exports.span = span;
/**
 * Drop a number of elements from the start of an array, creating a new array
 *
 * @example
 * import { drop } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(drop(2, [1, 2, 3]), [3])
 *
 * @function
 * @since 1.0.0
 */
exports.drop = function (n, as) {
    return as.slice(n, as.length);
};
/**
 * Drop a number of elements from the end of an array, creating a new array
 *
 * @example
 * import { dropEnd } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(dropEnd(2, [1, 2, 3, 4, 5]), [1, 2, 3])
 *
 * @function
 * @since 1.10.0
 */
exports.dropEnd = function (n, as) {
    return as.slice(0, as.length - n);
};
/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new array
 *
 * @example
 * import { dropWhile } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(dropWhile([1, 3, 2, 4, 5], n => n % 2 === 1), [2, 4, 5])
 *
 * @function
 * @since 1.0.0
 */
exports.dropWhile = function (as, predicate) {
    var i = spanIndexUncurry(as, predicate);
    var l = as.length;
    var rest = Array(l - i);
    for (var j = i; j < l; j++) {
        rest[j - i] = as[j];
    }
    return rest;
};
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(findIndex([1, 2, 3], x => x === 2), some(1))
 * assert.deepEqual(findIndex([], x => x === 2), none)
 *
 * @function
 * @since 1.0.0
 */
exports.findIndex = function (as, predicate) {
    var len = as.length;
    for (var i = 0; i < len; i++) {
        if (predicate(as[i])) {
            return Option_1.some(i);
        }
    }
    return Option_1.none;
};
function findFirst(as, predicate) {
    var len = as.length;
    for (var i = 0; i < len; i++) {
        if (predicate(as[i])) {
            return Option_1.some(as[i]);
        }
    }
    return Option_1.none;
}
exports.findFirst = findFirst;
function findLast(as, predicate) {
    var len = as.length;
    for (var i = len - 1; i >= 0; i--) {
        if (predicate(as[i])) {
            return Option_1.some(as[i]);
        }
    }
    return Option_1.none;
}
exports.findLast = findLast;
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * interface X {
 *   a: number
 *   b: number
 * }
 * const xs: Array<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepEqual(findLastIndex(xs, x => x.a === 1), some(1))
 * assert.deepEqual(findLastIndex(xs, x => x.a === 4), none)
 *
 * @function
 * @since 1.10.0
 */
exports.findLastIndex = function (as, predicate) {
    var len = as.length;
    for (var i = len - 1; i >= 0; i--) {
        if (predicate(as[i])) {
            return Option_1.some(i);
        }
    }
    return Option_1.none;
};
/**
 * Use {@link filter} instead
 * @function
 * @since 1.0.0
 * @deprecated
 */
exports.refine = function (as, refinement) {
    return filter(as, refinement);
};
/**
 * @function
 * @since 1.0.0
 */
exports.copy = function (as) {
    var l = as.length;
    var r = Array(l);
    for (var i = 0; i < l; i++) {
        r[i] = as[i];
    }
    return r;
};
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeInsertAt = function (i, a, as) {
    var xs = exports.copy(as);
    xs.splice(i, 0, a);
    return xs;
};
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/lib/Array'
 * import { some } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(insertAt(2, 5, [1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @function
 * @since 1.0.0
 */
exports.insertAt = function (i, a, as) {
    return i < 0 || i > as.length ? Option_1.none : Option_1.some(exports.unsafeInsertAt(i, a, as));
};
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeUpdateAt = function (i, a, as) {
    var xs = exports.copy(as);
    xs[i] = a;
    return xs;
};
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(updateAt(1, 1, [1, 2, 3]), some([1, 1, 3]))
 * assert.deepEqual(updateAt(1, 1, []), none)
 *
 * @function
 * @since 1.0.0
 */
exports.updateAt = function (i, a, as) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(exports.unsafeUpdateAt(i, a, as));
};
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeDeleteAt = function (i, as) {
    var xs = exports.copy(as);
    xs.splice(i, 1);
    return xs;
};
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(deleteAt(0, [1, 2, 3]), some([2, 3]))
 * assert.deepEqual(deleteAt(1, []), none)
 *
 * @function
 * @since 1.0.0
 */
exports.deleteAt = function (i, as) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(exports.unsafeDeleteAt(i, as));
};
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepEqual(modifyAt([1, 2, 3], 1, double), some([1, 4, 3]))
 * assert.deepEqual(modifyAt([], 1, double), none)
 *
 * @function
 * @since 1.0.0
 */
exports.modifyAt = function (as, i, f) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(exports.unsafeUpdateAt(i, f(as[i]), as));
};
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @function
 * @since 1.0.0
 */
exports.reverse = function (as) {
    return exports.copy(as).reverse();
};
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/lib/Array'
 * import { right, left } from 'fp-ts/lib/Either'
 *
 * assert.deepEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @function
 * @since 1.0.0
 */
exports.rights = function (as) {
    var r = [];
    var len = as.length;
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (a.isRight()) {
            r.push(a.value);
        }
    }
    return r;
};
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/lib/Array'
 * import { left, right } from 'fp-ts/lib/Either'
 *
 * assert.deepEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @function
 * @since 1.0.0
 */
exports.lefts = function (as) {
    var r = [];
    var len = as.length;
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (a.isLeft()) {
            r.push(a.value);
        }
    }
    return r;
};
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/lib/Array'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepEqual(sort(ordNumber)([3, 2, 1]), [1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.sort = function (O) { return function (as) {
    return exports.copy(as).sort(O.compare);
}; };
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @function
 * @since 1.0.0
 */
exports.zipWith = function (fa, fb, f) {
    var fc = [];
    var len = Math.min(fa.length, fb.length);
    for (var i = 0; i < len; i++) {
        fc[i] = f(fa[i], fb[i]);
    }
    return fc;
};
/**
 * Takes two arrays and returns an array of corresponding pairs. If one input array is short, excess elements of the
 * longer array are discarded
 *
 * @example
 * import { zip } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(zip([1, 2, 3], ['a', 'b', 'c', 'd']), [[1, 'a'], [2, 'b'], [3, 'c']])
 *
 * @function
 * @since 1.0.0
 */
exports.zip = function (fa, fb) {
    return exports.zipWith(fa, fb, function_1.tuple);
};
/**
 * Rotate an array to the right by `n` steps
 *
 * @example
 * import { rotate } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(rotate(2, [1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.rotate = function (n, xs) {
    var len = xs.length;
    if (n === 0 || len <= 1 || len === Math.abs(n)) {
        return xs;
    }
    else if (n < 0) {
        return exports.rotate(len + n, xs);
    }
    else {
        return xs.slice(-n).concat(xs.slice(0, len - n));
    }
};
/**
 * Test if a value is a member of an array. Takes a `Setoid<A>` as a single
 * argument which returns the function to use to search for a value of type `A` in
 * an array of type `Array<A>`.
 *
 * @example
 * import { member } from 'fp-ts/lib/Array'
 * import { setoidString, setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.strictEqual(member(setoidString)(['thing one', 'thing two', 'cat in the hat'], 'thing two'), true)
 * assert.strictEqual(member(setoidNumber)([1, 2, 3], 1), true)
 * assert.strictEqual(member(setoidNumber)([1, 2, 3], 4), false)
 *
 * @function
 * @since 1.3.0
 */
exports.member = function (S) { return function (as, a) {
    var predicate = function (e) { return S.equals(e, a); };
    var i = 0;
    var len = as.length;
    for (; i < len; i++) {
        if (predicate(as[i])) {
            return true;
        }
    }
    return false;
}; };
/**
 * Remove duplicates from an array, keeping the first occurance of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(uniq(setoidNumber)([1, 2, 1]), [1, 2])
 *
 * @function
 * @since 1.3.0
 */
exports.uniq = function (S) {
    var memberS = exports.member(S);
    return function (as) {
        var r = [];
        var len = as.length;
        var i = 0;
        for (; i < len; i++) {
            var a = as[i];
            if (!memberS(r, a)) {
                r.push(a);
            }
        }
        return len === r.length ? as : r;
    };
};
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/lib/Array'
 * import { contramap, ordString, ordNumber } from 'fp-ts/lib/Ord'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 * const byName = contramap((p: Person) => p.name, ordString)
 * const byAge = contramap((p: Person) => p.age, ordNumber)
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * if (sortByNameByAge.isSome()) {
 *   const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 *   assert.deepEqual(sortByNameByAge.value(persons), [
 *     { name: 'a', age: 1 },
 *     { name: 'b', age: 2 },
 *     { name: 'b', age: 3 },
 *     { name: 'c', age: 2 }
 *   ])
 * }
 *
 * @function
 * @since 1.3.0
 */
exports.sortBy = function (ords) {
    return exports.fold(ords, Option_1.none, function (head, tail) { return Option_1.some(exports.sortBy1(head, tail)); });
};
/**
 * Non failing version of {@link sortBy}
 * @example
 * import { sortBy1 } from 'fp-ts/lib/Array'
 * import { contramap, ordString, ordNumber } from 'fp-ts/lib/Ord'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 * const byName = contramap((p: Person) => p.name, ordString)
 * const byAge = contramap((p: Person) => p.age, ordNumber)
 *
 * const sortByNameByAge = sortBy1(byName, [byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @function
 * @since 1.3.0
 */
exports.sortBy1 = function (head, tail) {
    return exports.sort(tail.reduce(Ord_1.getSemigroup().concat, head));
};
/**
 * Apply a function to each element in an array, keeping only the results which contain a value, creating a new array.
 *
 * Alias of {@link Filterable}'s `filterMap`
 *
 * @example
 * import { mapOption } from 'fp-ts/lib/Array'
 * import { Option, some, none } from 'fp-ts/lib/Option'
 *
 * const f = (n: number): Option<number> => (n % 2 === 0 ? none : some(n))
 * assert.deepEqual(mapOption([1, 2, 3], f), [1, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.mapOption = function (as, f) {
    return filterMapWithIndex(as, function (_, a) { return f(a); });
};
/**
 * Filter an array of optional values, keeping only the elements which contain a value, creating a new array.
 *
 * Alias of {@link Compactable}'s `compact`
 *
 * @example
 * import { catOptions } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(catOptions([some(1), none, some(3)]), [1, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.catOptions = function (as) {
    return exports.mapOption(as, function_1.identity);
};
/**
 * @example
 * import { array } from 'fp-ts/lib/Array'
 * import { left, right } from 'fp-ts/lib/Either'
 * import { identity } from 'fp-ts/lib/function'
 *
 * assert.deepEqual(array.partitionMap([right(1), left('foo'), right(2)], identity), { left: ['foo'], right: [1, 2] })
 *
 * @function
 * @since 1.0.0
 */
exports.partitionMap = function (fa, f) {
    return partitionMapWithIndex(fa, function (_, a) { return f(a); });
};
function filter(as, predicate) {
    return as.filter(predicate);
}
exports.filter = filter;
function partition(fa, p) {
    return partitionWithIndex(fa, function (_, a) { return p(a); });
}
exports.partition = partition;
var compact = exports.catOptions;
var separate = function (fa) {
    var left = [];
    var right = [];
    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
        var e = fa_1[_i];
        if (e.isLeft()) {
            left.push(e.value);
        }
        else {
            right.push(e.value);
        }
    }
    return {
        left: left,
        right: right
    };
};
var filterMap = exports.mapOption;
var wither = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), compact); };
};
var wilt = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), separate); };
};
/**
 * A useful recursion pattern for processing an array to produce a new array, often used for "chopping" up the input
 * array. Typically chop is called with some function that will consume an initial prefix of the array and produce a
 * value and the rest of the array.
 *
 * @example
 * import { Setoid, setoidNumber } from 'fp-ts/lib/Setoid'
 * import { chop, span } from 'fp-ts/lib/Array'
 *
 * const group = <A>(S: Setoid<A>) => (as: Array<A>): Array<Array<A>> => {
 *   return chop(as, as => {
 *     const { init, rest } = span(as, a => S.equals(a, as[0]))
 *     return [init, rest]
 *   })
 * }
 * assert.deepEqual(group(setoidNumber)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @function
 * @since 1.10.0
 */
exports.chop = function (as, f) {
    var result = [];
    var cs = as;
    while (cs.length > 0) {
        var _a = f(cs), b = _a[0], c = _a[1];
        result.push(b);
        cs = c;
    }
    return result;
};
/**
 * Splits an array into two pieces, the first piece has `n` elements.
 *
 * @example
 * import { split } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(split(2, [1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @function
 * @since 1.10.0
 */
exports.split = function (n, as) {
    return [as.slice(0, n), as.slice(n)];
};
/**
 * Splits an array into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the array. Note that `chunksOf([], n)` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(xs, n).concat(chunksOf(ys, n)) == chunksOf(xs.concat(ys)), n)
 * ```
 *
 * whenever `n` evenly divides the length of `xs`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(chunksOf([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]])
 *
 * @function
 * @since 1.10.0
 */
exports.chunksOf = function (as, n) {
    return exports.isOutOfBound(n - 1, as) ? [as] : exports.chop(as, function (as) { return exports.split(n, as); });
};
function comprehension(input, f, g) {
    var go = function (scope, input) {
        if (input.length === 0) {
            return f.apply(void 0, scope) ? [g.apply(void 0, scope)] : exports.empty;
        }
        else {
            return chain(input[0], function (x) { return go(exports.snoc(scope, x), input.slice(1)); });
        }
    };
    return go(exports.empty, input);
}
exports.comprehension = comprehension;
/**
 * Creates an array of unique values, in order, from all given arrays using a {@link Setoid} for equality comparisons
 *
 * @example
 * import { union } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(union(setoidNumber)([1, 2], [2, 3]), [1, 2, 3])
 *
 * @function
 * @since 1.12.0
 */
exports.union = function (S) {
    var memberS = exports.member(S);
    return function (xs, ys) { return function_1.concat(xs, ys.filter(function (a) { return !memberS(xs, a); })); };
};
/**
 * Creates an array of unique values that are included in all given arrays using a {@link Setoid} for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { intersection } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(intersection(setoidNumber)([1, 2], [2, 3]), [2])
 *
 * @function
 * @since 1.12.0
 */
exports.intersection = function (S) {
    var memberS = exports.member(S);
    return function (xs, ys) { return xs.filter(function (a) { return memberS(ys, a); }); };
};
/**
 * Creates an array of array values not included in the other given array using a {@link Setoid} for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { difference } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(difference(setoidNumber)([1, 2], [2, 3]), [1])
 *
 * @function
 * @since 1.12.0
 */
exports.difference = function (S) {
    var memberS = exports.member(S);
    return function (xs, ys) { return xs.filter(function (a) { return !memberS(ys, a); }); };
};
var traverseWithIndex = function (F) { return function (ta, f) {
    return reduceWithIndex(ta, F.of(zero()), function (i, fbs, a) {
        return F.ap(F.map(fbs, function (bs) { return function (b) { return exports.snoc(bs, b); }; }), f(i, a));
    });
}; };
var partitionMapWithIndex = function (fa, f) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var e = f(i, fa[i]);
        if (e.isLeft()) {
            left.push(e.value);
        }
        else {
            right.push(e.value);
        }
    }
    return {
        left: left,
        right: right
    };
};
var partitionWithIndex = function (fa, p) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var a = fa[i];
        if (p(i, a)) {
            right.push(a);
        }
        else {
            left.push(a);
        }
    }
    return {
        left: left,
        right: right
    };
};
var filterMapWithIndex = function (fa, f) {
    var result = [];
    for (var i = 0; i < fa.length; i++) {
        var optionB = f(i, fa[i]);
        if (optionB.isSome()) {
            result.push(optionB.value);
        }
    }
    return result;
};
var filterWithIndex = function (fa, p) {
    return fa.filter(function (a, i) { return p(i, a); });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.array = {
    URI: exports.URI,
    map: map,
    mapWithIndex: mapWithIndex,
    compact: compact,
    separate: separate,
    filter: filter,
    filterMap: filterMap,
    partition: partition,
    partitionMap: exports.partitionMap,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: reduceRight,
    unfoldr: unfoldr,
    traverse: traverse,
    sequence: sequence,
    zero: zero,
    alt: alt,
    extend: extend,
    wither: wither,
    wilt: wilt,
    reduceWithIndex: reduceWithIndex,
    foldMapWithIndex: foldMapWithIndex,
    foldrWithIndex: foldrWithIndex,
    traverseWithIndex: traverseWithIndex,
    partitionMapWithIndex: partitionMapWithIndex,
    partitionWithIndex: partitionWithIndex,
    filterMapWithIndex: filterMapWithIndex,
    filterWithIndex: filterWithIndex
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @instance
 * @since 1.4.0
 */
exports.booleanAlgebraBoolean = {
    meet: function (x, y) { return x && y; },
    join: function (x, y) { return x || y; },
    zero: false,
    one: true,
    implies: function (x, y) { return !x || y; },
    not: function (x) { return !x; }
};
/**
 * @instance
 * @since 1.4.0
 */
exports.booleanAlgebraVoid = {
    meet: function () { return undefined; },
    join: function () { return undefined; },
    zero: undefined,
    one: undefined,
    implies: function () { return undefined; },
    not: function () { return undefined; }
};
/**
 * @function
 * @since 1.4.0
 */
exports.getFunctionBooleanAlgebra = function (B) { return function () {
    return {
        meet: function (x, y) { return function (a) { return B.meet(x(a), y(a)); }; },
        join: function (x, y) { return function (a) { return B.join(x(a), y(a)); }; },
        zero: function () { return B.zero; },
        one: function () { return B.one; },
        implies: function (x, y) { return function (a) { return B.implies(x(a), y(a)); }; },
        not: function (x) { return function (a) { return B.not(x(a)); }; }
    };
}; };
/**
 * Every boolean algebras has a dual algebra, which involves reversing one/zero as well as join/meet.
 * @function
 * @since 1.4.0
 */
exports.getDualBooleanAlgebra = function (B) {
    return {
        meet: function (x, y) { return B.join(x, y); },
        join: function (x, y) { return B.meet(x, y); },
        zero: B.one,
        one: B.zero,
        implies: function (x, y) { return B.join(B.not(x), y); },
        not: B.not
    };
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ord_1 = require("./Ord");
/**
 * @instance
 * @since 1.0.0
 */
exports.boundedNumber = __assign({}, Ord_1.ordNumber, { top: Infinity, bottom: -Infinity });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var DistributiveLattice_1 = require("./DistributiveLattice");
/**
 * @function
 * @since 1.4.0
 */
exports.getMinMaxBoundedDistributiveLattice = function (O) { return function (min, max) {
    return __assign({}, DistributiveLattice_1.getMinMaxDistributiveLattice(O), { zero: min, one: max });
}; };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flatten(chain) {
    return function (mma) { return chain.chain(mma, function (ma) { return ma; }); };
}
exports.flatten = flatten;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @function
 * @since 1.0.0
 */
exports.tailRec = function (f, a) {
    var v = f(a);
    while (v.isLeft()) {
        v = f(v.value);
    }
    return v.value;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function splitChoice(F) {
    return function (pab, pcd) {
        return F.compose(F.left(pab), F.right(pcd));
    };
}
exports.splitChoice = splitChoice;
function fanin(F) {
    var splitChoiceF = splitChoice(F);
    return function (pac, pbc) {
        var join = F.promap(F.id(), function (e) { return e.fold(function_1.identity, function_1.identity); }, function_1.identity);
        return F.compose(join, splitChoiceF(pac, pbc));
    };
}
exports.fanin = fanin;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Functor_1 = require("./Functor");
var Option_1 = require("./Option");
function getCompactableComposition(F, G) {
    var FC = Functor_1.getFunctorComposition(F, G);
    var CC = __assign({}, FC, { compact: function (fga) { return F.map(fga, G.compact); }, separate: function (fge) {
            var left = CC.compact(FC.map(fge, function (e) { return e.fold(Option_1.some, function () { return Option_1.none; }); }));
            var right = CC.compact(FC.map(fge, Option_1.fromEither));
            return { left: left, right: right };
        } });
    return CC;
}
exports.getCompactableComposition = getCompactableComposition;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
// Adapted from https://github.com/purescript/purescript-console
/**
 * @function
 * @since 1.0.0
 */
exports.log = function (s) {
    return new IO_1.IO(function () { return console.log(s); }); // tslint:disable-line:no-console
};
/**
 * @function
 * @since 1.0.0
 */
exports.warn = function (s) {
    return new IO_1.IO(function () { return console.warn(s); }); // tslint:disable-line:no-console
};
/**
 * @function
 * @since 1.0.0
 */
exports.error = function (s) {
    return new IO_1.IO(function () { return console.error(s); }); // tslint:disable-line:no-console
};
/**
 * @function
 * @since 1.0.0
 */
exports.info = function (s) {
    return new IO_1.IO(function () { return console.info(s); }); // tslint:disable-line:no-console
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Const';
/**
 * @data
 * @constructor Const
 * @since 1.0.0
 */
var Const = /** @class */ (function () {
    function Const(value) {
        this.value = value;
    }
    Const.prototype.map = function (f) {
        return this;
    };
    Const.prototype.contramap = function (f) {
        return this;
    };
    Const.prototype.fold = function (f) {
        return f(this.value);
    };
    Const.prototype.inspect = function () {
        return this.toString();
    };
    Const.prototype.toString = function () {
        return "new Const(" + function_1.toString(this.value) + ")";
    };
    return Const;
}());
exports.Const = Const;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    return {
        equals: function (x, y) { return S.equals(x.value, y.value); }
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var contramap = function (fa, f) {
    return fa.contramap(f);
};
var ap = function (S) { return function (fab, fa) {
    return new Const(S.concat(fab.value, fa.value));
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getApply = function (S) {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        ap: ap(S)
    };
};
var of = function (M) { return function (a) {
    return new Const(M.empty);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getApplicative = function (M) {
    return __assign({}, exports.getApply(M), { of: of(M) });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.const_ = {
    URI: exports.URI,
    map: map,
    contramap: contramap
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TWITTER_API_BASE_URL = 'https://api.twitter.com';
var ENDPOINTS;
(function (ENDPOINTS) {
    ENDPOINTS["OAuthAuthenticate"] = "/oauth/authenticate";
    ENDPOINTS["OAuthRequestToken"] = "/oauth/request_token";
    ENDPOINTS["OAuthAccessToken"] = "/oauth/access_token";
    ENDPOINTS["StatusesHomeTimeline"] = "/1.1/statuses/home_timeline.json";
    ENDPOINTS["AccountVerifyCredentials"] = "/1.1/account/verify_credentials.json";
    ENDPOINTS["AccountSettings"] = "/1.1/account/settings.json";
})(ENDPOINTS = exports.ENDPOINTS || (exports.ENDPOINTS = {}));
//# sourceMappingURL=constants.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function lift(contravariant) {
    return function (f) { return function (fa) { return contravariant.contramap(fa, f); }; };
}
exports.lift = lift;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
/**
 * Returns the current `Date`
 * @constant
 * @since 1.10.0
 */
exports.create = new IO_1.IO(function () { return new Date(); });
/**
 * Returns the number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC
 * @constant
 * @since 1.10.0
 */
exports.now = new IO_1.IO(function () { return new Date().getTime(); });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ord_1 = require("./Ord");
/**
 * @function
 * @since 1.4.0
 */
exports.getMinMaxDistributiveLattice = function (O) {
    return {
        meet: Ord_1.min(O),
        join: Ord_1.max(O)
    };
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ChainRec_1 = require("./ChainRec");
var function_1 = require("./function");
exports.URI = 'Either';
/**
 * Left side of {@link Either}
 */
var Left = /** @class */ (function () {
    function Left(value) {
        this.value = value;
        this._tag = 'Left';
    }
    /** The given function is applied if this is a `Right` */
    Left.prototype.map = function (f) {
        return this;
    };
    Left.prototype.ap = function (fab) {
        return (fab.isLeft() ? fab : this);
    };
    /**
     * Flipped version of {@link ap}
     */
    Left.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /** Binds the given function across `Right` */
    Left.prototype.chain = function (f) {
        return this;
    };
    Left.prototype.bimap = function (f, g) {
        return new Left(f(this.value));
    };
    Left.prototype.alt = function (fy) {
        return fy;
    };
    /**
     * Lazy version of {@link alt}
     *
     * @example
     * import { right } from 'fp-ts/lib/Either'
     *
     * assert.deepEqual(right(1).orElse(() => right(2)), right(1))
     *
     * @since 1.6.0
     */
    Left.prototype.orElse = function (fy) {
        return fy(this.value);
    };
    Left.prototype.extend = function (f) {
        return this;
    };
    Left.prototype.reduce = function (b, f) {
        return b;
    };
    /** Applies a function to each case in the data structure */
    Left.prototype.fold = function (whenLeft, whenRight) {
        return whenLeft(this.value);
    };
    /** Returns the value from this `Right` or the given argument if this is a `Left` */
    Left.prototype.getOrElse = function (a) {
        return a;
    };
    /** Returns the value from this `Right` or the result of given argument if this is a `Left` */
    Left.prototype.getOrElseL = function (f) {
        return f(this.value);
    };
    /** Maps the left side of the disjunction */
    Left.prototype.mapLeft = function (f) {
        return new Left(f(this.value));
    };
    Left.prototype.inspect = function () {
        return this.toString();
    };
    Left.prototype.toString = function () {
        return "left(" + function_1.toString(this.value) + ")";
    };
    /** Returns `true` if the either is an instance of `Left`, `false` otherwise */
    Left.prototype.isLeft = function () {
        return true;
    };
    /** Returns `true` if the either is an instance of `Right`, `false` otherwise */
    Left.prototype.isRight = function () {
        return false;
    };
    /** Swaps the disjunction values */
    Left.prototype.swap = function () {
        return new Right(this.value);
    };
    Left.prototype.filterOrElse = function (_, zero) {
        return this;
    };
    Left.prototype.filterOrElseL = function (_, zero) {
        return this;
    };
    /**
     * Use {@link filterOrElse} instead
     * @since 1.6.0
     * @deprecated
     */
    Left.prototype.refineOrElse = function (p, zero) {
        return this;
    };
    /**
     * Lazy version of {@link refineOrElse}
     * Use {@link filterOrElseL} instead
     * @since 1.6.0
     * @deprecated
     */
    Left.prototype.refineOrElseL = function (p, zero) {
        return this;
    };
    return Left;
}());
exports.Left = Left;
/**
 * Right side of {@link Either}
 */
var Right = /** @class */ (function () {
    function Right(value) {
        this.value = value;
        this._tag = 'Right';
    }
    Right.prototype.map = function (f) {
        return new Right(f(this.value));
    };
    Right.prototype.ap = function (fab) {
        return fab.isRight() ? this.map(fab.value) : exports.left(fab.value);
    };
    Right.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Right.prototype.chain = function (f) {
        return f(this.value);
    };
    Right.prototype.bimap = function (f, g) {
        return new Right(g(this.value));
    };
    Right.prototype.alt = function (fy) {
        return this;
    };
    Right.prototype.orElse = function (fy) {
        return this;
    };
    Right.prototype.extend = function (f) {
        return new Right(f(this));
    };
    Right.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    Right.prototype.fold = function (whenLeft, whenRight) {
        return whenRight(this.value);
    };
    Right.prototype.getOrElse = function (a) {
        return this.value;
    };
    Right.prototype.getOrElseL = function (f) {
        return this.value;
    };
    Right.prototype.mapLeft = function (f) {
        return new Right(this.value);
    };
    Right.prototype.inspect = function () {
        return this.toString();
    };
    Right.prototype.toString = function () {
        return "right(" + function_1.toString(this.value) + ")";
    };
    Right.prototype.isLeft = function () {
        return false;
    };
    Right.prototype.isRight = function () {
        return true;
    };
    Right.prototype.swap = function () {
        return new Left(this.value);
    };
    Right.prototype.filterOrElse = function (p, zero) {
        return p(this.value) ? this : exports.left(zero);
    };
    Right.prototype.filterOrElseL = function (p, zero) {
        return p(this.value) ? this : exports.left(zero(this.value));
    };
    Right.prototype.refineOrElse = function (p, zero) {
        return p(this.value) ? this : exports.left(zero);
    };
    Right.prototype.refineOrElseL = function (p, zero) {
        return p(this.value) ? this : exports.left(zero(this.value));
    };
    return Right;
}());
exports.Right = Right;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (SL, SA) {
    return {
        equals: function (x, y) {
            return x.isLeft() ? y.isLeft() && SL.equals(x.value, y.value) : y.isRight() && SA.equals(x.value, y.value);
        }
    };
};
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * appended using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getSemigroup<string, number>(semigroupSum)
 * assert.deepEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepEqual(S.concat(right(1), right(2)), right(3))
 *
 * @function
 * @since 1.7.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) { return (y.isLeft() ? x : x.isLeft() ? y : exports.right(S.concat(x.value, y.value))); }
    };
};
/**
 * {@link Apply} semigroup
 *
 * @example
 * import { getApplySemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getApplySemigroup<string, number>(semigroupSum)
 * assert.deepEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepEqual(S.concat(left('a'), right(2)), left('a'))
 * assert.deepEqual(S.concat(right(1), left('b')), left('b'))
 * assert.deepEqual(S.concat(right(1), right(2)), right(3))
 *
 * @function
 * @since 1.7.0
 */
exports.getApplySemigroup = function (S) {
    return {
        concat: function (x, y) { return (x.isLeft() ? x : y.isLeft() ? y : exports.right(S.concat(x.value, y.value))); }
    };
};
/**
 * @function
 * @since 1.7.0
 */
exports.getApplyMonoid = function (M) {
    return __assign({}, exports.getApplySemigroup(M), { empty: exports.right(M.empty) });
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Right(a);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var bimap = function (fla, f, g) {
    return fla.bimap(f, g);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var extend = function (ea, f) {
    return ea.extend(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.isLeft() ? M.empty : f(fa.value);
}; };
var foldr = function (fa, b, f) {
    return fa.isLeft() ? b : f(fa.value, b);
};
var traverse = function (F) { return function (ta, f) {
    return ta.isLeft() ? F.of(exports.left(ta.value)) : F.map(f(ta.value), of);
}; };
var sequence = function (F) { return function (ta) {
    return ta.isLeft() ? F.of(exports.left(ta.value)) : F.map(ta.value, exports.right);
}; };
var chainRec = function (a, f) {
    return ChainRec_1.tailRec(function (e) {
        if (e.isLeft()) {
            return exports.right(exports.left(e.value));
        }
        else {
            var r = e.value;
            return r.isLeft() ? exports.left(f(r.value)) : exports.right(exports.right(r.value));
        }
    }, f(a));
};
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure
 * @function
 * @since 1.0.0
 */
exports.left = function (l) {
    return new Left(l);
};
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure
 * @function
 * @since 1.0.0
 * @alias of
 */
exports.right = of;
function fromPredicate(predicate, whenFalse) {
    return function (a) { return (predicate(a) ? exports.right(a) : exports.left(whenFalse(a))); };
}
exports.fromPredicate = fromPredicate;
/**
 * Use {@link fromPredicate} instead
 * @function
 * @since 1.6.0
 * @deprecated
 */
exports.fromRefinement = function (refinement, whenFalse) { return function (a) {
    return refinement(a) ? exports.right(a) : exports.left(whenFalse(a));
}; };
/**
 * Takes a default and a `Option` value, if the value is a `Some`, turn it into a `Right`, if the value is a `None` use
 * the provided default as a `Left`
 * @function
 * @since 1.0.0
 */
exports.fromOption = function (defaultValue) { return function (fa) {
    return fa.isNone() ? exports.left(defaultValue) : exports.right(fa.value);
}; };
/**
 * Lazy version of {@link fromOption}
 * @function
 * @since 1.3.0
 */
exports.fromOptionL = function (defaultValue) { return function (fa) {
    return fa.isNone() ? exports.left(defaultValue()) : exports.right(fa.value);
}; };
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`
 * @function
 * @since 1.0.0
 */
exports.fromNullable = function (defaultValue) { return function (a) {
    return a == null ? exports.left(defaultValue) : exports.right(a);
}; };
/**
 * Default value for the optional `onerror` argument of `tryCatch`
 * @function
 * @since 1.0.0
 */
exports.toError = function (e) {
    if (e instanceof Error) {
        return e;
    }
    else {
        return new Error(String(e));
    }
};
/**
 * Use {@link tryCatch2v}
 * @function
 * @since 1.0.0
 * @deprecated
 */
exports.tryCatch = function (f, onerror) {
    if (onerror === void 0) { onerror = exports.toError; }
    return exports.tryCatch2v(f, onerror);
};
/**
 * @function
 * @since 1.11.0
 */
exports.tryCatch2v = function (f, onerror) {
    try {
        return exports.right(f());
    }
    catch (e) {
        return exports.left(onerror(e));
    }
};
/**
 * @function
 * @since 1.0.0
 */
exports.fromValidation = function (fa) {
    return fa.isFailure() ? exports.left(fa.value) : exports.right(fa.value);
};
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isLeft = function (fa) {
    return fa.isLeft();
};
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isRight = function (fa) {
    return fa.isRight();
};
/**
 * Builds {@link Compactable} instance for {@link Either} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getCompactable(ML) {
    var compact = function (fa) {
        if (fa.isLeft()) {
            return fa;
        }
        if (fa.value.isNone()) {
            return exports.left(ML.empty);
        }
        return exports.right(fa.value.value);
    };
    var separate = function (fa) {
        if (fa.isLeft()) {
            return {
                left: fa,
                right: fa
            };
        }
        if (fa.value.isLeft()) {
            return {
                left: exports.right(fa.value.value),
                right: exports.left(ML.empty)
            };
        }
        return {
            left: exports.left(ML.empty),
            right: exports.right(fa.value.value)
        };
    };
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        compact: compact,
        separate: separate
    };
}
exports.getCompactable = getCompactable;
/**
 * Builds {@link Filterable} instance for {@link Either} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getFilterable(ML) {
    var C = getCompactable(ML);
    var partitionMap = function (fa, f) {
        if (fa.isLeft()) {
            return {
                left: fa,
                right: fa
            };
        }
        var e = f(fa.value);
        if (e.isLeft()) {
            return {
                left: exports.right(e.value),
                right: exports.left(ML.empty)
            };
        }
        return {
            left: exports.left(ML.empty),
            right: exports.right(e.value)
        };
    };
    var partition = function (fa, p) {
        if (fa.isLeft()) {
            return {
                left: fa,
                right: fa
            };
        }
        if (p(fa.value)) {
            return {
                left: exports.left(ML.empty),
                right: exports.right(fa.value)
            };
        }
        return {
            left: exports.right(fa.value),
            right: exports.left(ML.empty)
        };
    };
    var filterMap = function (fa, f) {
        if (fa.isLeft()) {
            return fa;
        }
        var optionB = f(fa.value);
        if (optionB.isSome()) {
            return exports.right(optionB.value);
        }
        return exports.left(ML.empty);
    };
    var filter = function (fa, p) { return fa.filterOrElse(p, ML.empty); };
    return __assign({}, C, { map: map,
        partitionMap: partitionMap,
        filterMap: filterMap,
        partition: partition,
        filter: filter });
}
exports.getFilterable = getFilterable;
/**
 * Builds {@link Witherable} instance for {@link Either} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getWitherable(ML) {
    var filterableEither = getFilterable(ML);
    var wither = function (F) {
        var traverseF = traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), filterableEither.compact); };
    };
    var wilt = function (F) {
        var traverseF = traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), filterableEither.separate); };
    };
    return __assign({}, filterableEither, { traverse: traverse,
        reduce: reduce,
        wither: wither,
        wilt: wilt });
}
exports.getWitherable = getWitherable;
/**
 * @instance
 * @since 1.0.0
 */
exports.either = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    bimap: bimap,
    alt: alt,
    extend: extend,
    chainRec: chainRec
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Applicative_1 = require("./Applicative");
var Either_1 = require("./Either");
function chain(F) {
    return function (f, fa) { return F.chain(fa, function (e) { return (e.isLeft() ? F.of(Either_1.left(e.value)) : f(e.value)); }); };
}
exports.chain = chain;
function right(F) {
    return function (ma) { return F.map(ma, function (a) { return Either_1.right(a); }); };
}
exports.right = right;
function left(F) {
    return function (ml) { return F.map(ml, function (l) { return Either_1.left(l); }); };
}
exports.left = left;
function fromEither(F) {
    return function (oa) { return F.of(oa); };
}
exports.fromEither = fromEither;
function fold(F) {
    return function (left, right, fa) { return F.map(fa, function (e) { return (e.isLeft() ? left(e.value) : right(e.value)); }); };
}
exports.fold = fold;
function mapLeft(F) {
    return function (f) { return function (fa) { return F.map(fa, function (e) { return e.mapLeft(f); }); }; };
}
exports.mapLeft = mapLeft;
function bimap(F) {
    return function (fa, f, g) { return F.map(fa, function (e) { return e.bimap(f, g); }); };
}
exports.bimap = bimap;
function getEitherT(M) {
    var applicativeComposition = Applicative_1.getApplicativeComposition(M, Either_1.either);
    return __assign({}, applicativeComposition, { chain: chain(M) });
}
exports.getEitherT = getEitherT;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
var IO_1 = require("./IO");
var Option_1 = require("./Option");
// Adapted from https://github.com/purescript/purescript-exceptions
/**
 * Create a JavaScript error, specifying a message
 * @function
 * @since 1.0.0
 */
exports.error = function (message) {
    return new Error(message);
};
/**
 * Get the error message from a JavaScript error
 * @function
 * @since 1.0.0
 */
exports.message = function (e) {
    return e.message;
};
/**
 * Get the stack trace from a JavaScript error
 * @function
 * @since 1.0.0
 */
exports.stack = function (e) {
    return typeof e.stack === 'string' ? Option_1.some(e.stack) : Option_1.none;
};
/**
 * Throw an exception
 * @function
 * @since 1.0.0
 */
exports.throwError = function (e) {
    return new IO_1.IO(function () {
        throw e;
    });
};
/**
 * Catch an exception by providing an exception handler
 * @function
 * @since 1.0.0
 */
exports.catchError = function (ma, handler) {
    return new IO_1.IO(function () {
        try {
            return ma.run();
        }
        catch (e) {
            if (e instanceof Error) {
                return handler(e).run();
            }
            else {
                return handler(new Error(e.toString())).run();
            }
        }
    });
};
/**
 * Runs an IO and returns eventual Exceptions as a `Left` value. If the computation succeeds the result gets wrapped in
 * a `Right`.
 * @function
 * @since 1.0.0
 */
exports.tryCatch = function (ma) {
    return exports.catchError(ma.map(function (a) { return Either_1.right(a); }), function (e) { return IO_1.io.of(Either_1.left(e)); });
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function duplicate(E) {
    return function (ma) { return E.extend(ma, function_1.identity); };
}
exports.duplicate = duplicate;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("fp-ts/lib/Task");
const fetch = require("node-fetch");
exports.fetchTaskEither = (url, init) => task.tryCatch(() => fetch.default(url, init), 
// We assert that we'll only ever receive an `Error` instance from `fetch`
(error) => error);
//# sourceMappingURL=fetch.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @instance
 * @since 1.0.0
 */
exports.fieldNumber = {
    add: function (x, y) { return x + y; },
    zero: 0,
    mul: function (x, y) { return x * y; },
    one: 1,
    sub: function (x, y) { return x - y; },
    degree: function (_) { return 1; },
    div: function (x, y) { return x / y; },
    mod: function (x, y) { return x % y; }
};
/**
 * The *greatest common divisor* of two values
 * @function
 * @since 1.0.0
 */
exports.gcd = function (S, field) {
    var zero = field.zero;
    var f = function (x, y) { return (S.equals(y, zero) ? x : f(y, field.mod(x, y))); };
    return f;
};
/**
 * The *least common multiple* of two values
 * @function
 * @since 1.0.0
 */
exports.lcm = function (S, F) {
    var zero = F.zero;
    var gcdSF = exports.gcd(S, F);
    return function (x, y) { return (S.equals(x, zero) || S.equals(y, zero) ? zero : F.div(F.mul(x, y), gcdSF(x, y))); };
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Compactable_1 = require("./Compactable");
var Option_1 = require("./Option");
function getFilterableComposition(F, G) {
    var FC = __assign({}, Compactable_1.getCompactableComposition(F, G), { partitionMap: function (fga, f) {
            var left = FC.filterMap(fga, function (a) { return f(a).fold(Option_1.some, function () { return Option_1.none; }); });
            var right = FC.filterMap(fga, function (a) { return f(a).fold(function () { return Option_1.none; }, Option_1.some); });
            return { left: left, right: right };
        }, partition: function (fga, p) {
            var left = FC.filter(fga, function (a) { return !p(a); });
            var right = FC.filter(fga, p);
            return { left: left, right: right };
        }, filterMap: function (fga, f) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }, filter: function (fga, f) { return F.map(fga, function (ga) { return G.filter(ga, f); }); } });
    return FC;
}
exports.getFilterableComposition = getFilterableComposition;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Apply_1 = require("./Apply");
var Monoid_1 = require("./Monoid");
var Option_1 = require("./Option");
var Ord_1 = require("./Ord");
function getFoldableComposition(F, G) {
    return {
        reduce: function (fga, b, f) { return F.reduce(fga, b, function (b, ga) { return G.reduce(ga, b, f); }); }
    };
}
exports.getFoldableComposition = getFoldableComposition;
function foldMap(F, M) {
    return function (fa, f) { return F.reduce(fa, M.empty, function (acc, x) { return M.concat(acc, f(x)); }); };
}
exports.foldMap = foldMap;
function foldr(F) {
    var toArrayF = toArray(F);
    return function (fa, b, f) { return toArrayF(fa).reduceRight(function (acc, a) { return f(a, acc); }, b); };
}
exports.foldr = foldr;
function fold(F, M) {
    return function (fa) { return F.reduce(fa, M.empty, M.concat); };
}
exports.fold = fold;
function foldM(F, M) {
    return function (f, b, fa) { return F.reduce(fa, M.of(b), function (mb, a) { return M.chain(mb, function (b) { return f(b, a); }); }); };
}
exports.foldM = foldM;
function traverse_(M, F) {
    var toArrayF = toArray(F);
    var applyFirstM = Apply_1.applyFirst(M);
    var initialValue = M.of(undefined);
    return function (f, fa) { return toArrayF(fa).reduce(function (mu, a) { return applyFirstM(mu, f(a)); }, initialValue); };
}
exports.traverse_ = traverse_;
function sequence_(M, F) {
    var traverse_MF = traverse_(M, F);
    return function (fa) { return traverse_MF(function (ma) { return ma; }, fa); };
}
exports.sequence_ = sequence_;
function oneOf(F, P) {
    return function (fga) { return F.reduce(fga, P.zero(), function (acc, a) { return P.alt(acc, a); }); };
}
exports.oneOf = oneOf;
function intercalate(F, M) {
    return function (sep) {
        function go(_a, x) {
            var init = _a.init, acc = _a.acc;
            return init ? { init: false, acc: x } : { init: false, acc: M.concat(M.concat(acc, sep), x) };
        }
        return function (fm) { return F.reduce(fm, { init: true, acc: M.empty }, go).acc; };
    };
}
exports.intercalate = intercalate;
function sum(F, S) {
    return function (fa) { return F.reduce(fa, S.zero, function (b, a) { return S.add(b, a); }); };
}
exports.sum = sum;
function product(F, S) {
    return function (fa) { return F.reduce(fa, S.one, function (b, a) { return S.mul(b, a); }); };
}
exports.product = product;
function elem(F, S) {
    return function (a, fa) { return F.reduce(fa, false, function (b, x) { return b || S.equals(x, a); }); };
}
exports.elem = elem;
function find(F) {
    return function (fa, p) {
        return F.reduce(fa, Option_1.none, function (b, a) {
            if (b.isNone() && p(a)) {
                return Option_1.some(a);
            }
            else {
                return b;
            }
        });
    };
}
exports.find = find;
function minimum(F, O) {
    var minO = Ord_1.min(O);
    return function (fa) { return F.reduce(fa, Option_1.none, function (b, a) { return (b.isNone() ? Option_1.some(a) : Option_1.some(minO(b.value, a))); }); };
}
exports.minimum = minimum;
function maximum(F, O) {
    var maxO = Ord_1.max(O);
    return function (fa) { return F.reduce(fa, Option_1.none, function (b, a) { return (b.isNone() ? Option_1.some(a) : Option_1.some(maxO(b.value, a))); }); };
}
exports.maximum = maximum;
function toArray(F) {
    var foldMapF = foldMap(F, Monoid_1.unsafeMonoidArray);
    return function (fa) { return foldMapF(fa, function (a) { return [a]; }); };
}
exports.toArray = toArray;
function traverse(M, F) {
    var traverseMF = traverse_(M, F);
    return function (fa, f) { return traverseMF(f, fa); };
}
exports.traverse = traverse;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Monoid_1 = require("./Monoid");
var Option_1 = require("./Option");
var Ord_1 = require("./Ord");
var function_1 = require("./function");
var Foldable_1 = require("./Foldable");
var Apply_1 = require("./Apply");
function getFoldableComposition(F, G) {
    return {
        reduce: function (fga, b, f) { return F.reduce(fga, b, function (b, ga) { return G.reduce(ga, b, f); }); },
        foldMap: function (M) {
            var foldMapF = F.foldMap(M);
            var foldMapG = G.foldMap(M);
            return function (fa, f) { return foldMapF(fa, function (ga) { return foldMapG(ga, f); }); };
        },
        foldr: function (fa, b, f) { return F.foldr(fa, b, function (ga, b) { return G.foldr(ga, b, f); }); }
    };
}
exports.getFoldableComposition = getFoldableComposition;
function fold(M, F) {
    return function (fa) { return F.reduce(fa, M.empty, M.concat); };
}
exports.fold = fold;
function foldM(M, F) {
    return function (fa, b, f) { return F.reduce(fa, M.of(b), function (mb, a) { return M.chain(mb, function (b) { return f(b, a); }); }); };
}
exports.foldM = foldM;
function sequence_(M, F) {
    var traverseMF = traverse_(M, F);
    return function (fa) { return traverseMF(fa, function_1.identity); };
}
exports.sequence_ = sequence_;
function oneOf(P, F) {
    return function (fga) { return F.reduce(fga, P.zero(), function (acc, a) { return P.alt(acc, a); }); };
}
exports.oneOf = oneOf;
function intercalate(M, F) {
    return function (sep, fm) {
        var go = function (_a, x) {
            var init = _a.init, acc = _a.acc;
            return init ? { init: false, acc: x } : { init: false, acc: M.concat(M.concat(acc, sep), x) };
        };
        return F.reduce(fm, { init: true, acc: M.empty }, go).acc;
    };
}
exports.intercalate = intercalate;
function sum(S, F) {
    return function (fa) { return F.reduce(fa, S.zero, function (b, a) { return S.add(b, a); }); };
}
exports.sum = sum;
function product(S, F) {
    return function (fa) { return F.reduce(fa, S.one, function (b, a) { return S.mul(b, a); }); };
}
exports.product = product;
function member(S, F) {
    return function (a, fa) { return F.reduce(fa, false, function (b, x) { return b || S.equals(x, a); }); };
}
exports.member = member;
function findFirst(F) {
    return function (fa, p) {
        return F.reduce(fa, Option_1.none, function (b, a) {
            if (b.isNone() && p(a)) {
                return Option_1.some(a);
            }
            else {
                return b;
            }
        });
    };
}
exports.findFirst = findFirst;
function min(O, F) {
    var minO = Ord_1.min(O);
    return function (fa) { return F.reduce(fa, Option_1.none, function (b, a) { return (b.isNone() ? Option_1.some(a) : Option_1.some(minO(b.value, a))); }); };
}
exports.min = min;
function max(O, F) {
    var maxO = Ord_1.max(O);
    return function (fa) { return F.reduce(fa, Option_1.none, function (b, a) { return (b.isNone() ? Option_1.some(a) : Option_1.some(maxO(b.value, a))); }); };
}
exports.max = max;
function toArray(F) {
    return function (fa) { return Foldable_1.foldMap(F, Monoid_1.unsafeMonoidArray)(fa, function (a) { return [a]; }); };
}
exports.toArray = toArray;
function traverse_(M, F) {
    var toArrayF = toArray(F);
    var applyFirstM = Apply_1.applyFirst(M);
    var initialValue = M.of(undefined);
    return function (fa, f) { return toArrayF(fa).reduce(function (mu, a) { return applyFirstM(mu, f(a)); }, initialValue); };
}
exports.traverse_ = traverse_;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Foldable2v_1 = require("./Foldable2v");
function getFoldableWithIndexComposition(F, G) {
    return __assign({}, Foldable2v_1.getFoldableComposition(F, G), { reduceWithIndex: function (fga, b, f) {
            return F.reduceWithIndex(fga, b, function (fi, b, ga) { return G.reduceWithIndex(ga, b, function (gi, b, a) { return f([fi, gi], b, a); }); });
        }, foldMapWithIndex: function (M) {
            var foldMapWithIndexF = F.foldMapWithIndex(M);
            var foldMapWithIndexG = G.foldMapWithIndex(M);
            return function (fga, f) { return foldMapWithIndexF(fga, function (fi, ga) { return foldMapWithIndexG(ga, function (gi, a) { return f([fi, gi], a); }); }); };
        }, foldrWithIndex: function (fga, b, f) {
            return F.foldrWithIndex(fga, b, function (fi, ga, b) { return G.foldrWithIndex(ga, b, function (gi, a, b) { return f([fi, gi], a, b); }); });
        } });
}
exports.getFoldableWithIndexComposition = getFoldableWithIndexComposition;
"use strict";
// adapted from http://okmij.org/ftp/Computation/free-monad.html
// and https://github.com/purescript/purescript-free
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Free';
var Pure = /** @class */ (function () {
    function Pure(value) {
        this.value = value;
        this._tag = 'Pure';
    }
    Pure.prototype.map = function (f) {
        return new Pure(f(this.value));
    };
    Pure.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <- derived
    };
    /**
     * Flipped version of {@link ap}
     */
    Pure.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Pure.prototype.chain = function (f) {
        return f(this.value);
    };
    Pure.prototype.inspect = function () {
        return this.toString();
    };
    Pure.prototype.toString = function () {
        return "new Pure(" + function_1.toString(this.value) + ")";
    };
    Pure.prototype.isPure = function () {
        return true;
    };
    Pure.prototype.isImpure = function () {
        return false;
    };
    return Pure;
}());
exports.Pure = Pure;
var Impure = /** @class */ (function () {
    function Impure(fx, f) {
        this.fx = fx;
        this.f = f;
        this._tag = 'Impure';
    }
    Impure.prototype.map = function (f) {
        var _this = this;
        return new Impure(this.fx, function (x) { return _this.f(x).map(f); });
    };
    Impure.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <- derived
    };
    Impure.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Impure.prototype.chain = function (f) {
        var _this = this;
        return new Impure(this.fx, function (x) { return _this.f(x).chain(f); });
    };
    Impure.prototype.inspect = function () {
        return this.toString();
    };
    Impure.prototype.toString = function () {
        return "new Impure(" + (function_1.toString(this.fx), function_1.toString(this.f)) + ")";
    };
    Impure.prototype.isPure = function () {
        return false;
    };
    Impure.prototype.isImpure = function () {
        return true;
    };
    return Impure;
}());
exports.Impure = Impure;
/**
 * @function
 * @since 1.0.0
 */
exports.of = function (a) {
    return new Pure(a);
};
/**
 * Lift an impure value described by the generating type constructor `F` into the free monad
 * @function
 * @since 1.0.0
 */
exports.liftF = function (fa) {
    return new Impure(fa, function (a) { return exports.of(a); });
};
var substFree = function (f) {
    function go(fa) {
        switch (fa._tag) {
            case 'Pure':
                return exports.of(fa.value);
            case 'Impure':
                return f(fa.fx).chain(function (x) { return go(fa.f(x)); });
        }
    }
    return go;
};
function hoistFree(nt) {
    return substFree(function (fa) { return exports.liftF(nt(fa)); });
}
exports.hoistFree = hoistFree;
function foldFree(M) {
    return function (nt, fa) {
        if (fa.isPure()) {
            return M.of(fa.value);
        }
        else {
            return M.chain(nt(fa.fx), function (x) { return foldFree(M)(nt, fa.f(x)); });
        }
    };
}
exports.foldFree = foldFree;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @function
 * @since 1.0.0
 */
exports.identity = function (a) {
    return a;
};
/**
 * @constant
 * @since 1.0.0
 */
exports.unsafeCoerce = exports.identity;
/**
 * @function
 * @since 1.0.0
 */
exports.not = function (predicate) {
    return function (a) { return !predicate(a); };
};
function or(p1, p2) {
    return function (a) { return p1(a) || p2(a); };
}
exports.or = or;
/**
 * @function
 * @since 1.0.0
 */
exports.and = function (p1, p2) {
    return function (a) { return p1(a) && p2(a); };
};
/**
 * @function
 * @since 1.0.0
 */
exports.constant = function (a) {
    return function () { return a; };
};
/**
 * A thunk that returns always `true`
 * @function
 * @since 1.0.0
 */
exports.constTrue = function () {
    return true;
};
/**
 * A thunk that returns always `false`
 * @function
 * @since 1.0.0
 */
exports.constFalse = function () {
    return false;
};
/**
 * A thunk that returns always `null`
 * @function
 * @since 1.0.0
 */
exports.constNull = function () {
    return null;
};
/**
 * A thunk that returns always `undefined`
 * @function
 * @since 1.0.0
 */
exports.constUndefined = function () {
    return;
};
/**
 * Flips the order of the arguments to a function of two arguments.
 * @function
 * @since 1.0.0
 */
exports.flip = function (f) {
    return function (b) { return function (a) { return f(a)(b); }; };
};
/**
 * The `on` function is used to change the domain of a binary operator.
 * @function
 * @since 1.0.0
 */
exports.on = function (op) { return function (f) {
    return function (x, y) { return op(f(x), f(y)); };
}; };
function compose() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    var len = fns.length - 1;
    return function (x) {
        var y = x;
        for (var i = len; i > -1; i--) {
            y = fns[i].call(this, y);
        }
        return y;
    };
}
exports.compose = compose;
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    var len = fns.length - 1;
    return function (x) {
        var y = x;
        for (var i = 0; i <= len; i++) {
            y = fns[i].call(this, y);
        }
        return y;
    };
}
exports.pipe = pipe;
/**
 * @function
 * @since 1.0.0
 */
exports.concat = function (x, y) {
    var lenx = x.length;
    var leny = y.length;
    var r = Array(lenx + leny);
    for (var i = 0; i < lenx; i++) {
        r[i] = x[i];
    }
    for (var i = 0; i < leny; i++) {
        r[i + lenx] = y[i];
    }
    return r;
};
function curried(f, n, acc) {
    return function (x) {
        var combined = exports.concat(acc, [x]);
        return n === 0 ? f.apply(this, combined) : curried(f, n - 1, combined);
    };
}
exports.curried = curried;
function curry(f) {
    return curried(f, f.length - 1, []);
}
exports.curry = curry;
/* tslint:disable-next-line */
var getFunctionName = function (f) { return f.displayName || f.name || "<function" + f.length + ">"; };
/**
 * @function
 * @since 1.0.0
 */
exports.toString = function (x) {
    if (typeof x === 'string') {
        return JSON.stringify(x);
    }
    if (x instanceof Date) {
        return "new Date('" + x.toISOString() + "')";
    }
    if (Array.isArray(x)) {
        return "[" + x.map(exports.toString).join(', ') + "]";
    }
    if (typeof x === 'function') {
        return getFunctionName(x);
    }
    if (x == null) {
        return String(x);
    }
    if (typeof x.toString === 'function' && x.toString !== Object.prototype.toString) {
        return x.toString();
    }
    try {
        return JSON.stringify(x, null, 2);
    }
    catch (e) {
        return String(x);
    }
};
/**
 * @function
 * @since 1.0.0
 */
exports.tuple = function (a, b) {
    return [a, b];
};
/**
 * @function
 * @since 1.0.0
 */
exports.tupleCurried = function (a) { return function (b) {
    return [a, b];
}; };
/**
 * Applies a function to an argument ($)
 * @function
 * @since 1.0.0
 */
exports.apply = function (f) { return function (a) {
    return f(a);
}; };
/**
 * Applies an argument to a function (#)
 * @function
 * @since 1.0.0
 */
exports.applyFlipped = function (a) { return function (f) {
    return f(a);
}; };
/** For use with phantom fields */
exports.phantom = undefined;
/**
 * A thunk that returns always the `identity` function.
 * For use with `applySecond` methods.
 * @function
 * @since 1.5.0
 */
exports.constIdentity = function () {
    return exports.identity;
};
/**
 * @function
 * @since 1.9.0
 */
exports.increment = function (n) {
    return n + 1;
};
/**
 * @function
 * @since 1.9.0
 */
exports.decrement = function (n) {
    return n - 1;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function lift(F) {
    return function (f) { return function (fa) { return F.map(fa, f); }; };
}
exports.lift = lift;
function voidRight(F) {
    return function (a, fb) { return F.map(fb, function_1.constant(a)); };
}
exports.voidRight = voidRight;
function voidLeft(F) {
    return function (fa, b) { return F.map(fa, function_1.constant(b)); };
}
exports.voidLeft = voidLeft;
function flap(functor) {
    return function (a, ff) { return functor.map(ff, function (f) { return f(a); }); };
}
exports.flap = flap;
function getFunctorComposition(F, G) {
    return {
        map: function (fa, f) { return F.map(fa, function (ga) { return G.map(ga, f); }); }
    };
}
exports.getFunctorComposition = getFunctorComposition;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Functor_1 = require("./Functor");
function getFunctorWithIndexComposition(F, G) {
    return __assign({}, Functor_1.getFunctorComposition(F, G), { mapWithIndex: function (fga, f) { return F.mapWithIndex(fga, function (fi, ga) { return G.mapWithIndex(ga, function (gi, a) { return f([fi, gi], a); }); }); } });
}
exports.getFunctorWithIndexComposition = getFunctorWithIndexComposition;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const either = require("fp-ts/lib/Either");
const option = require("fp-ts/lib/Option");
exports.createErrorResponse = (errorResponse) => either.left(errorResponse);
exports.typecheck = (a) => a;
// Defaults
exports.defaultOAuthOptions = {
    callback: option.none,
    verifier: option.none,
    token: option.none,
    tokenSecret: option.none,
};
exports.defaultStatusesHomeTimelineQuery = {
    count: option.none,
    max_id: option.none,
};
//# sourceMappingURL=helpers.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Type-level integrity check
/* tslint:disable */
null;
null;
null;
null;
/* tslint:enable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChainRec_1 = require("./ChainRec");
var function_1 = require("./function");
exports.URI = 'Identity';
/**
 * @data
 * @constructor Identity
 * @since 1.0.0
 */
var Identity = /** @class */ (function () {
    function Identity(value) {
        this.value = value;
    }
    Identity.prototype.map = function (f) {
        return new Identity(f(this.value));
    };
    Identity.prototype.ap = function (fab) {
        return this.map(fab.value);
    };
    /**
     * Flipped version of {@link ap}
     */
    Identity.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Identity.prototype.chain = function (f) {
        return f(this.value);
    };
    Identity.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    Identity.prototype.alt = function (fx) {
        return this;
    };
    /**
     * Lazy version of {@link alt}
     *
     * @example
     * import { Identity } from 'fp-ts/lib/Identity'
     *
     * const a = new Identity(1)
     * assert.deepEqual(a.orElse(() => new Identity(2)), a)
     *
     * @since 1.6.0
     */
    Identity.prototype.orElse = function (fx) {
        return this;
    };
    Identity.prototype.extract = function () {
        return this.value;
    };
    Identity.prototype.extend = function (f) {
        return of(f(this));
    };
    Identity.prototype.fold = function (f) {
        return f(this.value);
    };
    Identity.prototype.inspect = function () {
        return this.toString();
    };
    Identity.prototype.toString = function () {
        return "new Identity(" + function_1.toString(this.value) + ")";
    };
    return Identity;
}());
exports.Identity = Identity;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (setoid) {
    return {
        equals: function (x, y) { return setoid.equals(x.value, y.value); }
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Identity(a);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return f(fa.value);
}; };
var foldr = function (fa, b, f) {
    return f(fa.value, b);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var extend = function (ea, f) {
    return ea.extend(f);
};
var extract = function (fa) {
    return fa.value;
};
var chainRec = function (a, f) {
    return new Identity(ChainRec_1.tailRec(function (a) { return f(a).value; }, a));
};
var traverse = function (F) { return function (ta, f) {
    return F.map(f(ta.value), of);
}; };
var sequence = function (F) { return function (ta) {
    return F.map(ta.value, of);
}; };
/**
 * @instance
 * @since 1.0.0
 */
exports.identity = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    alt: alt,
    extract: extract,
    extend: extend,
    chainRec: chainRec
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var alt = require("./Alt");
exports.alt = alt;
var alternative = require("./Alternative");
exports.alternative = alternative;
var applicative = require("./Applicative");
exports.applicative = applicative;
var apply = require("./Apply");
exports.apply = apply;
var array = require("./Array");
exports.array = array;
var bifunctor = require("./Bifunctor");
exports.bifunctor = bifunctor;
var booleanAlgebra = require("./BooleanAlgebra");
exports.booleanAlgebra = booleanAlgebra;
var bounded = require("./Bounded");
exports.bounded = bounded;
var boundedDistributiveLattice = require("./BoundedDistributiveLattice");
exports.boundedDistributiveLattice = boundedDistributiveLattice;
var boundedJoinSemilattice = require("./BoundedJoinSemilattice");
exports.boundedJoinSemilattice = boundedJoinSemilattice;
var boundedLattice = require("./BoundedLattice");
exports.boundedLattice = boundedLattice;
var boundedMeetSemilattice = require("./BoundedMeetSemilattice");
exports.boundedMeetSemilattice = boundedMeetSemilattice;
var category = require("./Category");
exports.category = category;
var chain = require("./Chain");
exports.chain = chain;
var chainRec = require("./ChainRec");
exports.chainRec = chainRec;
var choice = require("./Choice");
exports.choice = choice;
var comonad = require("./Comonad");
exports.comonad = comonad;
var console = require("./Console");
exports.console = console;
var const_ = require("./Const");
exports.const = const_;
var contravariant = require("./Contravariant");
exports.contravariant = contravariant;
var date = require("./Date");
exports.date = date;
var distributiveLattice = require("./DistributiveLattice");
exports.distributiveLattice = distributiveLattice;
var either = require("./Either");
exports.either = either;
var eitherT = require("./EitherT");
exports.eitherT = eitherT;
var exception = require("./Exception");
exports.exception = exception;
var extend = require("./Extend");
exports.extend = extend;
var field = require("./Field");
exports.field = field;
var filterable = require("./Filterable");
exports.filterable = filterable;
var filterableWithIndex = require("./FilterableWithIndex");
exports.filterableWithIndex = filterableWithIndex;
var foldable = require("./Foldable");
exports.foldable = foldable;
var foldable2v = require("./Foldable2v");
exports.foldable2v = foldable2v;
var foldableWithIndex = require("./FoldableWithIndex");
exports.foldableWithIndex = foldableWithIndex;
var free = require("./Free");
exports.free = free;
var function_ = require("./function");
exports.function = function_;
var functor = require("./Functor");
exports.functor = functor;
var functorWithIndex = require("./FunctorWithIndex");
exports.functorWithIndex = functorWithIndex;
var heytingAlgebra = require("./HeytingAlgebra");
exports.heytingAlgebra = heytingAlgebra;
var hkt = require("./HKT");
exports.hkt = hkt;
var identity = require("./Identity");
exports.identity = identity;
var invariant = require("./Invariant");
exports.invariant = invariant;
var io = require("./IO");
exports.io = io;
var ioEither = require("./IOEither");
exports.ioEither = ioEither;
var ioRef = require("./IORef");
exports.ioRef = ioRef;
var ixIO = require("./IxIO");
exports.ixIO = ixIO;
var ixMonad = require("./IxMonad");
exports.ixMonad = ixMonad;
var joinSemilattice = require("./JoinSemilattice");
exports.joinSemilattice = joinSemilattice;
var lattice = require("./Lattice");
exports.lattice = lattice;
var meetSemilattice = require("./MeetSemilattice");
exports.meetSemilattice = meetSemilattice;
var monad = require("./Monad");
exports.monad = monad;
var monadIO = require("./MonadIO");
exports.monadIO = monadIO;
var monadTask = require("./MonadTask");
exports.monadTask = monadTask;
var monoid = require("./Monoid");
exports.monoid = monoid;
var monoidal = require("./Monoidal");
exports.monoidal = monoidal;
var nonEmptyArray = require("./NonEmptyArray");
exports.nonEmptyArray = nonEmptyArray;
var option = require("./Option");
exports.option = option;
var optionT = require("./OptionT");
exports.optionT = optionT;
var ord = require("./Ord");
exports.ord = ord;
var ordering = require("./Ordering");
exports.ordering = ordering;
var pair = require("./Pair");
exports.pair = pair;
var plus = require("./Plus");
exports.plus = plus;
var profunctor = require("./Profunctor");
exports.profunctor = profunctor;
var random = require("./Random");
exports.random = random;
var reader = require("./Reader");
exports.reader = reader;
var readerT = require("./ReaderT");
exports.readerT = readerT;
var readerTaskEither = require("./ReaderTaskEither");
exports.readerTaskEither = readerTaskEither;
var record = require("./Record");
exports.record = record;
var ring = require("./Ring");
exports.ring = ring;
var semigroup = require("./Semigroup");
exports.semigroup = semigroup;
var semigroupoid = require("./Semigroupoid");
exports.semigroupoid = semigroupoid;
var semiring = require("./Semiring");
exports.semiring = semiring;
var set = require("./Set");
exports.set = set;
var setoid = require("./Setoid");
exports.setoid = setoid;
var state = require("./State");
exports.state = state;
var stateT = require("./StateT");
exports.stateT = stateT;
var store = require("./Store");
exports.store = store;
var strmap = require("./StrMap");
exports.strmap = strmap;
var strong = require("./Strong");
exports.strong = strong;
var task = require("./Task");
exports.task = task;
var taskEither = require("./TaskEither");
exports.taskEither = taskEither;
var these = require("./These");
exports.these = these;
var trace = require("./Trace");
exports.trace = trace;
var traversable = require("./Traversable");
exports.traversable = traversable;
var traversable2v = require("./Traversable2v");
exports.traversable2v = traversable2v;
var traversableWithIndex = require("./TraversableWithIndex");
exports.traversableWithIndex = traversableWithIndex;
var tree = require("./Tree");
exports.tree = tree;
var tuple = require("./Tuple");
exports.tuple = tuple;
var unfoldable = require("./Unfoldable");
exports.unfoldable = unfoldable;
var validation = require("./Validation");
exports.validation = validation;
var writer = require("./Writer");
exports.writer = writer;
var compactable = require("./Compactable");
exports.compactable = compactable;
var witherable = require("./Witherable");
exports.witherable = witherable;
var zipper = require("./Zipper");
exports.zipper = zipper;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Decode = require("decode-ts/target");
const either = require("fp-ts/lib/Either");
const task = require("fp-ts/lib/Task");
const oauth_authorization_header_1 = require("oauth-authorization-header");
const querystring = require("querystring");
const qsLib = require("qs");
var Task = task.Task;
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const fetch_1 = require("./helpers/fetch");
const types_1 = require("./types");
exports.fetchFromTwitter = ({ oAuth, endpointPath, method, query }) => {
    const oAuthWithDefaults = Object.assign({}, helpers_1.defaultOAuthOptions, oAuth);
    const baseUrl = `${constants_1.TWITTER_API_BASE_URL}${endpointPath}`;
    // We must use `qs` and not `querystring` for stringifying because that's what
    // `oauth-authorization-header` uses, and the query string needs to be consistent. (`qs` differs
    // in many ways, including the way it stringifies `undefined`.)
    const queryString = qsLib.stringify(query);
    const paramsStr = Object.keys(query).length > 0 ? `?${queryString}` : '';
    const url = `${baseUrl}${paramsStr}`;
    const authorizationHeader = oauth_authorization_header_1.getOAuthAuthorizationHeader({
        oAuth: {
            consumerKey: oAuthWithDefaults.consumerKey,
            consumerSecret: oAuthWithDefaults.consumerSecret,
            callback: oAuthWithDefaults.callback.toUndefined(),
            token: oAuthWithDefaults.token.toUndefined(),
            tokenSecret: oAuthWithDefaults.tokenSecret.toUndefined(),
            verifier: oAuthWithDefaults.verifier.toUndefined(),
        },
        url,
        method,
        queryParams: query,
        formParams: {},
    });
    const headers = { Authorization: authorizationHeader };
    return fetch_1.fetchTaskEither(url, {
        method,
        headers,
    }).map(e => e.mapLeft(error => types_1.ErrorResponse.JavaScriptError({ error })));
};
const handleRequestTokenResponse = response => new Task(() => response.text()).map(text => {
    if (response.ok) {
        const parsed = querystring.parse(text);
        return Decode.validateType(types_1.TwitterAPIRequestTokenResponse)(parsed).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.getRequestToken = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.OAuthRequestToken,
    method: 'POST',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleRequestTokenResponse));
const handleAccessTokenResponse = response => new Task(() => response.text()).map(text => {
    if (response.ok) {
        const parsed = querystring.parse(text);
        return Decode.validateType(types_1.TwitterAPIAccessTokenResponse)(parsed).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.getAccessToken = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.OAuthAccessToken,
    method: 'POST',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleAccessTokenResponse));
// https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-home_timeline
const handleTimelineResponse = (response) => new Task(() => response.text()).map(text => {
    if (response.ok) {
        return Decode.jsonDecodeString(types_1.TwitterAPITimelineResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.fetchHomeTimeline = ({ oAuth, query }) => {
    const queryWithDefaults = Object.assign({}, helpers_1.defaultStatusesHomeTimelineQuery, query);
    return exports.fetchFromTwitter({
        oAuth,
        endpointPath: constants_1.ENDPOINTS.StatusesHomeTimeline,
        method: 'GET',
        query: types_1.StatusesHomeTimelineQuery.encode(queryWithDefaults),
    }).chain(e => e.fold(l => task.task.of(either.left(l)), handleTimelineResponse));
};
// https://developer.twitter.com/en/docs/accounts-and-users/manage-account-settings/api-reference/get-account-verify_credentials
const handleAccountVerifyCredentialsResponse = (response) => new Task(() => response.text()).map(text => {
    if (response.ok) {
        return Decode.jsonDecodeString(types_1.TwitterAPIAccountVerifyCredentials)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.fetchAccountVerifyCredentials = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.AccountVerifyCredentials,
    method: 'GET',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleAccountVerifyCredentialsResponse));
// https://developer.twitter.com/en/docs/accounts-and-users/manage-account-settings/api-reference/get-account-settings
const handleAccountSettingsResponse = (response) => new Task(() => response.text()).map(text => {
    if (response.ok) {
        return Decode.jsonDecodeString(types_1.TwitterAPIAccountSettings)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.fetchAccountSettings = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.AccountSettings,
    method: 'GET',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleAccountSettingsResponse));
//# sourceMappingURL=index.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'IO';
/**
 * `IO<A>` represents a synchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent a synchronous computation that may fail, please see {@link IOEither}.
 * @data
 * @constructor IO
 * @since 1.0.0
 */
var IO = /** @class */ (function () {
    function IO(run) {
        this.run = run;
    }
    IO.prototype.map = function (f) {
        var _this = this;
        return new IO(function () { return f(_this.run()); });
    };
    IO.prototype.ap = function (fab) {
        var _this = this;
        return new IO(function () { return fab.run()(_this.run()); });
    };
    /**
     * Flipped version of {@link ap}
     */
    IO.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     * @since 1.6.0
     */
    IO.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     * @since 1.5.0
     */
    IO.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    IO.prototype.chain = function (f) {
        var _this = this;
        return new IO(function () { return f(_this.run()).run(); });
    };
    IO.prototype.inspect = function () {
        return this.toString();
    };
    IO.prototype.toString = function () {
        return "new IO(" + function_1.toString(this.run) + ")";
    };
    return IO;
}());
exports.IO = IO;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new IO(function () { return a; });
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) {
            return new IO(function () {
                var xr = x.run();
                var yr = y.run();
                return S.concat(xr, yr);
            });
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (M) {
    return __assign({}, exports.getSemigroup(M), { empty: of(M.empty) });
};
var fromIO = function_1.identity;
/**
 * @instance
 * @since 1.0.0
 */
exports.io = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    fromIO: fromIO
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
var eitherT = require("./EitherT");
var IO_1 = require("./IO");
var function_1 = require("./function");
var eitherTIO = eitherT.getEitherT(IO_1.io);
exports.URI = 'IOEither';
var eitherTfold = eitherT.fold(IO_1.io);
var eitherTmapLeft = eitherT.mapLeft(IO_1.io);
var eitherTbimap = eitherT.bimap(IO_1.io);
/**
 * `IOEither<L, A>` represents a synchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `L`. If you want to represent a synchronous computation that never fails, please see {@link IO}.
 * @data
 * @constructor IOEither
 * @since 1.6.0
 */
var IOEither = /** @class */ (function () {
    function IOEither(value) {
        this.value = value;
    }
    /**
     * Runs the inner io
     */
    IOEither.prototype.run = function () {
        return this.value.run();
    };
    IOEither.prototype.map = function (f) {
        return new IOEither(eitherTIO.map(this.value, f));
    };
    IOEither.prototype.ap = function (fab) {
        return new IOEither(eitherTIO.ap(fab.value, this.value));
    };
    /**
     * Flipped version of {@link ap}
     */
    IOEither.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     */
    IOEither.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     */
    IOEither.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    IOEither.prototype.chain = function (f) {
        return new IOEither(eitherTIO.chain(function (a) { return f(a).value; }, this.value));
    };
    IOEither.prototype.fold = function (left, right) {
        return eitherTfold(left, right, this.value);
    };
    IOEither.prototype.mapLeft = function (f) {
        return new IOEither(eitherTmapLeft(f)(this.value));
    };
    IOEither.prototype.orElse = function (f) {
        return new IOEither(this.value.chain(function (e) { return e.fold(function (l) { return f(l).value; }, function (a) { return eitherTIO.of(a); }); }));
    };
    IOEither.prototype.alt = function (fy) {
        return this.orElse(function () { return fy; });
    };
    IOEither.prototype.bimap = function (f, g) {
        return new IOEither(eitherTbimap(this.value, f, g));
    };
    return IOEither;
}());
exports.IOEither = IOEither;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new IOEither(eitherTIO.of(a));
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var bimap = function (fa, f, g) {
    return fa.bimap(f, g);
};
var eitherTright = eitherT.right(IO_1.io);
/**
 * @function
 * @since 1.6.0
 */
exports.right = function (fa) {
    return new IOEither(eitherTright(fa));
};
var eitherTleft = eitherT.left(IO_1.io);
/**
 * @function
 * @since 1.6.0
 */
exports.left = function (fa) {
    return new IOEither(eitherTleft(fa));
};
var eitherTfromEither = eitherT.fromEither(IO_1.io);
/**
 * @function
 * @since 1.6.0
 */
exports.fromEither = function (fa) {
    return new IOEither(eitherTfromEither(fa));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromLeft = function (l) {
    return exports.fromEither(Either_1.left(l));
};
/**
 * Use {@link tryCatch2v}
 * @function
 * @since 1.6.0
 * @deprecated
 */
exports.tryCatch = function (f, onerror) {
    if (onerror === void 0) { onerror = Either_1.toError; }
    return exports.tryCatch2v(f, onerror);
};
/**
 * @function
 * @since 1.11.0
 */
exports.tryCatch2v = function (f, onerror) {
    return new IOEither(new IO_1.IO(function () { return Either_1.tryCatch2v(f, onerror); }));
};
/**
 * @instance
 * @since 1.6.0
 */
exports.ioEither = {
    URI: exports.URI,
    bimap: bimap,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    alt: alt
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
/**
 * Mutable references in the `IO` monad
 *
 * @example
 * import { newIORef } from 'fp-ts/lib/IORef'
 *
 * assert.strictEqual(
 *   newIORef(1)
 *     .chain(ref => ref.write(2).chain(() => ref.read))
 *     .run(),
 *   2
 * )
 *
 * @data
 * @constructor IORef
 * @since 1.8.0
 */
var IORef = /** @class */ (function () {
    function IORef(value) {
        var _this = this;
        this.value = value;
        this.read = new IO_1.IO(function () { return _this.value; });
    }
    /**
     * @since 1.8.0
     */
    IORef.prototype.write = function (a) {
        var _this = this;
        return new IO_1.IO(function () {
            _this.value = a;
        });
    };
    /**
     * @since 1.8.0
     */
    IORef.prototype.modify = function (f) {
        var _this = this;
        return new IO_1.IO(function () {
            _this.value = f(_this.value);
        });
    };
    return IORef;
}());
exports.IORef = IORef;
/**
 * @function
 * @since 1.8.0
 */
exports.newIORef = function (a) {
    return new IO_1.IO(function () { return new IORef(a); });
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("io-ts");
const option = require("fp-ts/lib/Option");
// https://github.com/gcanti/io-ts-types/blob/d3c51fbd92e4d214acfc45236fd02c4b900088ef/src/fp-ts/createOptionFromNullable.ts
// Difference: `T | undefined` instead of `T | null`
// https://github.com/gcanti/io-ts-types/issues/21
exports.createOptionFromNullable = (type) => {
    const Nullable = t.union([type, t.null, t.undefined]);
    return new t.Type(`Option<${type.name}>`, (m) => m instanceof option.None || (m instanceof option.Some && type.is(m.value)), (s, c) => Nullable.validate(s, c).chain(u => t.success(option.fromNullable(u))), a => a.map(type.encode).toUndefined());
};
//# sourceMappingURL=io-ts.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
var function_1 = require("./function");
exports.URI = 'IxIO';
/**
 * @data
 * @constructor IxIO
 * @since 1.0.0
 */
var IxIO = /** @class */ (function () {
    function IxIO(value) {
        this.value = value;
    }
    IxIO.prototype.run = function () {
        return this.value.run();
    };
    IxIO.prototype.ichain = function (f) {
        return new IxIO(this.value.chain(function (a) { return f(a).value; }));
    };
    IxIO.prototype.map = function (f) {
        return new IxIO(this.value.map(f));
    };
    IxIO.prototype.ap = function (fab) {
        return new IxIO(this.value.ap(fab.value));
    };
    IxIO.prototype.chain = function (f) {
        return new IxIO(this.value.chain(function (a) { return f(a).value; }));
    };
    return IxIO;
}());
exports.IxIO = IxIO;
/**
 * @function
 * @since 1.0.0
 */
exports.iof = function (a) {
    return new IxIO(IO_1.io.of(a));
};
var ichain = function (fa, f) {
    return fa.ichain(f);
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = exports.iof;
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function () {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        _U: function_1.phantom,
        map: map,
        of: of,
        ap: ap,
        chain: chain
    };
};
/**
 * @instance
 * @since 1.0.0
 */
exports.ixIO = {
    URI: exports.URI,
    iof: exports.iof,
    ichain: ichain
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function iapplyFirst(ixmonad) {
    return function (fa, fb) { return ixmonad.ichain(fa, function (a) { return ixmonad.ichain(fb, function () { return ixmonad.iof(a); }); }); };
}
exports.iapplyFirst = iapplyFirst;
function iapplySecond(ixmonad) {
    return function (fa, fb) { return ixmonad.ichain(fa, function_1.constant(fb)); };
}
exports.iapplySecond = iapplySecond;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Semigroup_1 = require("./Semigroup");
/**
 * @function
 * @since 1.0.0
 */
exports.fold = function (M) {
    return Semigroup_1.fold(M)(M.empty);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getProductMonoid = function (MA, MB) {
    return __assign({}, Semigroup_1.getProductSemigroup(MA, MB), { empty: [MA.empty, MB.empty] });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getDualMonoid = function (M) {
    return __assign({}, Semigroup_1.getDualSemigroup(M), { empty: M.empty });
};
/**
 * Boolean monoid under conjunction
 * @instance
 * @since 1.0.0
 */
exports.monoidAll = __assign({}, Semigroup_1.semigroupAll, { empty: true });
/**
 * Boolean monoid under disjunction
 * @instance
 * @since 1.0.0
 */
exports.monoidAny = __assign({}, Semigroup_1.semigroupAny, { empty: false });
var emptyArray = [];
/**
 * @instance
 * @since 1.0.0
 */
exports.unsafeMonoidArray = __assign({}, Semigroup_1.getArraySemigroup(), { empty: emptyArray });
/**
 * Monoid under array concatenation (`Array<any>`)
 * @function
 * @since 1.0.0
 */
exports.getArrayMonoid = function () {
    return exports.unsafeMonoidArray;
};
var emptyObject = {};
/**
 * Gets {@link Monoid} instance for dictionaries given {@link Semigroup} instance for their values
 *
 * @example
 * import { getDictionaryMonoid, fold } from 'fp-ts/lib/Monoid'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const M = getDictionaryMonoid(semigroupSum)
 * assert.deepEqual(fold(M)([{ foo: 123 }, { foo: 456 }]), { foo: 579 })
 *
 * @function
 * @since 1.4.0
 */
exports.getDictionaryMonoid = function (S) {
    return __assign({}, Semigroup_1.getDictionarySemigroup(S), { empty: emptyObject });
};
/**
 * Number monoid under addition
 * @instance
 * @since 1.0.0
 */
exports.monoidSum = __assign({}, Semigroup_1.semigroupSum, { empty: 0 });
/**
 * Number monoid under multiplication
 * @instance
 * @since 1.0.0
 */
exports.monoidProduct = __assign({}, Semigroup_1.semigroupProduct, { empty: 1 });
/**
 * @instance
 * @since 1.0.0
 */
exports.monoidString = __assign({}, Semigroup_1.semigroupString, { empty: '' });
/**
 * @instance
 * @since 1.0.0
 */
exports.monoidVoid = __assign({}, Semigroup_1.semigroupVoid, { empty: undefined });
/**
 * @function
 * @since 1.0.0
 */
exports.getFunctionMonoid = function (M) { return function () {
    return __assign({}, Semigroup_1.getFunctionSemigroup(M)(), { empty: function () { return M.empty; } });
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getEndomorphismMonoid = function () {
    return {
        concat: function_1.compose,
        empty: function_1.identity
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getRecordMonoid = function (monoids) {
    var empty = {};
    var keys = Object.keys(monoids);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        empty[key] = monoids[key].empty;
    }
    return __assign({}, Semigroup_1.getRecordSemigroup(monoids), { empty: empty });
};
/**
 * @function
 * @since 1.9.0
 */
exports.getMeetMonoid = function (B) {
    return __assign({}, Semigroup_1.getMeetSemigroup(B), { empty: B.top });
};
/**
 * @function
 * @since 1.9.0
 */
exports.getJoinMonoid = function (B) {
    return __assign({}, Semigroup_1.getJoinSemigroup(B), { empty: B.bottom });
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Apply_1 = require("./Apply");
var function_1 = require("./function");
function fromApplicative(applicative) {
    return {
        URI: applicative.URI,
        map: applicative.map,
        unit: function () { return applicative.of(undefined); },
        mult: function (fa, fb) { return Apply_1.liftA2(applicative)(function_1.tupleCurried)(fa)(fb); }
    };
}
exports.fromApplicative = fromApplicative;
function toApplicative(monoidal) {
    return {
        URI: monoidal.URI,
        map: monoidal.map,
        of: function (a) { return monoidal.map(monoidal.unit(), function_1.constant(a)); },
        ap: function (fab, fa) { return monoidal.map(monoidal.mult(fab, fa), function (_a) {
            var f = _a[0], a = _a[1];
            return f(a);
        }); }
    };
}
exports.toApplicative = toApplicative;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Array_1 = require("./Array");
var function_1 = require("./function");
var Option_1 = require("./Option");
var Semigroup_1 = require("./Semigroup");
exports.URI = 'NonEmptyArray';
/**
 * Data structure which represents non-empty arrays
 * @data
 * @constructor NonEmptyArray
 * @since 1.0.0
 */
var NonEmptyArray = /** @class */ (function () {
    function NonEmptyArray(head, tail) {
        this.head = head;
        this.tail = tail;
    }
    /**
     * Converts this {@link NonEmptyArray} to plain {@link Array}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).toArray(), [1, 2, 3])
     */
    NonEmptyArray.prototype.toArray = function () {
        return function_1.concat([this.head], this.tail);
    };
    /**
     * Concatenates this {@link NonEmptyArray} and passed {@link Array}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.deepEqual(new NonEmptyArray<number>(1, []).concatArray([2]), new NonEmptyArray(1, [2]))
     */
    NonEmptyArray.prototype.concatArray = function (as) {
        return new NonEmptyArray(this.head, function_1.concat(this.tail, as));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const double = (n: number): number => n * 2
     * assert.deepEqual(new NonEmptyArray(1, [2]).map(double), new NonEmptyArray(2, [4]))
     */
    NonEmptyArray.prototype.map = function (f) {
        return new NonEmptyArray(f(this.head), this.tail.map(f));
    };
    NonEmptyArray.prototype.mapWithIndex = function (f) {
        return new NonEmptyArray(f(0, this.head), Array_1.array.mapWithIndex(this.tail, function (i, a) { return f(i + 1, a); }));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray(1, [2])
     * const double = (n: number): number => n * 2
     * assert.deepEqual(x.ap(new NonEmptyArray(double, [double])).toArray(), [2, 4, 2, 4])
     */
    NonEmptyArray.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <= derived
    };
    /**
     * Flipped version of {@link ap}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray(1, [2])
     * const double = (n: number) => n * 2
     * assert.deepEqual(new NonEmptyArray(double, [double]).ap_(x).toArray(), [2, 4, 2, 4])
     */
    NonEmptyArray.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray(1, [2])
     * const f = (a: number) => new NonEmptyArray(a, [4])
     * assert.deepEqual(x.chain(f).toArray(), [1, 4, 2, 4])
     */
    NonEmptyArray.prototype.chain = function (f) {
        return f(this.head).concatArray(Array_1.array.chain(this.tail, function (a) { return f(a).toArray(); }));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray(1, [2])
     * const y = new NonEmptyArray(3, [4])
     * assert.deepEqual(x.concat(y).toArray(), [1, 2, 3, 4])
     */
    NonEmptyArray.prototype.concat = function (y) {
        return this.concatArray(y.toArray());
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray('a', ['b'])
     * assert.strictEqual(x.reduce('', (b, a) => b + a), 'ab')
     */
    NonEmptyArray.prototype.reduce = function (b, f) {
        return Array_1.array.reduce(this.toArray(), b, f);
    };
    /**
     * @since 1.12.0
     */
    NonEmptyArray.prototype.reduceWithIndex = function (b, f) {
        return Array_1.array.reduceWithIndex(this.toArray(), b, f);
    };
    /**
     * @since 1.12.0
     */
    NonEmptyArray.prototype.foldr = function (b, f) {
        return this.foldrWithIndex(b, function (_, a, b) { return f(a, b); });
    };
    /**
     * @since 1.12.0
     */
    NonEmptyArray.prototype.foldrWithIndex = function (b, f) {
        return f(0, this.head, this.tail.reduceRight(function (acc, a, i) { return f(i + 1, a, acc); }, b));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { fold, monoidSum } from 'fp-ts/lib/Monoid'
     *
     * const sum = (as: NonEmptyArray<number>) => fold(monoidSum)(as.toArray())
     * assert.deepEqual(new NonEmptyArray(1, [2, 3, 4]).extend(sum), new NonEmptyArray(10, [9, 7, 4]))
     */
    NonEmptyArray.prototype.extend = function (f) {
        return unsafeFromArray(Array_1.array.extend(this.toArray(), function (as) { return f(unsafeFromArray(as)); }));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.strictEqual(new NonEmptyArray(1, [2, 3]).extract(), 1)
     */
    NonEmptyArray.prototype.extract = function () {
        return this.head;
    };
    /**
     * Same as {@link toString}
     */
    NonEmptyArray.prototype.inspect = function () {
        return this.toString();
    };
    /**
     * Return stringified representation of this {@link NonEmptyArray}
     */
    NonEmptyArray.prototype.toString = function () {
        return "new NonEmptyArray(" + function_1.toString(this.head) + ", " + function_1.toString(this.tail) + ")";
    };
    /**
     * Gets minimum of this {@link NonEmptyArray} using specified {@link Ord} instance
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { ordNumber } from 'fp-ts/lib/Ord'
     *
     * assert.strictEqual(new NonEmptyArray(1, [2, 3]).min(ordNumber), 1)
     *
     * @since 1.3.0
     */
    NonEmptyArray.prototype.min = function (ord) {
        return Semigroup_1.fold(Semigroup_1.getMeetSemigroup(ord))(this.head)(this.tail);
    };
    /**
     * Gets maximum of this {@link NonEmptyArray} using specified {@link Ord} instance
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { ordNumber } from 'fp-ts/lib/Ord'
     *
     * assert.strictEqual(new NonEmptyArray(1, [2, 3]).max(ordNumber), 3)
     *
     * @since 1.3.0
     */
    NonEmptyArray.prototype.max = function (ord) {
        return Semigroup_1.fold(Semigroup_1.getJoinSemigroup(ord))(this.head)(this.tail);
    };
    /**
     * Gets last element of this {@link NonEmptyArray}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.strictEqual(new NonEmptyArray(1, [2, 3]).last(), 3)
     * assert.strictEqual(new NonEmptyArray(1, []).last(), 1)
     *
     * @since 1.6.0
     */
    NonEmptyArray.prototype.last = function () {
        return Array_1.last(this.tail).getOrElse(this.head);
    };
    /**
     * Sorts this {@link NonEmptyArray} using specified {@link Ord} instance
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { ordNumber } from 'fp-ts/lib/Ord'
     *
     * assert.deepEqual(new NonEmptyArray(3, [2, 1]).sort(ordNumber), new NonEmptyArray(1, [2, 3]))
     *
     * @since 1.6.0
     */
    NonEmptyArray.prototype.sort = function (ord) {
        return unsafeFromArray(Array_1.sort(ord)(this.toArray()));
    };
    /**
     * Reverts this {@link NonEmptyArray}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).reverse(), new NonEmptyArray(3, [2, 1]))
     *
     * @since 1.6.0
     */
    NonEmptyArray.prototype.reverse = function () {
        return unsafeFromArray(this.toArray().reverse());
    };
    /**
     * @since 1.10.0
     */
    NonEmptyArray.prototype.length = function () {
        return 1 + this.tail.length;
    };
    /**
     * This function provides a safe way to read a value at a particular index from an NonEmptyArray
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).index(1), some(2))
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).index(3), none)
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.index = function (i) {
        return i === 0 ? Option_1.some(this.head) : Array_1.index(i - 1, this.tail);
    };
    NonEmptyArray.prototype.findFirst = function (predicate) {
        return predicate(this.head) ? Option_1.some(this.head) : Array_1.findFirst(this.tail, predicate);
    };
    NonEmptyArray.prototype.findLast = function (predicate) {
        var a = Array_1.findLast(this.tail, predicate);
        return a.isSome() ? a : predicate(this.head) ? Option_1.some(this.head) : Option_1.none;
    };
    /**
     * Find the first index for which a predicate holds
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).findIndex(x => x === 2), some(1))
     * assert.deepEqual(new NonEmptyArray<number>(1, []).findIndex(x => x === 2), none)
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.findIndex = function (predicate) {
        if (predicate(this.head)) {
            return Option_1.some(0);
        }
        else {
            var i = Array_1.findIndex(this.tail, predicate);
            return i.isSome() ? Option_1.some(i.value + 1) : Option_1.none;
        }
    };
    /**
     * Returns the index of the last element of the list which matches the predicate
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * interface X {
     *   a: number
     *   b: number
     * }
     * const xs: NonEmptyArray<X> = new NonEmptyArray({ a: 1, b: 0 }, [{ a: 1, b: 1 }])
     * assert.deepEqual(xs.findLastIndex(x => x.a === 1), some(1))
     * assert.deepEqual(xs.findLastIndex(x => x.a === 4), none)
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.findLastIndex = function (predicate) {
        var i = Array_1.findLastIndex(this.tail, predicate);
        return i.isSome() ? Option_1.some(i.value + 1) : predicate(this.head) ? Option_1.some(0) : Option_1.none;
    };
    /**
     * Insert an element at the specified index, creating a new NonEmptyArray, or returning `None` if the index is out of bounds
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3, 4]).insertAt(2, 5), some(new NonEmptyArray(1, [2, 5, 3, 4])))
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.insertAt = function (i, a) {
        if (i === 0) {
            return Option_1.some(new NonEmptyArray(a, this.toArray()));
        }
        else {
            var t = Array_1.insertAt(i - 1, a, this.tail);
            return t.isSome() ? Option_1.some(new NonEmptyArray(this.head, t.value)) : Option_1.none;
        }
    };
    /**
     * Change the element at the specified index, creating a new NonEmptyArray, or returning `None` if the index is out of bounds
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).updateAt(1, 1), some(new NonEmptyArray(1, [1, 3])))
     * assert.deepEqual(new NonEmptyArray(1, []).updateAt(1, 1), none)
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.updateAt = function (i, a) {
        if (i === 0) {
            return Option_1.some(new NonEmptyArray(a, this.tail));
        }
        else {
            var t = Array_1.updateAt(i - 1, a, this.tail);
            return t.isSome() ? Option_1.some(new NonEmptyArray(this.head, t.value)) : Option_1.none;
        }
    };
    NonEmptyArray.prototype.filter = function (predicate) {
        return this.filterWithIndex(function (_, a) { return predicate(a); });
    };
    /**
     * @function
     * @since 1.12.0
     */
    NonEmptyArray.prototype.filterWithIndex = function (predicate) {
        var t = Array_1.array.filterWithIndex(this.tail, function (i, a) { return predicate(i + 1, a); });
        return predicate(0, this.head) ? Option_1.some(new NonEmptyArray(this.head, t)) : exports.fromArray(t);
    };
    return NonEmptyArray;
}());
exports.NonEmptyArray = NonEmptyArray;
var unsafeFromArray = function (as) {
    return new NonEmptyArray(as[0], as.slice(1));
};
/**
 * Builds {@link NonEmptyArray} from {@link Array} returning {@link Option#none} or {@link Option#some} depending on amount of values in passed array
 * @function
 * @since 1.0.0
 */
exports.fromArray = function (as) {
    return as.length > 0 ? Option_1.some(unsafeFromArray(as)) : Option_1.none;
};
var map = function (fa, f) {
    return fa.map(f);
};
var mapWithIndex = function (fa, f) {
    return fa.mapWithIndex(f);
};
var of = function (a) {
    return new NonEmptyArray(a, []);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var concat = function (fx, fy) {
    return fx.concat(fy);
};
/**
 * Builds {@link Semigroup} instance for {@link NonEmptyArray} of specified type arument
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function () {
    return { concat: concat };
};
/**
 * Group equal, consecutive elements of an array into non empty arrays.
 *
 * @example
 * import { NonEmptyArray, group } from 'fp-ts/lib/NonEmptyArray'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepEqual(group(ordNumber)([1, 2, 1, 1]), [
 *   new NonEmptyArray(1, []),
 *   new NonEmptyArray(2, []),
 *   new NonEmptyArray(1, [1])
 * ])
 *
 * @function
 * @since 1.7.0
 */
exports.group = function (S) { return function (as) {
    var r = [];
    var len = as.length;
    if (len === 0) {
        return r;
    }
    var head = as[0];
    var tail = [];
    for (var i = 1; i < len; i++) {
        var x = as[i];
        if (S.equals(x, head)) {
            tail.push(x);
        }
        else {
            r.push(new NonEmptyArray(head, tail));
            head = x;
            tail = [];
        }
    }
    r.push(new NonEmptyArray(head, tail));
    return r;
}; };
/**
 * Sort and then group the elements of an array into non empty arrays.
 *
 * @example
 * import { NonEmptyArray, groupSort } from 'fp-ts/lib/NonEmptyArray'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepEqual(groupSort(ordNumber)([1, 2, 1, 1]), [new NonEmptyArray(1, [1, 1]), new NonEmptyArray(2, [])])
 *
 * @function
 * @since 1.7.0
 */
exports.groupSort = function (O) {
    return function_1.compose(exports.group(O), Array_1.sort(O));
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.tail.reduce(function (acc, a) { return M.concat(acc, f(a)); }, f(fa.head));
}; };
var foldr = function (fa, b, f) {
    return fa.foldr(b, f);
};
var reduceWithIndex = function (fa, b, f) {
    return fa.reduceWithIndex(b, f);
};
var foldMapWithIndex = function (M) { return function (fa, f) {
    return fa.tail.reduce(function (acc, a, i) { return M.concat(acc, f(i + 1, a)); }, f(0, fa.head));
}; };
var foldrWithIndex = function (fa, b, f) {
    return fa.foldrWithIndex(b, f);
};
var extend = function (fa, f) {
    return fa.extend(f);
};
var extract = function (fa) {
    return fa.extract();
};
function traverse(F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
}
function sequence(F) {
    var sequenceF = Array_1.array.sequence(F);
    return function (ta) {
        return F.ap(F.map(ta.head, function (a) { return function (as) { return new NonEmptyArray(a, as); }; }), sequenceF(ta.tail));
    };
}
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { NonEmptyArray, groupBy } from 'fp-ts/lib/NonEmptyArray'
 *
 * assert.deepEqual(groupBy(['foo', 'bar', 'foobar'], a => String(a.length)), {
 *   '3': new NonEmptyArray('foo', ['bar']),
 *   '6': new NonEmptyArray('foobar', [])
 * })
 *
 * @function
 * @since 1.10.0
 */
exports.groupBy = function (as, f) {
    var r = {};
    for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
        var a = as_1[_i];
        var k = f(a);
        if (r.hasOwnProperty(k)) {
            r[k].tail.push(a);
        }
        else {
            r[k] = new NonEmptyArray(a, []);
        }
    }
    return r;
};
var traverseWithIndex = function (F) {
    var traverseWithIndexF = Array_1.array.traverseWithIndex(F);
    return function (ta, f) {
        var fb = f(0, ta.head);
        var fbs = traverseWithIndexF(ta.tail, function (i, a) { return f(i + 1, a); });
        return F.ap(F.map(fb, function (b) { return function (bs) { return new NonEmptyArray(b, bs); }; }), fbs);
    };
};
/**
 * @instance
 * @since 1.0.0
 */
exports.nonEmptyArray = {
    URI: exports.URI,
    extend: extend,
    extract: extract,
    map: map,
    mapWithIndex: mapWithIndex,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    reduceWithIndex: reduceWithIndex,
    foldMapWithIndex: foldMapWithIndex,
    foldrWithIndex: foldrWithIndex,
    traverseWithIndex: traverseWithIndex
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Monoid_1 = require("./Monoid");
exports.URI = 'Option';
var None = /** @class */ (function () {
    function None() {
        this._tag = 'None';
    }
    /**
     * Takes a function `f` and an `Option` of `A`. Maps `f` either on `None` or `Some`, Option's data constructors. If it
     * maps on `Some` then it will apply the `f` on `Some`'s value, if it maps on `None` it will return `None`.
     *
     * @example
     * import { some } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some(1).map(n => n * 2), some(2))
     */
    None.prototype.map = function (f) {
        return exports.none;
    };
    /**
     * Maps `f` over this `Option`'s value. If the value returned from `f` is null or undefined, returns `None`
     *
     * @example
     * import { none, some } from 'fp-ts/lib/Option'
     *
     * interface Foo {
     *   bar?: {
     *     baz?: string
     *   }
     * }
     *
     * assert.deepEqual(
     *   some<Foo>({ bar: { baz: 'quux' } })
     *     .mapNullable(foo => foo.bar)
     *     .mapNullable(bar => bar.baz),
     *   some('quux')
     * )
     * assert.deepEqual(
     *   some<Foo>({ bar: {} })
     *     .mapNullable(foo => foo.bar)
     *     .mapNullable(bar => bar.baz),
     *   none
     * )
     * assert.deepEqual(
     *   some<Foo>({})
     *     .mapNullable(foo => foo.bar)
     *     .mapNullable(bar => bar.baz),
     *   none
     * )
     */
    None.prototype.mapNullable = function (f) {
        return exports.none;
    };
    /**
     * `ap`, some may also call it "apply". Takes a function `fab` that is in the context of `Option`, and applies that
     * function to this `Option`'s value. If the `Option` calling `ap` is `none` it will return `none`.
     *
     * @example
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some(2).ap(some((x: number) => x + 1)), some(3))
     * assert.deepEqual(none.ap(some((x: number) => x + 1)), none)
     */
    None.prototype.ap = function (fab) {
        return exports.none;
    };
    /**
     * Flipped version of {@link ap}
     *
     * @example
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some((x: number) => x + 1).ap_(some(2)), some(3))
     * assert.deepEqual(none.ap_(some(2)), none)
     */
    None.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Returns the result of applying f to this `Option`'s value if this `Option` is nonempty. Returns `None` if this
     * `Option` is empty. Slightly different from `map` in that `f` is expected to return an `Option` (which could be
     * `None`)
     */
    None.prototype.chain = function (f) {
        return exports.none;
    };
    None.prototype.reduce = function (b, f) {
        return b;
    };
    /**
     * `alt` short for alternative, takes another `Option`. If this `Option` is a `Some` type then it will be returned, if
     * it is a `None` then it will return the next `Some` if it exist. If both are `None` then it will return `none`.
     *
     * @example
     * import { Option, some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some(2).alt(some(4)), some(2))
     * const fa: Option<number> = none
     * assert.deepEqual(fa.alt(some(4)), some(4))
     */
    None.prototype.alt = function (fa) {
        return fa;
    };
    /**
     * Lazy version of {@link alt}
     *
     * @example
     * import { some } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some(1).orElse(() => some(2)), some(1))
     *
     * @since 1.6.0
     */
    None.prototype.orElse = function (fa) {
        return fa();
    };
    None.prototype.extend = function (f) {
        return exports.none;
    };
    /**
     * Applies a function to each case in the data structure
     *
     * @example
     * import { none, some } from 'fp-ts/lib/Option'
     *
     * assert.strictEqual(some(1).fold('none', a => `some: ${a}`), 'some: 1')
     * assert.strictEqual(none.fold('none', a => `some: ${a}`), 'none')
     */
    None.prototype.fold = function (b, whenSome) {
        return b;
    };
    /** Lazy version of {@link fold} */
    None.prototype.foldL = function (whenNone, whenSome) {
        return whenNone();
    };
    /**
     * Returns the value from this `Some` or the given argument if this is a `None`
     *
     * @example
     * import { Option, none, some } from 'fp-ts/lib/Option'
     *
     * assert.strictEqual(some(1).getOrElse(0), 1)
     * const fa: Option<number> = none
     * assert.strictEqual(fa.getOrElse(0), 0)
     */
    None.prototype.getOrElse = function (a) {
        return a;
    };
    /** Lazy version of {@link getOrElse} */
    None.prototype.getOrElseL = function (f) {
        return f();
    };
    /** Returns the value from this `Some` or `null` if this is a `None` */
    None.prototype.toNullable = function () {
        return null;
    };
    /** Returns the value from this `Some` or `undefined` if this is a `None` */
    None.prototype.toUndefined = function () {
        return undefined;
    };
    None.prototype.inspect = function () {
        return this.toString();
    };
    None.prototype.toString = function () {
        return 'none';
    };
    /** Returns `true` if the option has an element that is equal (as determined by `S`) to `a`, `false` otherwise */
    None.prototype.contains = function (S, a) {
        return false;
    };
    /** Returns `true` if the option is `None`, `false` otherwise */
    None.prototype.isNone = function () {
        return true;
    };
    /** Returns `true` if the option is an instance of `Some`, `false` otherwise */
    None.prototype.isSome = function () {
        return false;
    };
    /**
     * Returns `true` if this option is non empty and the predicate `p` returns `true` when applied to this Option's value
     */
    None.prototype.exists = function (p) {
        return false;
    };
    None.prototype.filter = function (p) {
        return exports.none;
    };
    /**
     * Use {@link filter} instead.
     * Returns this option refined as `Option<B>` if it is non empty and the `refinement` returns `true` when applied to
     * this Option's value. Otherwise returns `None`
     * @since 1.3.0
     * @deprecated
     */
    None.prototype.refine = function (refinement) {
        return exports.none;
    };
    None.value = new None();
    return None;
}());
exports.None = None;
/**
 * @constant
 * @since 1.0.0
 */
exports.none = None.value;
var Some = /** @class */ (function () {
    function Some(value) {
        this.value = value;
        this._tag = 'Some';
    }
    Some.prototype.map = function (f) {
        return new Some(f(this.value));
    };
    Some.prototype.mapNullable = function (f) {
        return exports.fromNullable(f(this.value));
    };
    Some.prototype.ap = function (fab) {
        return fab.isNone() ? exports.none : new Some(fab.value(this.value));
    };
    Some.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Some.prototype.chain = function (f) {
        return f(this.value);
    };
    Some.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    Some.prototype.alt = function (fa) {
        return this;
    };
    Some.prototype.orElse = function (fa) {
        return this;
    };
    Some.prototype.extend = function (f) {
        return new Some(f(this));
    };
    Some.prototype.fold = function (b, whenSome) {
        return whenSome(this.value);
    };
    Some.prototype.foldL = function (whenNone, whenSome) {
        return whenSome(this.value);
    };
    Some.prototype.getOrElse = function (a) {
        return this.value;
    };
    Some.prototype.getOrElseL = function (f) {
        return this.value;
    };
    Some.prototype.toNullable = function () {
        return this.value;
    };
    Some.prototype.toUndefined = function () {
        return this.value;
    };
    Some.prototype.inspect = function () {
        return this.toString();
    };
    Some.prototype.toString = function () {
        return "some(" + function_1.toString(this.value) + ")";
    };
    Some.prototype.contains = function (S, a) {
        return S.equals(this.value, a);
    };
    Some.prototype.isNone = function () {
        return false;
    };
    Some.prototype.isSome = function () {
        return true;
    };
    Some.prototype.exists = function (p) {
        return p(this.value);
    };
    Some.prototype.filter = function (p) {
        return this.exists(p) ? this : exports.none;
    };
    Some.prototype.refine = function (refinement) {
        return this.filter(refinement);
    };
    return Some;
}());
exports.Some = Some;
/**
 *
 * @example
 * import { none, some, getSetoid } from 'fp-ts/lib/Option'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * const S = getSetoid(setoidNumber)
 * assert.strictEqual(S.equals(none, none), true)
 * assert.strictEqual(S.equals(none, some(1)), false)
 * assert.strictEqual(S.equals(some(1), none), false)
 * assert.strictEqual(S.equals(some(1), some(2)), false)
 * assert.strictEqual(S.equals(some(1), some(1)), true)
 *
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    return {
        equals: function (x, y) { return (x.isNone() ? y.isNone() : y.isNone() ? false : S.equals(x.value, y.value)); }
    };
};
/**
 * The `Ord` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 *
 * @example
 * import { none, some, getOrd } from 'fp-ts/lib/Option'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * const O = getOrd(ordNumber)
 * assert.strictEqual(O.compare(none, none), 0)
 * assert.strictEqual(O.compare(none, some(1)), -1)
 * assert.strictEqual(O.compare(some(1), none), 1)
 * assert.strictEqual(O.compare(some(1), some(2)), -1)
 * assert.strictEqual(O.compare(some(1), some(1)), 0)
 *
 * @function
 * @since 1.2.0
 */
exports.getOrd = function (O) {
    return __assign({}, exports.getSetoid(O), { compare: function (x, y) { return (x.isSome() ? (y.isSome() ? O.compare(x.value, y.value) : 1) : y.isSome() ? -1 : 0); } });
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Some(a);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.isNone() ? M.empty : f(fa.value);
}; };
var foldr = function (fa, b, f) {
    return fa.isNone() ? b : f(fa.value, b);
};
var traverse = function (F) { return function (ta, f) {
    return ta.isNone() ? F.of(exports.none) : F.map(f(ta.value), exports.some);
}; };
var sequence = function (F) { return function (ta) {
    return ta.isNone() ? F.of(exports.none) : F.map(ta.value, exports.some);
}; };
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var extend = function (ea, f) {
    return ea.extend(f);
};
var zero = function () {
    return exports.none;
};
/**
 * {@link Apply} semigroup
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | none               |
 * | none    | some(a) | none               |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getApplySemigroup, some, none } from 'fp-ts/lib/Option'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getApplySemigroup(semigroupSum)
 * assert.deepEqual(S.concat(none, none), none)
 * assert.deepEqual(S.concat(some(1), none), none)
 * assert.deepEqual(S.concat(none, some(1)), none)
 * assert.deepEqual(S.concat(some(1), some(2)), some(3))
 *
 * @function
 * @since 1.7.0
 */
exports.getApplySemigroup = function (S) {
    return {
        concat: function (x, y) { return (x.isSome() && y.isSome() ? exports.some(S.concat(x.value, y.value)) : exports.none); }
    };
};
/**
 * @function
 * @since 1.7.0
 */
exports.getApplyMonoid = function (M) {
    return __assign({}, exports.getApplySemigroup(M), { empty: exports.some(M.empty) });
};
/**
 * Monoid returning the left-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(a)      |
 *
 * @example
 * import { getFirstMonoid, some, none } from 'fp-ts/lib/Option'
 *
 * const M = getFirstMonoid<number>()
 * assert.deepEqual(M.concat(none, none), none)
 * assert.deepEqual(M.concat(some(1), none), some(1))
 * assert.deepEqual(M.concat(none, some(1)), some(1))
 * assert.deepEqual(M.concat(some(1), some(2)), some(1))
 *
 * @function
 * @since 1.0.0
 */
exports.getFirstMonoid = function () {
    return {
        concat: alt,
        empty: exports.none
    };
};
/**
 * Monoid returning the right-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(b)      |
 *
 * @example
 * import { getLastMonoid, some, none } from 'fp-ts/lib/Option'
 *
 * const M = getLastMonoid<number>()
 * assert.deepEqual(M.concat(none, none), none)
 * assert.deepEqual(M.concat(some(1), none), some(1))
 * assert.deepEqual(M.concat(none, some(1)), some(1))
 * assert.deepEqual(M.concat(some(1), some(2)), some(2))
 *
 * @function
 * @since 1.0.0
 */
exports.getLastMonoid = function () {
    return Monoid_1.getDualMonoid(exports.getFirstMonoid());
};
/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * appended using the provided `Semigroup`
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | some(a)            |
 * | none    | some(a) | some(a)            |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getMonoid, some, none } from 'fp-ts/lib/Option'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const M = getMonoid(semigroupSum)
 * assert.deepEqual(M.concat(none, none), none)
 * assert.deepEqual(M.concat(some(1), none), some(1))
 * assert.deepEqual(M.concat(none, some(1)), some(1))
 * assert.deepEqual(M.concat(some(1), some(2)), some(3))
 *
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (S) {
    return {
        concat: function (x, y) { return (x.isNone() ? y : y.isNone() ? x : exports.some(S.concat(x.value, y.value))); },
        empty: exports.none
    };
};
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(fromNullable(undefined), none)
 * assert.deepEqual(fromNullable(null), none)
 * assert.deepEqual(fromNullable(1), some(1))
 *
 * @function
 * @since 1.0.0
 */
exports.fromNullable = function (a) {
    return a == null ? exports.none : new Some(a);
};
/**
 * @function
 * @since 1.0.0
 * @alias of
 */
exports.some = of;
function fromPredicate(predicate) {
    return function (a) { return (predicate(a) ? exports.some(a) : exports.none); };
}
exports.fromPredicate = fromPredicate;
/**
 * Transforms an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in
 * `Some`
 *
 * @example
 * import { none, some, tryCatch } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(
 *   tryCatch(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepEqual(tryCatch(() => 1), some(1))
 *
 * @function
 * @since 1.0.0
 */
exports.tryCatch = function (f) {
    try {
        return exports.some(f());
    }
    catch (e) {
        return exports.none;
    }
};
/**
 * Constructs a new `Option` from a `Either`. If the value is a `Left`, returns `None`, otherwise returns the inner
 * value wrapped in a `Some`
 *
 * @example
 * import { none, some, fromEither } from 'fp-ts/lib/Option'
 * import { left, right } from 'fp-ts/lib/Either'
 *
 * assert.deepEqual(fromEither(left(1)), none)
 * assert.deepEqual(fromEither(right(1)), some(1))
 *
 * @function
 * @since 1.0.0
 */
exports.fromEither = function (fa) {
    return fa.isLeft() ? exports.none : exports.some(fa.value);
};
/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isSome = function (fa) {
    return fa.isSome();
};
/**
 * Returns `true` if the option is `None`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isNone = function (fa) {
    return fa.isNone();
};
/**
 * Use {@link fromPredicate} instead.
 * Refinement version of {@link fromPredicate}
 * @function
 * @since 1.3.0
 * @deprecated
 */
exports.fromRefinement = function (refinement) { return function (a) {
    return refinement(a) ? exports.some(a) : exports.none;
}; };
/**
 * Returns a refinement from a prism.
 * This function ensures that a custom type guard definition is type-safe.
 *
 * ```ts
 * import { some, none, getRefinement } from 'fp-ts/lib/Option'
 *
 * type A = { type: 'A' }
 * type B = { type: 'B' }
 * type C = A | B
 *
 * const isA = (c: C): c is A => c.type === 'B' // <= typo but typescript doesn't complain
 * const isA = getRefinement<C, A>(c => (c.type === 'B' ? some(c) : none)) // static error: Type '"B"' is not assignable to type '"A"'
 * ```
 *
 * @function
 * @since 1.7.0
 */
exports.getRefinement = function (getOption) {
    return function (a) { return getOption(a).isSome(); };
};
var compact = function (fa) { return fa.chain(function_1.identity); };
var separate = function (fa) {
    if (fa.isNone()) {
        return {
            left: exports.none,
            right: exports.none
        };
    }
    var e = fa.value;
    if (e.isLeft()) {
        return {
            left: exports.some(e.value),
            right: exports.none
        };
    }
    return {
        left: exports.none,
        right: exports.some(e.value)
    };
};
var filter = function (fa, p) { return fa.filter(p); };
var filterMap = chain;
var partitionMap = function (fa, f) {
    return separate(fa.map(f));
};
var partition = function (fa, p) { return ({
    left: fa.filter(function_1.not(p)),
    right: fa.filter(p)
}); };
var wither = function (F) { return function (fa, f) {
    return fa.isNone() ? F.of(fa) : f(fa.value);
}; };
var wilt = function (F) { return function (fa, f) {
    if (fa.isNone()) {
        return F.of({
            left: exports.none,
            right: exports.none
        });
    }
    return F.map(f(fa.value), function (e) {
        if (e.isLeft()) {
            return {
                left: exports.some(e.value),
                right: exports.none
            };
        }
        return {
            left: exports.none,
            right: exports.some(e.value)
        };
    });
}; };
/**
 * @instance
 * @since 1.0.0
 */
exports.option = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    zero: zero,
    alt: alt,
    extend: extend,
    compact: compact,
    separate: separate,
    filter: filter,
    filterMap: filterMap,
    partition: partition,
    partitionMap: partitionMap,
    wither: wither,
    wilt: wilt
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Applicative_1 = require("./Applicative");
var Option_1 = require("./Option");
function chain(F) {
    return function (f, fa) { return F.chain(fa, function (o) { return (o.isNone() ? F.of(Option_1.none) : f(o.value)); }); };
}
exports.chain = chain;
function some(F) {
    return function (a) { return F.of(Option_1.some(a)); };
}
exports.some = some;
function none(F) {
    return function () { return F.of(Option_1.none); };
}
exports.none = none;
function fromOption(F) {
    return function (oa) { return F.of(oa); };
}
exports.fromOption = fromOption;
function liftF(F) {
    return function (fa) { return F.map(fa, function (a) { return Option_1.some(a); }); };
}
exports.liftF = liftF;
function fold(F) {
    return function (r, some, fa) { return F.map(fa, function (o) { return (o.isNone() ? r : some(o.value)); }); };
}
exports.fold = fold;
function getOrElse(F) {
    return function (a) { return function (fa) { return F.map(fa, function (o) { return o.getOrElse(a); }); }; };
}
exports.getOrElse = getOrElse;
function getOptionT(M) {
    var applicativeComposition = Applicative_1.getApplicativeComposition(M, Option_1.option);
    return __assign({}, applicativeComposition, { chain: chain(M) });
}
exports.getOptionT = getOptionT;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ordering_1 = require("./Ordering");
var Setoid_1 = require("./Setoid");
var function_1 = require("./function");
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeCompare = function (x, y) {
    return x < y ? -1 : x > y ? 1 : 0;
};
/**
 * @instance
 * @since 1.0.0
 */
exports.ordString = __assign({}, Setoid_1.setoidString, { compare: exports.unsafeCompare });
/**
 * @instance
 * @since 1.0.0
 */
exports.ordNumber = __assign({}, Setoid_1.setoidNumber, { compare: exports.unsafeCompare });
/**
 * @instance
 * @since 1.0.0
 */
exports.ordBoolean = __assign({}, Setoid_1.setoidBoolean, { compare: exports.unsafeCompare });
/**
 * Test whether one value is _strictly less than_ another
 * @function
 * @since 1.0.0
 */
exports.lessThan = function (O) { return function (x, y) {
    return O.compare(x, y) === -1;
}; };
/**
 * Test whether one value is _strictly greater than_ another
 * @function
 * @since 1.0.0
 */
exports.greaterThan = function (O) { return function (x, y) {
    return O.compare(x, y) === 1;
}; };
/**
 * Test whether one value is _non-strictly less than_ another
 * @function
 * @since 1.0.0
 */
exports.lessThanOrEq = function (O) { return function (x, y) {
    return O.compare(x, y) !== 1;
}; };
/**
 * Test whether one value is _non-strictly greater than_ another
 * @function
 * @since 1.0.0
 */
exports.greaterThanOrEq = function (O) { return function (x, y) {
    return O.compare(x, y) !== -1;
}; };
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 * @function
 * @since 1.0.0
 */
exports.min = function (O) { return function (x, y) {
    return O.compare(x, y) === 1 ? y : x;
}; };
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 * @function
 * @since 1.0.0
 */
exports.max = function (O) { return function (x, y) {
    return O.compare(x, y) === -1 ? y : x;
}; };
/**
 * Clamp a value between a minimum and a maximum
 * @function
 * @since 1.0.0
 */
exports.clamp = function (O) {
    var minO = exports.min(O);
    var maxO = exports.max(O);
    return function (low, hi) { return function (x) { return maxO(minO(x, hi), low); }; };
};
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 * @function
 * @since 1.0.0
 */
exports.between = function (O) {
    var lessThanO = exports.lessThan(O);
    var greaterThanO = exports.greaterThan(O);
    return function (low, hi) { return function (x) { return (lessThanO(x, low) || greaterThanO(x, hi) ? false : true); }; };
};
/**
 * @function
 * @since 1.0.0
 */
exports.fromCompare = function (compare) {
    return {
        equals: function (x, y) { return compare(x, y) === 0; },
        compare: compare
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.contramap = function (f, fa) {
    return exports.fromCompare(function_1.on(fa.compare)(f));
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function () {
    return {
        concat: function (x, y) { return exports.fromCompare(function (a, b) { return Ordering_1.semigroupOrdering.concat(x.compare(a, b), y.compare(a, b)); }); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getProductOrd = function (OA, OB) {
    var S = Setoid_1.getProductSetoid(OA, OB);
    return __assign({}, S, { compare: function (_a, _b) {
            var xa = _a[0], xb = _a[1];
            var ya = _b[0], yb = _b[1];
            var r = OA.compare(xa, ya);
            return r === 0 ? OB.compare(xb, yb) : r;
        } });
};
/**
 * @function
 * @since 1.3.0
 */
exports.getDualOrd = function (O) {
    return exports.fromCompare(function (x, y) { return O.compare(y, x); });
};
/**
 * @instance
 * @since 1.4.0
 */
exports.ordDate = exports.contramap(function (date) { return date.valueOf(); }, exports.ordNumber);
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @function
 * @since 1.0.0
 */
exports.sign = function (n) {
    return n <= -1 ? -1 : n >= 1 ? 1 : 0;
};
/**
 * @instance
 * @since 1.0.0
 */
exports.setoidOrdering = {
    equals: function (x, y) { return x === y; }
};
/**
 * @instance
 * @since 1.0.0
 */
exports.semigroupOrdering = {
    concat: function (x, y) { return (x !== 0 ? x : y); }
};
/**
 * @function
 * @since 1.0.0
 */
exports.invert = function (O) {
    switch (O) {
        case -1:
            return 1;
        case 1:
            return -1;
        default:
            return 0;
    }
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ordering_1 = require("./Ordering");
exports.URI = 'Pair';
/**
 * @data
 * @constructor Pair
 * @since 1.0.0
 */
var Pair = /** @class */ (function () {
    function Pair(fst, snd) {
        this.fst = fst;
        this.snd = snd;
    }
    /** Map a function over the first field of a pair */
    Pair.prototype.first = function (f) {
        return new Pair(f(this.fst), this.snd);
    };
    /** Map a function over the second field of a pair */
    Pair.prototype.second = function (f) {
        return new Pair(this.fst, f(this.snd));
    };
    /** Swaps the elements in a pair */
    Pair.prototype.swap = function () {
        return new Pair(this.snd, this.fst);
    };
    Pair.prototype.map = function (f) {
        return new Pair(f(this.fst), f(this.snd));
    };
    Pair.prototype.ap = function (fab) {
        return new Pair(fab.fst(this.fst), fab.snd(this.snd));
    };
    /**
     * Flipped version of {@link ap}
     */
    Pair.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Pair.prototype.reduce = function (b, f) {
        return f(f(b, this.fst), this.snd);
    };
    Pair.prototype.extract = function () {
        return this.fst;
    };
    Pair.prototype.extend = function (f) {
        return new Pair(f(this), f(this.swap()));
    };
    return Pair;
}());
exports.Pair = Pair;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Pair(a, a);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return M.concat(f(fa.fst), f(fa.snd));
}; };
var foldr = function (fa, b, f) {
    return f(fa.fst, f(fa.snd, b));
};
var extract = function (fa) {
    return fa.extract();
};
var extend = function (fa, f) {
    return fa.extend(f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    return {
        equals: function (x, y) { return S.equals(x.fst, y.fst) && S.equals(x.snd, y.snd); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getOrd = function (O) {
    return __assign({}, exports.getSetoid(O), { compare: function (x, y) { return Ordering_1.semigroupOrdering.concat(O.compare(x.fst, y.fst), O.compare(x.snd, y.snd)); } });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) { return new Pair(S.concat(x.fst, y.fst), S.concat(x.snd, y.snd)); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (M) {
    return __assign({}, exports.getSemigroup(M), { empty: new Pair(M.empty, M.empty) });
};
var traverse = function (F) { return function (ta, f) {
    return F.ap(F.map(f(ta.fst), function (b1) { return function (b2) { return new Pair(b1, b2); }; }), f(ta.snd));
}; };
var sequence = function (F) { return function (ta) {
    return F.ap(F.map(ta.fst, function (a1) { return function (a2) { return new Pair(a1, a2); }; }), ta.snd);
}; };
/**
 * @instance
 * @since 1.0.0
 */
exports.pair = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    extend: extend,
    extract: extract
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function lmap(profunctor) {
    return function (fbc, f) { return profunctor.promap(fbc, f, function (c) { return c; }); };
}
exports.lmap = lmap;
function rmap(profunctor) {
    return function (fbc, g) { return profunctor.promap(fbc, function (b) { return b; }, g); };
}
exports.rmap = rmap;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
// Adapted from https://github.com/purescript/purescript-random
/**
 * Returns a random number between 0 (inclusive) and 1 (exclusive). This is a direct wrapper around JavaScript's
 * `Math.random()`.
 * @constant
 * @since 1.0.0
 */
exports.random = new IO_1.IO(function () { return Math.random(); });
/**
 * Takes a range specified by `low` (the first argument) and `high` (the second), and returns a random integer uniformly
 * distributed in the closed interval `[low, high]`. It is unspecified what happens if `low > high`, or if either of
 * `low` or `high` is not an integer.
 * @function
 * @since 1.0.0
 */
exports.randomInt = function (low, high) {
    return exports.random.map(function (n) { return Math.floor((high - low + 1) * n + low); });
};
/**
 * Returns a random number between a minimum value (inclusive) and a maximum value (exclusive). It is unspecified what
 * happens if `maximum < minimum`.
 * @function
 * @since 1.0.0
 */
exports.randomRange = function (min, max) {
    return exports.random.map(function (n) { return (max - min) * n + min; });
};
/**
 * Returns a random boolean value with an equal chance of being `true` or `false`
 * @constant
 * @since 1.0.0
 */
exports.randomBool = exports.random.map(function (n) { return n < 0.5; });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Either_1 = require("./Either");
exports.URI = 'Reader';
/**
 * @data
 * @constructor Reader
 * @since 1.0.0
 */
var Reader = /** @class */ (function () {
    function Reader(run) {
        this.run = run;
    }
    Reader.prototype.map = function (f) {
        var _this = this;
        return new Reader(function (e) { return f(_this.run(e)); });
    };
    Reader.prototype.ap = function (fab) {
        var _this = this;
        return new Reader(function (e) { return fab.run(e)(_this.run(e)); });
    };
    /**
     * Flipped version of {@link ap}
     */
    Reader.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Reader.prototype.chain = function (f) {
        var _this = this;
        return new Reader(function (e) { return f(_this.run(e)).run(e); });
    };
    /**
     * @since 1.6.1
     */
    Reader.prototype.local = function (f) {
        var _this = this;
        return new Reader(function (e) { return _this.run(f(e)); });
    };
    return Reader;
}());
exports.Reader = Reader;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Reader(function (e) { return a; });
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * reads the current context
 * @function
 * @since 1.0.0
 */
exports.ask = function () {
    return new Reader(function_1.identity);
};
/**
 * Projects a value from the global context in a Reader
 * @function
 * @since 1.0.0
 */
exports.asks = function (f) {
    return new Reader(f);
};
/**
 * changes the value of the local context during the execution of the action `fa`
 * @function
 * @since 1.0.0
 */
exports.local = function (f) { return function (fa) {
    return fa.local(f);
}; };
var promap = function (fbc, f, g) {
    return new Reader(function (a) { return g(fbc.run(f(a))); });
};
var compose = function (ab, la) {
    return new Reader(function (l) { return ab.run(la.run(l)); });
};
var id = function () {
    return new Reader(function_1.identity);
};
var first = function (pab) {
    return new Reader(function (_a) {
        var a = _a[0], c = _a[1];
        return function_1.tuple(pab.run(a), c);
    });
};
var second = function (pbc) {
    return new Reader(function (_a) {
        var a = _a[0], b = _a[1];
        return function_1.tuple(a, pbc.run(b));
    });
};
var left = function (pab) {
    return new Reader(function (e) { return e.fold(function (a) { return Either_1.left(pab.run(a)); }, Either_1.right); });
};
var right = function (pbc) {
    return new Reader(function (e) { return e.fold(Either_1.left, function (b) { return Either_1.right(pbc.run(b)); }); });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.reader = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    promap: promap,
    compose: compose,
    id: id,
    first: first,
    second: second,
    left: left,
    right: right
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function map(F) {
    return function (f, fa) { return function (e) { return F.map(fa(e), f); }; };
}
exports.map = map;
function of(F) {
    return function (a) { return function (e) { return F.of(a); }; };
}
exports.of = of;
function ap(F) {
    return function (fab, fa) { return function (e) { return F.ap(fab(e), fa(e)); }; };
}
exports.ap = ap;
function chain(F) {
    return function (f, fa) { return function (e) { return F.chain(fa(e), function (a) { return f(a)(e); }); }; };
}
exports.chain = chain;
function ask(F) {
    return function () { return F.of; };
}
exports.ask = ask;
function asks(F) {
    return function (f) { return function (e) { return F.of(f(e)); }; };
}
exports.asks = asks;
function fromReader(F) {
    return function (fa) { return function (e) { return F.of(fa.run(e)); }; };
}
exports.fromReader = fromReader;
function getReaderT(M) {
    return {
        map: map(M),
        of: of(M),
        ap: ap(M),
        chain: chain(M)
    };
}
exports.getReaderT = getReaderT;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Reader_1 = require("./Reader");
var readerT = require("./ReaderT");
var taskEither = require("./TaskEither");
var readerTTaskEither = readerT.getReaderT(taskEither.taskEither);
exports.URI = 'ReaderTaskEither';
/**
 * @data
 * @constructor ReaderTaskEither
 * @since 1.6.0
 */
var ReaderTaskEither = /** @class */ (function () {
    function ReaderTaskEither(value) {
        this.value = value;
    }
    /** Runs the inner `TaskEither` */
    ReaderTaskEither.prototype.run = function (e) {
        return this.value(e).run();
    };
    ReaderTaskEither.prototype.map = function (f) {
        return new ReaderTaskEither(readerTTaskEither.map(f, this.value));
    };
    ReaderTaskEither.prototype.ap = function (fab) {
        return new ReaderTaskEither(readerTTaskEither.ap(fab.value, this.value));
    };
    /**
     * Flipped version of {@link ap}
     */
    ReaderTaskEither.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     */
    ReaderTaskEither.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     */
    ReaderTaskEither.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    ReaderTaskEither.prototype.chain = function (f) {
        return new ReaderTaskEither(readerTTaskEither.chain(function (a) { return f(a).value; }, this.value));
    };
    ReaderTaskEither.prototype.fold = function (left, right) {
        var _this = this;
        return new Reader_1.Reader(function (e) { return _this.value(e).fold(left, right); });
    };
    ReaderTaskEither.prototype.mapLeft = function (f) {
        var _this = this;
        return new ReaderTaskEither(function (e) { return _this.value(e).mapLeft(f); });
    };
    /**
     * Transforms the failure value of the `ReaderTaskEither` into a new `ReaderTaskEither`
     */
    ReaderTaskEither.prototype.orElse = function (f) {
        var _this = this;
        return new ReaderTaskEither(function (e) { return _this.value(e).orElse(function (l) { return f(l).value(e); }); });
    };
    ReaderTaskEither.prototype.alt = function (fy) {
        return this.orElse(function () { return fy; });
    };
    ReaderTaskEither.prototype.bimap = function (f, g) {
        var _this = this;
        return new ReaderTaskEither(function (e) { return _this.value(e).bimap(f, g); });
    };
    /**
     * @since 1.6.1
     */
    ReaderTaskEither.prototype.local = function (f) {
        var _this = this;
        return new ReaderTaskEither(function (e) { return _this.value(f(e)); });
    };
    return ReaderTaskEither;
}());
exports.ReaderTaskEither = ReaderTaskEither;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new ReaderTaskEither(readerTTaskEither.of(a));
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var bimap = function (fa, f, g) {
    return fa.bimap(f, g);
};
var readerTask = readerT.ask(taskEither.taskEither);
/**
 * @function
 * @since 1.6.0
 */
exports.ask = function () {
    return new ReaderTaskEither(readerTask());
};
var readerTasks = readerT.asks(taskEither.taskEither);
/**
 * @function
 * @since 1.6.0
 */
exports.asks = function (f) {
    return new ReaderTaskEither(readerTasks(f));
};
/**
 * @function
 * @since 1.6.0
 */
exports.local = function (f) { return function (fa) {
    return fa.local(f);
}; };
/**
 * @function
 * @since 1.6.0
 */
exports.right = function (fa) {
    return new ReaderTaskEither(function () { return taskEither.right(fa); });
};
/**
 * @function
 * @since 1.6.0
 */
exports.left = function (fa) {
    return new ReaderTaskEither(function () { return taskEither.left(fa); });
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromTaskEither = function (fa) {
    return new ReaderTaskEither(function () { return fa; });
};
var readerTfromReader = readerT.fromReader(taskEither.taskEither);
/**
 * @function
 * @since 1.6.0
 */
exports.fromReader = function (fa) {
    return new ReaderTaskEither(readerTfromReader(fa));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromEither = function (fa) {
    return exports.fromTaskEither(taskEither.fromEither(fa));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromIO = function (fa) {
    return exports.fromTaskEither(taskEither.fromIO(fa));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromLeft = function (l) {
    return exports.fromTaskEither(taskEither.fromLeft(l));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromIOEither = function (fa) {
    return exports.fromTaskEither(taskEither.fromIOEither(fa));
};
function fromPredicate(predicate, whenFalse) {
    var f = taskEither.fromPredicate(predicate, whenFalse);
    return function (a) { return exports.fromTaskEither(f(a)); };
}
exports.fromPredicate = fromPredicate;
/**
 * @function
 * @since 1.6.0
 */
exports.tryCatch = function (f, onrejected) {
    return new ReaderTaskEither(function (e) { return taskEither.tryCatch(function () { return f(e); }, function (reason) { return onrejected(reason, e); }); });
};
var fromTask = exports.right;
/**
 * @instance
 * @since 1.6.0
 */
exports.readerTaskEither = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    alt: alt,
    bimap: bimap,
    fromIO: exports.fromIO,
    fromTask: fromTask
};
/**
 * Like {@link readerTaskEither} but `ap` is sequential
 * @instance
 * @since 1.10.0
 */
exports.readerTaskEitherSeq = __assign({}, exports.readerTaskEither, { ap: function (fab, fa) { return fab.chain(function (f) { return fa.map(f); }); } });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Monoid_1 = require("./Monoid");
var Option_1 = require("./Option");
/**
 * Calculate the number of key/value pairs in a dictionary
 * @function
 * @since 1.10.0
 */
exports.size = function (d) {
    return Object.keys(d).length;
};
/**
 * Test whether a dictionary is empty
 * @function
 * @since 1.10.0
 */
exports.isEmpty = function (d) {
    return Object.keys(d).length === 0;
};
/**
 * @function
 * @since 1.10.0
 */
exports.collect = function (d, f) {
    var out = [];
    var keys = Object.keys(d).sort();
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        out.push(f(key, d[key]));
    }
    return out;
};
/**
 * @function
 * @since 1.10.0
 */
exports.toArray = function (d) {
    return exports.collect(d, function (k, a) { return function_1.tuple(k, a); });
};
/**
 * Unfolds a dictionary into a list of key/value pairs
 * @function
 * @since 1.10.0
 */
exports.toUnfoldable = function (unfoldable) { return function (d) {
    var arr = exports.toArray(d);
    var len = arr.length;
    return unfoldable.unfoldr(0, function (b) { return (b < len ? Option_1.some(function_1.tuple(arr[b], b + 1)) : Option_1.none); });
}; };
/**
 * Insert or replace a key/value pair in a map
 * @function
 * @since 1.10.0
 */
exports.insert = function (k, a, d) {
    var r = Object.assign({}, d);
    r[k] = a;
    return r;
};
/**
 * Delete a key and value from a map
 * @function
 * @since 1.10.0
 */
exports.remove = function (k, d) {
    var r = Object.assign({}, d);
    delete r[k];
    return r;
};
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 * @function
 * @since 1.10.0
 */
exports.pop = function (k, d) {
    var a = exports.lookup(k, d);
    return a.isNone() ? Option_1.none : Option_1.some(function_1.tuple(a.value, exports.remove(k, d)));
};
/**
 * Test whether one dictionary contains all of the keys and values contained in another dictionary
 * @function
 * @since 1.10.0
 */
exports.isSubdictionary = function (S) { return function (d1, d2) {
    for (var k in d1) {
        if (!d2.hasOwnProperty(k) || !S.equals(d1[k], d2[k])) {
            return false;
        }
    }
    return true;
}; };
/**
 * @function
 * @since 1.10.0
 */
exports.getSetoid = function (S) {
    var isSubdictionaryS = exports.isSubdictionary(S);
    return {
        equals: function (x, y) { return isSubdictionaryS(x, y) && isSubdictionaryS(y, x); }
    };
};
/**
 * @function
 * @since 1.10.0
 */
exports.getMonoid = Monoid_1.getDictionaryMonoid;
/**
 * Lookup the value for a key in a dictionary
 * @since 1.10.0
 */
exports.lookup = function (key, fa) {
    return fa.hasOwnProperty(key) ? Option_1.some(fa[key]) : Option_1.none;
};
function filter(fa, p) {
    return exports.filterWithIndex(fa, function (_, a) { return p(a); });
}
exports.filter = filter;
function fromFoldable(F) {
    return function (ta, f) {
        return F.reduce(ta, {}, function (b, _a) {
            var k = _a[0], a = _a[1];
            b[k] = b.hasOwnProperty(k) ? f(b[k], a) : a;
            return b;
        });
    };
}
exports.fromFoldable = fromFoldable;
/**
 * @constant
 * @since 1.10.0
 */
exports.empty = {};
/**
 * @function
 * @since 1.10.0
 */
exports.mapWithKey = function (fa, f) {
    var r = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        r[key] = f(key, fa[key]);
    }
    return r;
};
/**
 * @function
 * @since 1.10.0
 */
exports.map = function (fa, f) {
    return exports.mapWithKey(fa, function (_, a) { return f(a); });
};
/**
 * @function
 * @since 1.10.0
 */
exports.reduce = function (fa, b, f) {
    return exports.reduceWithKey(fa, b, function (_, b, a) { return f(b, a); });
};
/**
 * @function
 * @since 1.10.0
 */
exports.foldMap = function (M) {
    var foldMapWithKeyM = exports.foldMapWithKey(M);
    return function (fa, f) { return foldMapWithKeyM(fa, function (_, a) { return f(a); }); };
};
/**
 * @function
 * @since 1.10.0
 */
exports.foldr = function (fa, b, f) {
    return exports.foldrWithKey(fa, b, function (_, a, b) { return f(a, b); });
};
/**
 * @function
 * @since 1.12.0
 */
exports.reduceWithKey = function (fa, b, f) {
    var out = b;
    var keys = Object.keys(fa).sort();
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        var k = keys[i];
        out = f(k, out, fa[k]);
    }
    return out;
};
/**
 * @function
 * @since 1.12.0
 */
exports.foldMapWithKey = function (M) { return function (fa, f) {
    var out = M.empty;
    var keys = Object.keys(fa).sort();
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        var k = keys[i];
        out = M.concat(out, f(k, fa[k]));
    }
    return out;
}; };
/**
 * @function
 * @since 1.12.0
 */
exports.foldrWithKey = function (fa, b, f) {
    var out = b;
    var keys = Object.keys(fa).sort();
    var len = keys.length;
    for (var i = len - 1; i >= 0; i--) {
        var k = keys[i];
        out = f(k, fa[k], out);
    }
    return out;
};
/**
 * Create a dictionary with one key/value pair
 * @function
 * @since 1.10.0
 */
exports.singleton = function (k, a) {
    var _a;
    return _a = {}, _a[k] = a, _a;
};
function traverseWithKey(F) {
    return function (ta, f) {
        var fr = F.of(exports.empty);
        var keys = Object.keys(ta);
        var _loop_1 = function (key) {
            fr = F.ap(F.map(fr, function (r) { return function (b) {
                var _a;
                return (__assign({}, r, (_a = {}, _a[key] = b, _a)));
            }; }), f(key, ta[key]));
        };
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
            var key = keys_3[_i];
            _loop_1(key);
        }
        return fr;
    };
}
exports.traverseWithKey = traverseWithKey;
function traverse(F) {
    var traverseWithKeyF = traverseWithKey(F);
    return function (ta, f) { return traverseWithKeyF(ta, function (_, a) { return f(a); }); };
}
exports.traverse = traverse;
function sequence(F) {
    var traverseWithKeyF = traverseWithKey(F);
    return function (ta) { return traverseWithKeyF(ta, function (_, a) { return a; }); };
}
exports.sequence = sequence;
/**
 * @function
 * @since 1.10.0
 */
exports.compact = function (fa) {
    var r = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
        var key = keys_4[_i];
        var optionA = fa[key];
        if (optionA.isSome()) {
            r[key] = optionA.value;
        }
    }
    return r;
};
/**
 * @function
 * @since 1.10.0
 */
exports.partitionMap = function (fa, f) {
    return exports.partitionMapWithIndex(fa, function (_, a) { return f(a); });
};
/**
 * @function
 * @since 1.10.0
 */
exports.partition = function (fa, p) {
    return exports.partitionWithIndex(fa, function (_, a) { return p(a); });
};
/**
 * @function
 * @since 1.10.0
 */
exports.separate = function (fa) {
    var left = {};
    var right = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_5 = keys; _i < keys_5.length; _i++) {
        var key = keys_5[_i];
        var e = fa[key];
        if (e.isLeft()) {
            left[key] = e.value;
        }
        else {
            right[key] = e.value;
        }
    }
    return {
        left: left,
        right: right
    };
};
function wither(F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), exports.compact); };
}
exports.wither = wither;
function wilt(F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), exports.separate); };
}
exports.wilt = wilt;
/**
 * @function
 * @since 1.10.0
 */
exports.filterMap = function (fa, f) {
    return exports.filterMapWithIndex(fa, function (_, a) { return f(a); });
};
/**
 * @function
 * @since 1.12.0
 */
exports.partitionMapWithIndex = function (fa, f) {
    var left = {};
    var right = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_6 = keys; _i < keys_6.length; _i++) {
        var key = keys_6[_i];
        var e = f(key, fa[key]);
        if (e.isLeft()) {
            left[key] = e.value;
        }
        else {
            right[key] = e.value;
        }
    }
    return {
        left: left,
        right: right
    };
};
/**
 * @function
 * @since 1.12.0
 */
exports.partitionWithIndex = function (fa, p) {
    var left = {};
    var right = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_7 = keys; _i < keys_7.length; _i++) {
        var key = keys_7[_i];
        var a = fa[key];
        if (p(key, a)) {
            right[key] = a;
        }
        else {
            left[key] = a;
        }
    }
    return {
        left: left,
        right: right
    };
};
/**
 * @function
 * @since 1.12.0
 */
exports.filterMapWithIndex = function (fa, f) {
    var r = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_8 = keys; _i < keys_8.length; _i++) {
        var key = keys_8[_i];
        var optionB = f(key, fa[key]);
        if (optionB.isSome()) {
            r[key] = optionB.value;
        }
    }
    return r;
};
/**
 * @function
 * @since 1.12.0
 */
exports.filterWithIndex = function (fa, p) {
    var r = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_9 = keys; _i < keys_9.length; _i++) {
        var key = keys_9[_i];
        var a = fa[key];
        if (p(key, a)) {
            r[key] = a;
        }
    }
    return r;
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Semiring_1 = require("./Semiring");
/**
 * @function
 * @since 1.0.0
 */
exports.getFunctionRing = function (ring) {
    return __assign({}, Semiring_1.getFunctionSemiring(ring), { sub: function (f, g) { return function (x) { return ring.sub(f(x), g(x)); }; } });
};
/**
 * `negate x` can be used as a shorthand for `zero - x`
 * @function
 * @since 1.0.0
 */
exports.negate = function (ring) { return function (a) {
    return ring.sub(ring.zero, a);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getProductRing = function (RA, RB) {
    return {
        add: function (_a, _b) {
            var a1 = _a[0], b1 = _a[1];
            var a2 = _b[0], b2 = _b[1];
            return [RA.add(a1, a2), RB.add(b1, b2)];
        },
        zero: [RA.zero, RB.zero],
        mul: function (_a, _b) {
            var a1 = _a[0], b1 = _a[1];
            var a2 = _b[0], b2 = _b[1];
            return [RA.mul(a1, a2), RB.mul(b1, b2)];
        },
        one: [RA.one, RB.one],
        sub: function (_a, _b) {
            var a1 = _a[0], b1 = _a[1];
            var a2 = _b[0], b2 = _b[1];
            return [RA.sub(a1, a2), RB.sub(b1, b2)];
        }
    };
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ord_1 = require("./Ord");
var function_1 = require("./function");
/**
 * @function
 * @since 1.0.0
 */
exports.fold = function (S) { return function (a) { return function (as) {
    return as.reduce(S.concat, a);
}; }; };
/**
 * @function
 * @since 1.0.0
 */
exports.getFirstSemigroup = function () {
    return { concat: function_1.identity };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getLastSemigroup = function () {
    return { concat: function (_, y) { return y; } };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getProductSemigroup = function (SA, SB) {
    return {
        concat: function (_a, _b) {
            var xa = _a[0], xb = _a[1];
            var ya = _b[0], yb = _b[1];
            return [SA.concat(xa, ya), SB.concat(xb, yb)];
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getDualSemigroup = function (S) {
    return {
        concat: function (x, y) { return S.concat(y, x); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getFunctionSemigroup = function (S) { return function () {
    return {
        concat: function (f, g) { return function (a) { return S.concat(f(a), g(a)); }; }
    };
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getRecordSemigroup = function (semigroups) {
    return {
        concat: function (x, y) {
            var r = {};
            var keys = Object.keys(semigroups);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                r[key] = semigroups[key].concat(x[key], y[key]);
            }
            return r;
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMeetSemigroup = function (O) {
    return {
        concat: Ord_1.min(O)
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getJoinSemigroup = function (O) {
    return {
        concat: Ord_1.max(O)
    };
};
/**
 * Boolean semigroup under conjunction
 * @instance
 * @since 1.0.0
 */
exports.semigroupAll = {
    concat: function (x, y) { return x && y; }
};
/**
 * Boolean semigroup under disjunction
 * @instance
 * @since 1.0.0
 */
exports.semigroupAny = {
    concat: function (x, y) { return x || y; }
};
/**
 * Semigroup under array concatenation
 * @function
 * @since 1.0.0
 */
exports.getArraySemigroup = function () {
    return {
        concat: function (x, y) { return function_1.concat(x, y); }
    };
};
/**
 * Gets {@link Semigroup} instance for dictionaries given {@link Semigroup} instance for their values
 *
 * @example
 * import { getDictionarySemigroup, semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getDictionarySemigroup(semigroupSum)
 * assert.deepEqual(S.concat({ foo: 123 }, { foo: 456 }), { foo: 579 })
 *
 * @function
 * @since 1.4.0
 */
exports.getDictionarySemigroup = function (S) {
    return {
        concat: function (x, y) {
            var r = __assign({}, x);
            var keys = Object.keys(y);
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                r[k] = x.hasOwnProperty(k) ? S.concat(x[k], y[k]) : y[k];
            }
            return r;
        }
    };
};
var semigroupAnyDictionary = exports.getDictionarySemigroup(exports.getLastSemigroup());
/**
 * Gets {@link Semigroup} instance for objects of given type preserving their type
 *
 * @example
 * import { getObjectSemigroup } from 'fp-ts/lib/Semigroup'
 *
 * const S = getObjectSemigroup<{ foo: number }>()
 * assert.deepEqual(S.concat({ foo: 123 }, { foo: 456 }), { foo: 456 })
 *
 * @function
 * @since 1.4.0
 */
exports.getObjectSemigroup = function () {
    return semigroupAnyDictionary;
};
/**
 * Number Semigroup under addition
 * @instance
 * @since 1.0.0
 */
exports.semigroupSum = {
    concat: function (x, y) { return x + y; }
};
/**
 * Number Semigroup under multiplication
 * @instance
 * @since 1.0.0
 */
exports.semigroupProduct = {
    concat: function (x, y) { return x * y; }
};
/**
 * @instance
 * @since 1.0.0
 */
exports.semigroupString = {
    concat: function (x, y) { return x + y; }
};
/**
 * @instance
 * @since 1.0.0
 */
exports.semigroupVoid = {
    concat: function () { return undefined; }
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
// adapted from https://github.com/purescript/purescript-prelude/blob/master/src/Data/Semiring.purs
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @function
 * @since 1.0.0
 */
exports.getFunctionSemiring = function (S) {
    return {
        add: function (f, g) { return function (x) { return S.add(f(x), g(x)); }; },
        zero: function () { return S.zero; },
        mul: function (f, g) { return function (x) { return S.mul(f(x), g(x)); }; },
        one: function () { return S.one; }
    };
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
/**
 * @function
 * @since 1.0.0
 */
exports.toArray = function (O) { return function (x) {
    var r = [];
    x.forEach(function (e) { return r.push(e); });
    return r.sort(O.compare);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    var subsetS = exports.subset(S);
    return {
        equals: function (x, y) { return subsetS(x, y) && subsetS(y, x); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.some = function (x, predicate) {
    var values = x.values();
    var e;
    var found = false;
    // tslint:disable:no-conditional-assignment
    while (!found && !(e = values.next()).done) {
        found = predicate(e.value);
    }
    return found;
};
/**
 * Projects a Set through a function
 * @function
 * @since 1.2.0
 */
exports.map = function (bset) { return function (x, f) {
    var r = new Set();
    var ismember = exports.member(bset)(r);
    x.forEach(function (e) {
        var v = f(e);
        if (!ismember(v)) {
            r.add(v);
        }
    });
    return r;
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.every = function (x, predicate) {
    return !exports.some(x, function_1.not(predicate));
};
/**
 * @function
 * @since 1.2.0
 */
exports.chain = function (bset) { return function (x, f) {
    var r = new Set();
    var rhas = exports.member(bset)(r);
    x.forEach(function (e) {
        f(e).forEach(function (e) {
            if (!rhas(e)) {
                r.add(e);
            }
        });
    });
    return r;
}; };
/**
 * `true` if and only if every element in the first set is an element of the second set
 * @function
 * @since 1.0.0
 */
exports.subset = function (S) { return function (x, y) {
    return exports.every(x, exports.member(S)(y));
}; };
function filter(x, predicate) {
    var values = x.values();
    var e;
    var r = new Set();
    // tslint:disable:no-conditional-assignment
    while (!(e = values.next()).done) {
        var value = e.value;
        if (predicate(value)) {
            r.add(value);
        }
    }
    return r;
}
exports.filter = filter;
function partition(x, predicate) {
    var values = x.values();
    var e;
    var right = new Set();
    var left = new Set();
    // tslint:disable:no-conditional-assignment
    while (!(e = values.next()).done) {
        var value = e.value;
        if (predicate(value)) {
            right.add(value);
        }
        else {
            left.add(value);
        }
    }
    return { left: left, right: right };
}
exports.partition = partition;
/**
 * Test if a value is a member of a set
 * @function
 * @since 1.0.0
 */
exports.member = function (S) { return function (x) { return function (a) {
    return exports.some(x, function (ax) { return S.equals(a, ax); });
}; }; };
/**
 * Form the union of two sets
 * @function
 * @since 1.0.0
 */
exports.union = function (S) {
    var memberS = exports.member(S);
    return function (x, y) {
        var xhas = memberS(x);
        var r = new Set(x);
        y.forEach(function (e) {
            if (!xhas(e)) {
                r.add(e);
            }
        });
        return r;
    };
};
/**
 * The set of elements which are in both the first and second set
 * @function
 * @since 1.0.0
 */
exports.intersection = function (S) {
    var memberS = exports.member(S);
    return function (x, y) {
        var yhas = memberS(y);
        var r = new Set();
        x.forEach(function (e) {
            if (yhas(e)) {
                r.add(e);
            }
        });
        return r;
    };
};
/**
 * @function
 * @since 1.2.0
 */
exports.partitionMap = function (SL, SR) { return function (x, f) {
    var values = x.values();
    var e;
    var left = new Set();
    var right = new Set();
    var isMemberL = exports.member(SL)(left);
    var isMemberR = exports.member(SR)(right);
    // tslint:disable:no-conditional-assignment
    while (!(e = values.next()).done) {
        var v = f(e.value);
        if (v.isLeft()) {
            if (!isMemberL(v.value)) {
                left.add(v.value);
            }
        }
        else {
            if (!isMemberR(v.value)) {
                right.add(v.value);
            }
        }
    }
    return { left: left, right: right };
}; };
/**
 * Use {@link difference2v} instead
 * @function
 * @since 1.0.0
 * @deprecated
 */
exports.difference = function (S) {
    var d = exports.difference2v(S);
    return function (x, y) { return d(y, x); };
};
/**
 * Form the set difference (`x` - `y`)
 *
 * @example
 * import { difference2v } from 'fp-ts/lib/Set'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(difference2v(setoidNumber)(new Set([1, 2]), new Set([1, 3])), new Set([2]))
 *
 * @function
 * @since 1.12.0
 */
exports.difference2v = function (S) {
    var has = exports.member(S);
    return function (x, y) { return filter(x, function_1.not(has(y))); };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getUnionMonoid = function (S) {
    return {
        concat: exports.union(S),
        empty: new Set()
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getIntersectionSemigroup = function (S) {
    return {
        concat: exports.intersection(S)
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.reduce = function (O) {
    var toArrayO = exports.toArray(O);
    return function (fa, b, f) { return toArrayO(fa).reduce(f, b); };
};
/**
 * Create a set with one element
 * @function
 * @since 1.0.0
 */
exports.singleton = function (a) {
    return new Set([a]);
};
/**
 * Insert a value into a set
 * @function
 * @since 1.0.0
 */
exports.insert = function (S) {
    var memberS = exports.member(S);
    return function (a, x) {
        if (!memberS(x)(a)) {
            var r = new Set(x);
            r.add(a);
            return r;
        }
        else {
            return x;
        }
    };
};
/**
 * Delete a value from a set
 * @function
 * @since 1.0.0
 */
exports.remove = function (S) { return function (a, x) {
    return filter(x, function (ax) { return !S.equals(a, ax); });
}; };
/**
 * Create a set from an array
 * @function
 * @since 1.2.0
 */
exports.fromArray = function (S) { return function (as) {
    var len = as.length;
    var r = new Set();
    var isMember = exports.member(S)(r);
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (!isMember(a)) {
            r.add(a);
        }
    }
    return r;
}; };
/**
 * @function
 * @since 1.12.0
 */
exports.compact = function (S) {
    var filterMapS = exports.filterMap(S);
    return function (fa) { return filterMapS(fa, function_1.identity); };
};
/**
 * @function
 * @since 1.12.0
 */
exports.separate = function (SL, SR) { return function (fa) {
    var memberSL = exports.member(SL);
    var memberSR = exports.member(SR);
    var left = new Set();
    var right = new Set();
    var isMemberL = memberSL(left);
    var isMemberR = memberSR(right);
    fa.forEach(function (e) {
        if (e.isLeft()) {
            if (!isMemberL(e.value)) {
                left.add(e.value);
            }
        }
        else {
            if (!isMemberR(e.value)) {
                right.add(e.value);
            }
        }
    });
    return { left: left, right: right };
}; };
/**
 * @function
 * @since 1.12.0
 */
exports.filterMap = function (S) {
    var memberS = exports.member(S);
    return function (fa, f) {
        var r = new Set();
        var isMember = memberS(r);
        fa.forEach(function (a) {
            var ob = f(a);
            if (ob.isSome() && !isMember(ob.value)) {
                r.add(ob.value);
            }
        });
        return r;
    };
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
/**
 * @function
 * @since 1.0.0
 */
exports.strictEqual = function (a, b) {
    return a === b;
};
var setoidStrict = { equals: exports.strictEqual };
/**
 * @instance
 * @since 1.0.0
 */
exports.setoidString = setoidStrict;
/**
 * @instance
 * @since 1.0.0
 */
exports.setoidNumber = setoidStrict;
/**
 * @instance
 * @since 1.0.0
 */
exports.setoidBoolean = setoidStrict;
/**
 * @function
 * @since 1.0.0
 */
exports.getArraySetoid = function (S) {
    return {
        equals: function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return S.equals(x, ys[i]); }); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getRecordSetoid = function (setoids) {
    return {
        equals: function (x, y) {
            for (var k in setoids) {
                if (!setoids[k].equals(x[k], y[k])) {
                    return false;
                }
            }
            return true;
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getProductSetoid = function (SA, SB) {
    return {
        equals: function (_a, _b) {
            var xa = _a[0], xb = _a[1];
            var ya = _b[0], yb = _b[1];
            return SA.equals(xa, ya) && SB.equals(xb, yb);
        }
    };
};
/**
 * Returns the `Setoid` corresponding to the partitions of `B` induced by `f`
 * @function
 * @since 1.2.0
 */
exports.contramap = function (f, fa) {
    return {
        equals: function_1.on(fa.equals)(f)
    };
};
/**
 * @instance
 * @since 1.4.0
 */
exports.setoidDate = exports.contramap(function (date) { return date.valueOf(); }, exports.setoidNumber);
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'State';
/**
 * @data
 * @constructor State
 * @since 1.0.0
 */
var State = /** @class */ (function () {
    function State(run) {
        this.run = run;
    }
    State.prototype.eval = function (s) {
        return this.run(s)[0];
    };
    State.prototype.exec = function (s) {
        return this.run(s)[1];
    };
    State.prototype.map = function (f) {
        var _this = this;
        return new State(function (s) {
            var _a = _this.run(s), a = _a[0], s1 = _a[1];
            return [f(a), s1];
        });
    };
    State.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <= derived
    };
    /**
     * Flipped version of {@link ap}
     */
    State.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     * @since 1.7.0
     */
    State.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     * @since 1.7.0
     */
    State.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    State.prototype.chain = function (f) {
        var _this = this;
        return new State(function (s) {
            var _a = _this.run(s), a = _a[0], s1 = _a[1];
            return f(a).run(s1);
        });
    };
    return State;
}());
exports.State = State;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new State(function (s) { return [a, s]; });
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * Get the current state
 * @function
 * @since 1.0.0
 */
exports.get = function () {
    return new State(function (s) { return [s, s]; });
};
/**
 * Set the state
 * @function
 * @since 1.0.0
 */
exports.put = function (s) {
    return new State(function () { return [undefined, s]; });
};
/**
 * Modify the state by applying a function to the current state
 * @function
 * @since 1.0.0
 */
exports.modify = function (f) {
    return new State(function (s) { return [undefined, f(s)]; });
};
/**
 * Get a value which depends on the current state
 * @function
 * @since 1.0.0
 */
exports.gets = function (f) {
    return new State(function (s) { return [f(s), s]; });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.state = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function map(F) {
    return function (f, fa) { return function (s) { return F.map(fa(s), function (_a) {
        var a = _a[0], s1 = _a[1];
        return function_1.tuple(f(a), s1);
    }); }; };
}
exports.map = map;
function of(F) {
    return function (a) { return function (s) { return F.of(function_1.tuple(a, s)); }; };
}
exports.of = of;
function ap(F) {
    var mapF = map(F);
    var chainF = chain(F);
    return function (fab, fa) { return chainF(function (f) { return mapF(f, fa); }, fab); }; // <- derived
}
exports.ap = ap;
function chain(F) {
    return function (f, fa) { return function (s) { return F.chain(fa(s), function (_a) {
        var a = _a[0], s1 = _a[1];
        return f(a)(s1);
    }); }; };
}
exports.chain = chain;
function get(F) {
    return function () { return function (s) { return F.of(function_1.tuple(s, s)); }; };
}
exports.get = get;
function put(F) {
    return function (s) { return function () { return F.of(function_1.tuple(undefined, s)); }; };
}
exports.put = put;
function modify(F) {
    return function (f) { return function (s) { return F.of(function_1.tuple(undefined, f(s))); }; };
}
exports.modify = modify;
function gets(F) {
    return function (f) { return function (s) { return F.of(function_1.tuple(f(s), s)); }; };
}
exports.gets = gets;
function fromState(F) {
    return function (fa) { return function (s) { return F.of(fa.run(s)); }; };
}
exports.fromState = fromState;
function liftF(F) {
    return function (fa) { return function (s) { return F.map(fa, function (a) { return function_1.tuple(a, s); }); }; };
}
exports.liftF = liftF;
function getStateT(M) {
    return {
        map: map(M),
        of: of(M),
        ap: ap(M),
        chain: chain(M)
    };
}
exports.getStateT = getStateT;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Store';
/**
 * @data
 * @constructor Store
 * @since 1.0.0
 */
var Store = /** @class */ (function () {
    function Store(peek, pos) {
        this.peek = peek;
        this.pos = pos;
    }
    /** Reposition the focus at the specified position */
    Store.prototype.seek = function (s) {
        return new Store(this.peek, s);
    };
    Store.prototype.map = function (f) {
        var _this = this;
        return new Store(function (s) { return f(_this.peek(s)); }, this.pos);
    };
    Store.prototype.extract = function () {
        return this.peek(this.pos);
    };
    Store.prototype.extend = function (f) {
        var _this = this;
        return new Store(function (s) { return f(_this.seek(s)); }, this.pos);
    };
    Store.prototype.inspect = function () {
        return this.toString();
    };
    Store.prototype.toString = function () {
        return "new Store(" + function_1.toString(this.peek) + ", " + function_1.toString(this.pos) + ")";
    };
    return Store;
}());
exports.Store = Store;
var map = function (sa, f) {
    return sa.map(f);
};
var extract = function (sa) {
    return sa.extract();
};
var extend = function (sa, f) {
    return sa.extend(f);
};
/**
 * Extract a value from a position which depends on the current position
 * @function
 * @since 1.0.0
 */
exports.peeks = function (f) { return function (sa) { return function (s) {
    return sa.peek(f(sa.pos));
}; }; };
/**
 * Reposition the focus at the specified position, which depends on the current position
 * @function
 * @since 1.0.0
 */
exports.seeks = function (f) { return function (sa) {
    return new Store(sa.peek, f(sa.pos));
}; };
function experiment(F) {
    return function (f) { return function (sa) { return F.map(f(sa.pos), function (s) { return sa.peek(s); }); }; };
}
exports.experiment = experiment;
/**
 * @instance
 * @since 1.0.0
 */
exports.store = {
    URI: exports.URI,
    map: map,
    extract: extract,
    extend: extend
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var R = require("./Record");
var Semigroup_1 = require("./Semigroup");
exports.URI = 'StrMap';
var liftSeparated = function (_a) {
    var left = _a.left, right = _a.right;
    return {
        left: new StrMap(left),
        right: new StrMap(right)
    };
};
/**
 * @data
 * @constructor StrMap
 * @since 1.0.0
 */
var StrMap = /** @class */ (function () {
    function StrMap(value) {
        this.value = value;
    }
    StrMap.prototype.mapWithKey = function (f) {
        return new StrMap(R.mapWithKey(this.value, f));
    };
    StrMap.prototype.map = function (f) {
        return this.mapWithKey(function (_, a) { return f(a); });
    };
    StrMap.prototype.reduce = function (b, f) {
        return R.reduce(this.value, b, f);
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.foldr = function (b, f) {
        return R.foldr(this.value, b, f);
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.reduceWithKey = function (b, f) {
        return R.reduceWithKey(this.value, b, f);
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.foldrWithKey = function (b, f) {
        return R.foldrWithKey(this.value, b, f);
    };
    StrMap.prototype.filter = function (p) {
        return this.filterWithIndex(function (_, a) { return p(a); });
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.filterMap = function (f) {
        return this.filterMapWithIndex(function (_, a) { return f(a); });
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.partition = function (p) {
        return this.partitionWithIndex(function (_, a) { return p(a); });
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.partitionMap = function (f) {
        return this.partitionMapWithIndex(function (_, a) { return f(a); });
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.separate = function () {
        return liftSeparated(R.separate(this.value));
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.partitionMapWithIndex = function (f) {
        return liftSeparated(R.partitionMapWithIndex(this.value, f));
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.partitionWithIndex = function (p) {
        return liftSeparated(R.partitionWithIndex(this.value, p));
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.filterMapWithIndex = function (f) {
        return new StrMap(R.filterMapWithIndex(this.value, f));
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.filterWithIndex = function (p) {
        return new StrMap(R.filterWithIndex(this.value, p));
    };
    return StrMap;
}());
exports.StrMap = StrMap;
/**
 * @constant
 * @since 1.10.0
 */
var empty = new StrMap(R.empty);
var concat = function (S) {
    var concat = Semigroup_1.getDictionarySemigroup(S).concat;
    return function (x, y) { return new StrMap(concat(x.value, y.value)); };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (S) {
    if (S === void 0) { S = Semigroup_1.getLastSemigroup(); }
    return {
        concat: concat(S),
        empty: empty
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) {
    var foldMapM = R.foldMap(M);
    return function (fa, f) { return foldMapM(fa.value, f); };
};
var foldr = function (fa, b, f) {
    return fa.foldr(b, f);
};
var reduceWithIndex = function (fa, b, f) {
    return fa.reduceWithKey(b, f);
};
var foldMapWithIndex = function (M) {
    var foldMapWithKey = R.foldMapWithKey(M);
    return function (fa, f) { return foldMapWithKey(fa.value, f); };
};
var foldrWithIndex = function (fa, b, f) {
    return fa.foldrWithKey(b, f);
};
function traverseWithKey(F) {
    var traverseWithKeyF = R.traverseWithKey(F);
    return function (ta, f) { return F.map(traverseWithKeyF(ta.value, f), function (d) { return new StrMap(d); }); };
}
exports.traverseWithKey = traverseWithKey;
function traverse(F) {
    var traverseWithKeyF = traverseWithKey(F);
    return function (ta, f) { return traverseWithKeyF(ta, function (_, a) { return f(a); }); };
}
function sequence(F) {
    var traverseWithKeyF = traverseWithKey(F);
    return function (ta) { return traverseWithKeyF(ta, function (_, a) { return a; }); };
}
/**
 * Test whether one dictionary contains all of the keys and values contained in another dictionary
 * @function
 * @since 1.0.0
 */
exports.isSubdictionary = function (S) {
    var isSubdictionaryS = R.isSubdictionary(S);
    return function (d1, d2) { return isSubdictionaryS(d1.value, d2.value); };
};
/**
 * Calculate the number of key/value pairs in a dictionary
 * @function
 * @since 1.0.0
 */
exports.size = function (d) {
    return R.size(d.value);
};
/**
 * Test whether a dictionary is empty
 * @function
 * @since 1.0.0
 */
exports.isEmpty = function (d) {
    return R.isEmpty(d.value);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    var isSubdictionaryS = R.isSubdictionary(S);
    return {
        equals: function (x, y) { return isSubdictionaryS(x.value, y.value) && isSubdictionaryS(y.value, x.value); }
    };
};
/**
 * Create a dictionary with one key/value pair
 * @function
 * @since 1.0.0
 */
exports.singleton = function (k, a) {
    return new StrMap(R.singleton(k, a));
};
/**
 * Lookup the value for a key in a dictionary
 * @function
 * @since 1.0.0
 */
exports.lookup = function (k, d) {
    return R.lookup(k, d.value);
};
function fromFoldable(F) {
    var fromFoldableF = R.fromFoldable(F);
    return function (ta, f) { return new StrMap(fromFoldableF(ta, f)); };
}
exports.fromFoldable = fromFoldable;
/**
 * @function
 * @since 1.0.0
 */
exports.collect = function (d, f) {
    return R.collect(d.value, f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.toArray = function (d) {
    return R.toArray(d.value);
};
/**
 * Unfolds a dictionary into a list of key/value pairs
 * @function
 * @since 1.0.0
 */
exports.toUnfoldable = function (U) {
    var toUnfoldableU = R.toUnfoldable(U);
    return function (d) { return toUnfoldableU(d.value); };
};
/**
 * Insert or replace a key/value pair in a map
 * @function
 * @since 1.0.0
 */
exports.insert = function (k, a, d) {
    return new StrMap(R.insert(k, a, d.value));
};
/**
 * Delete a key and value from a map
 * @function
 * @since 1.0.0
 */
exports.remove = function (k, d) {
    return new StrMap(R.remove(k, d.value));
};
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 * @function
 * @since 1.0.0
 */
exports.pop = function (k, d) {
    return R.pop(k, d.value).map(function (_a) {
        var a = _a[0], d = _a[1];
        return function_1.tuple(a, new StrMap(d));
    });
};
var filterMap = function (fa, f) {
    return fa.filterMap(f);
};
var filter = function (fa, p) {
    return fa.filter(p);
};
var compact = function (fa) {
    return new StrMap(R.compact(fa.value));
};
var separate = function (fa) {
    return fa.separate();
};
var partitionMap = function (fa, f) {
    return fa.partitionMap(f);
};
var partition = function (fa, p) {
    return fa.partition(p);
};
var wither = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), compact); };
};
var wilt = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), separate); };
};
var mapWithIndex = function (fa, f) {
    return fa.mapWithKey(f);
};
var traverseWithIndex = traverseWithKey;
var partitionMapWithIndex = function (fa, f) {
    return fa.partitionMapWithIndex(f);
};
var partitionWithIndex = function (fa, p) {
    return fa.partitionWithIndex(p);
};
var filterMapWithIndex = function (fa, f) {
    return fa.filterMapWithIndex(f);
};
var filterWithIndex = function (fa, p) {
    return fa.filterWithIndex(p);
};
/**
 * @instance
 * @since 1.0.0
 */
exports.strmap = {
    URI: exports.URI,
    map: map,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    compact: compact,
    separate: separate,
    filter: filter,
    filterMap: filterMap,
    partition: partition,
    partitionMap: partitionMap,
    wither: wither,
    wilt: wilt,
    mapWithIndex: mapWithIndex,
    reduceWithIndex: reduceWithIndex,
    foldMapWithIndex: foldMapWithIndex,
    foldrWithIndex: foldrWithIndex,
    traverseWithIndex: traverseWithIndex,
    partitionMapWithIndex: partitionMapWithIndex,
    partitionWithIndex: partitionWithIndex,
    filterMapWithIndex: filterMapWithIndex,
    filterWithIndex: filterWithIndex
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function splitStrong(F) {
    return function (pab, pcd) {
        return F.compose(F.first(pab), F.second(pcd));
    };
}
exports.splitStrong = splitStrong;
function fanout(F) {
    var splitStrongF = splitStrong(F);
    return function (pab, pac) {
        var split = F.promap(F.id(), function_1.identity, function (a) { return function_1.tuple(a, a); });
        return F.compose(splitStrongF(pab, pac), split);
    };
}
exports.fanout = fanout;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
var function_1 = require("./function");
exports.URI = 'Task';
/**
 * `Task<A>` represents an asynchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent an asynchronous computation that may fail, please see {@link TaskEither}.
 * @data
 * @constructor Task
 * @since 1.0.0
 */
var Task = /** @class */ (function () {
    function Task(run) {
        this.run = run;
    }
    Task.prototype.map = function (f) {
        var _this = this;
        return new Task(function () { return _this.run().then(f); });
    };
    Task.prototype.ap = function (fab) {
        var _this = this;
        return new Task(function () { return Promise.all([fab.run(), _this.run()]).then(function (_a) {
            var f = _a[0], a = _a[1];
            return f(a);
        }); });
    };
    /**
     * Flipped version of {@link ap}
     */
    Task.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     * @since 1.6.0
     */
    Task.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     * @since 1.5.0
     */
    Task.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    Task.prototype.chain = function (f) {
        var _this = this;
        return new Task(function () { return _this.run().then(function (a) { return f(a).run(); }); });
    };
    Task.prototype.inspect = function () {
        return this.toString();
    };
    Task.prototype.toString = function () {
        return "new Task(" + function_1.toString(this.run) + ")";
    };
    return Task;
}());
exports.Task = Task;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Task(function () { return Promise.resolve(a); });
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getRaceMonoid = function () {
    return {
        concat: function (x, y) {
            return new Task(function () {
                return new Promise(function (resolve, reject) {
                    var running = true;
                    var resolveFirst = function (a) {
                        if (running) {
                            running = false;
                            resolve(a);
                        }
                    };
                    var rejectFirst = function (e) {
                        if (running) {
                            running = false;
                            reject(e);
                        }
                    };
                    x.run().then(resolveFirst, rejectFirst);
                    y.run().then(resolveFirst, rejectFirst);
                });
            });
        },
        empty: never
    };
};
var never = new Task(function () { return new Promise(function (_) { return undefined; }); });
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) { return new Task(function () { return x.run().then(function (rx) { return y.run().then(function (ry) { return S.concat(rx, ry); }); }); }); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (M) {
    return __assign({}, exports.getSemigroup(M), { empty: of(M.empty) });
};
/**
 * @function
 * @since 1.0.0
 */
exports.tryCatch = function (f, onrejected) {
    return new Task(function () { return f().then(function (a) { return Either_1.right(a); }, function (reason) { return Either_1.left(onrejected(reason)); }); });
};
/**
 * Lifts an IO action into a Task
 * @function
 * @since 1.0.0
 */
exports.fromIO = function (io) {
    return new Task(function () { return Promise.resolve(io.run()); });
};
/**
 * @function
 * @since 1.7.0
 */
exports.delay = function (millis, a) {
    return new Task(function () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(a);
            }, millis);
        });
    });
};
var fromTask = function_1.identity;
/**
 * @instance
 * @since 1.0.0
 */
exports.task = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    fromIO: exports.fromIO,
    fromTask: fromTask
};
/**
 * Like {@link task} but `ap` is sequential
 * @instance
 * @since 1.10.0
 */
exports.taskSeq = __assign({}, exports.task, { ap: function (fab, fa) { return fab.chain(function (f) { return fa.map(f); }); } });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
var eitherT = require("./EitherT");
var function_1 = require("./function");
var Task_1 = require("./Task");
var eitherTTask = eitherT.getEitherT(Task_1.task);
exports.URI = 'TaskEither';
var eitherTfold = eitherT.fold(Task_1.task);
var eitherTmapLeft = eitherT.mapLeft(Task_1.task);
var eitherTbimap = eitherT.bimap(Task_1.task);
/**
 * `TaskEither<L, A>` represents an asynchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `L`. If you want to represent an asynchronous computation that never fails, please see {@link Task}.
 * @data
 * @constructor TaskEither
 * @since 1.0.0
 */
var TaskEither = /** @class */ (function () {
    function TaskEither(value) {
        this.value = value;
    }
    /** Runs the inner `Task` */
    TaskEither.prototype.run = function () {
        return this.value.run();
    };
    TaskEither.prototype.map = function (f) {
        return new TaskEither(eitherTTask.map(this.value, f));
    };
    TaskEither.prototype.ap = function (fab) {
        return new TaskEither(eitherTTask.ap(fab.value, this.value));
    };
    /**
     * Flipped version of {@link ap}
     */
    TaskEither.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two (parallel) effectful actions, keeping only the result of the first
     * @since 1.6.0
     */
    TaskEither.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two (parallel) effectful actions, keeping only the result of the second
     * @since 1.5.0
     */
    TaskEither.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    /**
     * Combine two (sequential) effectful actions, keeping only the result of the first
     * @since 1.12.0
     */
    TaskEither.prototype.chainFirst = function (fb) {
        return this.chain(function (a) { return fb.map(function () { return a; }); });
    };
    /**
     * Combine two (sequential) effectful actions, keeping only the result of the second
     * @since 1.12.0
     */
    TaskEither.prototype.chainSecond = function (fb) {
        return this.chain(function () { return fb; });
    };
    TaskEither.prototype.chain = function (f) {
        return new TaskEither(eitherTTask.chain(function (a) { return f(a).value; }, this.value));
    };
    TaskEither.prototype.fold = function (whenLeft, whenRight) {
        return eitherTfold(whenLeft, whenRight, this.value);
    };
    /**
     * Similar to {@link fold}, but the result is flattened.
     * @since 1.10.0
     */
    TaskEither.prototype.foldTask = function (whenLeft, whenRight) {
        return this.value.chain(function (e) { return e.fold(whenLeft, whenRight); });
    };
    /**
     * Similar to {@link fold}, but the result is flattened.
     * @since 1.10.0
     */
    TaskEither.prototype.foldTaskEither = function (whenLeft, whenRight) {
        return new TaskEither(this.value.chain(function (e) { return e.fold(whenLeft, whenRight).value; }));
    };
    TaskEither.prototype.mapLeft = function (f) {
        return new TaskEither(eitherTmapLeft(f)(this.value));
    };
    /**
     * Transforms the failure value of the `TaskEither` into a new `TaskEither`
     */
    TaskEither.prototype.orElse = function (f) {
        return new TaskEither(this.value.chain(function (e) { return e.fold(function (l) { return f(l).value; }, eitherTTask.of); }));
    };
    /**
     * @since 1.6.0
     */
    TaskEither.prototype.alt = function (fy) {
        return this.orElse(function () { return fy; });
    };
    /**
     * @since 1.2.0
     */
    TaskEither.prototype.bimap = function (f, g) {
        return new TaskEither(eitherTbimap(this.value, f, g));
    };
    /**
     * Return `Right` if the given action succeeds, `Left` if it throws
     * @since 1.10.0
     */
    TaskEither.prototype.attempt = function () {
        return new TaskEither(this.value.map(Either_1.right));
    };
    TaskEither.prototype.filterOrElse = function (p, zero) {
        return new TaskEither(this.value.map(function (e) { return e.filterOrElse(p, zero); }));
    };
    TaskEither.prototype.filterOrElseL = function (p, zero) {
        return new TaskEither(this.value.map(function (e) { return e.filterOrElseL(p, zero); }));
    };
    return TaskEither;
}());
exports.TaskEither = TaskEither;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new TaskEither(eitherTTask.of(a));
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var bimap = function (fa, f, g) {
    return fa.bimap(f, g);
};
var eitherTright = eitherT.right(Task_1.task);
/**
 * @function
 * @since 1.0.0
 */
exports.right = function (fa) {
    return new TaskEither(eitherTright(fa));
};
var eitherTleft = eitherT.left(Task_1.task);
/**
 * @function
 * @since 1.0.0
 */
exports.left = function (fa) {
    return new TaskEither(eitherTleft(fa));
};
var eitherTfromEither = eitherT.fromEither(Task_1.task);
/**
 * @function
 * @since 1.0.0
 */
exports.fromEither = function (fa) {
    return new TaskEither(eitherTfromEither(fa));
};
/**
 * @function
 * @since 1.5.0
 */
exports.fromIO = function (fa) {
    return exports.right(Task_1.fromIO(fa));
};
/**
 * @function
 * @since 1.3.0
 */
exports.fromLeft = function (l) {
    return exports.fromEither(Either_1.left(l));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromIOEither = function (fa) {
    return new TaskEither(Task_1.fromIO(fa.value));
};
function fromPredicate(predicate, whenFalse) {
    var f = Either_1.fromPredicate(predicate, whenFalse);
    return function (a) { return exports.fromEither(f(a)); };
}
exports.fromPredicate = fromPredicate;
/**
 * @function
 * @since 1.9.0
 */
exports.getSemigroup = function (S) {
    var S2 = Task_1.getSemigroup(Either_1.getSemigroup(S));
    return {
        concat: function (x, y) { return new TaskEither(S2.concat(x.value, y.value)); }
    };
};
/**
 * @function
 * @since 1.9.0
 */
exports.getApplySemigroup = function (S) {
    var S2 = Task_1.getSemigroup(Either_1.getApplySemigroup(S));
    return {
        concat: function (x, y) { return new TaskEither(S2.concat(x.value, y.value)); }
    };
};
/**
 * @function
 * @since 1.9.0
 */
exports.getApplyMonoid = function (M) {
    return __assign({}, exports.getApplySemigroup(M), { empty: of(M.empty) });
};
/**
 * Transforms a `Promise` into a `TaskEither`, catching the possible error.
 *
 * @example
 * import { createHash } from 'crypto'
 * import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither'
 * import { createReadStream } from 'fs'
 * import { left } from 'fp-ts/lib/Either'
 *
 * const md5 = (path: string): TaskEither<string, string> => {
 *   const mkHash = (p: string) =>
 *     new Promise<string>((resolve, reject) => {
 *       const hash = createHash('md5')
 *       const rs = createReadStream(p)
 *       rs.on('error', (error: Error) => reject(error.message))
 *       rs.on('data', (chunk: string) => hash.update(chunk))
 *       rs.on('end', () => {
 *         return resolve(hash.digest('hex'))
 *       })
 *     })
 *   return tryCatch(() => mkHash(path), message => `cannot create md5 hash: ${String(message)}`)
 * }
 *
 * md5('foo')
 *   .run()
 *   .then(x => {
 *     assert.deepEqual(x, left(`cannot create md5 hash: ENOENT: no such file or directory, open 'foo'`))
 *   })
 *
 * @function
 * @since 1.0.0
 */
exports.tryCatch = function (f, onrejected) {
    return new TaskEither(Task_1.tryCatch(f, onrejected));
};
function taskify(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return new TaskEither(new Task_1.Task(function () {
            return new Promise(function (resolve) {
                var cbResolver = function (e, r) {
                    return e != null ? resolve(Either_1.left(e)) : resolve(Either_1.right(r));
                };
                f.apply(null, args.concat(cbResolver));
            });
        }));
    };
}
exports.taskify = taskify;
var fromTask = exports.right;
/**
 * Make sure that a resource is cleaned up in the event of an exception. The
 * release action is called regardless of whether the body action throws or
 * returns.
 * @function
 * @since 1.10.0
 */
exports.bracket = function (acquire, use, release) {
    return acquire.chain(function (a) {
        return use(a)
            .attempt()
            .chain(function (e) { return release(a, e).chain(function () { return e.fold(exports.fromLeft, exports.taskEither.of); }); });
    });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.taskEither = {
    URI: exports.URI,
    bimap: bimap,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    alt: alt,
    fromIO: exports.fromIO,
    fromTask: fromTask
};
/**
 * Like {@link taskEither} but `ap` is sequential
 * @instance
 * @since 1.10.0
 */
exports.taskEitherSeq = __assign({}, exports.taskEither, { ap: function (fab, fa) { return fab.chain(function (f) { return fa.map(f); }); } });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Option_1 = require("./Option");
exports.URI = 'These';
var This = /** @class */ (function () {
    function This(value) {
        this.value = value;
        this._tag = 'This';
    }
    This.prototype.map = function (f) {
        return this;
    };
    This.prototype.bimap = function (f, g) {
        return new This(f(this.value));
    };
    This.prototype.reduce = function (b, f) {
        return b;
    };
    /** Applies a function to each case in the data structure */
    This.prototype.fold = function (this_, that, both) {
        return this_(this.value);
    };
    This.prototype.inspect = function () {
        return this.toString();
    };
    This.prototype.toString = function () {
        return "this_(" + function_1.toString(this.value) + ")";
    };
    /** Returns `true` if the these is `This`, `false` otherwise */
    This.prototype.isThis = function () {
        return true;
    };
    /** Returns `true` if the these is `That`, `false` otherwise */
    This.prototype.isThat = function () {
        return false;
    };
    /** Returns `true` if the these is `Both`, `false` otherwise */
    This.prototype.isBoth = function () {
        return false;
    };
    return This;
}());
exports.This = This;
var That = /** @class */ (function () {
    function That(value) {
        this.value = value;
        this._tag = 'That';
    }
    That.prototype.map = function (f) {
        return new That(f(this.value));
    };
    That.prototype.bimap = function (f, g) {
        return new That(g(this.value));
    };
    That.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    That.prototype.fold = function (this_, that, both) {
        return that(this.value);
    };
    That.prototype.inspect = function () {
        return this.toString();
    };
    That.prototype.toString = function () {
        return "that(" + function_1.toString(this.value) + ")";
    };
    That.prototype.isThis = function () {
        return false;
    };
    That.prototype.isThat = function () {
        return true;
    };
    That.prototype.isBoth = function () {
        return false;
    };
    return That;
}());
exports.That = That;
var Both = /** @class */ (function () {
    function Both(l, a) {
        this.l = l;
        this.a = a;
        this._tag = 'Both';
    }
    Both.prototype.map = function (f) {
        return new Both(this.l, f(this.a));
    };
    Both.prototype.bimap = function (f, g) {
        return new Both(f(this.l), g(this.a));
    };
    Both.prototype.reduce = function (b, f) {
        return f(b, this.a);
    };
    Both.prototype.fold = function (this_, that, both) {
        return both(this.l, this.a);
    };
    Both.prototype.inspect = function () {
        return this.toString();
    };
    Both.prototype.toString = function () {
        return "both(" + function_1.toString(this.l) + ", " + function_1.toString(this.a) + ")";
    };
    Both.prototype.isThis = function () {
        return false;
    };
    Both.prototype.isThat = function () {
        return false;
    };
    Both.prototype.isBoth = function () {
        return true;
    };
    return Both;
}());
exports.Both = Both;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (SL, SA) {
    return {
        equals: function (x, y) {
            return x.isThis()
                ? y.isThis() && SL.equals(x.value, y.value)
                : x.isThat()
                    ? y.isThat() && SA.equals(x.value, y.value)
                    : y.isBoth() && SL.equals(x.l, y.l) && SA.equals(x.a, y.a);
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (SL, SA) {
    return {
        concat: function (x, y) {
            return x.isThis()
                ? y.isThis()
                    ? exports.this_(SL.concat(x.value, y.value))
                    : y.isThat()
                        ? exports.both(x.value, y.value)
                        : exports.both(SL.concat(x.value, y.l), y.a)
                : x.isThat()
                    ? y.isThis()
                        ? exports.both(y.value, x.value)
                        : y.isThat()
                            ? exports.that(SA.concat(x.value, y.value))
                            : exports.both(y.l, SA.concat(x.value, y.a))
                    : y.isThis()
                        ? exports.both(SL.concat(x.l, y.value), x.a)
                        : y.isThat()
                            ? exports.both(x.l, SA.concat(x.a, y.value))
                            : exports.both(SL.concat(x.l, y.l), SA.concat(x.a, y.a));
        }
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new That(a);
};
var ap = function (S) { return function (fab, fa) {
    return chain(S)(fab, function (f) { return map(fa, f); });
}; };
var chain = function (S) { return function (fa, f) {
    if (fa.isThis()) {
        return exports.this_(fa.value);
    }
    else if (fa.isThat()) {
        return f(fa.value);
    }
    else {
        var fb = f(fa.a);
        return fb.isThis()
            ? exports.this_(S.concat(fa.l, fb.value))
            : fb.isThat()
                ? exports.both(fa.l, fb.value)
                : exports.both(S.concat(fa.l, fb.l), fb.a);
    }
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function (S) {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        of: of,
        ap: ap(S),
        chain: chain(S)
    };
};
var bimap = function (fla, f, g) {
    return fla.bimap(f, g);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.isThis() ? M.empty : fa.isThat() ? f(fa.value) : f(fa.a);
}; };
var foldr = function (fa, b, f) {
    return fa.isThis() ? b : fa.isThat() ? f(fa.value, b) : f(fa.a, b);
};
var traverse = function (F) { return function (ta, f) {
    return ta.isThis()
        ? F.of(exports.this_(ta.value))
        : ta.isThat()
            ? F.map(f(ta.value), exports.that)
            : F.map(f(ta.a), function (b) { return exports.both(ta.l, b); });
}; };
var sequence = function (F) { return function (ta) {
    return ta.isThis()
        ? F.of(exports.this_(ta.value))
        : ta.isThat()
            ? F.map(ta.value, exports.that)
            : F.map(ta.a, function (b) { return exports.both(ta.l, b); });
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.this_ = function (l) {
    return new This(l);
};
/**
 * @function
 * @since 1.0.0
 * @alias of
 */
exports.that = of;
/**
 * @function
 * @since 1.0.0
 */
exports.both = function (l, a) {
    return new Both(l, a);
};
/**
 * @function
 * @since 1.0.0
 */
exports.fromThese = function (defaultThis, defaultThat) { return function (fa) {
    return fa.isThis() ? [fa.value, defaultThat] : fa.isThat() ? [defaultThis, fa.value] : [fa.l, fa.a];
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.theseLeft = function (fa) {
    return fa.isThis() ? Option_1.some(fa.value) : fa.isThat() ? Option_1.none : Option_1.some(fa.l);
};
/**
 * @function
 * @since 1.0.0
 */
exports.theseRight = function (fa) {
    return fa.isThis() ? Option_1.none : fa.isThat() ? Option_1.some(fa.value) : Option_1.some(fa.a);
};
/**
 * Returns `true` if the these is an instance of `This`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isThis = function (fa) {
    return fa.isThis();
};
/**
 * Returns `true` if the these is an instance of `That`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isThat = function (fa) {
    return fa.isThat();
};
/**
 * Returns `true` if the these is an instance of `Both`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isBoth = function (fa) {
    return fa.isBoth();
};
/**
 * @instance
 * @since 1.0.0
 */
exports.these = {
    URI: exports.URI,
    map: map,
    bimap: bimap,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Adapted from https://github.com/garyb/purescript-debug
/**
 * Log any value to the console for debugging purposes and then return a value. This will log the value's underlying
 * representation for low-level debugging
 * @function
 * @since 1.0.0
 */
exports.trace = function (message, out) {
    console.log(message); // tslint:disable-line:no-console
    return out();
};
/**
 * Log any value and return it
 * @function
 * @since 1.0.0
 */
exports.spy = function (a) {
    return exports.trace(a, function () { return a; });
};
function traceA(F) {
    return function (x) { return exports.trace(x, function () { return F.of(undefined); }); };
}
exports.traceA = traceA;
function traceM(F) {
    return function (a) { return exports.trace(a, function () { return F.of(a); }); };
}
exports.traceM = traceM;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Foldable_1 = require("./Foldable");
var Functor_1 = require("./Functor");
function traverse(F, T) {
    return T.traverse(F);
}
exports.traverse = traverse;
function sequence(F, T) {
    return function (tfa) { return T.traverse(F)(tfa, function (fa) { return fa; }); };
}
exports.sequence = sequence;
function getTraversableComposition(F, G) {
    return __assign({}, Functor_1.getFunctorComposition(F, G), Foldable_1.getFoldableComposition(F, G), { traverse: function (H) {
            var traverseF = F.traverse(H);
            var traverseG = G.traverse(H);
            return function (fga, f) { return traverseF(fga, function (ga) { return traverseG(ga, f); }); };
        } });
}
exports.getTraversableComposition = getTraversableComposition;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Foldable2v_1 = require("./Foldable2v");
var Functor_1 = require("./Functor");
function getTraversableComposition(F, G) {
    return __assign({}, Functor_1.getFunctorComposition(F, G), Foldable2v_1.getFoldableComposition(F, G), { traverse: function (H) {
            var traverseF = F.traverse(H);
            var traverseG = G.traverse(H);
            return function (fga, f) { return traverseF(fga, function (ga) { return traverseG(ga, f); }); };
        }, sequence: function (H) {
            var sequenceF = F.sequence(H);
            var sequenceG = G.sequence(H);
            return function (fgha) { return sequenceF(F.map(fgha, sequenceG)); };
        } });
}
exports.getTraversableComposition = getTraversableComposition;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Array_1 = require("./Array");
var function_1 = require("./function");
exports.URI = 'Tree';
/**
 * Multi-way trees (aka rose trees) and forests, where a forest is
 *
 * ```ts
 * type Forest<A> = Array<Tree<A>>
 * ```
 *
 * @data
 * @constructor Tree
 * @since 1.6.0
 */
var Tree = /** @class */ (function () {
    function Tree(value, forest) {
        this.value = value;
        this.forest = forest;
    }
    Tree.prototype.map = function (f) {
        return new Tree(f(this.value), this.forest.map(function (tree) { return tree.map(f); }));
    };
    Tree.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <- derived
    };
    /**
     * Flipped version of {@link ap}
     * @since 1.6.0
     */
    Tree.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Tree.prototype.chain = function (f) {
        var _a = f(this.value), value = _a.value, forest = _a.forest;
        return new Tree(value, function_1.concat(forest, this.forest.map(function (t) { return t.chain(f); })));
    };
    Tree.prototype.extract = function () {
        return this.value;
    };
    Tree.prototype.extend = function (f) {
        return new Tree(f(this), this.forest.map(function (t) { return t.extend(f); }));
    };
    Tree.prototype.reduce = function (b, f) {
        var r = f(b, this.value);
        var len = this.forest.length;
        for (var i = 0; i < len; i++) {
            r = this.forest[i].reduce(r, f);
        }
        return r;
    };
    Tree.prototype.inspect = function () {
        return this.toString();
    };
    Tree.prototype.toString = function () {
        return "new Tree(" + function_1.toString(this.value) + ", " + function_1.toString(this.forest) + ")";
    };
    return Tree;
}());
exports.Tree = Tree;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Tree(a, Array_1.empty);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var extract = function (fa) {
    return fa.extract();
};
var extend = function (fa, f) {
    return fa.extend(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.reduce(M.empty, function (acc, a) { return M.concat(acc, f(a)); });
}; };
var foldr = function (fa, b, f) {
    var r = b;
    var len = fa.forest.length;
    for (var i = len - 1; i >= 0; i--) {
        r = foldr(fa.forest[i], r, f);
    }
    return f(fa.value, r);
};
function traverse(F) {
    var traverseF = Array_1.traverse(F);
    var r = function (ta, f) {
        return F.ap(F.map(f(ta.value), function (value) { return function (forest) { return new Tree(value, forest); }; }), traverseF(ta.forest, function (t) { return r(t, f); }));
    };
    return r;
}
function sequence(F) {
    var traverseF = traverse(F);
    return function (ta) { return traverseF(ta, function_1.identity); };
}
/**
 * @function
 * @since 1.6.0
 */
exports.getSetoid = function (S) {
    var SA;
    var R = {
        equals: function (x, y) { return S.equals(x.value, y.value) && SA.equals(x.forest, y.forest); }
    };
    SA = Array_1.getSetoid(R);
    return R;
};
/**
 * @instance
 * @since 1.6.0
 */
exports.tree = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    extract: extract,
    extend: extend
};
var draw = function (indentation, forest) {
    var r = '';
    var len = forest.length;
    var tree;
    for (var i = 0; i < len; i++) {
        tree = forest[i];
        var isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += draw(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
/**
 * Neat 2-dimensional drawing of a forest
 * @function
 * @since 1.6.0
 */
exports.drawForest = function (forest) {
    return draw('\n', forest);
};
/**
 * Neat 2-dimensional drawing of a tree
 *
 * @example
 * import { Tree, drawTree, tree } from 'fp-ts/lib/Tree'
 *
 * const fa = new Tree('a', [
 *   tree.of('b'),
 *   tree.of('c'),
 *   new Tree('d', [tree.of('e'), tree.of('f')])
 * ])
 *
 * assert.strictEqual(drawTree(fa), `a
 * ├─ b
 * ├─ c
 * └─ d
 *    ├─ e
 *    └─ f`)
 *
 * @function
 * @since 1.6.0
 */
exports.drawTree = function (tree) {
    return tree.value + exports.drawForest(tree.forest);
};
/**
 * Build a tree from a seed value
 * @function
 * @since 1.6.0
 */
exports.unfoldTree = function (b, f) {
    var _a = f(b), a = _a[0], bs = _a[1];
    return new Tree(a, exports.unfoldForest(bs, f));
};
/**
 * Build a tree from a seed value
 * @function
 * @since 1.6.0
 */
exports.unfoldForest = function (bs, f) {
    return bs.map(function (b) { return exports.unfoldTree(b, f); });
};
function unfoldTreeM(M) {
    var unfoldForestMM = unfoldForestM(M);
    return function (b, f) { return M.chain(f(b), function (_a) {
        var a = _a[0], bs = _a[1];
        return M.chain(unfoldForestMM(bs, f), function (ts) { return M.of(new Tree(a, ts)); });
    }); };
}
exports.unfoldTreeM = unfoldTreeM;
function unfoldForestM(M) {
    var traverseM = Array_1.traverse(M);
    var unfoldTree;
    return function (bs, f) {
        // tslint:disable-next-line
        if (unfoldTree === undefined) {
            unfoldTree = unfoldTreeM(M);
        }
        return traverseM(bs, function (b) { return unfoldTree(b, f); });
    };
}
exports.unfoldForestM = unfoldForestM;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Ord_1 = require("./Ord");
exports.URI = 'Tuple';
/**
 * @data
 * @constructor Tuple
 * @since 1.0.0
 */
var Tuple = /** @class */ (function () {
    function Tuple(fst, snd) {
        this.fst = fst;
        this.snd = snd;
    }
    Tuple.prototype.compose = function (ab) {
        return new Tuple(this.fst, ab.snd);
    };
    Tuple.prototype.map = function (f) {
        return new Tuple(this.fst, f(this.snd));
    };
    Tuple.prototype.bimap = function (f, g) {
        return new Tuple(f(this.fst), g(this.snd));
    };
    Tuple.prototype.extract = function () {
        return this.snd;
    };
    Tuple.prototype.extend = function (f) {
        return new Tuple(this.fst, f(this));
    };
    Tuple.prototype.reduce = function (b, f) {
        return f(b, this.snd);
    };
    /** Exchange the first and second components of a tuple */
    Tuple.prototype.swap = function () {
        return new Tuple(this.snd, this.fst);
    };
    Tuple.prototype.inspect = function () {
        return this.toString();
    };
    Tuple.prototype.toString = function () {
        return "new Tuple(" + function_1.toString(this.fst) + ", " + function_1.toString(this.snd) + ")";
    };
    Tuple.prototype.toTuple = function () {
        return [this.fst, this.snd];
    };
    return Tuple;
}());
exports.Tuple = Tuple;
var fst = function (fa) {
    return fa.fst;
};
var snd = function (fa) {
    return fa.snd;
};
var compose = function (bc, fa) {
    return fa.compose(bc);
};
var map = function (fa, f) {
    return fa.map(f);
};
var bimap = function (fla, f, g) {
    return fla.bimap(f, g);
};
var extract = snd;
var extend = function (fa, f) {
    return fa.extend(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return f(fa.snd);
}; };
var foldr = function (fa, b, f) {
    return f(fa.snd, b);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (SA, SB) {
    return {
        equals: function (x, y) { return SA.equals(x.fst, y.fst) && SB.equals(x.snd, y.snd); }
    };
};
/**
 * To obtain the result, the `fst`s are `compare`d, and if they are `EQ`ual, the
 * `snd`s are `compare`d.
 * @function
 * @since 1.0.0
 */
exports.getOrd = function (OL, OA) {
    return Ord_1.getSemigroup().concat(Ord_1.contramap(fst, OL), Ord_1.contramap(snd, OA));
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (SL, SA) {
    return {
        concat: function (x, y) { return new Tuple(SL.concat(x.fst, y.fst), SA.concat(x.snd, y.snd)); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (ML, MA) {
    return __assign({}, exports.getSemigroup(ML, MA), { empty: new Tuple(ML.empty, MA.empty) });
};
var ap = function (S) { return function (fab, fa) {
    return new Tuple(S.concat(fab.fst, fa.fst), fab.snd(fa.snd));
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getApply = function (S) {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        ap: ap(S)
    };
};
var of = function (M) { return function (a) {
    return new Tuple(M.empty, a);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getApplicative = function (M) {
    return __assign({}, exports.getApply(M), { of: of(M) });
};
var chain = function (S) { return function (fa, f) {
    var _a = f(fa.snd), fst = _a.fst, snd = _a.snd;
    return new Tuple(S.concat(fa.fst, fst), snd);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getChain = function (S) {
    return __assign({}, exports.getApply(S), { chain: chain(S) });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function (M) {
    return __assign({}, exports.getChain(M), { of: of(M) });
};
var chainRec = function (M) { return function (a, f) {
    var result = f(a);
    var acc = M.empty;
    while (result.snd.isLeft()) {
        acc = M.concat(acc, result.fst);
        result = f(result.snd.value);
    }
    return new Tuple(M.concat(acc, result.fst), result.snd.value);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getChainRec = function (M) {
    return __assign({}, exports.getChain(M), { chainRec: chainRec(M) });
};
var traverse = function (F) { return function (ta, f) {
    return F.map(f(ta.snd), function (b) { return new Tuple(ta.fst, b); });
}; };
var sequence = function (F) { return function (ta) {
    return F.map(ta.snd, function (b) { return new Tuple(ta.fst, b); });
}; };
/**
 * @instance
 * @since 1.0.0
 */
exports.tuple = {
    URI: exports.URI,
    compose: compose,
    map: map,
    bimap: bimap,
    extract: extract,
    extend: extend,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unionize_1 = require("unionize");
const t = require("io-ts");
const io_ts_1 = require("./helpers/io-ts");
//
// Entities
//
// https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object
exports.User = t.interface({
    id_str: t.string,
    screen_name: t.string,
    time_zone: t.null,
});
exports.Tweet = t.interface({
    id_str: t.string,
    created_at: t.string,
    user: exports.User,
    text: t.string,
});
//
// Responses
//
exports.TwitterAPIErrorResponse = t.interface({
    errors: t.array(t.interface({
        code: t.number,
        message: t.string,
    })),
});
exports.TwitterAPIRequestTokenResponse = t.interface({
    oauth_token: t.string,
    oauth_token_secret: t.string,
    oauth_callback_confirmed: t.string,
});
exports.TwitterAPIAccessTokenResponse = t.interface({
    oauth_token: t.string,
    oauth_token_secret: t.string,
    user_id: t.string,
    screen_name: t.string,
});
exports.TwitterAPITimelineResponse = t.array(exports.Tweet);
exports.TwitterAPIAccountVerifyCredentials = exports.User;
exports.TwitterAPIAccountSettings = t.interface({
    time_zone: t.interface({
        name: t.string,
        tzinfo_name: t.string,
        utc_offset: t.number,
    }),
});
//
// Full responses (either success or error)
//
exports.ErrorResponse = unionize_1.unionize({
    JavaScriptError: unionize_1.ofType(),
    APIErrorResponse: unionize_1.ofType(),
    DecodeError: unionize_1.ofType(),
});
exports.StatusesHomeTimelineQuery = t.interface({
    count: io_ts_1.createOptionFromNullable(t.number),
    max_id: io_ts_1.createOptionFromNullable(t.string),
});
//# sourceMappingURL=types.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("./Option");
var Traversable_1 = require("./Traversable");
var function_1 = require("./function");
function replicate(U) {
    return function (a, n) {
        function step(n) {
            return n <= 0 ? Option_1.none : Option_1.option.of(function_1.tuple(a, n - 1));
        }
        return U.unfoldr(n, step);
    };
}
exports.replicate = replicate;
function empty(U) {
    return U.unfoldr(undefined, function_1.constant(Option_1.none));
}
exports.empty = empty;
function singleton(U) {
    var replicateU = replicate(U);
    return function (a) { return replicateU(a, 1); };
}
exports.singleton = singleton;
function replicateA(F, UT) {
    var sequenceFUT = Traversable_1.sequence(F, UT);
    var replicateUT = replicate(UT);
    return function (n, ma) { return sequenceFUT(replicateUT(ma, n)); };
}
exports.replicateA = replicateA;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Validation';
var Failure = /** @class */ (function () {
    function Failure(value) {
        this.value = value;
        this._tag = 'Failure';
    }
    Failure.prototype.map = function (f) {
        return this;
    };
    Failure.prototype.bimap = function (f, g) {
        return new Failure(f(this.value));
    };
    Failure.prototype.reduce = function (b, f) {
        return b;
    };
    Failure.prototype.fold = function (failure, success) {
        return failure(this.value);
    };
    /** Returns the value from this `Success` or the given argument if this is a `Failure` */
    Failure.prototype.getOrElse = function (a) {
        return a;
    };
    /** Returns the value from this `Success` or the result of given argument if this is a `Failure` */
    Failure.prototype.getOrElseL = function (f) {
        return f(this.value);
    };
    Failure.prototype.mapFailure = function (f) {
        return new Failure(f(this.value));
    };
    Failure.prototype.swap = function () {
        return new Success(this.value);
    };
    Failure.prototype.inspect = function () {
        return this.toString();
    };
    Failure.prototype.toString = function () {
        return "failure(" + function_1.toString(this.value) + ")";
    };
    /** Returns `true` if the validation is an instance of `Failure`, `false` otherwise */
    Failure.prototype.isFailure = function () {
        return true;
    };
    /** Returns `true` if the validation is an instance of `Success`, `false` otherwise */
    Failure.prototype.isSuccess = function () {
        return false;
    };
    return Failure;
}());
exports.Failure = Failure;
var Success = /** @class */ (function () {
    function Success(value) {
        this.value = value;
        this._tag = 'Success';
    }
    Success.prototype.map = function (f) {
        return new Success(f(this.value));
    };
    Success.prototype.bimap = function (f, g) {
        return new Success(g(this.value));
    };
    Success.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    Success.prototype.fold = function (failure, success) {
        return success(this.value);
    };
    Success.prototype.getOrElse = function (a) {
        return this.value;
    };
    Success.prototype.getOrElseL = function (f) {
        return this.value;
    };
    Success.prototype.mapFailure = function (f) {
        return this;
    };
    Success.prototype.swap = function () {
        return new Failure(this.value);
    };
    Success.prototype.inspect = function () {
        return this.toString();
    };
    Success.prototype.toString = function () {
        return "success(" + function_1.toString(this.value) + ")";
    };
    Success.prototype.isFailure = function () {
        return false;
    };
    Success.prototype.isSuccess = function () {
        return true;
    };
    return Success;
}());
exports.Success = Success;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (SL, SA) {
    return {
        equals: function (x, y) {
            return x.isFailure() ? y.isFailure() && SL.equals(x.value, y.value) : y.isSuccess() && SA.equals(x.value, y.value);
        }
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Success(a);
};
/**
 * @example
 * import { Validation, success, failure, getApplicative } from 'fp-ts/lib/Validation'
 * import { getArraySemigroup } from 'fp-ts/lib/Semigroup'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const person = (name: string) => (age: number): Person => ({ name, age })
 *
 * const validateName = (name: string): Validation<string[], string> =>
 *   name.length === 0 ? failure(['invalid name']) : success(name)
 *
 * const validateAge = (age: number): Validation<string[], number> =>
 *   age > 0 && age % 1 === 0 ? success(age) : failure(['invalid age'])
 *
 * const A = getApplicative(getArraySemigroup<string>())
 *
 * const validatePerson = (name: string, age: number): Validation<string[], Person> =>
 *   A.ap(A.map(validateName(name), person), validateAge(age))
 *
 * assert.deepEqual(validatePerson('Nicolas Bourbaki', 45), success({ "name": "Nicolas Bourbaki", "age": 45 }))
 * assert.deepEqual(validatePerson('Nicolas Bourbaki', -1), failure(["invalid age"]))
 * assert.deepEqual(validatePerson('', 0), failure(["invalid name", "invalid age"]))
 *
 * @function
 *
 * @since 1.0.0
 */
exports.getApplicative = function (S) {
    var ap = function (fab, fa) {
        return fab.isFailure()
            ? fa.isFailure()
                ? exports.failure(S.concat(fab.value, fa.value))
                : exports.failure(fab.value)
            : fa.isFailure()
                ? exports.failure(fa.value)
                : exports.success(fab.value(fa.value));
    };
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        of: of,
        ap: ap
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function (S) {
    var chain = function (fa, f) {
        return fa.isFailure() ? exports.failure(fa.value) : f(fa.value);
    };
    return __assign({}, exports.getApplicative(S), { chain: chain });
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.isFailure() ? M.empty : f(fa.value);
}; };
var foldr = function (fa, b, f) {
    return fa.isFailure() ? b : f(fa.value, b);
};
var traverse = function (F) { return function (ta, f) {
    return ta.isFailure() ? F.of(exports.failure(ta.value)) : F.map(f(ta.value), of);
}; };
var sequence = function (F) { return function (ta) {
    return ta.isFailure() ? F.of(exports.failure(ta.value)) : F.map(ta.value, of);
}; };
var bimap = function (fla, f, g) {
    return fla.bimap(f, g);
};
/**
 * @function
 * @since 1.0.0
 */
exports.failure = function (l) {
    return new Failure(l);
};
/**
 * @function
 * @since 1.0.0
 * @alias of
 */
exports.success = of;
function fromPredicate(predicate, f) {
    return function (a) { return (predicate(a) ? exports.success(a) : exports.failure(f(a))); };
}
exports.fromPredicate = fromPredicate;
/**
 * @function
 * @since 1.0.0
 */
exports.fromEither = function (e) {
    return e.isLeft() ? exports.failure(e.value) : exports.success(e.value);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (SL, SA) {
    var concat = function (fx, fy) {
        return fx.isFailure()
            ? fy.isFailure()
                ? exports.failure(SL.concat(fx.value, fy.value))
                : exports.failure(fx.value)
            : fy.isFailure()
                ? exports.failure(fy.value)
                : exports.success(SA.concat(fx.value, fy.value));
    };
    return {
        concat: concat
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (SL, SA) {
    return __assign({}, exports.getSemigroup(SL, SA), { empty: exports.success(SA.empty) });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getAlt = function (S) {
    var alt = function (fx, fy) {
        return fx.isFailure() ? (fy.isFailure() ? exports.failure(S.concat(fx.value, fy.value)) : fy) : fx;
    };
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        alt: alt
    };
};
/**
 * Returns `true` if the validation is an instance of `Failure`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isFailure = function (fa) {
    return fa.isFailure();
};
/**
 * Returns `true` if the validation is an instance of `Success`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isSuccess = function (fa) {
    return fa.isSuccess();
};
/**
 * Builds {@link Compactable} instance for {@link Validation} given {@link Monoid} for the failure side
 * @function
 * @since 1.7.0
 */
function getCompactable(ML) {
    var compact = function (fa) {
        if (fa.isFailure()) {
            return fa;
        }
        if (fa.value.isNone()) {
            return exports.failure(ML.empty);
        }
        return exports.success(fa.value.value);
    };
    var separate = function (fa) {
        if (fa.isFailure()) {
            return {
                left: fa,
                right: fa
            };
        }
        if (fa.value.isLeft()) {
            return {
                left: exports.success(fa.value.value),
                right: exports.failure(ML.empty)
            };
        }
        return {
            left: exports.failure(ML.empty),
            right: exports.success(fa.value.value)
        };
    };
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        compact: compact,
        separate: separate
    };
}
exports.getCompactable = getCompactable;
/**
 * Builds {@link Filterable} instance for {@link Validation} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getFilterable(ML) {
    var C = getCompactable(ML);
    var partitionMap = function (fa, f) {
        if (fa.isFailure()) {
            return {
                left: fa,
                right: fa
            };
        }
        var e = f(fa.value);
        if (e.isLeft()) {
            return {
                left: exports.success(e.value),
                right: exports.failure(ML.empty)
            };
        }
        return {
            left: exports.failure(ML.empty),
            right: exports.success(e.value)
        };
    };
    var partition = function (fa, p) {
        if (fa.isFailure()) {
            return {
                left: fa,
                right: fa
            };
        }
        if (p(fa.value)) {
            return {
                left: exports.failure(ML.empty),
                right: exports.success(fa.value)
            };
        }
        return {
            left: exports.success(fa.value),
            right: exports.failure(ML.empty)
        };
    };
    var filterMap = function (fa, f) {
        if (fa.isFailure()) {
            return fa;
        }
        var optionB = f(fa.value);
        if (optionB.isSome()) {
            return exports.success(optionB.value);
        }
        return exports.failure(ML.empty);
    };
    var filter = function (fa, p) {
        if (fa.isFailure()) {
            return fa;
        }
        var a = fa.value;
        if (p(a)) {
            return exports.success(a);
        }
        return exports.failure(ML.empty);
    };
    return __assign({}, C, { map: map,
        partitionMap: partitionMap,
        filterMap: filterMap,
        partition: partition,
        filter: filter });
}
exports.getFilterable = getFilterable;
/**
 * Builds {@link Witherable} instance for {@link Validation} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getWitherable(ML) {
    var filterableValidation = getFilterable(ML);
    var wither = function (F) {
        var traverseF = traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), filterableValidation.compact); };
    };
    var wilt = function (F) {
        var traverseF = traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), filterableValidation.separate); };
    };
    return __assign({}, filterableValidation, { traverse: traverse,
        reduce: reduce,
        wither: wither,
        wilt: wilt });
}
exports.getWitherable = getWitherable;
/**
 * @instance
 * @since 1.0.0
 */
exports.validation = {
    URI: exports.URI,
    map: map,
    bimap: bimap,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Writer';
/**
 * @data
 * @constructor Writer
 * @since 1.0.0
 */
var Writer = /** @class */ (function () {
    function Writer(run) {
        this.run = run;
    }
    Writer.prototype.eval = function () {
        return this.run()[0];
    };
    Writer.prototype.exec = function () {
        return this.run()[1];
    };
    Writer.prototype.map = function (f) {
        var _this = this;
        return new Writer(function () {
            var _a = _this.run(), a = _a[0], w = _a[1];
            return [f(a), w];
        });
    };
    return Writer;
}());
exports.Writer = Writer;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (M) { return function (a) {
    return new Writer(function () { return [a, M.empty]; });
}; };
var ap = function (S) { return function (fab, fa) {
    return new Writer(function () {
        var _a = fab.run(), f = _a[0], w1 = _a[1];
        var _b = fa.run(), a = _b[0], w2 = _b[1];
        return [f(a), S.concat(w1, w2)];
    });
}; };
var chain = function (S) { return function (fa, f) {
    return new Writer(function () {
        var _a = fa.run(), a = _a[0], w1 = _a[1];
        var _b = f(a).run(), b = _b[0], w2 = _b[1];
        return [b, S.concat(w1, w2)];
    });
}; };
/**
 * Appends a value to the accumulator
 * @function
 * @since 1.0.0
 */
exports.tell = function (w) {
    return new Writer(function () { return [undefined, w]; });
};
/**
 * Modifies the result to include the changes to the accumulator
 * @function
 * @since 1.3.0
 */
exports.listen = function (fa) {
    return new Writer(function () {
        var _a = fa.run(), a = _a[0], w = _a[1];
        return [function_1.tuple(a, w), w];
    });
};
/**
 * Applies the returned function to the accumulator
 * @function
 * @since 1.3.0
 */
exports.pass = function (fa) {
    return new Writer(function () {
        var _a = fa.run(), _b = _a[0], a = _b[0], f = _b[1], w = _a[1];
        return [a, f(w)];
    });
};
/**
 * Projects a value from modifications made to the accumulator during an action
 * @function
 * @since 1.3.0
 */
exports.listens = function (fa, f) {
    return new Writer(function () {
        var _a = fa.run(), a = _a[0], w = _a[1];
        return [function_1.tuple(a, f(w)), w];
    });
};
/**
 * Modify the final accumulator value by applying a function
 * @function
 * @since 1.3.0
 */
exports.censor = function (fa, f) {
    return new Writer(function () {
        var _a = fa.run(), a = _a[0], w = _a[1];
        return [a, f(w)];
    });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function (M) {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        of: of(M),
        ap: ap(M),
        chain: chain(M)
    };
};
/**
 * @instance
 * @since 1.0.0
 */
exports.writer = {
    URI: exports.URI,
    map: map
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Array_1 = require("./Array");
var function_1 = require("./function");
var Option_1 = require("./Option");
exports.URI = 'Zipper';
/**
 * Provides a pointed array, which is a non-empty zipper-like array structure that tracks an index (focus)
 * position in an array. Focus can be moved forward and backwards through the array.
 *
 * The array `[1, 2, 3, 4]` with focus on `3` is represented by `new Zipper([1, 2], 3, [4])`
 *
 * @data
 * @constructor Zipper
 * @since 1.9.0
 */
var Zipper = /** @class */ (function () {
    function Zipper(lefts, focus, rights) {
        this.lefts = lefts;
        this.focus = focus;
        this.rights = rights;
        this.length = lefts.length + 1 + rights.length;
    }
    /**
     * Update the focus in this zipper.
     * @since 1.9.0
     */
    Zipper.prototype.update = function (a) {
        return new Zipper(this.lefts, a, this.rights);
    };
    /**
     * Apply `f` to the focus and update with the result.
     * @since 1.9.0
     */
    Zipper.prototype.modify = function (f) {
        return this.update(f(this.focus));
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.toArray = function () {
        return Array_1.snoc(this.lefts, this.focus).concat(this.rights);
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.isOutOfBound = function (index) {
        return index < 0 || index >= this.length;
    };
    /**
     * Moves focus in the zipper, or `None` if there is no such element.
     * @since 1.9.0
     */
    Zipper.prototype.move = function (f) {
        var newIndex = f(this.lefts.length);
        if (this.isOutOfBound(newIndex)) {
            return Option_1.none;
        }
        else {
            return exports.fromArray(this.toArray(), newIndex);
        }
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.up = function () {
        return this.move(function_1.decrement);
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.down = function () {
        return this.move(function_1.increment);
    };
    /**
     * Moves focus to the start of the zipper.
     * @since 1.9.0
     */
    Zipper.prototype.start = function () {
        if (Array_1.isEmpty(this.lefts)) {
            return this;
        }
        else {
            return new Zipper(Array_1.empty, this.lefts[0], Array_1.snoc(Array_1.drop(1, this.lefts), this.focus).concat(this.rights));
        }
    };
    /**
     * Moves focus to the end of the zipper.
     * @since 1.9.0
     */
    Zipper.prototype.end = function () {
        var len = this.rights.length;
        if (len === 0) {
            return this;
        }
        else {
            return new Zipper(Array_1.snoc(this.lefts, this.focus).concat(Array_1.take(len - 1, this.rights)), this.rights[len - 1], Array_1.empty);
        }
    };
    /**
     * Inserts an element to the left of focus and focuses on the new element.
     * @since 1.9.0
     */
    Zipper.prototype.insertLeft = function (a) {
        return new Zipper(this.lefts, a, Array_1.cons(this.focus, this.rights));
    };
    /**
     * Inserts an element to the right of focus and focuses on the new element.
     * @since 1.9.0
     */
    Zipper.prototype.insertRight = function (a) {
        return new Zipper(Array_1.snoc(this.lefts, this.focus), a, this.rights);
    };
    /**
     * Deletes the element at focus and moves the focus to the left. If there is no element on the left,
     * focus is moved to the right.
     * @since 1.9.0
     */
    Zipper.prototype.deleteLeft = function () {
        var len = this.lefts.length;
        return exports.fromArray(this.lefts.concat(this.rights), len > 0 ? len - 1 : 0);
    };
    /**
     * Deletes the element at focus and moves the focus to the right. If there is no element on the right,
     * focus is moved to the left.
     * @since 1.9.0
     */
    Zipper.prototype.deleteRight = function () {
        var lenl = this.lefts.length;
        var lenr = this.rights.length;
        return exports.fromArray(this.lefts.concat(this.rights), lenr > 0 ? lenl : lenl - 1);
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.map = function (f) {
        return new Zipper(this.lefts.map(f), f(this.focus), this.rights.map(f));
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.ap = function (fab) {
        return new Zipper(Array_1.array.ap(fab.lefts, this.lefts), fab.focus(this.focus), Array_1.array.ap(fab.rights, this.rights));
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.reduce = function (b, f) {
        return this.rights.reduce(f, f(this.lefts.reduce(f, b), this.focus));
    };
    Zipper.prototype.inspect = function () {
        return this.toString();
    };
    Zipper.prototype.toString = function () {
        return "new Zipper(" + function_1.toString(this.lefts) + ", " + function_1.toString(this.focus) + ", " + function_1.toString(this.rights) + ")";
    };
    return Zipper;
}());
exports.Zipper = Zipper;
/**
 * @function
 * @since 1.9.0
 */
exports.fromArray = function (as, focusIndex) {
    if (focusIndex === void 0) { focusIndex = 0; }
    if (Array_1.isEmpty(as) || Array_1.isOutOfBound(focusIndex, as)) {
        return Option_1.none;
    }
    else {
        return Option_1.some(new Zipper(Array_1.take(focusIndex, as), as[focusIndex], Array_1.drop(focusIndex + 1, as)));
    }
};
/**
 * @function
 * @since 1.9.0
 */
exports.fromNonEmptyArray = function (nea) {
    return new Zipper(Array_1.empty, nea.head, nea.tail);
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Zipper(Array_1.empty, a, Array_1.empty);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    var lefts = fa.lefts.reduce(function (acc, a) { return M.concat(acc, f(a)); }, M.empty);
    var rights = fa.rights.reduce(function (acc, a) { return M.concat(acc, f(a)); }, M.empty);
    return M.concat(M.concat(lefts, f(fa.focus)), rights);
}; };
var foldr = function (fa, b, f) {
    var rights = fa.rights.reduceRight(function (acc, a) { return f(a, acc); }, b);
    var focus = f(fa.focus, rights);
    return fa.lefts.reduceRight(function (acc, a) { return f(a, acc); }, focus);
};
function traverse(F) {
    var traverseF = Array_1.array.traverse(F);
    return function (ta, f) {
        return F.ap(F.ap(F.map(traverseF(ta.lefts, f), function (lefts) { return function (focus) { return function (rights) { return new Zipper(lefts, focus, rights); }; }; }), f(ta.focus)), traverseF(ta.rights, f));
    };
}
function sequence(F) {
    var sequenceF = Array_1.array.sequence(F);
    return function (ta) {
        return F.ap(F.ap(F.map(sequenceF(ta.lefts), function (lefts) { return function (focus) { return function (rights) { return new Zipper(lefts, focus, rights); }; }; }), ta.focus), sequenceF(ta.rights));
    };
}
var extract = function (fa) {
    return fa.focus;
};
var extend = function (fa, f) {
    var lefts = fa.lefts.map(function (a, i) {
        return f(new Zipper(Array_1.take(i, fa.lefts), a, Array_1.snoc(Array_1.drop(i + 1, fa.lefts), fa.focus).concat(fa.rights)));
    });
    var rights = fa.rights.map(function (a, i) {
        return f(new Zipper(Array_1.snoc(fa.lefts, fa.focus).concat(Array_1.take(i, fa.rights)), a, Array_1.drop(i + 1, fa.rights)));
    });
    return new Zipper(lefts, f(fa), rights);
};
/**
 * @function
 * @since 1.9.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) { return new Zipper(x.lefts.concat(y.lefts), S.concat(x.focus, y.focus), x.rights.concat(y.rights)); }
    };
};
/**
 * @function
 * @since 1.9.0
 */
exports.getMonoid = function (M) {
    return __assign({}, exports.getSemigroup(M), { empty: new Zipper(Array_1.empty, M.empty, Array_1.empty) });
};
/**
 * @instance
 * @since 1.9.0
 */
exports.zipper = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    extend: extend,
    extract: extract,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Apply_1 = require("./Apply");
var Functor_1 = require("./Functor");
function when(F) {
    return function (condition, fu) { return (condition ? fu : F.of(undefined)); };
}
exports.when = when;
function getApplicativeComposition(F, G) {
    return __assign({}, Functor_1.getFunctorComposition(F, G), { of: function (a) { return F.of(G.of(a)); }, ap: function (fgab, fga) {
            return F.ap(F.map(fgab, function (h) { return function (ga) { return G.ap(h, ga); }; }), fga);
        } });
}
exports.getApplicativeComposition = getApplicativeComposition;
function getMonoid(F, M) {
    var S = Apply_1.getSemigroup(F, M)();
    return function () { return (__assign({}, S, { empty: F.of(M.empty) })); };
}
exports.getMonoid = getMonoid;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function applyFirst(F) {
    return function (fa, fb) { return F.ap(F.map(fa, function_1.constant), fb); };
}
exports.applyFirst = applyFirst;
function applySecond(F) {
    return function (fa, fb) { return F.ap(F.map(fa, function () { return function (b) { return b; }; }), fb); };
}
exports.applySecond = applySecond;
function liftA2(F) {
    return function (f) { return function (fa) { return function (fb) { return F.ap(F.map(fa, f), fb); }; }; };
}
exports.liftA2 = liftA2;
function liftA3(F) {
    return function (f) { return function (fa) { return function (fb) { return function (fc) { return F.ap(F.ap(F.map(fa, f), fb), fc); }; }; }; };
}
exports.liftA3 = liftA3;
function liftA4(F) {
    return function (f) { return function (fa) { return function (fb) { return function (fc) { return function (fd) { return F.ap(F.ap(F.ap(F.map(fa, f), fb), fc), fd); }; }; }; }; };
}
exports.liftA4 = liftA4;
function getSemigroup(F, S) {
    var concatLifted = liftA2(F)(function (a) { return function (b) { return S.concat(a, b); }; });
    return function () { return ({
        concat: function (x, y) { return concatLifted(x)(y); }
    }); };
}
exports.getSemigroup = getSemigroup;
var tupleConstructors = {};
function sequenceT(F) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = args.length;
        var f = tupleConstructors[len];
        if (!Boolean(f)) {
            f = tupleConstructors[len] = function_1.curried(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return args;
            }, len - 1, []);
        }
        var r = F.map(args[0], f);
        for (var i = 1; i < len; i++) {
            r = F.ap(r, args[i]);
        }
        return r;
    };
}
exports.sequenceT = sequenceT;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Option_1 = require("./Option");
var Ord_1 = require("./Ord");
var Setoid_1 = require("./Setoid");
exports.URI = 'Array';
/**
 *
 * @example
 * import { getMonoid } from 'fp-ts/lib/Array'
 *
 * const M = getMonoid<number>()
 * assert.deepEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function () {
    return {
        concat: function_1.concat,
        empty: exports.empty
    };
};
/**
 * Derives a Setoid over the Array of a given element type from the Setoid of that type. The derived setoid defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given setoid `S`. In case of
 * arrays of different lengths, the result is non equality.
 *
 *
 * @example
 * import { ordString } from 'fp-ts/lib/Ord'
 *
 * const O = getArraySetoid(ordString)
 * assert.strictEqual(O.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(O.equals(['a'], []), false)
 *
 * @constant
 * @since 1.0.0
 */
exports.getSetoid = Setoid_1.getArraySetoid;
/**
 * Derives an `Ord` over the Array of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 *
 * @example
 * import { getOrd } from 'fp-ts/lib/Array'
 * import { ordString } from 'fp-ts/lib/Ord'
 *
 * const O = getOrd(ordString)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 * @function
 * @since 1.2.0
 */
exports.getOrd = function (O) {
    return __assign({}, exports.getSetoid(O), { compare: function (a, b) {
            var aLen = a.length;
            var bLen = b.length;
            var len = Math.min(aLen, bLen);
            for (var i = 0; i < len; i++) {
                var order = O.compare(a[i], b[i]);
                if (order !== 0) {
                    return order;
                }
            }
            return Ord_1.ordNumber.compare(aLen, bLen);
        } });
};
var map = function (fa, f) {
    return fa.map(function (a) { return f(a); });
};
var mapWithIndex = function (fa, f) {
    return fa.map(function (a, i) { return f(i, a); });
};
var of = function (a) {
    return [a];
};
var ap = function (fab, fa) {
    return exports.flatten(map(fab, function (f) { return map(fa, f); }));
};
var chain = function (fa, f) {
    var resLen = 0;
    var l = fa.length;
    var temp = new Array(l);
    for (var i = 0; i < l; i++) {
        var e = fa[i];
        var arr = f(e);
        resLen += arr.length;
        temp[i] = arr;
    }
    var r = Array(resLen);
    var start = 0;
    for (var i = 0; i < l; i++) {
        var arr = temp[i];
        var l_1 = arr.length;
        for (var j = 0; j < l_1; j++) {
            r[j + start] = arr[j];
        }
        start += l_1;
    }
    return r;
};
var reduce = function (fa, b, f) {
    return reduceWithIndex(fa, b, function (_, b, a) { return f(b, a); });
};
var foldMap = function (M) {
    var foldMapWithIndexM = foldMapWithIndex(M);
    return function (fa, f) { return foldMapWithIndexM(fa, function (_, a) { return f(a); }); };
};
var reduceRight = function (fa, b, f) {
    return foldrWithIndex(fa, b, function (_, a, b) { return f(a, b); });
};
var reduceWithIndex = function (fa, b, f) {
    var l = fa.length;
    var r = b;
    for (var i = 0; i < l; i++) {
        r = f(i, r, fa[i]);
    }
    return r;
};
var foldMapWithIndex = function (M) { return function (fa, f) {
    return fa.reduce(function (b, a, i) { return M.concat(b, f(i, a)); }, M.empty);
}; };
var foldrWithIndex = function (fa, b, f) {
    return fa.reduceRight(function (b, a, i) { return f(i, a, b); }, b);
};
function traverse(F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
}
exports.traverse = traverse;
var sequence = function (F) { return function (ta) {
    return reduce(ta, F.of(zero()), function (fas, fa) { return F.ap(F.map(fas, function (as) { return function (a) { return exports.snoc(as, a); }; }), fa); });
}; };
/**
 * An empty array
 *
 * @constant
 * @since 1.9.0
 */
exports.empty = [];
var zero = function () { return exports.empty; };
var alt = function_1.concat;
var unfoldr = function (b, f) {
    var ret = [];
    var bb = b;
    while (true) {
        var mt = f(bb);
        if (mt.isSome()) {
            var _a = mt.value, a = _a[0], b_1 = _a[1];
            ret.push(a);
            bb = b_1;
        }
        else {
            break;
        }
    }
    return ret;
};
/**
 * Return a list of length `n` with element `i` initialized with `f(i)`
 *
 * @example
 * import { makeBy } from 'fp-ts/lib/Array'
 *
 * const double = (n: number): number => n * 2
 * assert.deepEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @function
 * @since 1.10.0
 */
exports.makeBy = function (n, f) {
    var r = [];
    for (var i = 0; i < n; i++) {
        r.push(f(i));
    }
    return r;
};
/**
 * Create an array containing a range of integers, including both endpoints
 *
 * @example
 * import { range } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @function
 * @since 1.10.0
 */
exports.range = function (start, end) {
    return exports.makeBy(end - start + 1, function (i) { return start + i; });
};
/**
 * Create an array containing a value repeated the specified number of times
 *
 * @example
 * import { replicate } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @function
 * @since 1.10.0
 */
exports.replicate = function (n, a) {
    return exports.makeBy(n, function () { return a; });
};
var extend = function (fa, f) {
    return fa.map(function (_, i, as) { return f(as.slice(i)); });
};
/**
 * Removes one level of nesting
 *
 * @example
 * import { flatten } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(flatten([[1], [2], [3]]), [1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.flatten = function (ffa) {
    var rLen = 0;
    var len = ffa.length;
    for (var i = 0; i < len; i++) {
        rLen += ffa[i].length;
    }
    var r = Array(rLen);
    var start = 0;
    for (var i = 0; i < len; i++) {
        var arr = ffa[i];
        var l = arr.length;
        for (var j = 0; j < l; j++) {
            r[j + start] = arr[j];
        }
        start += l;
    }
    return r;
};
/**
 * Break an array into its first element and remaining elements
 *
 * @example
 * import { fold } from 'fp-ts/lib/Array'
 *
 * const len = <A>(as: Array<A>): number => fold(as, 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @function
 * @since 1.0.0
 */
exports.fold = function (as, b, cons) {
    return exports.isEmpty(as) ? b : cons(as[0], as.slice(1));
};
/**
 * Lazy version of {@link fold}
 * @function
 * @since 1.0.0
 */
exports.foldL = function (as, nil, cons) {
    return exports.isEmpty(as) ? nil() : cons(as[0], as.slice(1));
};
/**
 * Break an array into its initial elements and the last element
 * @function
 * @since 1.7.0
 * @param as
 * @param b
 * @param cons
 */
exports.foldr = function (as, b, cons) {
    return exports.isEmpty(as) ? b : cons(as.slice(0, as.length - 1), as[as.length - 1]);
};
/**
 * Lazy version of {@link foldr}
 * @function
 * @since 1.7.0
 * @param as
 * @param nil
 * @param cons
 */
exports.foldrL = function (as, nil, cons) {
    return exports.isEmpty(as) ? nil() : cons(as.slice(0, as.length - 1), as[as.length - 1]);
};
/**
 * Same as `reduce` but it carries over the intermediate steps
 *
 * ```ts
 * import { scanLeft } from 'fp-ts/lib/Array'
 *
 * scanLeft([1, 2, 3], 10, (b, a) => b - a) // [ 10, 9, 7, 4 ]
 * ```
 *
 * @function
 * @since 1.1.0
 */
exports.scanLeft = function (as, b, f) {
    var l = as.length;
    var r = new Array(l + 1);
    r[0] = b;
    for (var i = 0; i < l; i++) {
        r[i + 1] = f(r[i], as[i]);
    }
    return r;
};
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(scanRight([1, 2, 3], 10, (a, b) => b - a), [ 4, 5, 7, 10 ])
 *
 * @function
 * @since 1.1.0
 */
exports.scanRight = function (as, b, f) {
    var l = as.length;
    var r = new Array(l + 1);
    r[l] = b;
    for (var i = l - 1; i >= 0; i--) {
        r[i] = f(as[i], r[i + 1]);
    }
    return r;
};
/**
 * Test whether an array is empty
 *
 * @example
 * import { isEmpty } from 'fp-ts/lib/Array'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @function
 * @since 1.0.0
 */
exports.isEmpty = function (as) {
    return as.length === 0;
};
/**
 * Test whether an array contains a particular index
 * @function
 * @since 1.0.0
 */
exports.isOutOfBound = function (i, as) {
    return i < 0 || i >= as.length;
};
/**
 * This function provides a safe way to read a value at a particular index from an array
 *
 * @example
 * import { index } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(index(1, [1, 2, 3]), some(2))
 * assert.deepEqual(index(3, [1, 2, 3]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.index = function (i, as) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(as[i]);
};
/**
 * Attaches an element to the front of an array, creating a new array
 *
 * @example
 * import { cons } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(cons(0, [1, 2, 3]), [0, 1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.cons = function (a, as) {
    var len = as.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i + 1] = as[i];
    }
    r[0] = a;
    return r;
};
/**
 * Append an element to the end of an array, creating a new array
 *
 * @example
 * import { snoc } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(snoc([1, 2, 3], 4), [1, 2, 3, 4])
 *
 * @function
 * @since 1.0.0
 */
exports.snoc = function (as, a) {
    var len = as.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = as[i];
    }
    r[len] = a;
    return r;
};
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(head([1, 2, 3]), some(1))
 * assert.deepEqual(head([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.head = function (as) {
    return exports.isEmpty(as) ? Option_1.none : Option_1.some(as[0]);
};
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(last([1, 2, 3]), some(3))
 * assert.deepEqual(last([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.last = function (as) {
    return exports.index(as.length - 1, as);
};
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepEqual(tail([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.tail = function (as) {
    return exports.isEmpty(as) ? Option_1.none : Option_1.some(as.slice(1));
};
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepEqual(init([]), none)
 *
 * @function
 * @since 1.0.0
 */
exports.init = function (as) {
    var len = as.length;
    return len === 0 ? Option_1.none : Option_1.some(as.slice(0, len - 1));
};
/**
 * Keep only a number of elements from the start of an array, creating a new array.
 * `n` must be a natural number
 *
 * @example
 * import { take } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(take(2, [1, 2, 3]), [1, 2])
 *
 * @function
 * @since 1.0.0
 */
exports.take = function (n, as) {
    return as.slice(0, n);
};
/**
 * Keep only a number of elements from the end of an array, creating a new array.
 * `n` must be a natural number
 *
 * @example
 * import { takeEnd } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(takeEnd(2, [1, 2, 3, 4, 5]), [4, 5])
 *
 * @function
 * @since 1.10.0
 */
exports.takeEnd = function (n, as) {
    return n === 0 ? exports.empty : as.slice(-n);
};
function takeWhile(as, predicate) {
    var i = spanIndexUncurry(as, predicate);
    var init = Array(i);
    for (var j = 0; j < i; j++) {
        init[j] = as[j];
    }
    return init;
}
exports.takeWhile = takeWhile;
var spanIndexUncurry = function (as, predicate) {
    var l = as.length;
    var i = 0;
    for (; i < l; i++) {
        if (!predicate(as[i])) {
            break;
        }
    }
    return i;
};
function span(as, predicate) {
    var i = spanIndexUncurry(as, predicate);
    var init = Array(i);
    for (var j = 0; j < i; j++) {
        init[j] = as[j];
    }
    var l = as.length;
    var rest = Array(l - i);
    for (var j = i; j < l; j++) {
        rest[j - i] = as[j];
    }
    return { init: init, rest: rest };
}
exports.span = span;
/**
 * Drop a number of elements from the start of an array, creating a new array
 *
 * @example
 * import { drop } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(drop(2, [1, 2, 3]), [3])
 *
 * @function
 * @since 1.0.0
 */
exports.drop = function (n, as) {
    return as.slice(n, as.length);
};
/**
 * Drop a number of elements from the end of an array, creating a new array
 *
 * @example
 * import { dropEnd } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(dropEnd(2, [1, 2, 3, 4, 5]), [1, 2, 3])
 *
 * @function
 * @since 1.10.0
 */
exports.dropEnd = function (n, as) {
    return as.slice(0, as.length - n);
};
/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new array
 *
 * @example
 * import { dropWhile } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(dropWhile([1, 3, 2, 4, 5], n => n % 2 === 1), [2, 4, 5])
 *
 * @function
 * @since 1.0.0
 */
exports.dropWhile = function (as, predicate) {
    var i = spanIndexUncurry(as, predicate);
    var l = as.length;
    var rest = Array(l - i);
    for (var j = i; j < l; j++) {
        rest[j - i] = as[j];
    }
    return rest;
};
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(findIndex([1, 2, 3], x => x === 2), some(1))
 * assert.deepEqual(findIndex([], x => x === 2), none)
 *
 * @function
 * @since 1.0.0
 */
exports.findIndex = function (as, predicate) {
    var len = as.length;
    for (var i = 0; i < len; i++) {
        if (predicate(as[i])) {
            return Option_1.some(i);
        }
    }
    return Option_1.none;
};
function findFirst(as, predicate) {
    var len = as.length;
    for (var i = 0; i < len; i++) {
        if (predicate(as[i])) {
            return Option_1.some(as[i]);
        }
    }
    return Option_1.none;
}
exports.findFirst = findFirst;
function findLast(as, predicate) {
    var len = as.length;
    for (var i = len - 1; i >= 0; i--) {
        if (predicate(as[i])) {
            return Option_1.some(as[i]);
        }
    }
    return Option_1.none;
}
exports.findLast = findLast;
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * interface X {
 *   a: number
 *   b: number
 * }
 * const xs: Array<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepEqual(findLastIndex(xs, x => x.a === 1), some(1))
 * assert.deepEqual(findLastIndex(xs, x => x.a === 4), none)
 *
 * @function
 * @since 1.10.0
 */
exports.findLastIndex = function (as, predicate) {
    var len = as.length;
    for (var i = len - 1; i >= 0; i--) {
        if (predicate(as[i])) {
            return Option_1.some(i);
        }
    }
    return Option_1.none;
};
/**
 * Use {@link filter} instead
 * @function
 * @since 1.0.0
 * @deprecated
 */
exports.refine = function (as, refinement) {
    return filter(as, refinement);
};
/**
 * @function
 * @since 1.0.0
 */
exports.copy = function (as) {
    var l = as.length;
    var r = Array(l);
    for (var i = 0; i < l; i++) {
        r[i] = as[i];
    }
    return r;
};
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeInsertAt = function (i, a, as) {
    var xs = exports.copy(as);
    xs.splice(i, 0, a);
    return xs;
};
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/lib/Array'
 * import { some } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(insertAt(2, 5, [1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @function
 * @since 1.0.0
 */
exports.insertAt = function (i, a, as) {
    return i < 0 || i > as.length ? Option_1.none : Option_1.some(exports.unsafeInsertAt(i, a, as));
};
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeUpdateAt = function (i, a, as) {
    var xs = exports.copy(as);
    xs[i] = a;
    return xs;
};
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(updateAt(1, 1, [1, 2, 3]), some([1, 1, 3]))
 * assert.deepEqual(updateAt(1, 1, []), none)
 *
 * @function
 * @since 1.0.0
 */
exports.updateAt = function (i, a, as) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(exports.unsafeUpdateAt(i, a, as));
};
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeDeleteAt = function (i, as) {
    var xs = exports.copy(as);
    xs.splice(i, 1);
    return xs;
};
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(deleteAt(0, [1, 2, 3]), some([2, 3]))
 * assert.deepEqual(deleteAt(1, []), none)
 *
 * @function
 * @since 1.0.0
 */
exports.deleteAt = function (i, as) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(exports.unsafeDeleteAt(i, as));
};
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepEqual(modifyAt([1, 2, 3], 1, double), some([1, 4, 3]))
 * assert.deepEqual(modifyAt([], 1, double), none)
 *
 * @function
 * @since 1.0.0
 */
exports.modifyAt = function (as, i, f) {
    return exports.isOutOfBound(i, as) ? Option_1.none : Option_1.some(exports.unsafeUpdateAt(i, f(as[i]), as));
};
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @function
 * @since 1.0.0
 */
exports.reverse = function (as) {
    return exports.copy(as).reverse();
};
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/lib/Array'
 * import { right, left } from 'fp-ts/lib/Either'
 *
 * assert.deepEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @function
 * @since 1.0.0
 */
exports.rights = function (as) {
    var r = [];
    var len = as.length;
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (a.isRight()) {
            r.push(a.value);
        }
    }
    return r;
};
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/lib/Array'
 * import { left, right } from 'fp-ts/lib/Either'
 *
 * assert.deepEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @function
 * @since 1.0.0
 */
exports.lefts = function (as) {
    var r = [];
    var len = as.length;
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (a.isLeft()) {
            r.push(a.value);
        }
    }
    return r;
};
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/lib/Array'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepEqual(sort(ordNumber)([3, 2, 1]), [1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.sort = function (O) { return function (as) {
    return exports.copy(as).sort(O.compare);
}; };
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @function
 * @since 1.0.0
 */
exports.zipWith = function (fa, fb, f) {
    var fc = [];
    var len = Math.min(fa.length, fb.length);
    for (var i = 0; i < len; i++) {
        fc[i] = f(fa[i], fb[i]);
    }
    return fc;
};
/**
 * Takes two arrays and returns an array of corresponding pairs. If one input array is short, excess elements of the
 * longer array are discarded
 *
 * @example
 * import { zip } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(zip([1, 2, 3], ['a', 'b', 'c', 'd']), [[1, 'a'], [2, 'b'], [3, 'c']])
 *
 * @function
 * @since 1.0.0
 */
exports.zip = function (fa, fb) {
    return exports.zipWith(fa, fb, function_1.tuple);
};
/**
 * Rotate an array to the right by `n` steps
 *
 * @example
 * import { rotate } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(rotate(2, [1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.rotate = function (n, xs) {
    var len = xs.length;
    if (n === 0 || len <= 1 || len === Math.abs(n)) {
        return xs;
    }
    else if (n < 0) {
        return exports.rotate(len + n, xs);
    }
    else {
        return xs.slice(-n).concat(xs.slice(0, len - n));
    }
};
/**
 * Test if a value is a member of an array. Takes a `Setoid<A>` as a single
 * argument which returns the function to use to search for a value of type `A` in
 * an array of type `Array<A>`.
 *
 * @example
 * import { member } from 'fp-ts/lib/Array'
 * import { setoidString, setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.strictEqual(member(setoidString)(['thing one', 'thing two', 'cat in the hat'], 'thing two'), true)
 * assert.strictEqual(member(setoidNumber)([1, 2, 3], 1), true)
 * assert.strictEqual(member(setoidNumber)([1, 2, 3], 4), false)
 *
 * @function
 * @since 1.3.0
 */
exports.member = function (S) { return function (as, a) {
    var predicate = function (e) { return S.equals(e, a); };
    var i = 0;
    var len = as.length;
    for (; i < len; i++) {
        if (predicate(as[i])) {
            return true;
        }
    }
    return false;
}; };
/**
 * Remove duplicates from an array, keeping the first occurance of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(uniq(setoidNumber)([1, 2, 1]), [1, 2])
 *
 * @function
 * @since 1.3.0
 */
exports.uniq = function (S) {
    var memberS = exports.member(S);
    return function (as) {
        var r = [];
        var len = as.length;
        var i = 0;
        for (; i < len; i++) {
            var a = as[i];
            if (!memberS(r, a)) {
                r.push(a);
            }
        }
        return len === r.length ? as : r;
    };
};
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/lib/Array'
 * import { contramap, ordString, ordNumber } from 'fp-ts/lib/Ord'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 * const byName = contramap((p: Person) => p.name, ordString)
 * const byAge = contramap((p: Person) => p.age, ordNumber)
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * if (sortByNameByAge.isSome()) {
 *   const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 *   assert.deepEqual(sortByNameByAge.value(persons), [
 *     { name: 'a', age: 1 },
 *     { name: 'b', age: 2 },
 *     { name: 'b', age: 3 },
 *     { name: 'c', age: 2 }
 *   ])
 * }
 *
 * @function
 * @since 1.3.0
 */
exports.sortBy = function (ords) {
    return exports.fold(ords, Option_1.none, function (head, tail) { return Option_1.some(exports.sortBy1(head, tail)); });
};
/**
 * Non failing version of {@link sortBy}
 * @example
 * import { sortBy1 } from 'fp-ts/lib/Array'
 * import { contramap, ordString, ordNumber } from 'fp-ts/lib/Ord'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 * const byName = contramap((p: Person) => p.name, ordString)
 * const byAge = contramap((p: Person) => p.age, ordNumber)
 *
 * const sortByNameByAge = sortBy1(byName, [byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @function
 * @since 1.3.0
 */
exports.sortBy1 = function (head, tail) {
    return exports.sort(tail.reduce(Ord_1.getSemigroup().concat, head));
};
/**
 * Apply a function to each element in an array, keeping only the results which contain a value, creating a new array.
 *
 * Alias of {@link Filterable}'s `filterMap`
 *
 * @example
 * import { mapOption } from 'fp-ts/lib/Array'
 * import { Option, some, none } from 'fp-ts/lib/Option'
 *
 * const f = (n: number): Option<number> => (n % 2 === 0 ? none : some(n))
 * assert.deepEqual(mapOption([1, 2, 3], f), [1, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.mapOption = function (as, f) {
    return filterMapWithIndex(as, function (_, a) { return f(a); });
};
/**
 * Filter an array of optional values, keeping only the elements which contain a value, creating a new array.
 *
 * Alias of {@link Compactable}'s `compact`
 *
 * @example
 * import { catOptions } from 'fp-ts/lib/Array'
 * import { some, none } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(catOptions([some(1), none, some(3)]), [1, 3])
 *
 * @function
 * @since 1.0.0
 */
exports.catOptions = function (as) {
    return exports.mapOption(as, function_1.identity);
};
/**
 * @example
 * import { array } from 'fp-ts/lib/Array'
 * import { left, right } from 'fp-ts/lib/Either'
 * import { identity } from 'fp-ts/lib/function'
 *
 * assert.deepEqual(array.partitionMap([right(1), left('foo'), right(2)], identity), { left: ['foo'], right: [1, 2] })
 *
 * @function
 * @since 1.0.0
 */
exports.partitionMap = function (fa, f) {
    return partitionMapWithIndex(fa, function (_, a) { return f(a); });
};
function filter(as, predicate) {
    return as.filter(predicate);
}
exports.filter = filter;
function partition(fa, p) {
    return partitionWithIndex(fa, function (_, a) { return p(a); });
}
exports.partition = partition;
var compact = exports.catOptions;
var separate = function (fa) {
    var left = [];
    var right = [];
    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
        var e = fa_1[_i];
        if (e.isLeft()) {
            left.push(e.value);
        }
        else {
            right.push(e.value);
        }
    }
    return {
        left: left,
        right: right
    };
};
var filterMap = exports.mapOption;
var wither = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), compact); };
};
var wilt = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), separate); };
};
/**
 * A useful recursion pattern for processing an array to produce a new array, often used for "chopping" up the input
 * array. Typically chop is called with some function that will consume an initial prefix of the array and produce a
 * value and the rest of the array.
 *
 * @example
 * import { Setoid, setoidNumber } from 'fp-ts/lib/Setoid'
 * import { chop, span } from 'fp-ts/lib/Array'
 *
 * const group = <A>(S: Setoid<A>) => (as: Array<A>): Array<Array<A>> => {
 *   return chop(as, as => {
 *     const { init, rest } = span(as, a => S.equals(a, as[0]))
 *     return [init, rest]
 *   })
 * }
 * assert.deepEqual(group(setoidNumber)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @function
 * @since 1.10.0
 */
exports.chop = function (as, f) {
    var result = [];
    var cs = as;
    while (cs.length > 0) {
        var _a = f(cs), b = _a[0], c = _a[1];
        result.push(b);
        cs = c;
    }
    return result;
};
/**
 * Splits an array into two pieces, the first piece has `n` elements.
 *
 * @example
 * import { split } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(split(2, [1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @function
 * @since 1.10.0
 */
exports.split = function (n, as) {
    return [as.slice(0, n), as.slice(n)];
};
/**
 * Splits an array into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the array. Note that `chunksOf([], n)` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(xs, n).concat(chunksOf(ys, n)) == chunksOf(xs.concat(ys)), n)
 * ```
 *
 * whenever `n` evenly divides the length of `xs`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/lib/Array'
 *
 * assert.deepEqual(chunksOf([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]])
 *
 * @function
 * @since 1.10.0
 */
exports.chunksOf = function (as, n) {
    return exports.isOutOfBound(n - 1, as) ? [as] : exports.chop(as, function (as) { return exports.split(n, as); });
};
function comprehension(input, f, g) {
    var go = function (scope, input) {
        if (input.length === 0) {
            return f.apply(void 0, scope) ? [g.apply(void 0, scope)] : exports.empty;
        }
        else {
            return chain(input[0], function (x) { return go(exports.snoc(scope, x), input.slice(1)); });
        }
    };
    return go(exports.empty, input);
}
exports.comprehension = comprehension;
/**
 * Creates an array of unique values, in order, from all given arrays using a {@link Setoid} for equality comparisons
 *
 * @example
 * import { union } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(union(setoidNumber)([1, 2], [2, 3]), [1, 2, 3])
 *
 * @function
 * @since 1.12.0
 */
exports.union = function (S) {
    var memberS = exports.member(S);
    return function (xs, ys) { return function_1.concat(xs, ys.filter(function (a) { return !memberS(xs, a); })); };
};
/**
 * Creates an array of unique values that are included in all given arrays using a {@link Setoid} for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { intersection } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(intersection(setoidNumber)([1, 2], [2, 3]), [2])
 *
 * @function
 * @since 1.12.0
 */
exports.intersection = function (S) {
    var memberS = exports.member(S);
    return function (xs, ys) { return xs.filter(function (a) { return memberS(ys, a); }); };
};
/**
 * Creates an array of array values not included in the other given array using a {@link Setoid} for equality
 * comparisons. The order and references of result values are determined by the first array.
 *
 * @example
 * import { difference } from 'fp-ts/lib/Array'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(difference(setoidNumber)([1, 2], [2, 3]), [1])
 *
 * @function
 * @since 1.12.0
 */
exports.difference = function (S) {
    var memberS = exports.member(S);
    return function (xs, ys) { return xs.filter(function (a) { return !memberS(ys, a); }); };
};
var traverseWithIndex = function (F) { return function (ta, f) {
    return reduceWithIndex(ta, F.of(zero()), function (i, fbs, a) {
        return F.ap(F.map(fbs, function (bs) { return function (b) { return exports.snoc(bs, b); }; }), f(i, a));
    });
}; };
var partitionMapWithIndex = function (fa, f) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var e = f(i, fa[i]);
        if (e.isLeft()) {
            left.push(e.value);
        }
        else {
            right.push(e.value);
        }
    }
    return {
        left: left,
        right: right
    };
};
var partitionWithIndex = function (fa, p) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var a = fa[i];
        if (p(i, a)) {
            right.push(a);
        }
        else {
            left.push(a);
        }
    }
    return {
        left: left,
        right: right
    };
};
var filterMapWithIndex = function (fa, f) {
    var result = [];
    for (var i = 0; i < fa.length; i++) {
        var optionB = f(i, fa[i]);
        if (optionB.isSome()) {
            result.push(optionB.value);
        }
    }
    return result;
};
var filterWithIndex = function (fa, p) {
    return fa.filter(function (a, i) { return p(i, a); });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.array = {
    URI: exports.URI,
    map: map,
    mapWithIndex: mapWithIndex,
    compact: compact,
    separate: separate,
    filter: filter,
    filterMap: filterMap,
    partition: partition,
    partitionMap: exports.partitionMap,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: reduceRight,
    unfoldr: unfoldr,
    traverse: traverse,
    sequence: sequence,
    zero: zero,
    alt: alt,
    extend: extend,
    wither: wither,
    wilt: wilt,
    reduceWithIndex: reduceWithIndex,
    foldMapWithIndex: foldMapWithIndex,
    foldrWithIndex: foldrWithIndex,
    traverseWithIndex: traverseWithIndex,
    partitionMapWithIndex: partitionMapWithIndex,
    partitionWithIndex: partitionWithIndex,
    filterMapWithIndex: filterMapWithIndex,
    filterWithIndex: filterWithIndex
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @instance
 * @since 1.4.0
 */
exports.booleanAlgebraBoolean = {
    meet: function (x, y) { return x && y; },
    join: function (x, y) { return x || y; },
    zero: false,
    one: true,
    implies: function (x, y) { return !x || y; },
    not: function (x) { return !x; }
};
/**
 * @instance
 * @since 1.4.0
 */
exports.booleanAlgebraVoid = {
    meet: function () { return undefined; },
    join: function () { return undefined; },
    zero: undefined,
    one: undefined,
    implies: function () { return undefined; },
    not: function () { return undefined; }
};
/**
 * @function
 * @since 1.4.0
 */
exports.getFunctionBooleanAlgebra = function (B) { return function () {
    return {
        meet: function (x, y) { return function (a) { return B.meet(x(a), y(a)); }; },
        join: function (x, y) { return function (a) { return B.join(x(a), y(a)); }; },
        zero: function () { return B.zero; },
        one: function () { return B.one; },
        implies: function (x, y) { return function (a) { return B.implies(x(a), y(a)); }; },
        not: function (x) { return function (a) { return B.not(x(a)); }; }
    };
}; };
/**
 * Every boolean algebras has a dual algebra, which involves reversing one/zero as well as join/meet.
 * @function
 * @since 1.4.0
 */
exports.getDualBooleanAlgebra = function (B) {
    return {
        meet: function (x, y) { return B.join(x, y); },
        join: function (x, y) { return B.meet(x, y); },
        zero: B.one,
        one: B.zero,
        implies: function (x, y) { return B.join(B.not(x), y); },
        not: B.not
    };
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ord_1 = require("./Ord");
/**
 * @instance
 * @since 1.0.0
 */
exports.boundedNumber = __assign({}, Ord_1.ordNumber, { top: Infinity, bottom: -Infinity });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var DistributiveLattice_1 = require("./DistributiveLattice");
/**
 * @function
 * @since 1.4.0
 */
exports.getMinMaxBoundedDistributiveLattice = function (O) { return function (min, max) {
    return __assign({}, DistributiveLattice_1.getMinMaxDistributiveLattice(O), { zero: min, one: max });
}; };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flatten(chain) {
    return function (mma) { return chain.chain(mma, function (ma) { return ma; }); };
}
exports.flatten = flatten;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @function
 * @since 1.0.0
 */
exports.tailRec = function (f, a) {
    var v = f(a);
    while (v.isLeft()) {
        v = f(v.value);
    }
    return v.value;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function splitChoice(F) {
    return function (pab, pcd) {
        return F.compose(F.left(pab), F.right(pcd));
    };
}
exports.splitChoice = splitChoice;
function fanin(F) {
    var splitChoiceF = splitChoice(F);
    return function (pac, pbc) {
        var join = F.promap(F.id(), function (e) { return e.fold(function_1.identity, function_1.identity); }, function_1.identity);
        return F.compose(join, splitChoiceF(pac, pbc));
    };
}
exports.fanin = fanin;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Functor_1 = require("./Functor");
var Option_1 = require("./Option");
function getCompactableComposition(F, G) {
    var FC = Functor_1.getFunctorComposition(F, G);
    var CC = __assign({}, FC, { compact: function (fga) { return F.map(fga, G.compact); }, separate: function (fge) {
            var left = CC.compact(FC.map(fge, function (e) { return e.fold(Option_1.some, function () { return Option_1.none; }); }));
            var right = CC.compact(FC.map(fge, Option_1.fromEither));
            return { left: left, right: right };
        } });
    return CC;
}
exports.getCompactableComposition = getCompactableComposition;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
// Adapted from https://github.com/purescript/purescript-console
/**
 * @function
 * @since 1.0.0
 */
exports.log = function (s) {
    return new IO_1.IO(function () { return console.log(s); }); // tslint:disable-line:no-console
};
/**
 * @function
 * @since 1.0.0
 */
exports.warn = function (s) {
    return new IO_1.IO(function () { return console.warn(s); }); // tslint:disable-line:no-console
};
/**
 * @function
 * @since 1.0.0
 */
exports.error = function (s) {
    return new IO_1.IO(function () { return console.error(s); }); // tslint:disable-line:no-console
};
/**
 * @function
 * @since 1.0.0
 */
exports.info = function (s) {
    return new IO_1.IO(function () { return console.info(s); }); // tslint:disable-line:no-console
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Const';
/**
 * @data
 * @constructor Const
 * @since 1.0.0
 */
var Const = /** @class */ (function () {
    function Const(value) {
        this.value = value;
    }
    Const.prototype.map = function (f) {
        return this;
    };
    Const.prototype.contramap = function (f) {
        return this;
    };
    Const.prototype.fold = function (f) {
        return f(this.value);
    };
    Const.prototype.inspect = function () {
        return this.toString();
    };
    Const.prototype.toString = function () {
        return "new Const(" + function_1.toString(this.value) + ")";
    };
    return Const;
}());
exports.Const = Const;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    return {
        equals: function (x, y) { return S.equals(x.value, y.value); }
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var contramap = function (fa, f) {
    return fa.contramap(f);
};
var ap = function (S) { return function (fab, fa) {
    return new Const(S.concat(fab.value, fa.value));
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getApply = function (S) {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        ap: ap(S)
    };
};
var of = function (M) { return function (a) {
    return new Const(M.empty);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getApplicative = function (M) {
    return __assign({}, exports.getApply(M), { of: of(M) });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.const_ = {
    URI: exports.URI,
    map: map,
    contramap: contramap
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TWITTER_API_BASE_URL = 'https://api.twitter.com';
var ENDPOINTS;
(function (ENDPOINTS) {
    ENDPOINTS["OAuthAuthenticate"] = "/oauth/authenticate";
    ENDPOINTS["OAuthRequestToken"] = "/oauth/request_token";
    ENDPOINTS["OAuthAccessToken"] = "/oauth/access_token";
    ENDPOINTS["StatusesHomeTimeline"] = "/1.1/statuses/home_timeline.json";
    ENDPOINTS["AccountVerifyCredentials"] = "/1.1/account/verify_credentials.json";
    ENDPOINTS["AccountSettings"] = "/1.1/account/settings.json";
})(ENDPOINTS = exports.ENDPOINTS || (exports.ENDPOINTS = {}));
//# sourceMappingURL=constants.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function lift(contravariant) {
    return function (f) { return function (fa) { return contravariant.contramap(fa, f); }; };
}
exports.lift = lift;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
/**
 * Returns the current `Date`
 * @constant
 * @since 1.10.0
 */
exports.create = new IO_1.IO(function () { return new Date(); });
/**
 * Returns the number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC
 * @constant
 * @since 1.10.0
 */
exports.now = new IO_1.IO(function () { return new Date().getTime(); });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ord_1 = require("./Ord");
/**
 * @function
 * @since 1.4.0
 */
exports.getMinMaxDistributiveLattice = function (O) {
    return {
        meet: Ord_1.min(O),
        join: Ord_1.max(O)
    };
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ChainRec_1 = require("./ChainRec");
var function_1 = require("./function");
exports.URI = 'Either';
/**
 * Left side of {@link Either}
 */
var Left = /** @class */ (function () {
    function Left(value) {
        this.value = value;
        this._tag = 'Left';
    }
    /** The given function is applied if this is a `Right` */
    Left.prototype.map = function (f) {
        return this;
    };
    Left.prototype.ap = function (fab) {
        return (fab.isLeft() ? fab : this);
    };
    /**
     * Flipped version of {@link ap}
     */
    Left.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /** Binds the given function across `Right` */
    Left.prototype.chain = function (f) {
        return this;
    };
    Left.prototype.bimap = function (f, g) {
        return new Left(f(this.value));
    };
    Left.prototype.alt = function (fy) {
        return fy;
    };
    /**
     * Lazy version of {@link alt}
     *
     * @example
     * import { right } from 'fp-ts/lib/Either'
     *
     * assert.deepEqual(right(1).orElse(() => right(2)), right(1))
     *
     * @since 1.6.0
     */
    Left.prototype.orElse = function (fy) {
        return fy(this.value);
    };
    Left.prototype.extend = function (f) {
        return this;
    };
    Left.prototype.reduce = function (b, f) {
        return b;
    };
    /** Applies a function to each case in the data structure */
    Left.prototype.fold = function (whenLeft, whenRight) {
        return whenLeft(this.value);
    };
    /** Returns the value from this `Right` or the given argument if this is a `Left` */
    Left.prototype.getOrElse = function (a) {
        return a;
    };
    /** Returns the value from this `Right` or the result of given argument if this is a `Left` */
    Left.prototype.getOrElseL = function (f) {
        return f(this.value);
    };
    /** Maps the left side of the disjunction */
    Left.prototype.mapLeft = function (f) {
        return new Left(f(this.value));
    };
    Left.prototype.inspect = function () {
        return this.toString();
    };
    Left.prototype.toString = function () {
        return "left(" + function_1.toString(this.value) + ")";
    };
    /** Returns `true` if the either is an instance of `Left`, `false` otherwise */
    Left.prototype.isLeft = function () {
        return true;
    };
    /** Returns `true` if the either is an instance of `Right`, `false` otherwise */
    Left.prototype.isRight = function () {
        return false;
    };
    /** Swaps the disjunction values */
    Left.prototype.swap = function () {
        return new Right(this.value);
    };
    Left.prototype.filterOrElse = function (_, zero) {
        return this;
    };
    Left.prototype.filterOrElseL = function (_, zero) {
        return this;
    };
    /**
     * Use {@link filterOrElse} instead
     * @since 1.6.0
     * @deprecated
     */
    Left.prototype.refineOrElse = function (p, zero) {
        return this;
    };
    /**
     * Lazy version of {@link refineOrElse}
     * Use {@link filterOrElseL} instead
     * @since 1.6.0
     * @deprecated
     */
    Left.prototype.refineOrElseL = function (p, zero) {
        return this;
    };
    return Left;
}());
exports.Left = Left;
/**
 * Right side of {@link Either}
 */
var Right = /** @class */ (function () {
    function Right(value) {
        this.value = value;
        this._tag = 'Right';
    }
    Right.prototype.map = function (f) {
        return new Right(f(this.value));
    };
    Right.prototype.ap = function (fab) {
        return fab.isRight() ? this.map(fab.value) : exports.left(fab.value);
    };
    Right.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Right.prototype.chain = function (f) {
        return f(this.value);
    };
    Right.prototype.bimap = function (f, g) {
        return new Right(g(this.value));
    };
    Right.prototype.alt = function (fy) {
        return this;
    };
    Right.prototype.orElse = function (fy) {
        return this;
    };
    Right.prototype.extend = function (f) {
        return new Right(f(this));
    };
    Right.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    Right.prototype.fold = function (whenLeft, whenRight) {
        return whenRight(this.value);
    };
    Right.prototype.getOrElse = function (a) {
        return this.value;
    };
    Right.prototype.getOrElseL = function (f) {
        return this.value;
    };
    Right.prototype.mapLeft = function (f) {
        return new Right(this.value);
    };
    Right.prototype.inspect = function () {
        return this.toString();
    };
    Right.prototype.toString = function () {
        return "right(" + function_1.toString(this.value) + ")";
    };
    Right.prototype.isLeft = function () {
        return false;
    };
    Right.prototype.isRight = function () {
        return true;
    };
    Right.prototype.swap = function () {
        return new Left(this.value);
    };
    Right.prototype.filterOrElse = function (p, zero) {
        return p(this.value) ? this : exports.left(zero);
    };
    Right.prototype.filterOrElseL = function (p, zero) {
        return p(this.value) ? this : exports.left(zero(this.value));
    };
    Right.prototype.refineOrElse = function (p, zero) {
        return p(this.value) ? this : exports.left(zero);
    };
    Right.prototype.refineOrElseL = function (p, zero) {
        return p(this.value) ? this : exports.left(zero(this.value));
    };
    return Right;
}());
exports.Right = Right;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (SL, SA) {
    return {
        equals: function (x, y) {
            return x.isLeft() ? y.isLeft() && SL.equals(x.value, y.value) : y.isRight() && SA.equals(x.value, y.value);
        }
    };
};
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * appended using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getSemigroup<string, number>(semigroupSum)
 * assert.deepEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepEqual(S.concat(right(1), right(2)), right(3))
 *
 * @function
 * @since 1.7.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) { return (y.isLeft() ? x : x.isLeft() ? y : exports.right(S.concat(x.value, y.value))); }
    };
};
/**
 * {@link Apply} semigroup
 *
 * @example
 * import { getApplySemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getApplySemigroup<string, number>(semigroupSum)
 * assert.deepEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepEqual(S.concat(left('a'), right(2)), left('a'))
 * assert.deepEqual(S.concat(right(1), left('b')), left('b'))
 * assert.deepEqual(S.concat(right(1), right(2)), right(3))
 *
 * @function
 * @since 1.7.0
 */
exports.getApplySemigroup = function (S) {
    return {
        concat: function (x, y) { return (x.isLeft() ? x : y.isLeft() ? y : exports.right(S.concat(x.value, y.value))); }
    };
};
/**
 * @function
 * @since 1.7.0
 */
exports.getApplyMonoid = function (M) {
    return __assign({}, exports.getApplySemigroup(M), { empty: exports.right(M.empty) });
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Right(a);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var bimap = function (fla, f, g) {
    return fla.bimap(f, g);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var extend = function (ea, f) {
    return ea.extend(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.isLeft() ? M.empty : f(fa.value);
}; };
var foldr = function (fa, b, f) {
    return fa.isLeft() ? b : f(fa.value, b);
};
var traverse = function (F) { return function (ta, f) {
    return ta.isLeft() ? F.of(exports.left(ta.value)) : F.map(f(ta.value), of);
}; };
var sequence = function (F) { return function (ta) {
    return ta.isLeft() ? F.of(exports.left(ta.value)) : F.map(ta.value, exports.right);
}; };
var chainRec = function (a, f) {
    return ChainRec_1.tailRec(function (e) {
        if (e.isLeft()) {
            return exports.right(exports.left(e.value));
        }
        else {
            var r = e.value;
            return r.isLeft() ? exports.left(f(r.value)) : exports.right(exports.right(r.value));
        }
    }, f(a));
};
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure
 * @function
 * @since 1.0.0
 */
exports.left = function (l) {
    return new Left(l);
};
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure
 * @function
 * @since 1.0.0
 * @alias of
 */
exports.right = of;
function fromPredicate(predicate, whenFalse) {
    return function (a) { return (predicate(a) ? exports.right(a) : exports.left(whenFalse(a))); };
}
exports.fromPredicate = fromPredicate;
/**
 * Use {@link fromPredicate} instead
 * @function
 * @since 1.6.0
 * @deprecated
 */
exports.fromRefinement = function (refinement, whenFalse) { return function (a) {
    return refinement(a) ? exports.right(a) : exports.left(whenFalse(a));
}; };
/**
 * Takes a default and a `Option` value, if the value is a `Some`, turn it into a `Right`, if the value is a `None` use
 * the provided default as a `Left`
 * @function
 * @since 1.0.0
 */
exports.fromOption = function (defaultValue) { return function (fa) {
    return fa.isNone() ? exports.left(defaultValue) : exports.right(fa.value);
}; };
/**
 * Lazy version of {@link fromOption}
 * @function
 * @since 1.3.0
 */
exports.fromOptionL = function (defaultValue) { return function (fa) {
    return fa.isNone() ? exports.left(defaultValue()) : exports.right(fa.value);
}; };
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`
 * @function
 * @since 1.0.0
 */
exports.fromNullable = function (defaultValue) { return function (a) {
    return a == null ? exports.left(defaultValue) : exports.right(a);
}; };
/**
 * Default value for the optional `onerror` argument of `tryCatch`
 * @function
 * @since 1.0.0
 */
exports.toError = function (e) {
    if (e instanceof Error) {
        return e;
    }
    else {
        return new Error(String(e));
    }
};
/**
 * Use {@link tryCatch2v}
 * @function
 * @since 1.0.0
 * @deprecated
 */
exports.tryCatch = function (f, onerror) {
    if (onerror === void 0) { onerror = exports.toError; }
    return exports.tryCatch2v(f, onerror);
};
/**
 * @function
 * @since 1.11.0
 */
exports.tryCatch2v = function (f, onerror) {
    try {
        return exports.right(f());
    }
    catch (e) {
        return exports.left(onerror(e));
    }
};
/**
 * @function
 * @since 1.0.0
 */
exports.fromValidation = function (fa) {
    return fa.isFailure() ? exports.left(fa.value) : exports.right(fa.value);
};
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isLeft = function (fa) {
    return fa.isLeft();
};
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isRight = function (fa) {
    return fa.isRight();
};
/**
 * Builds {@link Compactable} instance for {@link Either} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getCompactable(ML) {
    var compact = function (fa) {
        if (fa.isLeft()) {
            return fa;
        }
        if (fa.value.isNone()) {
            return exports.left(ML.empty);
        }
        return exports.right(fa.value.value);
    };
    var separate = function (fa) {
        if (fa.isLeft()) {
            return {
                left: fa,
                right: fa
            };
        }
        if (fa.value.isLeft()) {
            return {
                left: exports.right(fa.value.value),
                right: exports.left(ML.empty)
            };
        }
        return {
            left: exports.left(ML.empty),
            right: exports.right(fa.value.value)
        };
    };
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        compact: compact,
        separate: separate
    };
}
exports.getCompactable = getCompactable;
/**
 * Builds {@link Filterable} instance for {@link Either} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getFilterable(ML) {
    var C = getCompactable(ML);
    var partitionMap = function (fa, f) {
        if (fa.isLeft()) {
            return {
                left: fa,
                right: fa
            };
        }
        var e = f(fa.value);
        if (e.isLeft()) {
            return {
                left: exports.right(e.value),
                right: exports.left(ML.empty)
            };
        }
        return {
            left: exports.left(ML.empty),
            right: exports.right(e.value)
        };
    };
    var partition = function (fa, p) {
        if (fa.isLeft()) {
            return {
                left: fa,
                right: fa
            };
        }
        if (p(fa.value)) {
            return {
                left: exports.left(ML.empty),
                right: exports.right(fa.value)
            };
        }
        return {
            left: exports.right(fa.value),
            right: exports.left(ML.empty)
        };
    };
    var filterMap = function (fa, f) {
        if (fa.isLeft()) {
            return fa;
        }
        var optionB = f(fa.value);
        if (optionB.isSome()) {
            return exports.right(optionB.value);
        }
        return exports.left(ML.empty);
    };
    var filter = function (fa, p) { return fa.filterOrElse(p, ML.empty); };
    return __assign({}, C, { map: map,
        partitionMap: partitionMap,
        filterMap: filterMap,
        partition: partition,
        filter: filter });
}
exports.getFilterable = getFilterable;
/**
 * Builds {@link Witherable} instance for {@link Either} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getWitherable(ML) {
    var filterableEither = getFilterable(ML);
    var wither = function (F) {
        var traverseF = traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), filterableEither.compact); };
    };
    var wilt = function (F) {
        var traverseF = traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), filterableEither.separate); };
    };
    return __assign({}, filterableEither, { traverse: traverse,
        reduce: reduce,
        wither: wither,
        wilt: wilt });
}
exports.getWitherable = getWitherable;
/**
 * @instance
 * @since 1.0.0
 */
exports.either = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    bimap: bimap,
    alt: alt,
    extend: extend,
    chainRec: chainRec
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Applicative_1 = require("./Applicative");
var Either_1 = require("./Either");
function chain(F) {
    return function (f, fa) { return F.chain(fa, function (e) { return (e.isLeft() ? F.of(Either_1.left(e.value)) : f(e.value)); }); };
}
exports.chain = chain;
function right(F) {
    return function (ma) { return F.map(ma, function (a) { return Either_1.right(a); }); };
}
exports.right = right;
function left(F) {
    return function (ml) { return F.map(ml, function (l) { return Either_1.left(l); }); };
}
exports.left = left;
function fromEither(F) {
    return function (oa) { return F.of(oa); };
}
exports.fromEither = fromEither;
function fold(F) {
    return function (left, right, fa) { return F.map(fa, function (e) { return (e.isLeft() ? left(e.value) : right(e.value)); }); };
}
exports.fold = fold;
function mapLeft(F) {
    return function (f) { return function (fa) { return F.map(fa, function (e) { return e.mapLeft(f); }); }; };
}
exports.mapLeft = mapLeft;
function bimap(F) {
    return function (fa, f, g) { return F.map(fa, function (e) { return e.bimap(f, g); }); };
}
exports.bimap = bimap;
function getEitherT(M) {
    var applicativeComposition = Applicative_1.getApplicativeComposition(M, Either_1.either);
    return __assign({}, applicativeComposition, { chain: chain(M) });
}
exports.getEitherT = getEitherT;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
var IO_1 = require("./IO");
var Option_1 = require("./Option");
// Adapted from https://github.com/purescript/purescript-exceptions
/**
 * Create a JavaScript error, specifying a message
 * @function
 * @since 1.0.0
 */
exports.error = function (message) {
    return new Error(message);
};
/**
 * Get the error message from a JavaScript error
 * @function
 * @since 1.0.0
 */
exports.message = function (e) {
    return e.message;
};
/**
 * Get the stack trace from a JavaScript error
 * @function
 * @since 1.0.0
 */
exports.stack = function (e) {
    return typeof e.stack === 'string' ? Option_1.some(e.stack) : Option_1.none;
};
/**
 * Throw an exception
 * @function
 * @since 1.0.0
 */
exports.throwError = function (e) {
    return new IO_1.IO(function () {
        throw e;
    });
};
/**
 * Catch an exception by providing an exception handler
 * @function
 * @since 1.0.0
 */
exports.catchError = function (ma, handler) {
    return new IO_1.IO(function () {
        try {
            return ma.run();
        }
        catch (e) {
            if (e instanceof Error) {
                return handler(e).run();
            }
            else {
                return handler(new Error(e.toString())).run();
            }
        }
    });
};
/**
 * Runs an IO and returns eventual Exceptions as a `Left` value. If the computation succeeds the result gets wrapped in
 * a `Right`.
 * @function
 * @since 1.0.0
 */
exports.tryCatch = function (ma) {
    return exports.catchError(ma.map(function (a) { return Either_1.right(a); }), function (e) { return IO_1.io.of(Either_1.left(e)); });
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function duplicate(E) {
    return function (ma) { return E.extend(ma, function_1.identity); };
}
exports.duplicate = duplicate;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("fp-ts/lib/Task");
const fetch = require("node-fetch");
exports.fetchTaskEither = (url, init) => task.tryCatch(() => fetch.default(url, init), 
// We assert that we'll only ever receive an `Error` instance from `fetch`
(error) => error);
//# sourceMappingURL=fetch.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @instance
 * @since 1.0.0
 */
exports.fieldNumber = {
    add: function (x, y) { return x + y; },
    zero: 0,
    mul: function (x, y) { return x * y; },
    one: 1,
    sub: function (x, y) { return x - y; },
    degree: function (_) { return 1; },
    div: function (x, y) { return x / y; },
    mod: function (x, y) { return x % y; }
};
/**
 * The *greatest common divisor* of two values
 * @function
 * @since 1.0.0
 */
exports.gcd = function (S, field) {
    var zero = field.zero;
    var f = function (x, y) { return (S.equals(y, zero) ? x : f(y, field.mod(x, y))); };
    return f;
};
/**
 * The *least common multiple* of two values
 * @function
 * @since 1.0.0
 */
exports.lcm = function (S, F) {
    var zero = F.zero;
    var gcdSF = exports.gcd(S, F);
    return function (x, y) { return (S.equals(x, zero) || S.equals(y, zero) ? zero : F.div(F.mul(x, y), gcdSF(x, y))); };
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Compactable_1 = require("./Compactable");
var Option_1 = require("./Option");
function getFilterableComposition(F, G) {
    var FC = __assign({}, Compactable_1.getCompactableComposition(F, G), { partitionMap: function (fga, f) {
            var left = FC.filterMap(fga, function (a) { return f(a).fold(Option_1.some, function () { return Option_1.none; }); });
            var right = FC.filterMap(fga, function (a) { return f(a).fold(function () { return Option_1.none; }, Option_1.some); });
            return { left: left, right: right };
        }, partition: function (fga, p) {
            var left = FC.filter(fga, function (a) { return !p(a); });
            var right = FC.filter(fga, p);
            return { left: left, right: right };
        }, filterMap: function (fga, f) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }, filter: function (fga, f) { return F.map(fga, function (ga) { return G.filter(ga, f); }); } });
    return FC;
}
exports.getFilterableComposition = getFilterableComposition;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Apply_1 = require("./Apply");
var Monoid_1 = require("./Monoid");
var Option_1 = require("./Option");
var Ord_1 = require("./Ord");
function getFoldableComposition(F, G) {
    return {
        reduce: function (fga, b, f) { return F.reduce(fga, b, function (b, ga) { return G.reduce(ga, b, f); }); }
    };
}
exports.getFoldableComposition = getFoldableComposition;
function foldMap(F, M) {
    return function (fa, f) { return F.reduce(fa, M.empty, function (acc, x) { return M.concat(acc, f(x)); }); };
}
exports.foldMap = foldMap;
function foldr(F) {
    var toArrayF = toArray(F);
    return function (fa, b, f) { return toArrayF(fa).reduceRight(function (acc, a) { return f(a, acc); }, b); };
}
exports.foldr = foldr;
function fold(F, M) {
    return function (fa) { return F.reduce(fa, M.empty, M.concat); };
}
exports.fold = fold;
function foldM(F, M) {
    return function (f, b, fa) { return F.reduce(fa, M.of(b), function (mb, a) { return M.chain(mb, function (b) { return f(b, a); }); }); };
}
exports.foldM = foldM;
function traverse_(M, F) {
    var toArrayF = toArray(F);
    var applyFirstM = Apply_1.applyFirst(M);
    var initialValue = M.of(undefined);
    return function (f, fa) { return toArrayF(fa).reduce(function (mu, a) { return applyFirstM(mu, f(a)); }, initialValue); };
}
exports.traverse_ = traverse_;
function sequence_(M, F) {
    var traverse_MF = traverse_(M, F);
    return function (fa) { return traverse_MF(function (ma) { return ma; }, fa); };
}
exports.sequence_ = sequence_;
function oneOf(F, P) {
    return function (fga) { return F.reduce(fga, P.zero(), function (acc, a) { return P.alt(acc, a); }); };
}
exports.oneOf = oneOf;
function intercalate(F, M) {
    return function (sep) {
        function go(_a, x) {
            var init = _a.init, acc = _a.acc;
            return init ? { init: false, acc: x } : { init: false, acc: M.concat(M.concat(acc, sep), x) };
        }
        return function (fm) { return F.reduce(fm, { init: true, acc: M.empty }, go).acc; };
    };
}
exports.intercalate = intercalate;
function sum(F, S) {
    return function (fa) { return F.reduce(fa, S.zero, function (b, a) { return S.add(b, a); }); };
}
exports.sum = sum;
function product(F, S) {
    return function (fa) { return F.reduce(fa, S.one, function (b, a) { return S.mul(b, a); }); };
}
exports.product = product;
function elem(F, S) {
    return function (a, fa) { return F.reduce(fa, false, function (b, x) { return b || S.equals(x, a); }); };
}
exports.elem = elem;
function find(F) {
    return function (fa, p) {
        return F.reduce(fa, Option_1.none, function (b, a) {
            if (b.isNone() && p(a)) {
                return Option_1.some(a);
            }
            else {
                return b;
            }
        });
    };
}
exports.find = find;
function minimum(F, O) {
    var minO = Ord_1.min(O);
    return function (fa) { return F.reduce(fa, Option_1.none, function (b, a) { return (b.isNone() ? Option_1.some(a) : Option_1.some(minO(b.value, a))); }); };
}
exports.minimum = minimum;
function maximum(F, O) {
    var maxO = Ord_1.max(O);
    return function (fa) { return F.reduce(fa, Option_1.none, function (b, a) { return (b.isNone() ? Option_1.some(a) : Option_1.some(maxO(b.value, a))); }); };
}
exports.maximum = maximum;
function toArray(F) {
    var foldMapF = foldMap(F, Monoid_1.unsafeMonoidArray);
    return function (fa) { return foldMapF(fa, function (a) { return [a]; }); };
}
exports.toArray = toArray;
function traverse(M, F) {
    var traverseMF = traverse_(M, F);
    return function (fa, f) { return traverseMF(f, fa); };
}
exports.traverse = traverse;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Monoid_1 = require("./Monoid");
var Option_1 = require("./Option");
var Ord_1 = require("./Ord");
var function_1 = require("./function");
var Foldable_1 = require("./Foldable");
var Apply_1 = require("./Apply");
function getFoldableComposition(F, G) {
    return {
        reduce: function (fga, b, f) { return F.reduce(fga, b, function (b, ga) { return G.reduce(ga, b, f); }); },
        foldMap: function (M) {
            var foldMapF = F.foldMap(M);
            var foldMapG = G.foldMap(M);
            return function (fa, f) { return foldMapF(fa, function (ga) { return foldMapG(ga, f); }); };
        },
        foldr: function (fa, b, f) { return F.foldr(fa, b, function (ga, b) { return G.foldr(ga, b, f); }); }
    };
}
exports.getFoldableComposition = getFoldableComposition;
function fold(M, F) {
    return function (fa) { return F.reduce(fa, M.empty, M.concat); };
}
exports.fold = fold;
function foldM(M, F) {
    return function (fa, b, f) { return F.reduce(fa, M.of(b), function (mb, a) { return M.chain(mb, function (b) { return f(b, a); }); }); };
}
exports.foldM = foldM;
function sequence_(M, F) {
    var traverseMF = traverse_(M, F);
    return function (fa) { return traverseMF(fa, function_1.identity); };
}
exports.sequence_ = sequence_;
function oneOf(P, F) {
    return function (fga) { return F.reduce(fga, P.zero(), function (acc, a) { return P.alt(acc, a); }); };
}
exports.oneOf = oneOf;
function intercalate(M, F) {
    return function (sep, fm) {
        var go = function (_a, x) {
            var init = _a.init, acc = _a.acc;
            return init ? { init: false, acc: x } : { init: false, acc: M.concat(M.concat(acc, sep), x) };
        };
        return F.reduce(fm, { init: true, acc: M.empty }, go).acc;
    };
}
exports.intercalate = intercalate;
function sum(S, F) {
    return function (fa) { return F.reduce(fa, S.zero, function (b, a) { return S.add(b, a); }); };
}
exports.sum = sum;
function product(S, F) {
    return function (fa) { return F.reduce(fa, S.one, function (b, a) { return S.mul(b, a); }); };
}
exports.product = product;
function member(S, F) {
    return function (a, fa) { return F.reduce(fa, false, function (b, x) { return b || S.equals(x, a); }); };
}
exports.member = member;
function findFirst(F) {
    return function (fa, p) {
        return F.reduce(fa, Option_1.none, function (b, a) {
            if (b.isNone() && p(a)) {
                return Option_1.some(a);
            }
            else {
                return b;
            }
        });
    };
}
exports.findFirst = findFirst;
function min(O, F) {
    var minO = Ord_1.min(O);
    return function (fa) { return F.reduce(fa, Option_1.none, function (b, a) { return (b.isNone() ? Option_1.some(a) : Option_1.some(minO(b.value, a))); }); };
}
exports.min = min;
function max(O, F) {
    var maxO = Ord_1.max(O);
    return function (fa) { return F.reduce(fa, Option_1.none, function (b, a) { return (b.isNone() ? Option_1.some(a) : Option_1.some(maxO(b.value, a))); }); };
}
exports.max = max;
function toArray(F) {
    return function (fa) { return Foldable_1.foldMap(F, Monoid_1.unsafeMonoidArray)(fa, function (a) { return [a]; }); };
}
exports.toArray = toArray;
function traverse_(M, F) {
    var toArrayF = toArray(F);
    var applyFirstM = Apply_1.applyFirst(M);
    var initialValue = M.of(undefined);
    return function (fa, f) { return toArrayF(fa).reduce(function (mu, a) { return applyFirstM(mu, f(a)); }, initialValue); };
}
exports.traverse_ = traverse_;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Foldable2v_1 = require("./Foldable2v");
function getFoldableWithIndexComposition(F, G) {
    return __assign({}, Foldable2v_1.getFoldableComposition(F, G), { reduceWithIndex: function (fga, b, f) {
            return F.reduceWithIndex(fga, b, function (fi, b, ga) { return G.reduceWithIndex(ga, b, function (gi, b, a) { return f([fi, gi], b, a); }); });
        }, foldMapWithIndex: function (M) {
            var foldMapWithIndexF = F.foldMapWithIndex(M);
            var foldMapWithIndexG = G.foldMapWithIndex(M);
            return function (fga, f) { return foldMapWithIndexF(fga, function (fi, ga) { return foldMapWithIndexG(ga, function (gi, a) { return f([fi, gi], a); }); }); };
        }, foldrWithIndex: function (fga, b, f) {
            return F.foldrWithIndex(fga, b, function (fi, ga, b) { return G.foldrWithIndex(ga, b, function (gi, a, b) { return f([fi, gi], a, b); }); });
        } });
}
exports.getFoldableWithIndexComposition = getFoldableWithIndexComposition;
"use strict";
// adapted from http://okmij.org/ftp/Computation/free-monad.html
// and https://github.com/purescript/purescript-free
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Free';
var Pure = /** @class */ (function () {
    function Pure(value) {
        this.value = value;
        this._tag = 'Pure';
    }
    Pure.prototype.map = function (f) {
        return new Pure(f(this.value));
    };
    Pure.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <- derived
    };
    /**
     * Flipped version of {@link ap}
     */
    Pure.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Pure.prototype.chain = function (f) {
        return f(this.value);
    };
    Pure.prototype.inspect = function () {
        return this.toString();
    };
    Pure.prototype.toString = function () {
        return "new Pure(" + function_1.toString(this.value) + ")";
    };
    Pure.prototype.isPure = function () {
        return true;
    };
    Pure.prototype.isImpure = function () {
        return false;
    };
    return Pure;
}());
exports.Pure = Pure;
var Impure = /** @class */ (function () {
    function Impure(fx, f) {
        this.fx = fx;
        this.f = f;
        this._tag = 'Impure';
    }
    Impure.prototype.map = function (f) {
        var _this = this;
        return new Impure(this.fx, function (x) { return _this.f(x).map(f); });
    };
    Impure.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <- derived
    };
    Impure.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Impure.prototype.chain = function (f) {
        var _this = this;
        return new Impure(this.fx, function (x) { return _this.f(x).chain(f); });
    };
    Impure.prototype.inspect = function () {
        return this.toString();
    };
    Impure.prototype.toString = function () {
        return "new Impure(" + (function_1.toString(this.fx), function_1.toString(this.f)) + ")";
    };
    Impure.prototype.isPure = function () {
        return false;
    };
    Impure.prototype.isImpure = function () {
        return true;
    };
    return Impure;
}());
exports.Impure = Impure;
/**
 * @function
 * @since 1.0.0
 */
exports.of = function (a) {
    return new Pure(a);
};
/**
 * Lift an impure value described by the generating type constructor `F` into the free monad
 * @function
 * @since 1.0.0
 */
exports.liftF = function (fa) {
    return new Impure(fa, function (a) { return exports.of(a); });
};
var substFree = function (f) {
    function go(fa) {
        switch (fa._tag) {
            case 'Pure':
                return exports.of(fa.value);
            case 'Impure':
                return f(fa.fx).chain(function (x) { return go(fa.f(x)); });
        }
    }
    return go;
};
function hoistFree(nt) {
    return substFree(function (fa) { return exports.liftF(nt(fa)); });
}
exports.hoistFree = hoistFree;
function foldFree(M) {
    return function (nt, fa) {
        if (fa.isPure()) {
            return M.of(fa.value);
        }
        else {
            return M.chain(nt(fa.fx), function (x) { return foldFree(M)(nt, fa.f(x)); });
        }
    };
}
exports.foldFree = foldFree;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @function
 * @since 1.0.0
 */
exports.identity = function (a) {
    return a;
};
/**
 * @constant
 * @since 1.0.0
 */
exports.unsafeCoerce = exports.identity;
/**
 * @function
 * @since 1.0.0
 */
exports.not = function (predicate) {
    return function (a) { return !predicate(a); };
};
function or(p1, p2) {
    return function (a) { return p1(a) || p2(a); };
}
exports.or = or;
/**
 * @function
 * @since 1.0.0
 */
exports.and = function (p1, p2) {
    return function (a) { return p1(a) && p2(a); };
};
/**
 * @function
 * @since 1.0.0
 */
exports.constant = function (a) {
    return function () { return a; };
};
/**
 * A thunk that returns always `true`
 * @function
 * @since 1.0.0
 */
exports.constTrue = function () {
    return true;
};
/**
 * A thunk that returns always `false`
 * @function
 * @since 1.0.0
 */
exports.constFalse = function () {
    return false;
};
/**
 * A thunk that returns always `null`
 * @function
 * @since 1.0.0
 */
exports.constNull = function () {
    return null;
};
/**
 * A thunk that returns always `undefined`
 * @function
 * @since 1.0.0
 */
exports.constUndefined = function () {
    return;
};
/**
 * Flips the order of the arguments to a function of two arguments.
 * @function
 * @since 1.0.0
 */
exports.flip = function (f) {
    return function (b) { return function (a) { return f(a)(b); }; };
};
/**
 * The `on` function is used to change the domain of a binary operator.
 * @function
 * @since 1.0.0
 */
exports.on = function (op) { return function (f) {
    return function (x, y) { return op(f(x), f(y)); };
}; };
function compose() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    var len = fns.length - 1;
    return function (x) {
        var y = x;
        for (var i = len; i > -1; i--) {
            y = fns[i].call(this, y);
        }
        return y;
    };
}
exports.compose = compose;
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    var len = fns.length - 1;
    return function (x) {
        var y = x;
        for (var i = 0; i <= len; i++) {
            y = fns[i].call(this, y);
        }
        return y;
    };
}
exports.pipe = pipe;
/**
 * @function
 * @since 1.0.0
 */
exports.concat = function (x, y) {
    var lenx = x.length;
    var leny = y.length;
    var r = Array(lenx + leny);
    for (var i = 0; i < lenx; i++) {
        r[i] = x[i];
    }
    for (var i = 0; i < leny; i++) {
        r[i + lenx] = y[i];
    }
    return r;
};
function curried(f, n, acc) {
    return function (x) {
        var combined = exports.concat(acc, [x]);
        return n === 0 ? f.apply(this, combined) : curried(f, n - 1, combined);
    };
}
exports.curried = curried;
function curry(f) {
    return curried(f, f.length - 1, []);
}
exports.curry = curry;
/* tslint:disable-next-line */
var getFunctionName = function (f) { return f.displayName || f.name || "<function" + f.length + ">"; };
/**
 * @function
 * @since 1.0.0
 */
exports.toString = function (x) {
    if (typeof x === 'string') {
        return JSON.stringify(x);
    }
    if (x instanceof Date) {
        return "new Date('" + x.toISOString() + "')";
    }
    if (Array.isArray(x)) {
        return "[" + x.map(exports.toString).join(', ') + "]";
    }
    if (typeof x === 'function') {
        return getFunctionName(x);
    }
    if (x == null) {
        return String(x);
    }
    if (typeof x.toString === 'function' && x.toString !== Object.prototype.toString) {
        return x.toString();
    }
    try {
        return JSON.stringify(x, null, 2);
    }
    catch (e) {
        return String(x);
    }
};
/**
 * @function
 * @since 1.0.0
 */
exports.tuple = function (a, b) {
    return [a, b];
};
/**
 * @function
 * @since 1.0.0
 */
exports.tupleCurried = function (a) { return function (b) {
    return [a, b];
}; };
/**
 * Applies a function to an argument ($)
 * @function
 * @since 1.0.0
 */
exports.apply = function (f) { return function (a) {
    return f(a);
}; };
/**
 * Applies an argument to a function (#)
 * @function
 * @since 1.0.0
 */
exports.applyFlipped = function (a) { return function (f) {
    return f(a);
}; };
/** For use with phantom fields */
exports.phantom = undefined;
/**
 * A thunk that returns always the `identity` function.
 * For use with `applySecond` methods.
 * @function
 * @since 1.5.0
 */
exports.constIdentity = function () {
    return exports.identity;
};
/**
 * @function
 * @since 1.9.0
 */
exports.increment = function (n) {
    return n + 1;
};
/**
 * @function
 * @since 1.9.0
 */
exports.decrement = function (n) {
    return n - 1;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function lift(F) {
    return function (f) { return function (fa) { return F.map(fa, f); }; };
}
exports.lift = lift;
function voidRight(F) {
    return function (a, fb) { return F.map(fb, function_1.constant(a)); };
}
exports.voidRight = voidRight;
function voidLeft(F) {
    return function (fa, b) { return F.map(fa, function_1.constant(b)); };
}
exports.voidLeft = voidLeft;
function flap(functor) {
    return function (a, ff) { return functor.map(ff, function (f) { return f(a); }); };
}
exports.flap = flap;
function getFunctorComposition(F, G) {
    return {
        map: function (fa, f) { return F.map(fa, function (ga) { return G.map(ga, f); }); }
    };
}
exports.getFunctorComposition = getFunctorComposition;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Functor_1 = require("./Functor");
function getFunctorWithIndexComposition(F, G) {
    return __assign({}, Functor_1.getFunctorComposition(F, G), { mapWithIndex: function (fga, f) { return F.mapWithIndex(fga, function (fi, ga) { return G.mapWithIndex(ga, function (gi, a) { return f([fi, gi], a); }); }); } });
}
exports.getFunctorWithIndexComposition = getFunctorWithIndexComposition;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const either = require("fp-ts/lib/Either");
const option = require("fp-ts/lib/Option");
exports.createErrorResponse = (errorResponse) => either.left(errorResponse);
exports.typecheck = (a) => a;
// Defaults
exports.defaultOAuthOptions = {
    callback: option.none,
    verifier: option.none,
    token: option.none,
    tokenSecret: option.none,
};
exports.defaultStatusesHomeTimelineQuery = {
    count: option.none,
    max_id: option.none,
};
//# sourceMappingURL=helpers.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Type-level integrity check
/* tslint:disable */
null;
null;
null;
null;
/* tslint:enable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChainRec_1 = require("./ChainRec");
var function_1 = require("./function");
exports.URI = 'Identity';
/**
 * @data
 * @constructor Identity
 * @since 1.0.0
 */
var Identity = /** @class */ (function () {
    function Identity(value) {
        this.value = value;
    }
    Identity.prototype.map = function (f) {
        return new Identity(f(this.value));
    };
    Identity.prototype.ap = function (fab) {
        return this.map(fab.value);
    };
    /**
     * Flipped version of {@link ap}
     */
    Identity.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Identity.prototype.chain = function (f) {
        return f(this.value);
    };
    Identity.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    Identity.prototype.alt = function (fx) {
        return this;
    };
    /**
     * Lazy version of {@link alt}
     *
     * @example
     * import { Identity } from 'fp-ts/lib/Identity'
     *
     * const a = new Identity(1)
     * assert.deepEqual(a.orElse(() => new Identity(2)), a)
     *
     * @since 1.6.0
     */
    Identity.prototype.orElse = function (fx) {
        return this;
    };
    Identity.prototype.extract = function () {
        return this.value;
    };
    Identity.prototype.extend = function (f) {
        return of(f(this));
    };
    Identity.prototype.fold = function (f) {
        return f(this.value);
    };
    Identity.prototype.inspect = function () {
        return this.toString();
    };
    Identity.prototype.toString = function () {
        return "new Identity(" + function_1.toString(this.value) + ")";
    };
    return Identity;
}());
exports.Identity = Identity;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (setoid) {
    return {
        equals: function (x, y) { return setoid.equals(x.value, y.value); }
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Identity(a);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return f(fa.value);
}; };
var foldr = function (fa, b, f) {
    return f(fa.value, b);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var extend = function (ea, f) {
    return ea.extend(f);
};
var extract = function (fa) {
    return fa.value;
};
var chainRec = function (a, f) {
    return new Identity(ChainRec_1.tailRec(function (a) { return f(a).value; }, a));
};
var traverse = function (F) { return function (ta, f) {
    return F.map(f(ta.value), of);
}; };
var sequence = function (F) { return function (ta) {
    return F.map(ta.value, of);
}; };
/**
 * @instance
 * @since 1.0.0
 */
exports.identity = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    alt: alt,
    extract: extract,
    extend: extend,
    chainRec: chainRec
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var alt = require("./Alt");
exports.alt = alt;
var alternative = require("./Alternative");
exports.alternative = alternative;
var applicative = require("./Applicative");
exports.applicative = applicative;
var apply = require("./Apply");
exports.apply = apply;
var array = require("./Array");
exports.array = array;
var bifunctor = require("./Bifunctor");
exports.bifunctor = bifunctor;
var booleanAlgebra = require("./BooleanAlgebra");
exports.booleanAlgebra = booleanAlgebra;
var bounded = require("./Bounded");
exports.bounded = bounded;
var boundedDistributiveLattice = require("./BoundedDistributiveLattice");
exports.boundedDistributiveLattice = boundedDistributiveLattice;
var boundedJoinSemilattice = require("./BoundedJoinSemilattice");
exports.boundedJoinSemilattice = boundedJoinSemilattice;
var boundedLattice = require("./BoundedLattice");
exports.boundedLattice = boundedLattice;
var boundedMeetSemilattice = require("./BoundedMeetSemilattice");
exports.boundedMeetSemilattice = boundedMeetSemilattice;
var category = require("./Category");
exports.category = category;
var chain = require("./Chain");
exports.chain = chain;
var chainRec = require("./ChainRec");
exports.chainRec = chainRec;
var choice = require("./Choice");
exports.choice = choice;
var comonad = require("./Comonad");
exports.comonad = comonad;
var console = require("./Console");
exports.console = console;
var const_ = require("./Const");
exports.const = const_;
var contravariant = require("./Contravariant");
exports.contravariant = contravariant;
var date = require("./Date");
exports.date = date;
var distributiveLattice = require("./DistributiveLattice");
exports.distributiveLattice = distributiveLattice;
var either = require("./Either");
exports.either = either;
var eitherT = require("./EitherT");
exports.eitherT = eitherT;
var exception = require("./Exception");
exports.exception = exception;
var extend = require("./Extend");
exports.extend = extend;
var field = require("./Field");
exports.field = field;
var filterable = require("./Filterable");
exports.filterable = filterable;
var filterableWithIndex = require("./FilterableWithIndex");
exports.filterableWithIndex = filterableWithIndex;
var foldable = require("./Foldable");
exports.foldable = foldable;
var foldable2v = require("./Foldable2v");
exports.foldable2v = foldable2v;
var foldableWithIndex = require("./FoldableWithIndex");
exports.foldableWithIndex = foldableWithIndex;
var free = require("./Free");
exports.free = free;
var function_ = require("./function");
exports.function = function_;
var functor = require("./Functor");
exports.functor = functor;
var functorWithIndex = require("./FunctorWithIndex");
exports.functorWithIndex = functorWithIndex;
var heytingAlgebra = require("./HeytingAlgebra");
exports.heytingAlgebra = heytingAlgebra;
var hkt = require("./HKT");
exports.hkt = hkt;
var identity = require("./Identity");
exports.identity = identity;
var invariant = require("./Invariant");
exports.invariant = invariant;
var io = require("./IO");
exports.io = io;
var ioEither = require("./IOEither");
exports.ioEither = ioEither;
var ioRef = require("./IORef");
exports.ioRef = ioRef;
var ixIO = require("./IxIO");
exports.ixIO = ixIO;
var ixMonad = require("./IxMonad");
exports.ixMonad = ixMonad;
var joinSemilattice = require("./JoinSemilattice");
exports.joinSemilattice = joinSemilattice;
var lattice = require("./Lattice");
exports.lattice = lattice;
var meetSemilattice = require("./MeetSemilattice");
exports.meetSemilattice = meetSemilattice;
var monad = require("./Monad");
exports.monad = monad;
var monadIO = require("./MonadIO");
exports.monadIO = monadIO;
var monadTask = require("./MonadTask");
exports.monadTask = monadTask;
var monoid = require("./Monoid");
exports.monoid = monoid;
var monoidal = require("./Monoidal");
exports.monoidal = monoidal;
var nonEmptyArray = require("./NonEmptyArray");
exports.nonEmptyArray = nonEmptyArray;
var option = require("./Option");
exports.option = option;
var optionT = require("./OptionT");
exports.optionT = optionT;
var ord = require("./Ord");
exports.ord = ord;
var ordering = require("./Ordering");
exports.ordering = ordering;
var pair = require("./Pair");
exports.pair = pair;
var plus = require("./Plus");
exports.plus = plus;
var profunctor = require("./Profunctor");
exports.profunctor = profunctor;
var random = require("./Random");
exports.random = random;
var reader = require("./Reader");
exports.reader = reader;
var readerT = require("./ReaderT");
exports.readerT = readerT;
var readerTaskEither = require("./ReaderTaskEither");
exports.readerTaskEither = readerTaskEither;
var record = require("./Record");
exports.record = record;
var ring = require("./Ring");
exports.ring = ring;
var semigroup = require("./Semigroup");
exports.semigroup = semigroup;
var semigroupoid = require("./Semigroupoid");
exports.semigroupoid = semigroupoid;
var semiring = require("./Semiring");
exports.semiring = semiring;
var set = require("./Set");
exports.set = set;
var setoid = require("./Setoid");
exports.setoid = setoid;
var state = require("./State");
exports.state = state;
var stateT = require("./StateT");
exports.stateT = stateT;
var store = require("./Store");
exports.store = store;
var strmap = require("./StrMap");
exports.strmap = strmap;
var strong = require("./Strong");
exports.strong = strong;
var task = require("./Task");
exports.task = task;
var taskEither = require("./TaskEither");
exports.taskEither = taskEither;
var these = require("./These");
exports.these = these;
var trace = require("./Trace");
exports.trace = trace;
var traversable = require("./Traversable");
exports.traversable = traversable;
var traversable2v = require("./Traversable2v");
exports.traversable2v = traversable2v;
var traversableWithIndex = require("./TraversableWithIndex");
exports.traversableWithIndex = traversableWithIndex;
var tree = require("./Tree");
exports.tree = tree;
var tuple = require("./Tuple");
exports.tuple = tuple;
var unfoldable = require("./Unfoldable");
exports.unfoldable = unfoldable;
var validation = require("./Validation");
exports.validation = validation;
var writer = require("./Writer");
exports.writer = writer;
var compactable = require("./Compactable");
exports.compactable = compactable;
var witherable = require("./Witherable");
exports.witherable = witherable;
var zipper = require("./Zipper");
exports.zipper = zipper;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Decode = require("decode-ts/target");
const either = require("fp-ts/lib/Either");
const task = require("fp-ts/lib/Task");
const oauth_authorization_header_1 = require("oauth-authorization-header");
const querystring = require("querystring");
const qsLib = require("qs");
var Task = task.Task;
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const fetch_1 = require("./helpers/fetch");
const types_1 = require("./types");
exports.fetchFromTwitter = ({ oAuth, endpointPath, method, query }) => {
    const oAuthWithDefaults = Object.assign({}, helpers_1.defaultOAuthOptions, oAuth);
    const baseUrl = `${constants_1.TWITTER_API_BASE_URL}${endpointPath}`;
    // We must use `qs` and not `querystring` for stringifying because that's what
    // `oauth-authorization-header` uses, and the query string needs to be consistent. (`qs` differs
    // in many ways, including the way it stringifies `undefined`.)
    const queryString = qsLib.stringify(query);
    const paramsStr = Object.keys(query).length > 0 ? `?${queryString}` : '';
    const url = `${baseUrl}${paramsStr}`;
    const authorizationHeader = oauth_authorization_header_1.getOAuthAuthorizationHeader({
        oAuth: {
            consumerKey: oAuthWithDefaults.consumerKey,
            consumerSecret: oAuthWithDefaults.consumerSecret,
            callback: oAuthWithDefaults.callback.toUndefined(),
            token: oAuthWithDefaults.token.toUndefined(),
            tokenSecret: oAuthWithDefaults.tokenSecret.toUndefined(),
            verifier: oAuthWithDefaults.verifier.toUndefined(),
        },
        url,
        method,
        queryParams: query,
        formParams: {},
    });
    const headers = { Authorization: authorizationHeader };
    return fetch_1.fetchTaskEither(url, {
        method,
        headers,
    }).map(e => e.mapLeft(error => types_1.ErrorResponse.JavaScriptError({ error })));
};
const handleRequestTokenResponse = response => new Task(() => response.text()).map(text => {
    if (response.ok) {
        const parsed = querystring.parse(text);
        return Decode.validateType(types_1.TwitterAPIRequestTokenResponse)(parsed).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.getRequestToken = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.OAuthRequestToken,
    method: 'POST',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleRequestTokenResponse));
const handleAccessTokenResponse = response => new Task(() => response.text()).map(text => {
    if (response.ok) {
        const parsed = querystring.parse(text);
        return Decode.validateType(types_1.TwitterAPIAccessTokenResponse)(parsed).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.getAccessToken = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.OAuthAccessToken,
    method: 'POST',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleAccessTokenResponse));
// https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-home_timeline
const handleTimelineResponse = (response) => new Task(() => response.text()).map(text => {
    if (response.ok) {
        return Decode.jsonDecodeString(types_1.TwitterAPITimelineResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.fetchHomeTimeline = ({ oAuth, query }) => {
    const queryWithDefaults = Object.assign({}, helpers_1.defaultStatusesHomeTimelineQuery, query);
    return exports.fetchFromTwitter({
        oAuth,
        endpointPath: constants_1.ENDPOINTS.StatusesHomeTimeline,
        method: 'GET',
        query: types_1.StatusesHomeTimelineQuery.encode(queryWithDefaults),
    }).chain(e => e.fold(l => task.task.of(either.left(l)), handleTimelineResponse));
};
// https://developer.twitter.com/en/docs/accounts-and-users/manage-account-settings/api-reference/get-account-verify_credentials
const handleAccountVerifyCredentialsResponse = (response) => new Task(() => response.text()).map(text => {
    if (response.ok) {
        return Decode.jsonDecodeString(types_1.TwitterAPIAccountVerifyCredentials)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.fetchAccountVerifyCredentials = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.AccountVerifyCredentials,
    method: 'GET',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleAccountVerifyCredentialsResponse));
// https://developer.twitter.com/en/docs/accounts-and-users/manage-account-settings/api-reference/get-account-settings
const handleAccountSettingsResponse = (response) => new Task(() => response.text()).map(text => {
    if (response.ok) {
        return Decode.jsonDecodeString(types_1.TwitterAPIAccountSettings)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }));
    }
    else {
        return helpers_1.typecheck(Decode.jsonDecodeString(types_1.TwitterAPIErrorResponse)(text).mapLeft(decodeError => types_1.ErrorResponse.DecodeError({ decodeError }))).chain(apiErrorResponse => helpers_1.createErrorResponse(types_1.ErrorResponse.APIErrorResponse({ apiErrorResponse })));
    }
});
exports.fetchAccountSettings = ({ oAuth }) => exports.fetchFromTwitter({
    oAuth,
    endpointPath: constants_1.ENDPOINTS.AccountSettings,
    method: 'GET',
    query: {},
}).chain(e => e.fold(l => task.task.of(either.left(l)), handleAccountSettingsResponse));
//# sourceMappingURL=index.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'IO';
/**
 * `IO<A>` represents a synchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent a synchronous computation that may fail, please see {@link IOEither}.
 * @data
 * @constructor IO
 * @since 1.0.0
 */
var IO = /** @class */ (function () {
    function IO(run) {
        this.run = run;
    }
    IO.prototype.map = function (f) {
        var _this = this;
        return new IO(function () { return f(_this.run()); });
    };
    IO.prototype.ap = function (fab) {
        var _this = this;
        return new IO(function () { return fab.run()(_this.run()); });
    };
    /**
     * Flipped version of {@link ap}
     */
    IO.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     * @since 1.6.0
     */
    IO.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     * @since 1.5.0
     */
    IO.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    IO.prototype.chain = function (f) {
        var _this = this;
        return new IO(function () { return f(_this.run()).run(); });
    };
    IO.prototype.inspect = function () {
        return this.toString();
    };
    IO.prototype.toString = function () {
        return "new IO(" + function_1.toString(this.run) + ")";
    };
    return IO;
}());
exports.IO = IO;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new IO(function () { return a; });
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) {
            return new IO(function () {
                var xr = x.run();
                var yr = y.run();
                return S.concat(xr, yr);
            });
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (M) {
    return __assign({}, exports.getSemigroup(M), { empty: of(M.empty) });
};
var fromIO = function_1.identity;
/**
 * @instance
 * @since 1.0.0
 */
exports.io = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    fromIO: fromIO
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
var eitherT = require("./EitherT");
var IO_1 = require("./IO");
var function_1 = require("./function");
var eitherTIO = eitherT.getEitherT(IO_1.io);
exports.URI = 'IOEither';
var eitherTfold = eitherT.fold(IO_1.io);
var eitherTmapLeft = eitherT.mapLeft(IO_1.io);
var eitherTbimap = eitherT.bimap(IO_1.io);
/**
 * `IOEither<L, A>` represents a synchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `L`. If you want to represent a synchronous computation that never fails, please see {@link IO}.
 * @data
 * @constructor IOEither
 * @since 1.6.0
 */
var IOEither = /** @class */ (function () {
    function IOEither(value) {
        this.value = value;
    }
    /**
     * Runs the inner io
     */
    IOEither.prototype.run = function () {
        return this.value.run();
    };
    IOEither.prototype.map = function (f) {
        return new IOEither(eitherTIO.map(this.value, f));
    };
    IOEither.prototype.ap = function (fab) {
        return new IOEither(eitherTIO.ap(fab.value, this.value));
    };
    /**
     * Flipped version of {@link ap}
     */
    IOEither.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     */
    IOEither.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     */
    IOEither.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    IOEither.prototype.chain = function (f) {
        return new IOEither(eitherTIO.chain(function (a) { return f(a).value; }, this.value));
    };
    IOEither.prototype.fold = function (left, right) {
        return eitherTfold(left, right, this.value);
    };
    IOEither.prototype.mapLeft = function (f) {
        return new IOEither(eitherTmapLeft(f)(this.value));
    };
    IOEither.prototype.orElse = function (f) {
        return new IOEither(this.value.chain(function (e) { return e.fold(function (l) { return f(l).value; }, function (a) { return eitherTIO.of(a); }); }));
    };
    IOEither.prototype.alt = function (fy) {
        return this.orElse(function () { return fy; });
    };
    IOEither.prototype.bimap = function (f, g) {
        return new IOEither(eitherTbimap(this.value, f, g));
    };
    return IOEither;
}());
exports.IOEither = IOEither;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new IOEither(eitherTIO.of(a));
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var bimap = function (fa, f, g) {
    return fa.bimap(f, g);
};
var eitherTright = eitherT.right(IO_1.io);
/**
 * @function
 * @since 1.6.0
 */
exports.right = function (fa) {
    return new IOEither(eitherTright(fa));
};
var eitherTleft = eitherT.left(IO_1.io);
/**
 * @function
 * @since 1.6.0
 */
exports.left = function (fa) {
    return new IOEither(eitherTleft(fa));
};
var eitherTfromEither = eitherT.fromEither(IO_1.io);
/**
 * @function
 * @since 1.6.0
 */
exports.fromEither = function (fa) {
    return new IOEither(eitherTfromEither(fa));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromLeft = function (l) {
    return exports.fromEither(Either_1.left(l));
};
/**
 * Use {@link tryCatch2v}
 * @function
 * @since 1.6.0
 * @deprecated
 */
exports.tryCatch = function (f, onerror) {
    if (onerror === void 0) { onerror = Either_1.toError; }
    return exports.tryCatch2v(f, onerror);
};
/**
 * @function
 * @since 1.11.0
 */
exports.tryCatch2v = function (f, onerror) {
    return new IOEither(new IO_1.IO(function () { return Either_1.tryCatch2v(f, onerror); }));
};
/**
 * @instance
 * @since 1.6.0
 */
exports.ioEither = {
    URI: exports.URI,
    bimap: bimap,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    alt: alt
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
/**
 * Mutable references in the `IO` monad
 *
 * @example
 * import { newIORef } from 'fp-ts/lib/IORef'
 *
 * assert.strictEqual(
 *   newIORef(1)
 *     .chain(ref => ref.write(2).chain(() => ref.read))
 *     .run(),
 *   2
 * )
 *
 * @data
 * @constructor IORef
 * @since 1.8.0
 */
var IORef = /** @class */ (function () {
    function IORef(value) {
        var _this = this;
        this.value = value;
        this.read = new IO_1.IO(function () { return _this.value; });
    }
    /**
     * @since 1.8.0
     */
    IORef.prototype.write = function (a) {
        var _this = this;
        return new IO_1.IO(function () {
            _this.value = a;
        });
    };
    /**
     * @since 1.8.0
     */
    IORef.prototype.modify = function (f) {
        var _this = this;
        return new IO_1.IO(function () {
            _this.value = f(_this.value);
        });
    };
    return IORef;
}());
exports.IORef = IORef;
/**
 * @function
 * @since 1.8.0
 */
exports.newIORef = function (a) {
    return new IO_1.IO(function () { return new IORef(a); });
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("io-ts");
const option = require("fp-ts/lib/Option");
// https://github.com/gcanti/io-ts-types/blob/d3c51fbd92e4d214acfc45236fd02c4b900088ef/src/fp-ts/createOptionFromNullable.ts
// Difference: `T | undefined` instead of `T | null`
// https://github.com/gcanti/io-ts-types/issues/21
exports.createOptionFromNullable = (type) => {
    const Nullable = t.union([type, t.null, t.undefined]);
    return new t.Type(`Option<${type.name}>`, (m) => m instanceof option.None || (m instanceof option.Some && type.is(m.value)), (s, c) => Nullable.validate(s, c).chain(u => t.success(option.fromNullable(u))), a => a.map(type.encode).toUndefined());
};
//# sourceMappingURL=io-ts.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
var function_1 = require("./function");
exports.URI = 'IxIO';
/**
 * @data
 * @constructor IxIO
 * @since 1.0.0
 */
var IxIO = /** @class */ (function () {
    function IxIO(value) {
        this.value = value;
    }
    IxIO.prototype.run = function () {
        return this.value.run();
    };
    IxIO.prototype.ichain = function (f) {
        return new IxIO(this.value.chain(function (a) { return f(a).value; }));
    };
    IxIO.prototype.map = function (f) {
        return new IxIO(this.value.map(f));
    };
    IxIO.prototype.ap = function (fab) {
        return new IxIO(this.value.ap(fab.value));
    };
    IxIO.prototype.chain = function (f) {
        return new IxIO(this.value.chain(function (a) { return f(a).value; }));
    };
    return IxIO;
}());
exports.IxIO = IxIO;
/**
 * @function
 * @since 1.0.0
 */
exports.iof = function (a) {
    return new IxIO(IO_1.io.of(a));
};
var ichain = function (fa, f) {
    return fa.ichain(f);
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = exports.iof;
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function () {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        _U: function_1.phantom,
        map: map,
        of: of,
        ap: ap,
        chain: chain
    };
};
/**
 * @instance
 * @since 1.0.0
 */
exports.ixIO = {
    URI: exports.URI,
    iof: exports.iof,
    ichain: ichain
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function iapplyFirst(ixmonad) {
    return function (fa, fb) { return ixmonad.ichain(fa, function (a) { return ixmonad.ichain(fb, function () { return ixmonad.iof(a); }); }); };
}
exports.iapplyFirst = iapplyFirst;
function iapplySecond(ixmonad) {
    return function (fa, fb) { return ixmonad.ichain(fa, function_1.constant(fb)); };
}
exports.iapplySecond = iapplySecond;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Semigroup_1 = require("./Semigroup");
/**
 * @function
 * @since 1.0.0
 */
exports.fold = function (M) {
    return Semigroup_1.fold(M)(M.empty);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getProductMonoid = function (MA, MB) {
    return __assign({}, Semigroup_1.getProductSemigroup(MA, MB), { empty: [MA.empty, MB.empty] });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getDualMonoid = function (M) {
    return __assign({}, Semigroup_1.getDualSemigroup(M), { empty: M.empty });
};
/**
 * Boolean monoid under conjunction
 * @instance
 * @since 1.0.0
 */
exports.monoidAll = __assign({}, Semigroup_1.semigroupAll, { empty: true });
/**
 * Boolean monoid under disjunction
 * @instance
 * @since 1.0.0
 */
exports.monoidAny = __assign({}, Semigroup_1.semigroupAny, { empty: false });
var emptyArray = [];
/**
 * @instance
 * @since 1.0.0
 */
exports.unsafeMonoidArray = __assign({}, Semigroup_1.getArraySemigroup(), { empty: emptyArray });
/**
 * Monoid under array concatenation (`Array<any>`)
 * @function
 * @since 1.0.0
 */
exports.getArrayMonoid = function () {
    return exports.unsafeMonoidArray;
};
var emptyObject = {};
/**
 * Gets {@link Monoid} instance for dictionaries given {@link Semigroup} instance for their values
 *
 * @example
 * import { getDictionaryMonoid, fold } from 'fp-ts/lib/Monoid'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const M = getDictionaryMonoid(semigroupSum)
 * assert.deepEqual(fold(M)([{ foo: 123 }, { foo: 456 }]), { foo: 579 })
 *
 * @function
 * @since 1.4.0
 */
exports.getDictionaryMonoid = function (S) {
    return __assign({}, Semigroup_1.getDictionarySemigroup(S), { empty: emptyObject });
};
/**
 * Number monoid under addition
 * @instance
 * @since 1.0.0
 */
exports.monoidSum = __assign({}, Semigroup_1.semigroupSum, { empty: 0 });
/**
 * Number monoid under multiplication
 * @instance
 * @since 1.0.0
 */
exports.monoidProduct = __assign({}, Semigroup_1.semigroupProduct, { empty: 1 });
/**
 * @instance
 * @since 1.0.0
 */
exports.monoidString = __assign({}, Semigroup_1.semigroupString, { empty: '' });
/**
 * @instance
 * @since 1.0.0
 */
exports.monoidVoid = __assign({}, Semigroup_1.semigroupVoid, { empty: undefined });
/**
 * @function
 * @since 1.0.0
 */
exports.getFunctionMonoid = function (M) { return function () {
    return __assign({}, Semigroup_1.getFunctionSemigroup(M)(), { empty: function () { return M.empty; } });
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getEndomorphismMonoid = function () {
    return {
        concat: function_1.compose,
        empty: function_1.identity
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getRecordMonoid = function (monoids) {
    var empty = {};
    var keys = Object.keys(monoids);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        empty[key] = monoids[key].empty;
    }
    return __assign({}, Semigroup_1.getRecordSemigroup(monoids), { empty: empty });
};
/**
 * @function
 * @since 1.9.0
 */
exports.getMeetMonoid = function (B) {
    return __assign({}, Semigroup_1.getMeetSemigroup(B), { empty: B.top });
};
/**
 * @function
 * @since 1.9.0
 */
exports.getJoinMonoid = function (B) {
    return __assign({}, Semigroup_1.getJoinSemigroup(B), { empty: B.bottom });
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Apply_1 = require("./Apply");
var function_1 = require("./function");
function fromApplicative(applicative) {
    return {
        URI: applicative.URI,
        map: applicative.map,
        unit: function () { return applicative.of(undefined); },
        mult: function (fa, fb) { return Apply_1.liftA2(applicative)(function_1.tupleCurried)(fa)(fb); }
    };
}
exports.fromApplicative = fromApplicative;
function toApplicative(monoidal) {
    return {
        URI: monoidal.URI,
        map: monoidal.map,
        of: function (a) { return monoidal.map(monoidal.unit(), function_1.constant(a)); },
        ap: function (fab, fa) { return monoidal.map(monoidal.mult(fab, fa), function (_a) {
            var f = _a[0], a = _a[1];
            return f(a);
        }); }
    };
}
exports.toApplicative = toApplicative;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Array_1 = require("./Array");
var function_1 = require("./function");
var Option_1 = require("./Option");
var Semigroup_1 = require("./Semigroup");
exports.URI = 'NonEmptyArray';
/**
 * Data structure which represents non-empty arrays
 * @data
 * @constructor NonEmptyArray
 * @since 1.0.0
 */
var NonEmptyArray = /** @class */ (function () {
    function NonEmptyArray(head, tail) {
        this.head = head;
        this.tail = tail;
    }
    /**
     * Converts this {@link NonEmptyArray} to plain {@link Array}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).toArray(), [1, 2, 3])
     */
    NonEmptyArray.prototype.toArray = function () {
        return function_1.concat([this.head], this.tail);
    };
    /**
     * Concatenates this {@link NonEmptyArray} and passed {@link Array}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.deepEqual(new NonEmptyArray<number>(1, []).concatArray([2]), new NonEmptyArray(1, [2]))
     */
    NonEmptyArray.prototype.concatArray = function (as) {
        return new NonEmptyArray(this.head, function_1.concat(this.tail, as));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const double = (n: number): number => n * 2
     * assert.deepEqual(new NonEmptyArray(1, [2]).map(double), new NonEmptyArray(2, [4]))
     */
    NonEmptyArray.prototype.map = function (f) {
        return new NonEmptyArray(f(this.head), this.tail.map(f));
    };
    NonEmptyArray.prototype.mapWithIndex = function (f) {
        return new NonEmptyArray(f(0, this.head), Array_1.array.mapWithIndex(this.tail, function (i, a) { return f(i + 1, a); }));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray(1, [2])
     * const double = (n: number): number => n * 2
     * assert.deepEqual(x.ap(new NonEmptyArray(double, [double])).toArray(), [2, 4, 2, 4])
     */
    NonEmptyArray.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <= derived
    };
    /**
     * Flipped version of {@link ap}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray(1, [2])
     * const double = (n: number) => n * 2
     * assert.deepEqual(new NonEmptyArray(double, [double]).ap_(x).toArray(), [2, 4, 2, 4])
     */
    NonEmptyArray.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray(1, [2])
     * const f = (a: number) => new NonEmptyArray(a, [4])
     * assert.deepEqual(x.chain(f).toArray(), [1, 4, 2, 4])
     */
    NonEmptyArray.prototype.chain = function (f) {
        return f(this.head).concatArray(Array_1.array.chain(this.tail, function (a) { return f(a).toArray(); }));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray(1, [2])
     * const y = new NonEmptyArray(3, [4])
     * assert.deepEqual(x.concat(y).toArray(), [1, 2, 3, 4])
     */
    NonEmptyArray.prototype.concat = function (y) {
        return this.concatArray(y.toArray());
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * const x = new NonEmptyArray('a', ['b'])
     * assert.strictEqual(x.reduce('', (b, a) => b + a), 'ab')
     */
    NonEmptyArray.prototype.reduce = function (b, f) {
        return Array_1.array.reduce(this.toArray(), b, f);
    };
    /**
     * @since 1.12.0
     */
    NonEmptyArray.prototype.reduceWithIndex = function (b, f) {
        return Array_1.array.reduceWithIndex(this.toArray(), b, f);
    };
    /**
     * @since 1.12.0
     */
    NonEmptyArray.prototype.foldr = function (b, f) {
        return this.foldrWithIndex(b, function (_, a, b) { return f(a, b); });
    };
    /**
     * @since 1.12.0
     */
    NonEmptyArray.prototype.foldrWithIndex = function (b, f) {
        return f(0, this.head, this.tail.reduceRight(function (acc, a, i) { return f(i + 1, a, acc); }, b));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { fold, monoidSum } from 'fp-ts/lib/Monoid'
     *
     * const sum = (as: NonEmptyArray<number>) => fold(monoidSum)(as.toArray())
     * assert.deepEqual(new NonEmptyArray(1, [2, 3, 4]).extend(sum), new NonEmptyArray(10, [9, 7, 4]))
     */
    NonEmptyArray.prototype.extend = function (f) {
        return unsafeFromArray(Array_1.array.extend(this.toArray(), function (as) { return f(unsafeFromArray(as)); }));
    };
    /**
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.strictEqual(new NonEmptyArray(1, [2, 3]).extract(), 1)
     */
    NonEmptyArray.prototype.extract = function () {
        return this.head;
    };
    /**
     * Same as {@link toString}
     */
    NonEmptyArray.prototype.inspect = function () {
        return this.toString();
    };
    /**
     * Return stringified representation of this {@link NonEmptyArray}
     */
    NonEmptyArray.prototype.toString = function () {
        return "new NonEmptyArray(" + function_1.toString(this.head) + ", " + function_1.toString(this.tail) + ")";
    };
    /**
     * Gets minimum of this {@link NonEmptyArray} using specified {@link Ord} instance
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { ordNumber } from 'fp-ts/lib/Ord'
     *
     * assert.strictEqual(new NonEmptyArray(1, [2, 3]).min(ordNumber), 1)
     *
     * @since 1.3.0
     */
    NonEmptyArray.prototype.min = function (ord) {
        return Semigroup_1.fold(Semigroup_1.getMeetSemigroup(ord))(this.head)(this.tail);
    };
    /**
     * Gets maximum of this {@link NonEmptyArray} using specified {@link Ord} instance
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { ordNumber } from 'fp-ts/lib/Ord'
     *
     * assert.strictEqual(new NonEmptyArray(1, [2, 3]).max(ordNumber), 3)
     *
     * @since 1.3.0
     */
    NonEmptyArray.prototype.max = function (ord) {
        return Semigroup_1.fold(Semigroup_1.getJoinSemigroup(ord))(this.head)(this.tail);
    };
    /**
     * Gets last element of this {@link NonEmptyArray}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.strictEqual(new NonEmptyArray(1, [2, 3]).last(), 3)
     * assert.strictEqual(new NonEmptyArray(1, []).last(), 1)
     *
     * @since 1.6.0
     */
    NonEmptyArray.prototype.last = function () {
        return Array_1.last(this.tail).getOrElse(this.head);
    };
    /**
     * Sorts this {@link NonEmptyArray} using specified {@link Ord} instance
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { ordNumber } from 'fp-ts/lib/Ord'
     *
     * assert.deepEqual(new NonEmptyArray(3, [2, 1]).sort(ordNumber), new NonEmptyArray(1, [2, 3]))
     *
     * @since 1.6.0
     */
    NonEmptyArray.prototype.sort = function (ord) {
        return unsafeFromArray(Array_1.sort(ord)(this.toArray()));
    };
    /**
     * Reverts this {@link NonEmptyArray}
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).reverse(), new NonEmptyArray(3, [2, 1]))
     *
     * @since 1.6.0
     */
    NonEmptyArray.prototype.reverse = function () {
        return unsafeFromArray(this.toArray().reverse());
    };
    /**
     * @since 1.10.0
     */
    NonEmptyArray.prototype.length = function () {
        return 1 + this.tail.length;
    };
    /**
     * This function provides a safe way to read a value at a particular index from an NonEmptyArray
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).index(1), some(2))
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).index(3), none)
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.index = function (i) {
        return i === 0 ? Option_1.some(this.head) : Array_1.index(i - 1, this.tail);
    };
    NonEmptyArray.prototype.findFirst = function (predicate) {
        return predicate(this.head) ? Option_1.some(this.head) : Array_1.findFirst(this.tail, predicate);
    };
    NonEmptyArray.prototype.findLast = function (predicate) {
        var a = Array_1.findLast(this.tail, predicate);
        return a.isSome() ? a : predicate(this.head) ? Option_1.some(this.head) : Option_1.none;
    };
    /**
     * Find the first index for which a predicate holds
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).findIndex(x => x === 2), some(1))
     * assert.deepEqual(new NonEmptyArray<number>(1, []).findIndex(x => x === 2), none)
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.findIndex = function (predicate) {
        if (predicate(this.head)) {
            return Option_1.some(0);
        }
        else {
            var i = Array_1.findIndex(this.tail, predicate);
            return i.isSome() ? Option_1.some(i.value + 1) : Option_1.none;
        }
    };
    /**
     * Returns the index of the last element of the list which matches the predicate
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * interface X {
     *   a: number
     *   b: number
     * }
     * const xs: NonEmptyArray<X> = new NonEmptyArray({ a: 1, b: 0 }, [{ a: 1, b: 1 }])
     * assert.deepEqual(xs.findLastIndex(x => x.a === 1), some(1))
     * assert.deepEqual(xs.findLastIndex(x => x.a === 4), none)
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.findLastIndex = function (predicate) {
        var i = Array_1.findLastIndex(this.tail, predicate);
        return i.isSome() ? Option_1.some(i.value + 1) : predicate(this.head) ? Option_1.some(0) : Option_1.none;
    };
    /**
     * Insert an element at the specified index, creating a new NonEmptyArray, or returning `None` if the index is out of bounds
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3, 4]).insertAt(2, 5), some(new NonEmptyArray(1, [2, 5, 3, 4])))
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.insertAt = function (i, a) {
        if (i === 0) {
            return Option_1.some(new NonEmptyArray(a, this.toArray()));
        }
        else {
            var t = Array_1.insertAt(i - 1, a, this.tail);
            return t.isSome() ? Option_1.some(new NonEmptyArray(this.head, t.value)) : Option_1.none;
        }
    };
    /**
     * Change the element at the specified index, creating a new NonEmptyArray, or returning `None` if the index is out of bounds
     *
     * @example
     * import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(new NonEmptyArray(1, [2, 3]).updateAt(1, 1), some(new NonEmptyArray(1, [1, 3])))
     * assert.deepEqual(new NonEmptyArray(1, []).updateAt(1, 1), none)
     *
     * @function
     * @since 1.11.0
     */
    NonEmptyArray.prototype.updateAt = function (i, a) {
        if (i === 0) {
            return Option_1.some(new NonEmptyArray(a, this.tail));
        }
        else {
            var t = Array_1.updateAt(i - 1, a, this.tail);
            return t.isSome() ? Option_1.some(new NonEmptyArray(this.head, t.value)) : Option_1.none;
        }
    };
    NonEmptyArray.prototype.filter = function (predicate) {
        return this.filterWithIndex(function (_, a) { return predicate(a); });
    };
    /**
     * @function
     * @since 1.12.0
     */
    NonEmptyArray.prototype.filterWithIndex = function (predicate) {
        var t = Array_1.array.filterWithIndex(this.tail, function (i, a) { return predicate(i + 1, a); });
        return predicate(0, this.head) ? Option_1.some(new NonEmptyArray(this.head, t)) : exports.fromArray(t);
    };
    return NonEmptyArray;
}());
exports.NonEmptyArray = NonEmptyArray;
var unsafeFromArray = function (as) {
    return new NonEmptyArray(as[0], as.slice(1));
};
/**
 * Builds {@link NonEmptyArray} from {@link Array} returning {@link Option#none} or {@link Option#some} depending on amount of values in passed array
 * @function
 * @since 1.0.0
 */
exports.fromArray = function (as) {
    return as.length > 0 ? Option_1.some(unsafeFromArray(as)) : Option_1.none;
};
var map = function (fa, f) {
    return fa.map(f);
};
var mapWithIndex = function (fa, f) {
    return fa.mapWithIndex(f);
};
var of = function (a) {
    return new NonEmptyArray(a, []);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var concat = function (fx, fy) {
    return fx.concat(fy);
};
/**
 * Builds {@link Semigroup} instance for {@link NonEmptyArray} of specified type arument
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function () {
    return { concat: concat };
};
/**
 * Group equal, consecutive elements of an array into non empty arrays.
 *
 * @example
 * import { NonEmptyArray, group } from 'fp-ts/lib/NonEmptyArray'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepEqual(group(ordNumber)([1, 2, 1, 1]), [
 *   new NonEmptyArray(1, []),
 *   new NonEmptyArray(2, []),
 *   new NonEmptyArray(1, [1])
 * ])
 *
 * @function
 * @since 1.7.0
 */
exports.group = function (S) { return function (as) {
    var r = [];
    var len = as.length;
    if (len === 0) {
        return r;
    }
    var head = as[0];
    var tail = [];
    for (var i = 1; i < len; i++) {
        var x = as[i];
        if (S.equals(x, head)) {
            tail.push(x);
        }
        else {
            r.push(new NonEmptyArray(head, tail));
            head = x;
            tail = [];
        }
    }
    r.push(new NonEmptyArray(head, tail));
    return r;
}; };
/**
 * Sort and then group the elements of an array into non empty arrays.
 *
 * @example
 * import { NonEmptyArray, groupSort } from 'fp-ts/lib/NonEmptyArray'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepEqual(groupSort(ordNumber)([1, 2, 1, 1]), [new NonEmptyArray(1, [1, 1]), new NonEmptyArray(2, [])])
 *
 * @function
 * @since 1.7.0
 */
exports.groupSort = function (O) {
    return function_1.compose(exports.group(O), Array_1.sort(O));
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.tail.reduce(function (acc, a) { return M.concat(acc, f(a)); }, f(fa.head));
}; };
var foldr = function (fa, b, f) {
    return fa.foldr(b, f);
};
var reduceWithIndex = function (fa, b, f) {
    return fa.reduceWithIndex(b, f);
};
var foldMapWithIndex = function (M) { return function (fa, f) {
    return fa.tail.reduce(function (acc, a, i) { return M.concat(acc, f(i + 1, a)); }, f(0, fa.head));
}; };
var foldrWithIndex = function (fa, b, f) {
    return fa.foldrWithIndex(b, f);
};
var extend = function (fa, f) {
    return fa.extend(f);
};
var extract = function (fa) {
    return fa.extract();
};
function traverse(F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
}
function sequence(F) {
    var sequenceF = Array_1.array.sequence(F);
    return function (ta) {
        return F.ap(F.map(ta.head, function (a) { return function (as) { return new NonEmptyArray(a, as); }; }), sequenceF(ta.tail));
    };
}
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { NonEmptyArray, groupBy } from 'fp-ts/lib/NonEmptyArray'
 *
 * assert.deepEqual(groupBy(['foo', 'bar', 'foobar'], a => String(a.length)), {
 *   '3': new NonEmptyArray('foo', ['bar']),
 *   '6': new NonEmptyArray('foobar', [])
 * })
 *
 * @function
 * @since 1.10.0
 */
exports.groupBy = function (as, f) {
    var r = {};
    for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
        var a = as_1[_i];
        var k = f(a);
        if (r.hasOwnProperty(k)) {
            r[k].tail.push(a);
        }
        else {
            r[k] = new NonEmptyArray(a, []);
        }
    }
    return r;
};
var traverseWithIndex = function (F) {
    var traverseWithIndexF = Array_1.array.traverseWithIndex(F);
    return function (ta, f) {
        var fb = f(0, ta.head);
        var fbs = traverseWithIndexF(ta.tail, function (i, a) { return f(i + 1, a); });
        return F.ap(F.map(fb, function (b) { return function (bs) { return new NonEmptyArray(b, bs); }; }), fbs);
    };
};
/**
 * @instance
 * @since 1.0.0
 */
exports.nonEmptyArray = {
    URI: exports.URI,
    extend: extend,
    extract: extract,
    map: map,
    mapWithIndex: mapWithIndex,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    reduceWithIndex: reduceWithIndex,
    foldMapWithIndex: foldMapWithIndex,
    foldrWithIndex: foldrWithIndex,
    traverseWithIndex: traverseWithIndex
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Monoid_1 = require("./Monoid");
exports.URI = 'Option';
var None = /** @class */ (function () {
    function None() {
        this._tag = 'None';
    }
    /**
     * Takes a function `f` and an `Option` of `A`. Maps `f` either on `None` or `Some`, Option's data constructors. If it
     * maps on `Some` then it will apply the `f` on `Some`'s value, if it maps on `None` it will return `None`.
     *
     * @example
     * import { some } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some(1).map(n => n * 2), some(2))
     */
    None.prototype.map = function (f) {
        return exports.none;
    };
    /**
     * Maps `f` over this `Option`'s value. If the value returned from `f` is null or undefined, returns `None`
     *
     * @example
     * import { none, some } from 'fp-ts/lib/Option'
     *
     * interface Foo {
     *   bar?: {
     *     baz?: string
     *   }
     * }
     *
     * assert.deepEqual(
     *   some<Foo>({ bar: { baz: 'quux' } })
     *     .mapNullable(foo => foo.bar)
     *     .mapNullable(bar => bar.baz),
     *   some('quux')
     * )
     * assert.deepEqual(
     *   some<Foo>({ bar: {} })
     *     .mapNullable(foo => foo.bar)
     *     .mapNullable(bar => bar.baz),
     *   none
     * )
     * assert.deepEqual(
     *   some<Foo>({})
     *     .mapNullable(foo => foo.bar)
     *     .mapNullable(bar => bar.baz),
     *   none
     * )
     */
    None.prototype.mapNullable = function (f) {
        return exports.none;
    };
    /**
     * `ap`, some may also call it "apply". Takes a function `fab` that is in the context of `Option`, and applies that
     * function to this `Option`'s value. If the `Option` calling `ap` is `none` it will return `none`.
     *
     * @example
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some(2).ap(some((x: number) => x + 1)), some(3))
     * assert.deepEqual(none.ap(some((x: number) => x + 1)), none)
     */
    None.prototype.ap = function (fab) {
        return exports.none;
    };
    /**
     * Flipped version of {@link ap}
     *
     * @example
     * import { some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some((x: number) => x + 1).ap_(some(2)), some(3))
     * assert.deepEqual(none.ap_(some(2)), none)
     */
    None.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Returns the result of applying f to this `Option`'s value if this `Option` is nonempty. Returns `None` if this
     * `Option` is empty. Slightly different from `map` in that `f` is expected to return an `Option` (which could be
     * `None`)
     */
    None.prototype.chain = function (f) {
        return exports.none;
    };
    None.prototype.reduce = function (b, f) {
        return b;
    };
    /**
     * `alt` short for alternative, takes another `Option`. If this `Option` is a `Some` type then it will be returned, if
     * it is a `None` then it will return the next `Some` if it exist. If both are `None` then it will return `none`.
     *
     * @example
     * import { Option, some, none } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some(2).alt(some(4)), some(2))
     * const fa: Option<number> = none
     * assert.deepEqual(fa.alt(some(4)), some(4))
     */
    None.prototype.alt = function (fa) {
        return fa;
    };
    /**
     * Lazy version of {@link alt}
     *
     * @example
     * import { some } from 'fp-ts/lib/Option'
     *
     * assert.deepEqual(some(1).orElse(() => some(2)), some(1))
     *
     * @since 1.6.0
     */
    None.prototype.orElse = function (fa) {
        return fa();
    };
    None.prototype.extend = function (f) {
        return exports.none;
    };
    /**
     * Applies a function to each case in the data structure
     *
     * @example
     * import { none, some } from 'fp-ts/lib/Option'
     *
     * assert.strictEqual(some(1).fold('none', a => `some: ${a}`), 'some: 1')
     * assert.strictEqual(none.fold('none', a => `some: ${a}`), 'none')
     */
    None.prototype.fold = function (b, whenSome) {
        return b;
    };
    /** Lazy version of {@link fold} */
    None.prototype.foldL = function (whenNone, whenSome) {
        return whenNone();
    };
    /**
     * Returns the value from this `Some` or the given argument if this is a `None`
     *
     * @example
     * import { Option, none, some } from 'fp-ts/lib/Option'
     *
     * assert.strictEqual(some(1).getOrElse(0), 1)
     * const fa: Option<number> = none
     * assert.strictEqual(fa.getOrElse(0), 0)
     */
    None.prototype.getOrElse = function (a) {
        return a;
    };
    /** Lazy version of {@link getOrElse} */
    None.prototype.getOrElseL = function (f) {
        return f();
    };
    /** Returns the value from this `Some` or `null` if this is a `None` */
    None.prototype.toNullable = function () {
        return null;
    };
    /** Returns the value from this `Some` or `undefined` if this is a `None` */
    None.prototype.toUndefined = function () {
        return undefined;
    };
    None.prototype.inspect = function () {
        return this.toString();
    };
    None.prototype.toString = function () {
        return 'none';
    };
    /** Returns `true` if the option has an element that is equal (as determined by `S`) to `a`, `false` otherwise */
    None.prototype.contains = function (S, a) {
        return false;
    };
    /** Returns `true` if the option is `None`, `false` otherwise */
    None.prototype.isNone = function () {
        return true;
    };
    /** Returns `true` if the option is an instance of `Some`, `false` otherwise */
    None.prototype.isSome = function () {
        return false;
    };
    /**
     * Returns `true` if this option is non empty and the predicate `p` returns `true` when applied to this Option's value
     */
    None.prototype.exists = function (p) {
        return false;
    };
    None.prototype.filter = function (p) {
        return exports.none;
    };
    /**
     * Use {@link filter} instead.
     * Returns this option refined as `Option<B>` if it is non empty and the `refinement` returns `true` when applied to
     * this Option's value. Otherwise returns `None`
     * @since 1.3.0
     * @deprecated
     */
    None.prototype.refine = function (refinement) {
        return exports.none;
    };
    None.value = new None();
    return None;
}());
exports.None = None;
/**
 * @constant
 * @since 1.0.0
 */
exports.none = None.value;
var Some = /** @class */ (function () {
    function Some(value) {
        this.value = value;
        this._tag = 'Some';
    }
    Some.prototype.map = function (f) {
        return new Some(f(this.value));
    };
    Some.prototype.mapNullable = function (f) {
        return exports.fromNullable(f(this.value));
    };
    Some.prototype.ap = function (fab) {
        return fab.isNone() ? exports.none : new Some(fab.value(this.value));
    };
    Some.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Some.prototype.chain = function (f) {
        return f(this.value);
    };
    Some.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    Some.prototype.alt = function (fa) {
        return this;
    };
    Some.prototype.orElse = function (fa) {
        return this;
    };
    Some.prototype.extend = function (f) {
        return new Some(f(this));
    };
    Some.prototype.fold = function (b, whenSome) {
        return whenSome(this.value);
    };
    Some.prototype.foldL = function (whenNone, whenSome) {
        return whenSome(this.value);
    };
    Some.prototype.getOrElse = function (a) {
        return this.value;
    };
    Some.prototype.getOrElseL = function (f) {
        return this.value;
    };
    Some.prototype.toNullable = function () {
        return this.value;
    };
    Some.prototype.toUndefined = function () {
        return this.value;
    };
    Some.prototype.inspect = function () {
        return this.toString();
    };
    Some.prototype.toString = function () {
        return "some(" + function_1.toString(this.value) + ")";
    };
    Some.prototype.contains = function (S, a) {
        return S.equals(this.value, a);
    };
    Some.prototype.isNone = function () {
        return false;
    };
    Some.prototype.isSome = function () {
        return true;
    };
    Some.prototype.exists = function (p) {
        return p(this.value);
    };
    Some.prototype.filter = function (p) {
        return this.exists(p) ? this : exports.none;
    };
    Some.prototype.refine = function (refinement) {
        return this.filter(refinement);
    };
    return Some;
}());
exports.Some = Some;
/**
 *
 * @example
 * import { none, some, getSetoid } from 'fp-ts/lib/Option'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * const S = getSetoid(setoidNumber)
 * assert.strictEqual(S.equals(none, none), true)
 * assert.strictEqual(S.equals(none, some(1)), false)
 * assert.strictEqual(S.equals(some(1), none), false)
 * assert.strictEqual(S.equals(some(1), some(2)), false)
 * assert.strictEqual(S.equals(some(1), some(1)), true)
 *
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    return {
        equals: function (x, y) { return (x.isNone() ? y.isNone() : y.isNone() ? false : S.equals(x.value, y.value)); }
    };
};
/**
 * The `Ord` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 *
 * @example
 * import { none, some, getOrd } from 'fp-ts/lib/Option'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * const O = getOrd(ordNumber)
 * assert.strictEqual(O.compare(none, none), 0)
 * assert.strictEqual(O.compare(none, some(1)), -1)
 * assert.strictEqual(O.compare(some(1), none), 1)
 * assert.strictEqual(O.compare(some(1), some(2)), -1)
 * assert.strictEqual(O.compare(some(1), some(1)), 0)
 *
 * @function
 * @since 1.2.0
 */
exports.getOrd = function (O) {
    return __assign({}, exports.getSetoid(O), { compare: function (x, y) { return (x.isSome() ? (y.isSome() ? O.compare(x.value, y.value) : 1) : y.isSome() ? -1 : 0); } });
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Some(a);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.isNone() ? M.empty : f(fa.value);
}; };
var foldr = function (fa, b, f) {
    return fa.isNone() ? b : f(fa.value, b);
};
var traverse = function (F) { return function (ta, f) {
    return ta.isNone() ? F.of(exports.none) : F.map(f(ta.value), exports.some);
}; };
var sequence = function (F) { return function (ta) {
    return ta.isNone() ? F.of(exports.none) : F.map(ta.value, exports.some);
}; };
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var extend = function (ea, f) {
    return ea.extend(f);
};
var zero = function () {
    return exports.none;
};
/**
 * {@link Apply} semigroup
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | none               |
 * | none    | some(a) | none               |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getApplySemigroup, some, none } from 'fp-ts/lib/Option'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getApplySemigroup(semigroupSum)
 * assert.deepEqual(S.concat(none, none), none)
 * assert.deepEqual(S.concat(some(1), none), none)
 * assert.deepEqual(S.concat(none, some(1)), none)
 * assert.deepEqual(S.concat(some(1), some(2)), some(3))
 *
 * @function
 * @since 1.7.0
 */
exports.getApplySemigroup = function (S) {
    return {
        concat: function (x, y) { return (x.isSome() && y.isSome() ? exports.some(S.concat(x.value, y.value)) : exports.none); }
    };
};
/**
 * @function
 * @since 1.7.0
 */
exports.getApplyMonoid = function (M) {
    return __assign({}, exports.getApplySemigroup(M), { empty: exports.some(M.empty) });
};
/**
 * Monoid returning the left-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(a)      |
 *
 * @example
 * import { getFirstMonoid, some, none } from 'fp-ts/lib/Option'
 *
 * const M = getFirstMonoid<number>()
 * assert.deepEqual(M.concat(none, none), none)
 * assert.deepEqual(M.concat(some(1), none), some(1))
 * assert.deepEqual(M.concat(none, some(1)), some(1))
 * assert.deepEqual(M.concat(some(1), some(2)), some(1))
 *
 * @function
 * @since 1.0.0
 */
exports.getFirstMonoid = function () {
    return {
        concat: alt,
        empty: exports.none
    };
};
/**
 * Monoid returning the right-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(b)      |
 *
 * @example
 * import { getLastMonoid, some, none } from 'fp-ts/lib/Option'
 *
 * const M = getLastMonoid<number>()
 * assert.deepEqual(M.concat(none, none), none)
 * assert.deepEqual(M.concat(some(1), none), some(1))
 * assert.deepEqual(M.concat(none, some(1)), some(1))
 * assert.deepEqual(M.concat(some(1), some(2)), some(2))
 *
 * @function
 * @since 1.0.0
 */
exports.getLastMonoid = function () {
    return Monoid_1.getDualMonoid(exports.getFirstMonoid());
};
/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * appended using the provided `Semigroup`
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | some(a)            |
 * | none    | some(a) | some(a)            |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getMonoid, some, none } from 'fp-ts/lib/Option'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const M = getMonoid(semigroupSum)
 * assert.deepEqual(M.concat(none, none), none)
 * assert.deepEqual(M.concat(some(1), none), some(1))
 * assert.deepEqual(M.concat(none, some(1)), some(1))
 * assert.deepEqual(M.concat(some(1), some(2)), some(3))
 *
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (S) {
    return {
        concat: function (x, y) { return (x.isNone() ? y : y.isNone() ? x : exports.some(S.concat(x.value, y.value))); },
        empty: exports.none
    };
};
/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(fromNullable(undefined), none)
 * assert.deepEqual(fromNullable(null), none)
 * assert.deepEqual(fromNullable(1), some(1))
 *
 * @function
 * @since 1.0.0
 */
exports.fromNullable = function (a) {
    return a == null ? exports.none : new Some(a);
};
/**
 * @function
 * @since 1.0.0
 * @alias of
 */
exports.some = of;
function fromPredicate(predicate) {
    return function (a) { return (predicate(a) ? exports.some(a) : exports.none); };
}
exports.fromPredicate = fromPredicate;
/**
 * Transforms an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in
 * `Some`
 *
 * @example
 * import { none, some, tryCatch } from 'fp-ts/lib/Option'
 *
 * assert.deepEqual(
 *   tryCatch(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepEqual(tryCatch(() => 1), some(1))
 *
 * @function
 * @since 1.0.0
 */
exports.tryCatch = function (f) {
    try {
        return exports.some(f());
    }
    catch (e) {
        return exports.none;
    }
};
/**
 * Constructs a new `Option` from a `Either`. If the value is a `Left`, returns `None`, otherwise returns the inner
 * value wrapped in a `Some`
 *
 * @example
 * import { none, some, fromEither } from 'fp-ts/lib/Option'
 * import { left, right } from 'fp-ts/lib/Either'
 *
 * assert.deepEqual(fromEither(left(1)), none)
 * assert.deepEqual(fromEither(right(1)), some(1))
 *
 * @function
 * @since 1.0.0
 */
exports.fromEither = function (fa) {
    return fa.isLeft() ? exports.none : exports.some(fa.value);
};
/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isSome = function (fa) {
    return fa.isSome();
};
/**
 * Returns `true` if the option is `None`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isNone = function (fa) {
    return fa.isNone();
};
/**
 * Use {@link fromPredicate} instead.
 * Refinement version of {@link fromPredicate}
 * @function
 * @since 1.3.0
 * @deprecated
 */
exports.fromRefinement = function (refinement) { return function (a) {
    return refinement(a) ? exports.some(a) : exports.none;
}; };
/**
 * Returns a refinement from a prism.
 * This function ensures that a custom type guard definition is type-safe.
 *
 * ```ts
 * import { some, none, getRefinement } from 'fp-ts/lib/Option'
 *
 * type A = { type: 'A' }
 * type B = { type: 'B' }
 * type C = A | B
 *
 * const isA = (c: C): c is A => c.type === 'B' // <= typo but typescript doesn't complain
 * const isA = getRefinement<C, A>(c => (c.type === 'B' ? some(c) : none)) // static error: Type '"B"' is not assignable to type '"A"'
 * ```
 *
 * @function
 * @since 1.7.0
 */
exports.getRefinement = function (getOption) {
    return function (a) { return getOption(a).isSome(); };
};
var compact = function (fa) { return fa.chain(function_1.identity); };
var separate = function (fa) {
    if (fa.isNone()) {
        return {
            left: exports.none,
            right: exports.none
        };
    }
    var e = fa.value;
    if (e.isLeft()) {
        return {
            left: exports.some(e.value),
            right: exports.none
        };
    }
    return {
        left: exports.none,
        right: exports.some(e.value)
    };
};
var filter = function (fa, p) { return fa.filter(p); };
var filterMap = chain;
var partitionMap = function (fa, f) {
    return separate(fa.map(f));
};
var partition = function (fa, p) { return ({
    left: fa.filter(function_1.not(p)),
    right: fa.filter(p)
}); };
var wither = function (F) { return function (fa, f) {
    return fa.isNone() ? F.of(fa) : f(fa.value);
}; };
var wilt = function (F) { return function (fa, f) {
    if (fa.isNone()) {
        return F.of({
            left: exports.none,
            right: exports.none
        });
    }
    return F.map(f(fa.value), function (e) {
        if (e.isLeft()) {
            return {
                left: exports.some(e.value),
                right: exports.none
            };
        }
        return {
            left: exports.none,
            right: exports.some(e.value)
        };
    });
}; };
/**
 * @instance
 * @since 1.0.0
 */
exports.option = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    zero: zero,
    alt: alt,
    extend: extend,
    compact: compact,
    separate: separate,
    filter: filter,
    filterMap: filterMap,
    partition: partition,
    partitionMap: partitionMap,
    wither: wither,
    wilt: wilt
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Applicative_1 = require("./Applicative");
var Option_1 = require("./Option");
function chain(F) {
    return function (f, fa) { return F.chain(fa, function (o) { return (o.isNone() ? F.of(Option_1.none) : f(o.value)); }); };
}
exports.chain = chain;
function some(F) {
    return function (a) { return F.of(Option_1.some(a)); };
}
exports.some = some;
function none(F) {
    return function () { return F.of(Option_1.none); };
}
exports.none = none;
function fromOption(F) {
    return function (oa) { return F.of(oa); };
}
exports.fromOption = fromOption;
function liftF(F) {
    return function (fa) { return F.map(fa, function (a) { return Option_1.some(a); }); };
}
exports.liftF = liftF;
function fold(F) {
    return function (r, some, fa) { return F.map(fa, function (o) { return (o.isNone() ? r : some(o.value)); }); };
}
exports.fold = fold;
function getOrElse(F) {
    return function (a) { return function (fa) { return F.map(fa, function (o) { return o.getOrElse(a); }); }; };
}
exports.getOrElse = getOrElse;
function getOptionT(M) {
    var applicativeComposition = Applicative_1.getApplicativeComposition(M, Option_1.option);
    return __assign({}, applicativeComposition, { chain: chain(M) });
}
exports.getOptionT = getOptionT;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ordering_1 = require("./Ordering");
var Setoid_1 = require("./Setoid");
var function_1 = require("./function");
/**
 * @function
 * @since 1.0.0
 */
exports.unsafeCompare = function (x, y) {
    return x < y ? -1 : x > y ? 1 : 0;
};
/**
 * @instance
 * @since 1.0.0
 */
exports.ordString = __assign({}, Setoid_1.setoidString, { compare: exports.unsafeCompare });
/**
 * @instance
 * @since 1.0.0
 */
exports.ordNumber = __assign({}, Setoid_1.setoidNumber, { compare: exports.unsafeCompare });
/**
 * @instance
 * @since 1.0.0
 */
exports.ordBoolean = __assign({}, Setoid_1.setoidBoolean, { compare: exports.unsafeCompare });
/**
 * Test whether one value is _strictly less than_ another
 * @function
 * @since 1.0.0
 */
exports.lessThan = function (O) { return function (x, y) {
    return O.compare(x, y) === -1;
}; };
/**
 * Test whether one value is _strictly greater than_ another
 * @function
 * @since 1.0.0
 */
exports.greaterThan = function (O) { return function (x, y) {
    return O.compare(x, y) === 1;
}; };
/**
 * Test whether one value is _non-strictly less than_ another
 * @function
 * @since 1.0.0
 */
exports.lessThanOrEq = function (O) { return function (x, y) {
    return O.compare(x, y) !== 1;
}; };
/**
 * Test whether one value is _non-strictly greater than_ another
 * @function
 * @since 1.0.0
 */
exports.greaterThanOrEq = function (O) { return function (x, y) {
    return O.compare(x, y) !== -1;
}; };
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 * @function
 * @since 1.0.0
 */
exports.min = function (O) { return function (x, y) {
    return O.compare(x, y) === 1 ? y : x;
}; };
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 * @function
 * @since 1.0.0
 */
exports.max = function (O) { return function (x, y) {
    return O.compare(x, y) === -1 ? y : x;
}; };
/**
 * Clamp a value between a minimum and a maximum
 * @function
 * @since 1.0.0
 */
exports.clamp = function (O) {
    var minO = exports.min(O);
    var maxO = exports.max(O);
    return function (low, hi) { return function (x) { return maxO(minO(x, hi), low); }; };
};
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 * @function
 * @since 1.0.0
 */
exports.between = function (O) {
    var lessThanO = exports.lessThan(O);
    var greaterThanO = exports.greaterThan(O);
    return function (low, hi) { return function (x) { return (lessThanO(x, low) || greaterThanO(x, hi) ? false : true); }; };
};
/**
 * @function
 * @since 1.0.0
 */
exports.fromCompare = function (compare) {
    return {
        equals: function (x, y) { return compare(x, y) === 0; },
        compare: compare
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.contramap = function (f, fa) {
    return exports.fromCompare(function_1.on(fa.compare)(f));
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function () {
    return {
        concat: function (x, y) { return exports.fromCompare(function (a, b) { return Ordering_1.semigroupOrdering.concat(x.compare(a, b), y.compare(a, b)); }); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getProductOrd = function (OA, OB) {
    var S = Setoid_1.getProductSetoid(OA, OB);
    return __assign({}, S, { compare: function (_a, _b) {
            var xa = _a[0], xb = _a[1];
            var ya = _b[0], yb = _b[1];
            var r = OA.compare(xa, ya);
            return r === 0 ? OB.compare(xb, yb) : r;
        } });
};
/**
 * @function
 * @since 1.3.0
 */
exports.getDualOrd = function (O) {
    return exports.fromCompare(function (x, y) { return O.compare(y, x); });
};
/**
 * @instance
 * @since 1.4.0
 */
exports.ordDate = exports.contramap(function (date) { return date.valueOf(); }, exports.ordNumber);
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @function
 * @since 1.0.0
 */
exports.sign = function (n) {
    return n <= -1 ? -1 : n >= 1 ? 1 : 0;
};
/**
 * @instance
 * @since 1.0.0
 */
exports.setoidOrdering = {
    equals: function (x, y) { return x === y; }
};
/**
 * @instance
 * @since 1.0.0
 */
exports.semigroupOrdering = {
    concat: function (x, y) { return (x !== 0 ? x : y); }
};
/**
 * @function
 * @since 1.0.0
 */
exports.invert = function (O) {
    switch (O) {
        case -1:
            return 1;
        case 1:
            return -1;
        default:
            return 0;
    }
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ordering_1 = require("./Ordering");
exports.URI = 'Pair';
/**
 * @data
 * @constructor Pair
 * @since 1.0.0
 */
var Pair = /** @class */ (function () {
    function Pair(fst, snd) {
        this.fst = fst;
        this.snd = snd;
    }
    /** Map a function over the first field of a pair */
    Pair.prototype.first = function (f) {
        return new Pair(f(this.fst), this.snd);
    };
    /** Map a function over the second field of a pair */
    Pair.prototype.second = function (f) {
        return new Pair(this.fst, f(this.snd));
    };
    /** Swaps the elements in a pair */
    Pair.prototype.swap = function () {
        return new Pair(this.snd, this.fst);
    };
    Pair.prototype.map = function (f) {
        return new Pair(f(this.fst), f(this.snd));
    };
    Pair.prototype.ap = function (fab) {
        return new Pair(fab.fst(this.fst), fab.snd(this.snd));
    };
    /**
     * Flipped version of {@link ap}
     */
    Pair.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Pair.prototype.reduce = function (b, f) {
        return f(f(b, this.fst), this.snd);
    };
    Pair.prototype.extract = function () {
        return this.fst;
    };
    Pair.prototype.extend = function (f) {
        return new Pair(f(this), f(this.swap()));
    };
    return Pair;
}());
exports.Pair = Pair;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Pair(a, a);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return M.concat(f(fa.fst), f(fa.snd));
}; };
var foldr = function (fa, b, f) {
    return f(fa.fst, f(fa.snd, b));
};
var extract = function (fa) {
    return fa.extract();
};
var extend = function (fa, f) {
    return fa.extend(f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    return {
        equals: function (x, y) { return S.equals(x.fst, y.fst) && S.equals(x.snd, y.snd); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getOrd = function (O) {
    return __assign({}, exports.getSetoid(O), { compare: function (x, y) { return Ordering_1.semigroupOrdering.concat(O.compare(x.fst, y.fst), O.compare(x.snd, y.snd)); } });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) { return new Pair(S.concat(x.fst, y.fst), S.concat(x.snd, y.snd)); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (M) {
    return __assign({}, exports.getSemigroup(M), { empty: new Pair(M.empty, M.empty) });
};
var traverse = function (F) { return function (ta, f) {
    return F.ap(F.map(f(ta.fst), function (b1) { return function (b2) { return new Pair(b1, b2); }; }), f(ta.snd));
}; };
var sequence = function (F) { return function (ta) {
    return F.ap(F.map(ta.fst, function (a1) { return function (a2) { return new Pair(a1, a2); }; }), ta.snd);
}; };
/**
 * @instance
 * @since 1.0.0
 */
exports.pair = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    extend: extend,
    extract: extract
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function lmap(profunctor) {
    return function (fbc, f) { return profunctor.promap(fbc, f, function (c) { return c; }); };
}
exports.lmap = lmap;
function rmap(profunctor) {
    return function (fbc, g) { return profunctor.promap(fbc, function (b) { return b; }, g); };
}
exports.rmap = rmap;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
// Adapted from https://github.com/purescript/purescript-random
/**
 * Returns a random number between 0 (inclusive) and 1 (exclusive). This is a direct wrapper around JavaScript's
 * `Math.random()`.
 * @constant
 * @since 1.0.0
 */
exports.random = new IO_1.IO(function () { return Math.random(); });
/**
 * Takes a range specified by `low` (the first argument) and `high` (the second), and returns a random integer uniformly
 * distributed in the closed interval `[low, high]`. It is unspecified what happens if `low > high`, or if either of
 * `low` or `high` is not an integer.
 * @function
 * @since 1.0.0
 */
exports.randomInt = function (low, high) {
    return exports.random.map(function (n) { return Math.floor((high - low + 1) * n + low); });
};
/**
 * Returns a random number between a minimum value (inclusive) and a maximum value (exclusive). It is unspecified what
 * happens if `maximum < minimum`.
 * @function
 * @since 1.0.0
 */
exports.randomRange = function (min, max) {
    return exports.random.map(function (n) { return (max - min) * n + min; });
};
/**
 * Returns a random boolean value with an equal chance of being `true` or `false`
 * @constant
 * @since 1.0.0
 */
exports.randomBool = exports.random.map(function (n) { return n < 0.5; });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Either_1 = require("./Either");
exports.URI = 'Reader';
/**
 * @data
 * @constructor Reader
 * @since 1.0.0
 */
var Reader = /** @class */ (function () {
    function Reader(run) {
        this.run = run;
    }
    Reader.prototype.map = function (f) {
        var _this = this;
        return new Reader(function (e) { return f(_this.run(e)); });
    };
    Reader.prototype.ap = function (fab) {
        var _this = this;
        return new Reader(function (e) { return fab.run(e)(_this.run(e)); });
    };
    /**
     * Flipped version of {@link ap}
     */
    Reader.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Reader.prototype.chain = function (f) {
        var _this = this;
        return new Reader(function (e) { return f(_this.run(e)).run(e); });
    };
    /**
     * @since 1.6.1
     */
    Reader.prototype.local = function (f) {
        var _this = this;
        return new Reader(function (e) { return _this.run(f(e)); });
    };
    return Reader;
}());
exports.Reader = Reader;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Reader(function (e) { return a; });
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * reads the current context
 * @function
 * @since 1.0.0
 */
exports.ask = function () {
    return new Reader(function_1.identity);
};
/**
 * Projects a value from the global context in a Reader
 * @function
 * @since 1.0.0
 */
exports.asks = function (f) {
    return new Reader(f);
};
/**
 * changes the value of the local context during the execution of the action `fa`
 * @function
 * @since 1.0.0
 */
exports.local = function (f) { return function (fa) {
    return fa.local(f);
}; };
var promap = function (fbc, f, g) {
    return new Reader(function (a) { return g(fbc.run(f(a))); });
};
var compose = function (ab, la) {
    return new Reader(function (l) { return ab.run(la.run(l)); });
};
var id = function () {
    return new Reader(function_1.identity);
};
var first = function (pab) {
    return new Reader(function (_a) {
        var a = _a[0], c = _a[1];
        return function_1.tuple(pab.run(a), c);
    });
};
var second = function (pbc) {
    return new Reader(function (_a) {
        var a = _a[0], b = _a[1];
        return function_1.tuple(a, pbc.run(b));
    });
};
var left = function (pab) {
    return new Reader(function (e) { return e.fold(function (a) { return Either_1.left(pab.run(a)); }, Either_1.right); });
};
var right = function (pbc) {
    return new Reader(function (e) { return e.fold(Either_1.left, function (b) { return Either_1.right(pbc.run(b)); }); });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.reader = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    promap: promap,
    compose: compose,
    id: id,
    first: first,
    second: second,
    left: left,
    right: right
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function map(F) {
    return function (f, fa) { return function (e) { return F.map(fa(e), f); }; };
}
exports.map = map;
function of(F) {
    return function (a) { return function (e) { return F.of(a); }; };
}
exports.of = of;
function ap(F) {
    return function (fab, fa) { return function (e) { return F.ap(fab(e), fa(e)); }; };
}
exports.ap = ap;
function chain(F) {
    return function (f, fa) { return function (e) { return F.chain(fa(e), function (a) { return f(a)(e); }); }; };
}
exports.chain = chain;
function ask(F) {
    return function () { return F.of; };
}
exports.ask = ask;
function asks(F) {
    return function (f) { return function (e) { return F.of(f(e)); }; };
}
exports.asks = asks;
function fromReader(F) {
    return function (fa) { return function (e) { return F.of(fa.run(e)); }; };
}
exports.fromReader = fromReader;
function getReaderT(M) {
    return {
        map: map(M),
        of: of(M),
        ap: ap(M),
        chain: chain(M)
    };
}
exports.getReaderT = getReaderT;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Reader_1 = require("./Reader");
var readerT = require("./ReaderT");
var taskEither = require("./TaskEither");
var readerTTaskEither = readerT.getReaderT(taskEither.taskEither);
exports.URI = 'ReaderTaskEither';
/**
 * @data
 * @constructor ReaderTaskEither
 * @since 1.6.0
 */
var ReaderTaskEither = /** @class */ (function () {
    function ReaderTaskEither(value) {
        this.value = value;
    }
    /** Runs the inner `TaskEither` */
    ReaderTaskEither.prototype.run = function (e) {
        return this.value(e).run();
    };
    ReaderTaskEither.prototype.map = function (f) {
        return new ReaderTaskEither(readerTTaskEither.map(f, this.value));
    };
    ReaderTaskEither.prototype.ap = function (fab) {
        return new ReaderTaskEither(readerTTaskEither.ap(fab.value, this.value));
    };
    /**
     * Flipped version of {@link ap}
     */
    ReaderTaskEither.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     */
    ReaderTaskEither.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     */
    ReaderTaskEither.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    ReaderTaskEither.prototype.chain = function (f) {
        return new ReaderTaskEither(readerTTaskEither.chain(function (a) { return f(a).value; }, this.value));
    };
    ReaderTaskEither.prototype.fold = function (left, right) {
        var _this = this;
        return new Reader_1.Reader(function (e) { return _this.value(e).fold(left, right); });
    };
    ReaderTaskEither.prototype.mapLeft = function (f) {
        var _this = this;
        return new ReaderTaskEither(function (e) { return _this.value(e).mapLeft(f); });
    };
    /**
     * Transforms the failure value of the `ReaderTaskEither` into a new `ReaderTaskEither`
     */
    ReaderTaskEither.prototype.orElse = function (f) {
        var _this = this;
        return new ReaderTaskEither(function (e) { return _this.value(e).orElse(function (l) { return f(l).value(e); }); });
    };
    ReaderTaskEither.prototype.alt = function (fy) {
        return this.orElse(function () { return fy; });
    };
    ReaderTaskEither.prototype.bimap = function (f, g) {
        var _this = this;
        return new ReaderTaskEither(function (e) { return _this.value(e).bimap(f, g); });
    };
    /**
     * @since 1.6.1
     */
    ReaderTaskEither.prototype.local = function (f) {
        var _this = this;
        return new ReaderTaskEither(function (e) { return _this.value(f(e)); });
    };
    return ReaderTaskEither;
}());
exports.ReaderTaskEither = ReaderTaskEither;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new ReaderTaskEither(readerTTaskEither.of(a));
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var bimap = function (fa, f, g) {
    return fa.bimap(f, g);
};
var readerTask = readerT.ask(taskEither.taskEither);
/**
 * @function
 * @since 1.6.0
 */
exports.ask = function () {
    return new ReaderTaskEither(readerTask());
};
var readerTasks = readerT.asks(taskEither.taskEither);
/**
 * @function
 * @since 1.6.0
 */
exports.asks = function (f) {
    return new ReaderTaskEither(readerTasks(f));
};
/**
 * @function
 * @since 1.6.0
 */
exports.local = function (f) { return function (fa) {
    return fa.local(f);
}; };
/**
 * @function
 * @since 1.6.0
 */
exports.right = function (fa) {
    return new ReaderTaskEither(function () { return taskEither.right(fa); });
};
/**
 * @function
 * @since 1.6.0
 */
exports.left = function (fa) {
    return new ReaderTaskEither(function () { return taskEither.left(fa); });
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromTaskEither = function (fa) {
    return new ReaderTaskEither(function () { return fa; });
};
var readerTfromReader = readerT.fromReader(taskEither.taskEither);
/**
 * @function
 * @since 1.6.0
 */
exports.fromReader = function (fa) {
    return new ReaderTaskEither(readerTfromReader(fa));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromEither = function (fa) {
    return exports.fromTaskEither(taskEither.fromEither(fa));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromIO = function (fa) {
    return exports.fromTaskEither(taskEither.fromIO(fa));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromLeft = function (l) {
    return exports.fromTaskEither(taskEither.fromLeft(l));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromIOEither = function (fa) {
    return exports.fromTaskEither(taskEither.fromIOEither(fa));
};
function fromPredicate(predicate, whenFalse) {
    var f = taskEither.fromPredicate(predicate, whenFalse);
    return function (a) { return exports.fromTaskEither(f(a)); };
}
exports.fromPredicate = fromPredicate;
/**
 * @function
 * @since 1.6.0
 */
exports.tryCatch = function (f, onrejected) {
    return new ReaderTaskEither(function (e) { return taskEither.tryCatch(function () { return f(e); }, function (reason) { return onrejected(reason, e); }); });
};
var fromTask = exports.right;
/**
 * @instance
 * @since 1.6.0
 */
exports.readerTaskEither = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    alt: alt,
    bimap: bimap,
    fromIO: exports.fromIO,
    fromTask: fromTask
};
/**
 * Like {@link readerTaskEither} but `ap` is sequential
 * @instance
 * @since 1.10.0
 */
exports.readerTaskEitherSeq = __assign({}, exports.readerTaskEither, { ap: function (fab, fa) { return fab.chain(function (f) { return fa.map(f); }); } });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Monoid_1 = require("./Monoid");
var Option_1 = require("./Option");
/**
 * Calculate the number of key/value pairs in a dictionary
 * @function
 * @since 1.10.0
 */
exports.size = function (d) {
    return Object.keys(d).length;
};
/**
 * Test whether a dictionary is empty
 * @function
 * @since 1.10.0
 */
exports.isEmpty = function (d) {
    return Object.keys(d).length === 0;
};
/**
 * @function
 * @since 1.10.0
 */
exports.collect = function (d, f) {
    var out = [];
    var keys = Object.keys(d).sort();
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        out.push(f(key, d[key]));
    }
    return out;
};
/**
 * @function
 * @since 1.10.0
 */
exports.toArray = function (d) {
    return exports.collect(d, function (k, a) { return function_1.tuple(k, a); });
};
/**
 * Unfolds a dictionary into a list of key/value pairs
 * @function
 * @since 1.10.0
 */
exports.toUnfoldable = function (unfoldable) { return function (d) {
    var arr = exports.toArray(d);
    var len = arr.length;
    return unfoldable.unfoldr(0, function (b) { return (b < len ? Option_1.some(function_1.tuple(arr[b], b + 1)) : Option_1.none); });
}; };
/**
 * Insert or replace a key/value pair in a map
 * @function
 * @since 1.10.0
 */
exports.insert = function (k, a, d) {
    var r = Object.assign({}, d);
    r[k] = a;
    return r;
};
/**
 * Delete a key and value from a map
 * @function
 * @since 1.10.0
 */
exports.remove = function (k, d) {
    var r = Object.assign({}, d);
    delete r[k];
    return r;
};
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 * @function
 * @since 1.10.0
 */
exports.pop = function (k, d) {
    var a = exports.lookup(k, d);
    return a.isNone() ? Option_1.none : Option_1.some(function_1.tuple(a.value, exports.remove(k, d)));
};
/**
 * Test whether one dictionary contains all of the keys and values contained in another dictionary
 * @function
 * @since 1.10.0
 */
exports.isSubdictionary = function (S) { return function (d1, d2) {
    for (var k in d1) {
        if (!d2.hasOwnProperty(k) || !S.equals(d1[k], d2[k])) {
            return false;
        }
    }
    return true;
}; };
/**
 * @function
 * @since 1.10.0
 */
exports.getSetoid = function (S) {
    var isSubdictionaryS = exports.isSubdictionary(S);
    return {
        equals: function (x, y) { return isSubdictionaryS(x, y) && isSubdictionaryS(y, x); }
    };
};
/**
 * @function
 * @since 1.10.0
 */
exports.getMonoid = Monoid_1.getDictionaryMonoid;
/**
 * Lookup the value for a key in a dictionary
 * @since 1.10.0
 */
exports.lookup = function (key, fa) {
    return fa.hasOwnProperty(key) ? Option_1.some(fa[key]) : Option_1.none;
};
function filter(fa, p) {
    return exports.filterWithIndex(fa, function (_, a) { return p(a); });
}
exports.filter = filter;
function fromFoldable(F) {
    return function (ta, f) {
        return F.reduce(ta, {}, function (b, _a) {
            var k = _a[0], a = _a[1];
            b[k] = b.hasOwnProperty(k) ? f(b[k], a) : a;
            return b;
        });
    };
}
exports.fromFoldable = fromFoldable;
/**
 * @constant
 * @since 1.10.0
 */
exports.empty = {};
/**
 * @function
 * @since 1.10.0
 */
exports.mapWithKey = function (fa, f) {
    var r = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        r[key] = f(key, fa[key]);
    }
    return r;
};
/**
 * @function
 * @since 1.10.0
 */
exports.map = function (fa, f) {
    return exports.mapWithKey(fa, function (_, a) { return f(a); });
};
/**
 * @function
 * @since 1.10.0
 */
exports.reduce = function (fa, b, f) {
    return exports.reduceWithKey(fa, b, function (_, b, a) { return f(b, a); });
};
/**
 * @function
 * @since 1.10.0
 */
exports.foldMap = function (M) {
    var foldMapWithKeyM = exports.foldMapWithKey(M);
    return function (fa, f) { return foldMapWithKeyM(fa, function (_, a) { return f(a); }); };
};
/**
 * @function
 * @since 1.10.0
 */
exports.foldr = function (fa, b, f) {
    return exports.foldrWithKey(fa, b, function (_, a, b) { return f(a, b); });
};
/**
 * @function
 * @since 1.12.0
 */
exports.reduceWithKey = function (fa, b, f) {
    var out = b;
    var keys = Object.keys(fa).sort();
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        var k = keys[i];
        out = f(k, out, fa[k]);
    }
    return out;
};
/**
 * @function
 * @since 1.12.0
 */
exports.foldMapWithKey = function (M) { return function (fa, f) {
    var out = M.empty;
    var keys = Object.keys(fa).sort();
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        var k = keys[i];
        out = M.concat(out, f(k, fa[k]));
    }
    return out;
}; };
/**
 * @function
 * @since 1.12.0
 */
exports.foldrWithKey = function (fa, b, f) {
    var out = b;
    var keys = Object.keys(fa).sort();
    var len = keys.length;
    for (var i = len - 1; i >= 0; i--) {
        var k = keys[i];
        out = f(k, fa[k], out);
    }
    return out;
};
/**
 * Create a dictionary with one key/value pair
 * @function
 * @since 1.10.0
 */
exports.singleton = function (k, a) {
    var _a;
    return _a = {}, _a[k] = a, _a;
};
function traverseWithKey(F) {
    return function (ta, f) {
        var fr = F.of(exports.empty);
        var keys = Object.keys(ta);
        var _loop_1 = function (key) {
            fr = F.ap(F.map(fr, function (r) { return function (b) {
                var _a;
                return (__assign({}, r, (_a = {}, _a[key] = b, _a)));
            }; }), f(key, ta[key]));
        };
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
            var key = keys_3[_i];
            _loop_1(key);
        }
        return fr;
    };
}
exports.traverseWithKey = traverseWithKey;
function traverse(F) {
    var traverseWithKeyF = traverseWithKey(F);
    return function (ta, f) { return traverseWithKeyF(ta, function (_, a) { return f(a); }); };
}
exports.traverse = traverse;
function sequence(F) {
    var traverseWithKeyF = traverseWithKey(F);
    return function (ta) { return traverseWithKeyF(ta, function (_, a) { return a; }); };
}
exports.sequence = sequence;
/**
 * @function
 * @since 1.10.0
 */
exports.compact = function (fa) {
    var r = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
        var key = keys_4[_i];
        var optionA = fa[key];
        if (optionA.isSome()) {
            r[key] = optionA.value;
        }
    }
    return r;
};
/**
 * @function
 * @since 1.10.0
 */
exports.partitionMap = function (fa, f) {
    return exports.partitionMapWithIndex(fa, function (_, a) { return f(a); });
};
/**
 * @function
 * @since 1.10.0
 */
exports.partition = function (fa, p) {
    return exports.partitionWithIndex(fa, function (_, a) { return p(a); });
};
/**
 * @function
 * @since 1.10.0
 */
exports.separate = function (fa) {
    var left = {};
    var right = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_5 = keys; _i < keys_5.length; _i++) {
        var key = keys_5[_i];
        var e = fa[key];
        if (e.isLeft()) {
            left[key] = e.value;
        }
        else {
            right[key] = e.value;
        }
    }
    return {
        left: left,
        right: right
    };
};
function wither(F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), exports.compact); };
}
exports.wither = wither;
function wilt(F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), exports.separate); };
}
exports.wilt = wilt;
/**
 * @function
 * @since 1.10.0
 */
exports.filterMap = function (fa, f) {
    return exports.filterMapWithIndex(fa, function (_, a) { return f(a); });
};
/**
 * @function
 * @since 1.12.0
 */
exports.partitionMapWithIndex = function (fa, f) {
    var left = {};
    var right = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_6 = keys; _i < keys_6.length; _i++) {
        var key = keys_6[_i];
        var e = f(key, fa[key]);
        if (e.isLeft()) {
            left[key] = e.value;
        }
        else {
            right[key] = e.value;
        }
    }
    return {
        left: left,
        right: right
    };
};
/**
 * @function
 * @since 1.12.0
 */
exports.partitionWithIndex = function (fa, p) {
    var left = {};
    var right = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_7 = keys; _i < keys_7.length; _i++) {
        var key = keys_7[_i];
        var a = fa[key];
        if (p(key, a)) {
            right[key] = a;
        }
        else {
            left[key] = a;
        }
    }
    return {
        left: left,
        right: right
    };
};
/**
 * @function
 * @since 1.12.0
 */
exports.filterMapWithIndex = function (fa, f) {
    var r = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_8 = keys; _i < keys_8.length; _i++) {
        var key = keys_8[_i];
        var optionB = f(key, fa[key]);
        if (optionB.isSome()) {
            r[key] = optionB.value;
        }
    }
    return r;
};
/**
 * @function
 * @since 1.12.0
 */
exports.filterWithIndex = function (fa, p) {
    var r = {};
    var keys = Object.keys(fa);
    for (var _i = 0, keys_9 = keys; _i < keys_9.length; _i++) {
        var key = keys_9[_i];
        var a = fa[key];
        if (p(key, a)) {
            r[key] = a;
        }
    }
    return r;
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Semiring_1 = require("./Semiring");
/**
 * @function
 * @since 1.0.0
 */
exports.getFunctionRing = function (ring) {
    return __assign({}, Semiring_1.getFunctionSemiring(ring), { sub: function (f, g) { return function (x) { return ring.sub(f(x), g(x)); }; } });
};
/**
 * `negate x` can be used as a shorthand for `zero - x`
 * @function
 * @since 1.0.0
 */
exports.negate = function (ring) { return function (a) {
    return ring.sub(ring.zero, a);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getProductRing = function (RA, RB) {
    return {
        add: function (_a, _b) {
            var a1 = _a[0], b1 = _a[1];
            var a2 = _b[0], b2 = _b[1];
            return [RA.add(a1, a2), RB.add(b1, b2)];
        },
        zero: [RA.zero, RB.zero],
        mul: function (_a, _b) {
            var a1 = _a[0], b1 = _a[1];
            var a2 = _b[0], b2 = _b[1];
            return [RA.mul(a1, a2), RB.mul(b1, b2)];
        },
        one: [RA.one, RB.one],
        sub: function (_a, _b) {
            var a1 = _a[0], b1 = _a[1];
            var a2 = _b[0], b2 = _b[1];
            return [RA.sub(a1, a2), RB.sub(b1, b2)];
        }
    };
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Ord_1 = require("./Ord");
var function_1 = require("./function");
/**
 * @function
 * @since 1.0.0
 */
exports.fold = function (S) { return function (a) { return function (as) {
    return as.reduce(S.concat, a);
}; }; };
/**
 * @function
 * @since 1.0.0
 */
exports.getFirstSemigroup = function () {
    return { concat: function_1.identity };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getLastSemigroup = function () {
    return { concat: function (_, y) { return y; } };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getProductSemigroup = function (SA, SB) {
    return {
        concat: function (_a, _b) {
            var xa = _a[0], xb = _a[1];
            var ya = _b[0], yb = _b[1];
            return [SA.concat(xa, ya), SB.concat(xb, yb)];
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getDualSemigroup = function (S) {
    return {
        concat: function (x, y) { return S.concat(y, x); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getFunctionSemigroup = function (S) { return function () {
    return {
        concat: function (f, g) { return function (a) { return S.concat(f(a), g(a)); }; }
    };
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getRecordSemigroup = function (semigroups) {
    return {
        concat: function (x, y) {
            var r = {};
            var keys = Object.keys(semigroups);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                r[key] = semigroups[key].concat(x[key], y[key]);
            }
            return r;
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMeetSemigroup = function (O) {
    return {
        concat: Ord_1.min(O)
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getJoinSemigroup = function (O) {
    return {
        concat: Ord_1.max(O)
    };
};
/**
 * Boolean semigroup under conjunction
 * @instance
 * @since 1.0.0
 */
exports.semigroupAll = {
    concat: function (x, y) { return x && y; }
};
/**
 * Boolean semigroup under disjunction
 * @instance
 * @since 1.0.0
 */
exports.semigroupAny = {
    concat: function (x, y) { return x || y; }
};
/**
 * Semigroup under array concatenation
 * @function
 * @since 1.0.0
 */
exports.getArraySemigroup = function () {
    return {
        concat: function (x, y) { return function_1.concat(x, y); }
    };
};
/**
 * Gets {@link Semigroup} instance for dictionaries given {@link Semigroup} instance for their values
 *
 * @example
 * import { getDictionarySemigroup, semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getDictionarySemigroup(semigroupSum)
 * assert.deepEqual(S.concat({ foo: 123 }, { foo: 456 }), { foo: 579 })
 *
 * @function
 * @since 1.4.0
 */
exports.getDictionarySemigroup = function (S) {
    return {
        concat: function (x, y) {
            var r = __assign({}, x);
            var keys = Object.keys(y);
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                r[k] = x.hasOwnProperty(k) ? S.concat(x[k], y[k]) : y[k];
            }
            return r;
        }
    };
};
var semigroupAnyDictionary = exports.getDictionarySemigroup(exports.getLastSemigroup());
/**
 * Gets {@link Semigroup} instance for objects of given type preserving their type
 *
 * @example
 * import { getObjectSemigroup } from 'fp-ts/lib/Semigroup'
 *
 * const S = getObjectSemigroup<{ foo: number }>()
 * assert.deepEqual(S.concat({ foo: 123 }, { foo: 456 }), { foo: 456 })
 *
 * @function
 * @since 1.4.0
 */
exports.getObjectSemigroup = function () {
    return semigroupAnyDictionary;
};
/**
 * Number Semigroup under addition
 * @instance
 * @since 1.0.0
 */
exports.semigroupSum = {
    concat: function (x, y) { return x + y; }
};
/**
 * Number Semigroup under multiplication
 * @instance
 * @since 1.0.0
 */
exports.semigroupProduct = {
    concat: function (x, y) { return x * y; }
};
/**
 * @instance
 * @since 1.0.0
 */
exports.semigroupString = {
    concat: function (x, y) { return x + y; }
};
/**
 * @instance
 * @since 1.0.0
 */
exports.semigroupVoid = {
    concat: function () { return undefined; }
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
// adapted from https://github.com/purescript/purescript-prelude/blob/master/src/Data/Semiring.purs
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @function
 * @since 1.0.0
 */
exports.getFunctionSemiring = function (S) {
    return {
        add: function (f, g) { return function (x) { return S.add(f(x), g(x)); }; },
        zero: function () { return S.zero; },
        mul: function (f, g) { return function (x) { return S.mul(f(x), g(x)); }; },
        one: function () { return S.one; }
    };
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
/**
 * @function
 * @since 1.0.0
 */
exports.toArray = function (O) { return function (x) {
    var r = [];
    x.forEach(function (e) { return r.push(e); });
    return r.sort(O.compare);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    var subsetS = exports.subset(S);
    return {
        equals: function (x, y) { return subsetS(x, y) && subsetS(y, x); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.some = function (x, predicate) {
    var values = x.values();
    var e;
    var found = false;
    // tslint:disable:no-conditional-assignment
    while (!found && !(e = values.next()).done) {
        found = predicate(e.value);
    }
    return found;
};
/**
 * Projects a Set through a function
 * @function
 * @since 1.2.0
 */
exports.map = function (bset) { return function (x, f) {
    var r = new Set();
    var ismember = exports.member(bset)(r);
    x.forEach(function (e) {
        var v = f(e);
        if (!ismember(v)) {
            r.add(v);
        }
    });
    return r;
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.every = function (x, predicate) {
    return !exports.some(x, function_1.not(predicate));
};
/**
 * @function
 * @since 1.2.0
 */
exports.chain = function (bset) { return function (x, f) {
    var r = new Set();
    var rhas = exports.member(bset)(r);
    x.forEach(function (e) {
        f(e).forEach(function (e) {
            if (!rhas(e)) {
                r.add(e);
            }
        });
    });
    return r;
}; };
/**
 * `true` if and only if every element in the first set is an element of the second set
 * @function
 * @since 1.0.0
 */
exports.subset = function (S) { return function (x, y) {
    return exports.every(x, exports.member(S)(y));
}; };
function filter(x, predicate) {
    var values = x.values();
    var e;
    var r = new Set();
    // tslint:disable:no-conditional-assignment
    while (!(e = values.next()).done) {
        var value = e.value;
        if (predicate(value)) {
            r.add(value);
        }
    }
    return r;
}
exports.filter = filter;
function partition(x, predicate) {
    var values = x.values();
    var e;
    var right = new Set();
    var left = new Set();
    // tslint:disable:no-conditional-assignment
    while (!(e = values.next()).done) {
        var value = e.value;
        if (predicate(value)) {
            right.add(value);
        }
        else {
            left.add(value);
        }
    }
    return { left: left, right: right };
}
exports.partition = partition;
/**
 * Test if a value is a member of a set
 * @function
 * @since 1.0.0
 */
exports.member = function (S) { return function (x) { return function (a) {
    return exports.some(x, function (ax) { return S.equals(a, ax); });
}; }; };
/**
 * Form the union of two sets
 * @function
 * @since 1.0.0
 */
exports.union = function (S) {
    var memberS = exports.member(S);
    return function (x, y) {
        var xhas = memberS(x);
        var r = new Set(x);
        y.forEach(function (e) {
            if (!xhas(e)) {
                r.add(e);
            }
        });
        return r;
    };
};
/**
 * The set of elements which are in both the first and second set
 * @function
 * @since 1.0.0
 */
exports.intersection = function (S) {
    var memberS = exports.member(S);
    return function (x, y) {
        var yhas = memberS(y);
        var r = new Set();
        x.forEach(function (e) {
            if (yhas(e)) {
                r.add(e);
            }
        });
        return r;
    };
};
/**
 * @function
 * @since 1.2.0
 */
exports.partitionMap = function (SL, SR) { return function (x, f) {
    var values = x.values();
    var e;
    var left = new Set();
    var right = new Set();
    var isMemberL = exports.member(SL)(left);
    var isMemberR = exports.member(SR)(right);
    // tslint:disable:no-conditional-assignment
    while (!(e = values.next()).done) {
        var v = f(e.value);
        if (v.isLeft()) {
            if (!isMemberL(v.value)) {
                left.add(v.value);
            }
        }
        else {
            if (!isMemberR(v.value)) {
                right.add(v.value);
            }
        }
    }
    return { left: left, right: right };
}; };
/**
 * Use {@link difference2v} instead
 * @function
 * @since 1.0.0
 * @deprecated
 */
exports.difference = function (S) {
    var d = exports.difference2v(S);
    return function (x, y) { return d(y, x); };
};
/**
 * Form the set difference (`x` - `y`)
 *
 * @example
 * import { difference2v } from 'fp-ts/lib/Set'
 * import { setoidNumber } from 'fp-ts/lib/Setoid'
 *
 * assert.deepEqual(difference2v(setoidNumber)(new Set([1, 2]), new Set([1, 3])), new Set([2]))
 *
 * @function
 * @since 1.12.0
 */
exports.difference2v = function (S) {
    var has = exports.member(S);
    return function (x, y) { return filter(x, function_1.not(has(y))); };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getUnionMonoid = function (S) {
    return {
        concat: exports.union(S),
        empty: new Set()
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getIntersectionSemigroup = function (S) {
    return {
        concat: exports.intersection(S)
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.reduce = function (O) {
    var toArrayO = exports.toArray(O);
    return function (fa, b, f) { return toArrayO(fa).reduce(f, b); };
};
/**
 * Create a set with one element
 * @function
 * @since 1.0.0
 */
exports.singleton = function (a) {
    return new Set([a]);
};
/**
 * Insert a value into a set
 * @function
 * @since 1.0.0
 */
exports.insert = function (S) {
    var memberS = exports.member(S);
    return function (a, x) {
        if (!memberS(x)(a)) {
            var r = new Set(x);
            r.add(a);
            return r;
        }
        else {
            return x;
        }
    };
};
/**
 * Delete a value from a set
 * @function
 * @since 1.0.0
 */
exports.remove = function (S) { return function (a, x) {
    return filter(x, function (ax) { return !S.equals(a, ax); });
}; };
/**
 * Create a set from an array
 * @function
 * @since 1.2.0
 */
exports.fromArray = function (S) { return function (as) {
    var len = as.length;
    var r = new Set();
    var isMember = exports.member(S)(r);
    for (var i = 0; i < len; i++) {
        var a = as[i];
        if (!isMember(a)) {
            r.add(a);
        }
    }
    return r;
}; };
/**
 * @function
 * @since 1.12.0
 */
exports.compact = function (S) {
    var filterMapS = exports.filterMap(S);
    return function (fa) { return filterMapS(fa, function_1.identity); };
};
/**
 * @function
 * @since 1.12.0
 */
exports.separate = function (SL, SR) { return function (fa) {
    var memberSL = exports.member(SL);
    var memberSR = exports.member(SR);
    var left = new Set();
    var right = new Set();
    var isMemberL = memberSL(left);
    var isMemberR = memberSR(right);
    fa.forEach(function (e) {
        if (e.isLeft()) {
            if (!isMemberL(e.value)) {
                left.add(e.value);
            }
        }
        else {
            if (!isMemberR(e.value)) {
                right.add(e.value);
            }
        }
    });
    return { left: left, right: right };
}; };
/**
 * @function
 * @since 1.12.0
 */
exports.filterMap = function (S) {
    var memberS = exports.member(S);
    return function (fa, f) {
        var r = new Set();
        var isMember = memberS(r);
        fa.forEach(function (a) {
            var ob = f(a);
            if (ob.isSome() && !isMember(ob.value)) {
                r.add(ob.value);
            }
        });
        return r;
    };
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
/**
 * @function
 * @since 1.0.0
 */
exports.strictEqual = function (a, b) {
    return a === b;
};
var setoidStrict = { equals: exports.strictEqual };
/**
 * @instance
 * @since 1.0.0
 */
exports.setoidString = setoidStrict;
/**
 * @instance
 * @since 1.0.0
 */
exports.setoidNumber = setoidStrict;
/**
 * @instance
 * @since 1.0.0
 */
exports.setoidBoolean = setoidStrict;
/**
 * @function
 * @since 1.0.0
 */
exports.getArraySetoid = function (S) {
    return {
        equals: function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return S.equals(x, ys[i]); }); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getRecordSetoid = function (setoids) {
    return {
        equals: function (x, y) {
            for (var k in setoids) {
                if (!setoids[k].equals(x[k], y[k])) {
                    return false;
                }
            }
            return true;
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getProductSetoid = function (SA, SB) {
    return {
        equals: function (_a, _b) {
            var xa = _a[0], xb = _a[1];
            var ya = _b[0], yb = _b[1];
            return SA.equals(xa, ya) && SB.equals(xb, yb);
        }
    };
};
/**
 * Returns the `Setoid` corresponding to the partitions of `B` induced by `f`
 * @function
 * @since 1.2.0
 */
exports.contramap = function (f, fa) {
    return {
        equals: function_1.on(fa.equals)(f)
    };
};
/**
 * @instance
 * @since 1.4.0
 */
exports.setoidDate = exports.contramap(function (date) { return date.valueOf(); }, exports.setoidNumber);
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'State';
/**
 * @data
 * @constructor State
 * @since 1.0.0
 */
var State = /** @class */ (function () {
    function State(run) {
        this.run = run;
    }
    State.prototype.eval = function (s) {
        return this.run(s)[0];
    };
    State.prototype.exec = function (s) {
        return this.run(s)[1];
    };
    State.prototype.map = function (f) {
        var _this = this;
        return new State(function (s) {
            var _a = _this.run(s), a = _a[0], s1 = _a[1];
            return [f(a), s1];
        });
    };
    State.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <= derived
    };
    /**
     * Flipped version of {@link ap}
     */
    State.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     * @since 1.7.0
     */
    State.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     * @since 1.7.0
     */
    State.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    State.prototype.chain = function (f) {
        var _this = this;
        return new State(function (s) {
            var _a = _this.run(s), a = _a[0], s1 = _a[1];
            return f(a).run(s1);
        });
    };
    return State;
}());
exports.State = State;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new State(function (s) { return [a, s]; });
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * Get the current state
 * @function
 * @since 1.0.0
 */
exports.get = function () {
    return new State(function (s) { return [s, s]; });
};
/**
 * Set the state
 * @function
 * @since 1.0.0
 */
exports.put = function (s) {
    return new State(function () { return [undefined, s]; });
};
/**
 * Modify the state by applying a function to the current state
 * @function
 * @since 1.0.0
 */
exports.modify = function (f) {
    return new State(function (s) { return [undefined, f(s)]; });
};
/**
 * Get a value which depends on the current state
 * @function
 * @since 1.0.0
 */
exports.gets = function (f) {
    return new State(function (s) { return [f(s), s]; });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.state = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function map(F) {
    return function (f, fa) { return function (s) { return F.map(fa(s), function (_a) {
        var a = _a[0], s1 = _a[1];
        return function_1.tuple(f(a), s1);
    }); }; };
}
exports.map = map;
function of(F) {
    return function (a) { return function (s) { return F.of(function_1.tuple(a, s)); }; };
}
exports.of = of;
function ap(F) {
    var mapF = map(F);
    var chainF = chain(F);
    return function (fab, fa) { return chainF(function (f) { return mapF(f, fa); }, fab); }; // <- derived
}
exports.ap = ap;
function chain(F) {
    return function (f, fa) { return function (s) { return F.chain(fa(s), function (_a) {
        var a = _a[0], s1 = _a[1];
        return f(a)(s1);
    }); }; };
}
exports.chain = chain;
function get(F) {
    return function () { return function (s) { return F.of(function_1.tuple(s, s)); }; };
}
exports.get = get;
function put(F) {
    return function (s) { return function () { return F.of(function_1.tuple(undefined, s)); }; };
}
exports.put = put;
function modify(F) {
    return function (f) { return function (s) { return F.of(function_1.tuple(undefined, f(s))); }; };
}
exports.modify = modify;
function gets(F) {
    return function (f) { return function (s) { return F.of(function_1.tuple(f(s), s)); }; };
}
exports.gets = gets;
function fromState(F) {
    return function (fa) { return function (s) { return F.of(fa.run(s)); }; };
}
exports.fromState = fromState;
function liftF(F) {
    return function (fa) { return function (s) { return F.map(fa, function (a) { return function_1.tuple(a, s); }); }; };
}
exports.liftF = liftF;
function getStateT(M) {
    return {
        map: map(M),
        of: of(M),
        ap: ap(M),
        chain: chain(M)
    };
}
exports.getStateT = getStateT;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Store';
/**
 * @data
 * @constructor Store
 * @since 1.0.0
 */
var Store = /** @class */ (function () {
    function Store(peek, pos) {
        this.peek = peek;
        this.pos = pos;
    }
    /** Reposition the focus at the specified position */
    Store.prototype.seek = function (s) {
        return new Store(this.peek, s);
    };
    Store.prototype.map = function (f) {
        var _this = this;
        return new Store(function (s) { return f(_this.peek(s)); }, this.pos);
    };
    Store.prototype.extract = function () {
        return this.peek(this.pos);
    };
    Store.prototype.extend = function (f) {
        var _this = this;
        return new Store(function (s) { return f(_this.seek(s)); }, this.pos);
    };
    Store.prototype.inspect = function () {
        return this.toString();
    };
    Store.prototype.toString = function () {
        return "new Store(" + function_1.toString(this.peek) + ", " + function_1.toString(this.pos) + ")";
    };
    return Store;
}());
exports.Store = Store;
var map = function (sa, f) {
    return sa.map(f);
};
var extract = function (sa) {
    return sa.extract();
};
var extend = function (sa, f) {
    return sa.extend(f);
};
/**
 * Extract a value from a position which depends on the current position
 * @function
 * @since 1.0.0
 */
exports.peeks = function (f) { return function (sa) { return function (s) {
    return sa.peek(f(sa.pos));
}; }; };
/**
 * Reposition the focus at the specified position, which depends on the current position
 * @function
 * @since 1.0.0
 */
exports.seeks = function (f) { return function (sa) {
    return new Store(sa.peek, f(sa.pos));
}; };
function experiment(F) {
    return function (f) { return function (sa) { return F.map(f(sa.pos), function (s) { return sa.peek(s); }); }; };
}
exports.experiment = experiment;
/**
 * @instance
 * @since 1.0.0
 */
exports.store = {
    URI: exports.URI,
    map: map,
    extract: extract,
    extend: extend
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var R = require("./Record");
var Semigroup_1 = require("./Semigroup");
exports.URI = 'StrMap';
var liftSeparated = function (_a) {
    var left = _a.left, right = _a.right;
    return {
        left: new StrMap(left),
        right: new StrMap(right)
    };
};
/**
 * @data
 * @constructor StrMap
 * @since 1.0.0
 */
var StrMap = /** @class */ (function () {
    function StrMap(value) {
        this.value = value;
    }
    StrMap.prototype.mapWithKey = function (f) {
        return new StrMap(R.mapWithKey(this.value, f));
    };
    StrMap.prototype.map = function (f) {
        return this.mapWithKey(function (_, a) { return f(a); });
    };
    StrMap.prototype.reduce = function (b, f) {
        return R.reduce(this.value, b, f);
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.foldr = function (b, f) {
        return R.foldr(this.value, b, f);
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.reduceWithKey = function (b, f) {
        return R.reduceWithKey(this.value, b, f);
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.foldrWithKey = function (b, f) {
        return R.foldrWithKey(this.value, b, f);
    };
    StrMap.prototype.filter = function (p) {
        return this.filterWithIndex(function (_, a) { return p(a); });
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.filterMap = function (f) {
        return this.filterMapWithIndex(function (_, a) { return f(a); });
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.partition = function (p) {
        return this.partitionWithIndex(function (_, a) { return p(a); });
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.partitionMap = function (f) {
        return this.partitionMapWithIndex(function (_, a) { return f(a); });
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.separate = function () {
        return liftSeparated(R.separate(this.value));
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.partitionMapWithIndex = function (f) {
        return liftSeparated(R.partitionMapWithIndex(this.value, f));
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.partitionWithIndex = function (p) {
        return liftSeparated(R.partitionWithIndex(this.value, p));
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.filterMapWithIndex = function (f) {
        return new StrMap(R.filterMapWithIndex(this.value, f));
    };
    /**
     * @since 1.12.0
     */
    StrMap.prototype.filterWithIndex = function (p) {
        return new StrMap(R.filterWithIndex(this.value, p));
    };
    return StrMap;
}());
exports.StrMap = StrMap;
/**
 * @constant
 * @since 1.10.0
 */
var empty = new StrMap(R.empty);
var concat = function (S) {
    var concat = Semigroup_1.getDictionarySemigroup(S).concat;
    return function (x, y) { return new StrMap(concat(x.value, y.value)); };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (S) {
    if (S === void 0) { S = Semigroup_1.getLastSemigroup(); }
    return {
        concat: concat(S),
        empty: empty
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) {
    var foldMapM = R.foldMap(M);
    return function (fa, f) { return foldMapM(fa.value, f); };
};
var foldr = function (fa, b, f) {
    return fa.foldr(b, f);
};
var reduceWithIndex = function (fa, b, f) {
    return fa.reduceWithKey(b, f);
};
var foldMapWithIndex = function (M) {
    var foldMapWithKey = R.foldMapWithKey(M);
    return function (fa, f) { return foldMapWithKey(fa.value, f); };
};
var foldrWithIndex = function (fa, b, f) {
    return fa.foldrWithKey(b, f);
};
function traverseWithKey(F) {
    var traverseWithKeyF = R.traverseWithKey(F);
    return function (ta, f) { return F.map(traverseWithKeyF(ta.value, f), function (d) { return new StrMap(d); }); };
}
exports.traverseWithKey = traverseWithKey;
function traverse(F) {
    var traverseWithKeyF = traverseWithKey(F);
    return function (ta, f) { return traverseWithKeyF(ta, function (_, a) { return f(a); }); };
}
function sequence(F) {
    var traverseWithKeyF = traverseWithKey(F);
    return function (ta) { return traverseWithKeyF(ta, function (_, a) { return a; }); };
}
/**
 * Test whether one dictionary contains all of the keys and values contained in another dictionary
 * @function
 * @since 1.0.0
 */
exports.isSubdictionary = function (S) {
    var isSubdictionaryS = R.isSubdictionary(S);
    return function (d1, d2) { return isSubdictionaryS(d1.value, d2.value); };
};
/**
 * Calculate the number of key/value pairs in a dictionary
 * @function
 * @since 1.0.0
 */
exports.size = function (d) {
    return R.size(d.value);
};
/**
 * Test whether a dictionary is empty
 * @function
 * @since 1.0.0
 */
exports.isEmpty = function (d) {
    return R.isEmpty(d.value);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (S) {
    var isSubdictionaryS = R.isSubdictionary(S);
    return {
        equals: function (x, y) { return isSubdictionaryS(x.value, y.value) && isSubdictionaryS(y.value, x.value); }
    };
};
/**
 * Create a dictionary with one key/value pair
 * @function
 * @since 1.0.0
 */
exports.singleton = function (k, a) {
    return new StrMap(R.singleton(k, a));
};
/**
 * Lookup the value for a key in a dictionary
 * @function
 * @since 1.0.0
 */
exports.lookup = function (k, d) {
    return R.lookup(k, d.value);
};
function fromFoldable(F) {
    var fromFoldableF = R.fromFoldable(F);
    return function (ta, f) { return new StrMap(fromFoldableF(ta, f)); };
}
exports.fromFoldable = fromFoldable;
/**
 * @function
 * @since 1.0.0
 */
exports.collect = function (d, f) {
    return R.collect(d.value, f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.toArray = function (d) {
    return R.toArray(d.value);
};
/**
 * Unfolds a dictionary into a list of key/value pairs
 * @function
 * @since 1.0.0
 */
exports.toUnfoldable = function (U) {
    var toUnfoldableU = R.toUnfoldable(U);
    return function (d) { return toUnfoldableU(d.value); };
};
/**
 * Insert or replace a key/value pair in a map
 * @function
 * @since 1.0.0
 */
exports.insert = function (k, a, d) {
    return new StrMap(R.insert(k, a, d.value));
};
/**
 * Delete a key and value from a map
 * @function
 * @since 1.0.0
 */
exports.remove = function (k, d) {
    return new StrMap(R.remove(k, d.value));
};
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 * @function
 * @since 1.0.0
 */
exports.pop = function (k, d) {
    return R.pop(k, d.value).map(function (_a) {
        var a = _a[0], d = _a[1];
        return function_1.tuple(a, new StrMap(d));
    });
};
var filterMap = function (fa, f) {
    return fa.filterMap(f);
};
var filter = function (fa, p) {
    return fa.filter(p);
};
var compact = function (fa) {
    return new StrMap(R.compact(fa.value));
};
var separate = function (fa) {
    return fa.separate();
};
var partitionMap = function (fa, f) {
    return fa.partitionMap(f);
};
var partition = function (fa, p) {
    return fa.partition(p);
};
var wither = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), compact); };
};
var wilt = function (F) {
    var traverseF = traverse(F);
    return function (wa, f) { return F.map(traverseF(wa, f), separate); };
};
var mapWithIndex = function (fa, f) {
    return fa.mapWithKey(f);
};
var traverseWithIndex = traverseWithKey;
var partitionMapWithIndex = function (fa, f) {
    return fa.partitionMapWithIndex(f);
};
var partitionWithIndex = function (fa, p) {
    return fa.partitionWithIndex(p);
};
var filterMapWithIndex = function (fa, f) {
    return fa.filterMapWithIndex(f);
};
var filterWithIndex = function (fa, p) {
    return fa.filterWithIndex(p);
};
/**
 * @instance
 * @since 1.0.0
 */
exports.strmap = {
    URI: exports.URI,
    map: map,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    compact: compact,
    separate: separate,
    filter: filter,
    filterMap: filterMap,
    partition: partition,
    partitionMap: partitionMap,
    wither: wither,
    wilt: wilt,
    mapWithIndex: mapWithIndex,
    reduceWithIndex: reduceWithIndex,
    foldMapWithIndex: foldMapWithIndex,
    foldrWithIndex: foldrWithIndex,
    traverseWithIndex: traverseWithIndex,
    partitionMapWithIndex: partitionMapWithIndex,
    partitionWithIndex: partitionWithIndex,
    filterMapWithIndex: filterMapWithIndex,
    filterWithIndex: filterWithIndex
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
function splitStrong(F) {
    return function (pab, pcd) {
        return F.compose(F.first(pab), F.second(pcd));
    };
}
exports.splitStrong = splitStrong;
function fanout(F) {
    var splitStrongF = splitStrong(F);
    return function (pab, pac) {
        var split = F.promap(F.id(), function_1.identity, function (a) { return function_1.tuple(a, a); });
        return F.compose(splitStrongF(pab, pac), split);
    };
}
exports.fanout = fanout;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
var function_1 = require("./function");
exports.URI = 'Task';
/**
 * `Task<A>` represents an asynchronous computation that yields a value of type `A` and **never fails**.
 * If you want to represent an asynchronous computation that may fail, please see {@link TaskEither}.
 * @data
 * @constructor Task
 * @since 1.0.0
 */
var Task = /** @class */ (function () {
    function Task(run) {
        this.run = run;
    }
    Task.prototype.map = function (f) {
        var _this = this;
        return new Task(function () { return _this.run().then(f); });
    };
    Task.prototype.ap = function (fab) {
        var _this = this;
        return new Task(function () { return Promise.all([fab.run(), _this.run()]).then(function (_a) {
            var f = _a[0], a = _a[1];
            return f(a);
        }); });
    };
    /**
     * Flipped version of {@link ap}
     */
    Task.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two effectful actions, keeping only the result of the first
     * @since 1.6.0
     */
    Task.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two effectful actions, keeping only the result of the second
     * @since 1.5.0
     */
    Task.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    Task.prototype.chain = function (f) {
        var _this = this;
        return new Task(function () { return _this.run().then(function (a) { return f(a).run(); }); });
    };
    Task.prototype.inspect = function () {
        return this.toString();
    };
    Task.prototype.toString = function () {
        return "new Task(" + function_1.toString(this.run) + ")";
    };
    return Task;
}());
exports.Task = Task;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Task(function () { return Promise.resolve(a); });
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getRaceMonoid = function () {
    return {
        concat: function (x, y) {
            return new Task(function () {
                return new Promise(function (resolve, reject) {
                    var running = true;
                    var resolveFirst = function (a) {
                        if (running) {
                            running = false;
                            resolve(a);
                        }
                    };
                    var rejectFirst = function (e) {
                        if (running) {
                            running = false;
                            reject(e);
                        }
                    };
                    x.run().then(resolveFirst, rejectFirst);
                    y.run().then(resolveFirst, rejectFirst);
                });
            });
        },
        empty: never
    };
};
var never = new Task(function () { return new Promise(function (_) { return undefined; }); });
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) { return new Task(function () { return x.run().then(function (rx) { return y.run().then(function (ry) { return S.concat(rx, ry); }); }); }); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (M) {
    return __assign({}, exports.getSemigroup(M), { empty: of(M.empty) });
};
/**
 * @function
 * @since 1.0.0
 */
exports.tryCatch = function (f, onrejected) {
    return new Task(function () { return f().then(function (a) { return Either_1.right(a); }, function (reason) { return Either_1.left(onrejected(reason)); }); });
};
/**
 * Lifts an IO action into a Task
 * @function
 * @since 1.0.0
 */
exports.fromIO = function (io) {
    return new Task(function () { return Promise.resolve(io.run()); });
};
/**
 * @function
 * @since 1.7.0
 */
exports.delay = function (millis, a) {
    return new Task(function () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(a);
            }, millis);
        });
    });
};
var fromTask = function_1.identity;
/**
 * @instance
 * @since 1.0.0
 */
exports.task = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    fromIO: exports.fromIO,
    fromTask: fromTask
};
/**
 * Like {@link task} but `ap` is sequential
 * @instance
 * @since 1.10.0
 */
exports.taskSeq = __assign({}, exports.task, { ap: function (fab, fa) { return fab.chain(function (f) { return fa.map(f); }); } });
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
var eitherT = require("./EitherT");
var function_1 = require("./function");
var Task_1 = require("./Task");
var eitherTTask = eitherT.getEitherT(Task_1.task);
exports.URI = 'TaskEither';
var eitherTfold = eitherT.fold(Task_1.task);
var eitherTmapLeft = eitherT.mapLeft(Task_1.task);
var eitherTbimap = eitherT.bimap(Task_1.task);
/**
 * `TaskEither<L, A>` represents an asynchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `L`. If you want to represent an asynchronous computation that never fails, please see {@link Task}.
 * @data
 * @constructor TaskEither
 * @since 1.0.0
 */
var TaskEither = /** @class */ (function () {
    function TaskEither(value) {
        this.value = value;
    }
    /** Runs the inner `Task` */
    TaskEither.prototype.run = function () {
        return this.value.run();
    };
    TaskEither.prototype.map = function (f) {
        return new TaskEither(eitherTTask.map(this.value, f));
    };
    TaskEither.prototype.ap = function (fab) {
        return new TaskEither(eitherTTask.ap(fab.value, this.value));
    };
    /**
     * Flipped version of {@link ap}
     */
    TaskEither.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    /**
     * Combine two (parallel) effectful actions, keeping only the result of the first
     * @since 1.6.0
     */
    TaskEither.prototype.applyFirst = function (fb) {
        return fb.ap(this.map(function_1.constant));
    };
    /**
     * Combine two (parallel) effectful actions, keeping only the result of the second
     * @since 1.5.0
     */
    TaskEither.prototype.applySecond = function (fb) {
        return fb.ap(this.map(function_1.constIdentity));
    };
    /**
     * Combine two (sequential) effectful actions, keeping only the result of the first
     * @since 1.12.0
     */
    TaskEither.prototype.chainFirst = function (fb) {
        return this.chain(function (a) { return fb.map(function () { return a; }); });
    };
    /**
     * Combine two (sequential) effectful actions, keeping only the result of the second
     * @since 1.12.0
     */
    TaskEither.prototype.chainSecond = function (fb) {
        return this.chain(function () { return fb; });
    };
    TaskEither.prototype.chain = function (f) {
        return new TaskEither(eitherTTask.chain(function (a) { return f(a).value; }, this.value));
    };
    TaskEither.prototype.fold = function (whenLeft, whenRight) {
        return eitherTfold(whenLeft, whenRight, this.value);
    };
    /**
     * Similar to {@link fold}, but the result is flattened.
     * @since 1.10.0
     */
    TaskEither.prototype.foldTask = function (whenLeft, whenRight) {
        return this.value.chain(function (e) { return e.fold(whenLeft, whenRight); });
    };
    /**
     * Similar to {@link fold}, but the result is flattened.
     * @since 1.10.0
     */
    TaskEither.prototype.foldTaskEither = function (whenLeft, whenRight) {
        return new TaskEither(this.value.chain(function (e) { return e.fold(whenLeft, whenRight).value; }));
    };
    TaskEither.prototype.mapLeft = function (f) {
        return new TaskEither(eitherTmapLeft(f)(this.value));
    };
    /**
     * Transforms the failure value of the `TaskEither` into a new `TaskEither`
     */
    TaskEither.prototype.orElse = function (f) {
        return new TaskEither(this.value.chain(function (e) { return e.fold(function (l) { return f(l).value; }, eitherTTask.of); }));
    };
    /**
     * @since 1.6.0
     */
    TaskEither.prototype.alt = function (fy) {
        return this.orElse(function () { return fy; });
    };
    /**
     * @since 1.2.0
     */
    TaskEither.prototype.bimap = function (f, g) {
        return new TaskEither(eitherTbimap(this.value, f, g));
    };
    /**
     * Return `Right` if the given action succeeds, `Left` if it throws
     * @since 1.10.0
     */
    TaskEither.prototype.attempt = function () {
        return new TaskEither(this.value.map(Either_1.right));
    };
    TaskEither.prototype.filterOrElse = function (p, zero) {
        return new TaskEither(this.value.map(function (e) { return e.filterOrElse(p, zero); }));
    };
    TaskEither.prototype.filterOrElseL = function (p, zero) {
        return new TaskEither(this.value.map(function (e) { return e.filterOrElseL(p, zero); }));
    };
    return TaskEither;
}());
exports.TaskEither = TaskEither;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new TaskEither(eitherTTask.of(a));
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var alt = function (fx, fy) {
    return fx.alt(fy);
};
var bimap = function (fa, f, g) {
    return fa.bimap(f, g);
};
var eitherTright = eitherT.right(Task_1.task);
/**
 * @function
 * @since 1.0.0
 */
exports.right = function (fa) {
    return new TaskEither(eitherTright(fa));
};
var eitherTleft = eitherT.left(Task_1.task);
/**
 * @function
 * @since 1.0.0
 */
exports.left = function (fa) {
    return new TaskEither(eitherTleft(fa));
};
var eitherTfromEither = eitherT.fromEither(Task_1.task);
/**
 * @function
 * @since 1.0.0
 */
exports.fromEither = function (fa) {
    return new TaskEither(eitherTfromEither(fa));
};
/**
 * @function
 * @since 1.5.0
 */
exports.fromIO = function (fa) {
    return exports.right(Task_1.fromIO(fa));
};
/**
 * @function
 * @since 1.3.0
 */
exports.fromLeft = function (l) {
    return exports.fromEither(Either_1.left(l));
};
/**
 * @function
 * @since 1.6.0
 */
exports.fromIOEither = function (fa) {
    return new TaskEither(Task_1.fromIO(fa.value));
};
function fromPredicate(predicate, whenFalse) {
    var f = Either_1.fromPredicate(predicate, whenFalse);
    return function (a) { return exports.fromEither(f(a)); };
}
exports.fromPredicate = fromPredicate;
/**
 * @function
 * @since 1.9.0
 */
exports.getSemigroup = function (S) {
    var S2 = Task_1.getSemigroup(Either_1.getSemigroup(S));
    return {
        concat: function (x, y) { return new TaskEither(S2.concat(x.value, y.value)); }
    };
};
/**
 * @function
 * @since 1.9.0
 */
exports.getApplySemigroup = function (S) {
    var S2 = Task_1.getSemigroup(Either_1.getApplySemigroup(S));
    return {
        concat: function (x, y) { return new TaskEither(S2.concat(x.value, y.value)); }
    };
};
/**
 * @function
 * @since 1.9.0
 */
exports.getApplyMonoid = function (M) {
    return __assign({}, exports.getApplySemigroup(M), { empty: of(M.empty) });
};
/**
 * Transforms a `Promise` into a `TaskEither`, catching the possible error.
 *
 * @example
 * import { createHash } from 'crypto'
 * import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither'
 * import { createReadStream } from 'fs'
 * import { left } from 'fp-ts/lib/Either'
 *
 * const md5 = (path: string): TaskEither<string, string> => {
 *   const mkHash = (p: string) =>
 *     new Promise<string>((resolve, reject) => {
 *       const hash = createHash('md5')
 *       const rs = createReadStream(p)
 *       rs.on('error', (error: Error) => reject(error.message))
 *       rs.on('data', (chunk: string) => hash.update(chunk))
 *       rs.on('end', () => {
 *         return resolve(hash.digest('hex'))
 *       })
 *     })
 *   return tryCatch(() => mkHash(path), message => `cannot create md5 hash: ${String(message)}`)
 * }
 *
 * md5('foo')
 *   .run()
 *   .then(x => {
 *     assert.deepEqual(x, left(`cannot create md5 hash: ENOENT: no such file or directory, open 'foo'`))
 *   })
 *
 * @function
 * @since 1.0.0
 */
exports.tryCatch = function (f, onrejected) {
    return new TaskEither(Task_1.tryCatch(f, onrejected));
};
function taskify(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return new TaskEither(new Task_1.Task(function () {
            return new Promise(function (resolve) {
                var cbResolver = function (e, r) {
                    return e != null ? resolve(Either_1.left(e)) : resolve(Either_1.right(r));
                };
                f.apply(null, args.concat(cbResolver));
            });
        }));
    };
}
exports.taskify = taskify;
var fromTask = exports.right;
/**
 * Make sure that a resource is cleaned up in the event of an exception. The
 * release action is called regardless of whether the body action throws or
 * returns.
 * @function
 * @since 1.10.0
 */
exports.bracket = function (acquire, use, release) {
    return acquire.chain(function (a) {
        return use(a)
            .attempt()
            .chain(function (e) { return release(a, e).chain(function () { return e.fold(exports.fromLeft, exports.taskEither.of); }); });
    });
};
/**
 * @instance
 * @since 1.0.0
 */
exports.taskEither = {
    URI: exports.URI,
    bimap: bimap,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    alt: alt,
    fromIO: exports.fromIO,
    fromTask: fromTask
};
/**
 * Like {@link taskEither} but `ap` is sequential
 * @instance
 * @since 1.10.0
 */
exports.taskEitherSeq = __assign({}, exports.taskEither, { ap: function (fab, fa) { return fab.chain(function (f) { return fa.map(f); }); } });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Option_1 = require("./Option");
exports.URI = 'These';
var This = /** @class */ (function () {
    function This(value) {
        this.value = value;
        this._tag = 'This';
    }
    This.prototype.map = function (f) {
        return this;
    };
    This.prototype.bimap = function (f, g) {
        return new This(f(this.value));
    };
    This.prototype.reduce = function (b, f) {
        return b;
    };
    /** Applies a function to each case in the data structure */
    This.prototype.fold = function (this_, that, both) {
        return this_(this.value);
    };
    This.prototype.inspect = function () {
        return this.toString();
    };
    This.prototype.toString = function () {
        return "this_(" + function_1.toString(this.value) + ")";
    };
    /** Returns `true` if the these is `This`, `false` otherwise */
    This.prototype.isThis = function () {
        return true;
    };
    /** Returns `true` if the these is `That`, `false` otherwise */
    This.prototype.isThat = function () {
        return false;
    };
    /** Returns `true` if the these is `Both`, `false` otherwise */
    This.prototype.isBoth = function () {
        return false;
    };
    return This;
}());
exports.This = This;
var That = /** @class */ (function () {
    function That(value) {
        this.value = value;
        this._tag = 'That';
    }
    That.prototype.map = function (f) {
        return new That(f(this.value));
    };
    That.prototype.bimap = function (f, g) {
        return new That(g(this.value));
    };
    That.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    That.prototype.fold = function (this_, that, both) {
        return that(this.value);
    };
    That.prototype.inspect = function () {
        return this.toString();
    };
    That.prototype.toString = function () {
        return "that(" + function_1.toString(this.value) + ")";
    };
    That.prototype.isThis = function () {
        return false;
    };
    That.prototype.isThat = function () {
        return true;
    };
    That.prototype.isBoth = function () {
        return false;
    };
    return That;
}());
exports.That = That;
var Both = /** @class */ (function () {
    function Both(l, a) {
        this.l = l;
        this.a = a;
        this._tag = 'Both';
    }
    Both.prototype.map = function (f) {
        return new Both(this.l, f(this.a));
    };
    Both.prototype.bimap = function (f, g) {
        return new Both(f(this.l), g(this.a));
    };
    Both.prototype.reduce = function (b, f) {
        return f(b, this.a);
    };
    Both.prototype.fold = function (this_, that, both) {
        return both(this.l, this.a);
    };
    Both.prototype.inspect = function () {
        return this.toString();
    };
    Both.prototype.toString = function () {
        return "both(" + function_1.toString(this.l) + ", " + function_1.toString(this.a) + ")";
    };
    Both.prototype.isThis = function () {
        return false;
    };
    Both.prototype.isThat = function () {
        return false;
    };
    Both.prototype.isBoth = function () {
        return true;
    };
    return Both;
}());
exports.Both = Both;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (SL, SA) {
    return {
        equals: function (x, y) {
            return x.isThis()
                ? y.isThis() && SL.equals(x.value, y.value)
                : x.isThat()
                    ? y.isThat() && SA.equals(x.value, y.value)
                    : y.isBoth() && SL.equals(x.l, y.l) && SA.equals(x.a, y.a);
        }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (SL, SA) {
    return {
        concat: function (x, y) {
            return x.isThis()
                ? y.isThis()
                    ? exports.this_(SL.concat(x.value, y.value))
                    : y.isThat()
                        ? exports.both(x.value, y.value)
                        : exports.both(SL.concat(x.value, y.l), y.a)
                : x.isThat()
                    ? y.isThis()
                        ? exports.both(y.value, x.value)
                        : y.isThat()
                            ? exports.that(SA.concat(x.value, y.value))
                            : exports.both(y.l, SA.concat(x.value, y.a))
                    : y.isThis()
                        ? exports.both(SL.concat(x.l, y.value), x.a)
                        : y.isThat()
                            ? exports.both(x.l, SA.concat(x.a, y.value))
                            : exports.both(SL.concat(x.l, y.l), SA.concat(x.a, y.a));
        }
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new That(a);
};
var ap = function (S) { return function (fab, fa) {
    return chain(S)(fab, function (f) { return map(fa, f); });
}; };
var chain = function (S) { return function (fa, f) {
    if (fa.isThis()) {
        return exports.this_(fa.value);
    }
    else if (fa.isThat()) {
        return f(fa.value);
    }
    else {
        var fb = f(fa.a);
        return fb.isThis()
            ? exports.this_(S.concat(fa.l, fb.value))
            : fb.isThat()
                ? exports.both(fa.l, fb.value)
                : exports.both(S.concat(fa.l, fb.l), fb.a);
    }
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function (S) {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        of: of,
        ap: ap(S),
        chain: chain(S)
    };
};
var bimap = function (fla, f, g) {
    return fla.bimap(f, g);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.isThis() ? M.empty : fa.isThat() ? f(fa.value) : f(fa.a);
}; };
var foldr = function (fa, b, f) {
    return fa.isThis() ? b : fa.isThat() ? f(fa.value, b) : f(fa.a, b);
};
var traverse = function (F) { return function (ta, f) {
    return ta.isThis()
        ? F.of(exports.this_(ta.value))
        : ta.isThat()
            ? F.map(f(ta.value), exports.that)
            : F.map(f(ta.a), function (b) { return exports.both(ta.l, b); });
}; };
var sequence = function (F) { return function (ta) {
    return ta.isThis()
        ? F.of(exports.this_(ta.value))
        : ta.isThat()
            ? F.map(ta.value, exports.that)
            : F.map(ta.a, function (b) { return exports.both(ta.l, b); });
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.this_ = function (l) {
    return new This(l);
};
/**
 * @function
 * @since 1.0.0
 * @alias of
 */
exports.that = of;
/**
 * @function
 * @since 1.0.0
 */
exports.both = function (l, a) {
    return new Both(l, a);
};
/**
 * @function
 * @since 1.0.0
 */
exports.fromThese = function (defaultThis, defaultThat) { return function (fa) {
    return fa.isThis() ? [fa.value, defaultThat] : fa.isThat() ? [defaultThis, fa.value] : [fa.l, fa.a];
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.theseLeft = function (fa) {
    return fa.isThis() ? Option_1.some(fa.value) : fa.isThat() ? Option_1.none : Option_1.some(fa.l);
};
/**
 * @function
 * @since 1.0.0
 */
exports.theseRight = function (fa) {
    return fa.isThis() ? Option_1.none : fa.isThat() ? Option_1.some(fa.value) : Option_1.some(fa.a);
};
/**
 * Returns `true` if the these is an instance of `This`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isThis = function (fa) {
    return fa.isThis();
};
/**
 * Returns `true` if the these is an instance of `That`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isThat = function (fa) {
    return fa.isThat();
};
/**
 * Returns `true` if the these is an instance of `Both`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isBoth = function (fa) {
    return fa.isBoth();
};
/**
 * @instance
 * @since 1.0.0
 */
exports.these = {
    URI: exports.URI,
    map: map,
    bimap: bimap,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Adapted from https://github.com/garyb/purescript-debug
/**
 * Log any value to the console for debugging purposes and then return a value. This will log the value's underlying
 * representation for low-level debugging
 * @function
 * @since 1.0.0
 */
exports.trace = function (message, out) {
    console.log(message); // tslint:disable-line:no-console
    return out();
};
/**
 * Log any value and return it
 * @function
 * @since 1.0.0
 */
exports.spy = function (a) {
    return exports.trace(a, function () { return a; });
};
function traceA(F) {
    return function (x) { return exports.trace(x, function () { return F.of(undefined); }); };
}
exports.traceA = traceA;
function traceM(F) {
    return function (a) { return exports.trace(a, function () { return F.of(a); }); };
}
exports.traceM = traceM;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Foldable_1 = require("./Foldable");
var Functor_1 = require("./Functor");
function traverse(F, T) {
    return T.traverse(F);
}
exports.traverse = traverse;
function sequence(F, T) {
    return function (tfa) { return T.traverse(F)(tfa, function (fa) { return fa; }); };
}
exports.sequence = sequence;
function getTraversableComposition(F, G) {
    return __assign({}, Functor_1.getFunctorComposition(F, G), Foldable_1.getFoldableComposition(F, G), { traverse: function (H) {
            var traverseF = F.traverse(H);
            var traverseG = G.traverse(H);
            return function (fga, f) { return traverseF(fga, function (ga) { return traverseG(ga, f); }); };
        } });
}
exports.getTraversableComposition = getTraversableComposition;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Foldable2v_1 = require("./Foldable2v");
var Functor_1 = require("./Functor");
function getTraversableComposition(F, G) {
    return __assign({}, Functor_1.getFunctorComposition(F, G), Foldable2v_1.getFoldableComposition(F, G), { traverse: function (H) {
            var traverseF = F.traverse(H);
            var traverseG = G.traverse(H);
            return function (fga, f) { return traverseF(fga, function (ga) { return traverseG(ga, f); }); };
        }, sequence: function (H) {
            var sequenceF = F.sequence(H);
            var sequenceG = G.sequence(H);
            return function (fgha) { return sequenceF(F.map(fgha, sequenceG)); };
        } });
}
exports.getTraversableComposition = getTraversableComposition;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Array_1 = require("./Array");
var function_1 = require("./function");
exports.URI = 'Tree';
/**
 * Multi-way trees (aka rose trees) and forests, where a forest is
 *
 * ```ts
 * type Forest<A> = Array<Tree<A>>
 * ```
 *
 * @data
 * @constructor Tree
 * @since 1.6.0
 */
var Tree = /** @class */ (function () {
    function Tree(value, forest) {
        this.value = value;
        this.forest = forest;
    }
    Tree.prototype.map = function (f) {
        return new Tree(f(this.value), this.forest.map(function (tree) { return tree.map(f); }));
    };
    Tree.prototype.ap = function (fab) {
        var _this = this;
        return fab.chain(function (f) { return _this.map(f); }); // <- derived
    };
    /**
     * Flipped version of {@link ap}
     * @since 1.6.0
     */
    Tree.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Tree.prototype.chain = function (f) {
        var _a = f(this.value), value = _a.value, forest = _a.forest;
        return new Tree(value, function_1.concat(forest, this.forest.map(function (t) { return t.chain(f); })));
    };
    Tree.prototype.extract = function () {
        return this.value;
    };
    Tree.prototype.extend = function (f) {
        return new Tree(f(this), this.forest.map(function (t) { return t.extend(f); }));
    };
    Tree.prototype.reduce = function (b, f) {
        var r = f(b, this.value);
        var len = this.forest.length;
        for (var i = 0; i < len; i++) {
            r = this.forest[i].reduce(r, f);
        }
        return r;
    };
    Tree.prototype.inspect = function () {
        return this.toString();
    };
    Tree.prototype.toString = function () {
        return "new Tree(" + function_1.toString(this.value) + ", " + function_1.toString(this.forest) + ")";
    };
    return Tree;
}());
exports.Tree = Tree;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Tree(a, Array_1.empty);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
var extract = function (fa) {
    return fa.extract();
};
var extend = function (fa, f) {
    return fa.extend(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.reduce(M.empty, function (acc, a) { return M.concat(acc, f(a)); });
}; };
var foldr = function (fa, b, f) {
    var r = b;
    var len = fa.forest.length;
    for (var i = len - 1; i >= 0; i--) {
        r = foldr(fa.forest[i], r, f);
    }
    return f(fa.value, r);
};
function traverse(F) {
    var traverseF = Array_1.traverse(F);
    var r = function (ta, f) {
        return F.ap(F.map(f(ta.value), function (value) { return function (forest) { return new Tree(value, forest); }; }), traverseF(ta.forest, function (t) { return r(t, f); }));
    };
    return r;
}
function sequence(F) {
    var traverseF = traverse(F);
    return function (ta) { return traverseF(ta, function_1.identity); };
}
/**
 * @function
 * @since 1.6.0
 */
exports.getSetoid = function (S) {
    var SA;
    var R = {
        equals: function (x, y) { return S.equals(x.value, y.value) && SA.equals(x.forest, y.forest); }
    };
    SA = Array_1.getSetoid(R);
    return R;
};
/**
 * @instance
 * @since 1.6.0
 */
exports.tree = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence,
    extract: extract,
    extend: extend
};
var draw = function (indentation, forest) {
    var r = '';
    var len = forest.length;
    var tree;
    for (var i = 0; i < len; i++) {
        tree = forest[i];
        var isLast = i === len - 1;
        r += indentation + (isLast ? '└' : '├') + '─ ' + tree.value;
        r += draw(indentation + (len > 1 && !isLast ? '│  ' : '   '), tree.forest);
    }
    return r;
};
/**
 * Neat 2-dimensional drawing of a forest
 * @function
 * @since 1.6.0
 */
exports.drawForest = function (forest) {
    return draw('\n', forest);
};
/**
 * Neat 2-dimensional drawing of a tree
 *
 * @example
 * import { Tree, drawTree, tree } from 'fp-ts/lib/Tree'
 *
 * const fa = new Tree('a', [
 *   tree.of('b'),
 *   tree.of('c'),
 *   new Tree('d', [tree.of('e'), tree.of('f')])
 * ])
 *
 * assert.strictEqual(drawTree(fa), `a
 * ├─ b
 * ├─ c
 * └─ d
 *    ├─ e
 *    └─ f`)
 *
 * @function
 * @since 1.6.0
 */
exports.drawTree = function (tree) {
    return tree.value + exports.drawForest(tree.forest);
};
/**
 * Build a tree from a seed value
 * @function
 * @since 1.6.0
 */
exports.unfoldTree = function (b, f) {
    var _a = f(b), a = _a[0], bs = _a[1];
    return new Tree(a, exports.unfoldForest(bs, f));
};
/**
 * Build a tree from a seed value
 * @function
 * @since 1.6.0
 */
exports.unfoldForest = function (bs, f) {
    return bs.map(function (b) { return exports.unfoldTree(b, f); });
};
function unfoldTreeM(M) {
    var unfoldForestMM = unfoldForestM(M);
    return function (b, f) { return M.chain(f(b), function (_a) {
        var a = _a[0], bs = _a[1];
        return M.chain(unfoldForestMM(bs, f), function (ts) { return M.of(new Tree(a, ts)); });
    }); };
}
exports.unfoldTreeM = unfoldTreeM;
function unfoldForestM(M) {
    var traverseM = Array_1.traverse(M);
    var unfoldTree;
    return function (bs, f) {
        // tslint:disable-next-line
        if (unfoldTree === undefined) {
            unfoldTree = unfoldTreeM(M);
        }
        return traverseM(bs, function (b) { return unfoldTree(b, f); });
    };
}
exports.unfoldForestM = unfoldForestM;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Ord_1 = require("./Ord");
exports.URI = 'Tuple';
/**
 * @data
 * @constructor Tuple
 * @since 1.0.0
 */
var Tuple = /** @class */ (function () {
    function Tuple(fst, snd) {
        this.fst = fst;
        this.snd = snd;
    }
    Tuple.prototype.compose = function (ab) {
        return new Tuple(this.fst, ab.snd);
    };
    Tuple.prototype.map = function (f) {
        return new Tuple(this.fst, f(this.snd));
    };
    Tuple.prototype.bimap = function (f, g) {
        return new Tuple(f(this.fst), g(this.snd));
    };
    Tuple.prototype.extract = function () {
        return this.snd;
    };
    Tuple.prototype.extend = function (f) {
        return new Tuple(this.fst, f(this));
    };
    Tuple.prototype.reduce = function (b, f) {
        return f(b, this.snd);
    };
    /** Exchange the first and second components of a tuple */
    Tuple.prototype.swap = function () {
        return new Tuple(this.snd, this.fst);
    };
    Tuple.prototype.inspect = function () {
        return this.toString();
    };
    Tuple.prototype.toString = function () {
        return "new Tuple(" + function_1.toString(this.fst) + ", " + function_1.toString(this.snd) + ")";
    };
    Tuple.prototype.toTuple = function () {
        return [this.fst, this.snd];
    };
    return Tuple;
}());
exports.Tuple = Tuple;
var fst = function (fa) {
    return fa.fst;
};
var snd = function (fa) {
    return fa.snd;
};
var compose = function (bc, fa) {
    return fa.compose(bc);
};
var map = function (fa, f) {
    return fa.map(f);
};
var bimap = function (fla, f, g) {
    return fla.bimap(f, g);
};
var extract = snd;
var extend = function (fa, f) {
    return fa.extend(f);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return f(fa.snd);
}; };
var foldr = function (fa, b, f) {
    return f(fa.snd, b);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (SA, SB) {
    return {
        equals: function (x, y) { return SA.equals(x.fst, y.fst) && SB.equals(x.snd, y.snd); }
    };
};
/**
 * To obtain the result, the `fst`s are `compare`d, and if they are `EQ`ual, the
 * `snd`s are `compare`d.
 * @function
 * @since 1.0.0
 */
exports.getOrd = function (OL, OA) {
    return Ord_1.getSemigroup().concat(Ord_1.contramap(fst, OL), Ord_1.contramap(snd, OA));
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (SL, SA) {
    return {
        concat: function (x, y) { return new Tuple(SL.concat(x.fst, y.fst), SA.concat(x.snd, y.snd)); }
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (ML, MA) {
    return __assign({}, exports.getSemigroup(ML, MA), { empty: new Tuple(ML.empty, MA.empty) });
};
var ap = function (S) { return function (fab, fa) {
    return new Tuple(S.concat(fab.fst, fa.fst), fab.snd(fa.snd));
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getApply = function (S) {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        ap: ap(S)
    };
};
var of = function (M) { return function (a) {
    return new Tuple(M.empty, a);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getApplicative = function (M) {
    return __assign({}, exports.getApply(M), { of: of(M) });
};
var chain = function (S) { return function (fa, f) {
    var _a = f(fa.snd), fst = _a.fst, snd = _a.snd;
    return new Tuple(S.concat(fa.fst, fst), snd);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getChain = function (S) {
    return __assign({}, exports.getApply(S), { chain: chain(S) });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function (M) {
    return __assign({}, exports.getChain(M), { of: of(M) });
};
var chainRec = function (M) { return function (a, f) {
    var result = f(a);
    var acc = M.empty;
    while (result.snd.isLeft()) {
        acc = M.concat(acc, result.fst);
        result = f(result.snd.value);
    }
    return new Tuple(M.concat(acc, result.fst), result.snd.value);
}; };
/**
 * @function
 * @since 1.0.0
 */
exports.getChainRec = function (M) {
    return __assign({}, exports.getChain(M), { chainRec: chainRec(M) });
};
var traverse = function (F) { return function (ta, f) {
    return F.map(f(ta.snd), function (b) { return new Tuple(ta.fst, b); });
}; };
var sequence = function (F) { return function (ta) {
    return F.map(ta.snd, function (b) { return new Tuple(ta.fst, b); });
}; };
/**
 * @instance
 * @since 1.0.0
 */
exports.tuple = {
    URI: exports.URI,
    compose: compose,
    map: map,
    bimap: bimap,
    extract: extract,
    extend: extend,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unionize_1 = require("unionize");
const t = require("io-ts");
const io_ts_1 = require("./helpers/io-ts");
//
// Entities
//
// https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object
exports.User = t.interface({
    id_str: t.string,
    screen_name: t.string,
    time_zone: t.null,
});
exports.Tweet = t.interface({
    id_str: t.string,
    created_at: t.string,
    user: exports.User,
    text: t.string,
});
//
// Responses
//
exports.TwitterAPIErrorResponse = t.interface({
    errors: t.array(t.interface({
        code: t.number,
        message: t.string,
    })),
});
exports.TwitterAPIRequestTokenResponse = t.interface({
    oauth_token: t.string,
    oauth_token_secret: t.string,
    oauth_callback_confirmed: t.string,
});
exports.TwitterAPIAccessTokenResponse = t.interface({
    oauth_token: t.string,
    oauth_token_secret: t.string,
    user_id: t.string,
    screen_name: t.string,
});
exports.TwitterAPITimelineResponse = t.array(exports.Tweet);
exports.TwitterAPIAccountVerifyCredentials = exports.User;
exports.TwitterAPIAccountSettings = t.interface({
    time_zone: t.interface({
        name: t.string,
        tzinfo_name: t.string,
        utc_offset: t.number,
    }),
});
//
// Full responses (either success or error)
//
exports.ErrorResponse = unionize_1.unionize({
    JavaScriptError: unionize_1.ofType(),
    APIErrorResponse: unionize_1.ofType(),
    DecodeError: unionize_1.ofType(),
});
exports.StatusesHomeTimelineQuery = t.interface({
    count: io_ts_1.createOptionFromNullable(t.number),
    max_id: io_ts_1.createOptionFromNullable(t.string),
});
//# sourceMappingURL=types.js.map"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("./Option");
var Traversable_1 = require("./Traversable");
var function_1 = require("./function");
function replicate(U) {
    return function (a, n) {
        function step(n) {
            return n <= 0 ? Option_1.none : Option_1.option.of(function_1.tuple(a, n - 1));
        }
        return U.unfoldr(n, step);
    };
}
exports.replicate = replicate;
function empty(U) {
    return U.unfoldr(undefined, function_1.constant(Option_1.none));
}
exports.empty = empty;
function singleton(U) {
    var replicateU = replicate(U);
    return function (a) { return replicateU(a, 1); };
}
exports.singleton = singleton;
function replicateA(F, UT) {
    var sequenceFUT = Traversable_1.sequence(F, UT);
    var replicateUT = replicate(UT);
    return function (n, ma) { return sequenceFUT(replicateUT(ma, n)); };
}
exports.replicateA = replicateA;
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Validation';
var Failure = /** @class */ (function () {
    function Failure(value) {
        this.value = value;
        this._tag = 'Failure';
    }
    Failure.prototype.map = function (f) {
        return this;
    };
    Failure.prototype.bimap = function (f, g) {
        return new Failure(f(this.value));
    };
    Failure.prototype.reduce = function (b, f) {
        return b;
    };
    Failure.prototype.fold = function (failure, success) {
        return failure(this.value);
    };
    /** Returns the value from this `Success` or the given argument if this is a `Failure` */
    Failure.prototype.getOrElse = function (a) {
        return a;
    };
    /** Returns the value from this `Success` or the result of given argument if this is a `Failure` */
    Failure.prototype.getOrElseL = function (f) {
        return f(this.value);
    };
    Failure.prototype.mapFailure = function (f) {
        return new Failure(f(this.value));
    };
    Failure.prototype.swap = function () {
        return new Success(this.value);
    };
    Failure.prototype.inspect = function () {
        return this.toString();
    };
    Failure.prototype.toString = function () {
        return "failure(" + function_1.toString(this.value) + ")";
    };
    /** Returns `true` if the validation is an instance of `Failure`, `false` otherwise */
    Failure.prototype.isFailure = function () {
        return true;
    };
    /** Returns `true` if the validation is an instance of `Success`, `false` otherwise */
    Failure.prototype.isSuccess = function () {
        return false;
    };
    return Failure;
}());
exports.Failure = Failure;
var Success = /** @class */ (function () {
    function Success(value) {
        this.value = value;
        this._tag = 'Success';
    }
    Success.prototype.map = function (f) {
        return new Success(f(this.value));
    };
    Success.prototype.bimap = function (f, g) {
        return new Success(g(this.value));
    };
    Success.prototype.reduce = function (b, f) {
        return f(b, this.value);
    };
    Success.prototype.fold = function (failure, success) {
        return success(this.value);
    };
    Success.prototype.getOrElse = function (a) {
        return this.value;
    };
    Success.prototype.getOrElseL = function (f) {
        return this.value;
    };
    Success.prototype.mapFailure = function (f) {
        return this;
    };
    Success.prototype.swap = function () {
        return new Failure(this.value);
    };
    Success.prototype.inspect = function () {
        return this.toString();
    };
    Success.prototype.toString = function () {
        return "success(" + function_1.toString(this.value) + ")";
    };
    Success.prototype.isFailure = function () {
        return false;
    };
    Success.prototype.isSuccess = function () {
        return true;
    };
    return Success;
}());
exports.Success = Success;
/**
 * @function
 * @since 1.0.0
 */
exports.getSetoid = function (SL, SA) {
    return {
        equals: function (x, y) {
            return x.isFailure() ? y.isFailure() && SL.equals(x.value, y.value) : y.isSuccess() && SA.equals(x.value, y.value);
        }
    };
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Success(a);
};
/**
 * @example
 * import { Validation, success, failure, getApplicative } from 'fp-ts/lib/Validation'
 * import { getArraySemigroup } from 'fp-ts/lib/Semigroup'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 *
 * const person = (name: string) => (age: number): Person => ({ name, age })
 *
 * const validateName = (name: string): Validation<string[], string> =>
 *   name.length === 0 ? failure(['invalid name']) : success(name)
 *
 * const validateAge = (age: number): Validation<string[], number> =>
 *   age > 0 && age % 1 === 0 ? success(age) : failure(['invalid age'])
 *
 * const A = getApplicative(getArraySemigroup<string>())
 *
 * const validatePerson = (name: string, age: number): Validation<string[], Person> =>
 *   A.ap(A.map(validateName(name), person), validateAge(age))
 *
 * assert.deepEqual(validatePerson('Nicolas Bourbaki', 45), success({ "name": "Nicolas Bourbaki", "age": 45 }))
 * assert.deepEqual(validatePerson('Nicolas Bourbaki', -1), failure(["invalid age"]))
 * assert.deepEqual(validatePerson('', 0), failure(["invalid name", "invalid age"]))
 *
 * @function
 *
 * @since 1.0.0
 */
exports.getApplicative = function (S) {
    var ap = function (fab, fa) {
        return fab.isFailure()
            ? fa.isFailure()
                ? exports.failure(S.concat(fab.value, fa.value))
                : exports.failure(fab.value)
            : fa.isFailure()
                ? exports.failure(fa.value)
                : exports.success(fab.value(fa.value));
    };
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        of: of,
        ap: ap
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function (S) {
    var chain = function (fa, f) {
        return fa.isFailure() ? exports.failure(fa.value) : f(fa.value);
    };
    return __assign({}, exports.getApplicative(S), { chain: chain });
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    return fa.isFailure() ? M.empty : f(fa.value);
}; };
var foldr = function (fa, b, f) {
    return fa.isFailure() ? b : f(fa.value, b);
};
var traverse = function (F) { return function (ta, f) {
    return ta.isFailure() ? F.of(exports.failure(ta.value)) : F.map(f(ta.value), of);
}; };
var sequence = function (F) { return function (ta) {
    return ta.isFailure() ? F.of(exports.failure(ta.value)) : F.map(ta.value, of);
}; };
var bimap = function (fla, f, g) {
    return fla.bimap(f, g);
};
/**
 * @function
 * @since 1.0.0
 */
exports.failure = function (l) {
    return new Failure(l);
};
/**
 * @function
 * @since 1.0.0
 * @alias of
 */
exports.success = of;
function fromPredicate(predicate, f) {
    return function (a) { return (predicate(a) ? exports.success(a) : exports.failure(f(a))); };
}
exports.fromPredicate = fromPredicate;
/**
 * @function
 * @since 1.0.0
 */
exports.fromEither = function (e) {
    return e.isLeft() ? exports.failure(e.value) : exports.success(e.value);
};
/**
 * @function
 * @since 1.0.0
 */
exports.getSemigroup = function (SL, SA) {
    var concat = function (fx, fy) {
        return fx.isFailure()
            ? fy.isFailure()
                ? exports.failure(SL.concat(fx.value, fy.value))
                : exports.failure(fx.value)
            : fy.isFailure()
                ? exports.failure(fy.value)
                : exports.success(SA.concat(fx.value, fy.value));
    };
    return {
        concat: concat
    };
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonoid = function (SL, SA) {
    return __assign({}, exports.getSemigroup(SL, SA), { empty: exports.success(SA.empty) });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getAlt = function (S) {
    var alt = function (fx, fy) {
        return fx.isFailure() ? (fy.isFailure() ? exports.failure(S.concat(fx.value, fy.value)) : fy) : fx;
    };
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        alt: alt
    };
};
/**
 * Returns `true` if the validation is an instance of `Failure`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isFailure = function (fa) {
    return fa.isFailure();
};
/**
 * Returns `true` if the validation is an instance of `Success`, `false` otherwise
 * @function
 * @since 1.0.0
 */
exports.isSuccess = function (fa) {
    return fa.isSuccess();
};
/**
 * Builds {@link Compactable} instance for {@link Validation} given {@link Monoid} for the failure side
 * @function
 * @since 1.7.0
 */
function getCompactable(ML) {
    var compact = function (fa) {
        if (fa.isFailure()) {
            return fa;
        }
        if (fa.value.isNone()) {
            return exports.failure(ML.empty);
        }
        return exports.success(fa.value.value);
    };
    var separate = function (fa) {
        if (fa.isFailure()) {
            return {
                left: fa,
                right: fa
            };
        }
        if (fa.value.isLeft()) {
            return {
                left: exports.success(fa.value.value),
                right: exports.failure(ML.empty)
            };
        }
        return {
            left: exports.failure(ML.empty),
            right: exports.success(fa.value.value)
        };
    };
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        compact: compact,
        separate: separate
    };
}
exports.getCompactable = getCompactable;
/**
 * Builds {@link Filterable} instance for {@link Validation} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getFilterable(ML) {
    var C = getCompactable(ML);
    var partitionMap = function (fa, f) {
        if (fa.isFailure()) {
            return {
                left: fa,
                right: fa
            };
        }
        var e = f(fa.value);
        if (e.isLeft()) {
            return {
                left: exports.success(e.value),
                right: exports.failure(ML.empty)
            };
        }
        return {
            left: exports.failure(ML.empty),
            right: exports.success(e.value)
        };
    };
    var partition = function (fa, p) {
        if (fa.isFailure()) {
            return {
                left: fa,
                right: fa
            };
        }
        if (p(fa.value)) {
            return {
                left: exports.failure(ML.empty),
                right: exports.success(fa.value)
            };
        }
        return {
            left: exports.success(fa.value),
            right: exports.failure(ML.empty)
        };
    };
    var filterMap = function (fa, f) {
        if (fa.isFailure()) {
            return fa;
        }
        var optionB = f(fa.value);
        if (optionB.isSome()) {
            return exports.success(optionB.value);
        }
        return exports.failure(ML.empty);
    };
    var filter = function (fa, p) {
        if (fa.isFailure()) {
            return fa;
        }
        var a = fa.value;
        if (p(a)) {
            return exports.success(a);
        }
        return exports.failure(ML.empty);
    };
    return __assign({}, C, { map: map,
        partitionMap: partitionMap,
        filterMap: filterMap,
        partition: partition,
        filter: filter });
}
exports.getFilterable = getFilterable;
/**
 * Builds {@link Witherable} instance for {@link Validation} given {@link Monoid} for the left side
 * @function
 * @since 1.7.0
 */
function getWitherable(ML) {
    var filterableValidation = getFilterable(ML);
    var wither = function (F) {
        var traverseF = traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), filterableValidation.compact); };
    };
    var wilt = function (F) {
        var traverseF = traverse(F);
        return function (wa, f) { return F.map(traverseF(wa, f), filterableValidation.separate); };
    };
    return __assign({}, filterableValidation, { traverse: traverse,
        reduce: reduce,
        wither: wither,
        wilt: wilt });
}
exports.getWitherable = getWitherable;
/**
 * @instance
 * @since 1.0.0
 */
exports.validation = {
    URI: exports.URI,
    map: map,
    bimap: bimap,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
exports.URI = 'Writer';
/**
 * @data
 * @constructor Writer
 * @since 1.0.0
 */
var Writer = /** @class */ (function () {
    function Writer(run) {
        this.run = run;
    }
    Writer.prototype.eval = function () {
        return this.run()[0];
    };
    Writer.prototype.exec = function () {
        return this.run()[1];
    };
    Writer.prototype.map = function (f) {
        var _this = this;
        return new Writer(function () {
            var _a = _this.run(), a = _a[0], w = _a[1];
            return [f(a), w];
        });
    };
    return Writer;
}());
exports.Writer = Writer;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (M) { return function (a) {
    return new Writer(function () { return [a, M.empty]; });
}; };
var ap = function (S) { return function (fab, fa) {
    return new Writer(function () {
        var _a = fab.run(), f = _a[0], w1 = _a[1];
        var _b = fa.run(), a = _b[0], w2 = _b[1];
        return [f(a), S.concat(w1, w2)];
    });
}; };
var chain = function (S) { return function (fa, f) {
    return new Writer(function () {
        var _a = fa.run(), a = _a[0], w1 = _a[1];
        var _b = f(a).run(), b = _b[0], w2 = _b[1];
        return [b, S.concat(w1, w2)];
    });
}; };
/**
 * Appends a value to the accumulator
 * @function
 * @since 1.0.0
 */
exports.tell = function (w) {
    return new Writer(function () { return [undefined, w]; });
};
/**
 * Modifies the result to include the changes to the accumulator
 * @function
 * @since 1.3.0
 */
exports.listen = function (fa) {
    return new Writer(function () {
        var _a = fa.run(), a = _a[0], w = _a[1];
        return [function_1.tuple(a, w), w];
    });
};
/**
 * Applies the returned function to the accumulator
 * @function
 * @since 1.3.0
 */
exports.pass = function (fa) {
    return new Writer(function () {
        var _a = fa.run(), _b = _a[0], a = _b[0], f = _b[1], w = _a[1];
        return [a, f(w)];
    });
};
/**
 * Projects a value from modifications made to the accumulator during an action
 * @function
 * @since 1.3.0
 */
exports.listens = function (fa, f) {
    return new Writer(function () {
        var _a = fa.run(), a = _a[0], w = _a[1];
        return [function_1.tuple(a, f(w)), w];
    });
};
/**
 * Modify the final accumulator value by applying a function
 * @function
 * @since 1.3.0
 */
exports.censor = function (fa, f) {
    return new Writer(function () {
        var _a = fa.run(), a = _a[0], w = _a[1];
        return [a, f(w)];
    });
};
/**
 * @function
 * @since 1.0.0
 */
exports.getMonad = function (M) {
    return {
        URI: exports.URI,
        _L: function_1.phantom,
        map: map,
        of: of(M),
        ap: ap(M),
        chain: chain(M)
    };
};
/**
 * @instance
 * @since 1.0.0
 */
exports.writer = {
    URI: exports.URI,
    map: map
};
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Array_1 = require("./Array");
var function_1 = require("./function");
var Option_1 = require("./Option");
exports.URI = 'Zipper';
/**
 * Provides a pointed array, which is a non-empty zipper-like array structure that tracks an index (focus)
 * position in an array. Focus can be moved forward and backwards through the array.
 *
 * The array `[1, 2, 3, 4]` with focus on `3` is represented by `new Zipper([1, 2], 3, [4])`
 *
 * @data
 * @constructor Zipper
 * @since 1.9.0
 */
var Zipper = /** @class */ (function () {
    function Zipper(lefts, focus, rights) {
        this.lefts = lefts;
        this.focus = focus;
        this.rights = rights;
        this.length = lefts.length + 1 + rights.length;
    }
    /**
     * Update the focus in this zipper.
     * @since 1.9.0
     */
    Zipper.prototype.update = function (a) {
        return new Zipper(this.lefts, a, this.rights);
    };
    /**
     * Apply `f` to the focus and update with the result.
     * @since 1.9.0
     */
    Zipper.prototype.modify = function (f) {
        return this.update(f(this.focus));
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.toArray = function () {
        return Array_1.snoc(this.lefts, this.focus).concat(this.rights);
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.isOutOfBound = function (index) {
        return index < 0 || index >= this.length;
    };
    /**
     * Moves focus in the zipper, or `None` if there is no such element.
     * @since 1.9.0
     */
    Zipper.prototype.move = function (f) {
        var newIndex = f(this.lefts.length);
        if (this.isOutOfBound(newIndex)) {
            return Option_1.none;
        }
        else {
            return exports.fromArray(this.toArray(), newIndex);
        }
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.up = function () {
        return this.move(function_1.decrement);
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.down = function () {
        return this.move(function_1.increment);
    };
    /**
     * Moves focus to the start of the zipper.
     * @since 1.9.0
     */
    Zipper.prototype.start = function () {
        if (Array_1.isEmpty(this.lefts)) {
            return this;
        }
        else {
            return new Zipper(Array_1.empty, this.lefts[0], Array_1.snoc(Array_1.drop(1, this.lefts), this.focus).concat(this.rights));
        }
    };
    /**
     * Moves focus to the end of the zipper.
     * @since 1.9.0
     */
    Zipper.prototype.end = function () {
        var len = this.rights.length;
        if (len === 0) {
            return this;
        }
        else {
            return new Zipper(Array_1.snoc(this.lefts, this.focus).concat(Array_1.take(len - 1, this.rights)), this.rights[len - 1], Array_1.empty);
        }
    };
    /**
     * Inserts an element to the left of focus and focuses on the new element.
     * @since 1.9.0
     */
    Zipper.prototype.insertLeft = function (a) {
        return new Zipper(this.lefts, a, Array_1.cons(this.focus, this.rights));
    };
    /**
     * Inserts an element to the right of focus and focuses on the new element.
     * @since 1.9.0
     */
    Zipper.prototype.insertRight = function (a) {
        return new Zipper(Array_1.snoc(this.lefts, this.focus), a, this.rights);
    };
    /**
     * Deletes the element at focus and moves the focus to the left. If there is no element on the left,
     * focus is moved to the right.
     * @since 1.9.0
     */
    Zipper.prototype.deleteLeft = function () {
        var len = this.lefts.length;
        return exports.fromArray(this.lefts.concat(this.rights), len > 0 ? len - 1 : 0);
    };
    /**
     * Deletes the element at focus and moves the focus to the right. If there is no element on the right,
     * focus is moved to the left.
     * @since 1.9.0
     */
    Zipper.prototype.deleteRight = function () {
        var lenl = this.lefts.length;
        var lenr = this.rights.length;
        return exports.fromArray(this.lefts.concat(this.rights), lenr > 0 ? lenl : lenl - 1);
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.map = function (f) {
        return new Zipper(this.lefts.map(f), f(this.focus), this.rights.map(f));
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.ap = function (fab) {
        return new Zipper(Array_1.array.ap(fab.lefts, this.lefts), fab.focus(this.focus), Array_1.array.ap(fab.rights, this.rights));
    };
    /**
     * @since 1.9.0
     */
    Zipper.prototype.reduce = function (b, f) {
        return this.rights.reduce(f, f(this.lefts.reduce(f, b), this.focus));
    };
    Zipper.prototype.inspect = function () {
        return this.toString();
    };
    Zipper.prototype.toString = function () {
        return "new Zipper(" + function_1.toString(this.lefts) + ", " + function_1.toString(this.focus) + ", " + function_1.toString(this.rights) + ")";
    };
    return Zipper;
}());
exports.Zipper = Zipper;
/**
 * @function
 * @since 1.9.0
 */
exports.fromArray = function (as, focusIndex) {
    if (focusIndex === void 0) { focusIndex = 0; }
    if (Array_1.isEmpty(as) || Array_1.isOutOfBound(focusIndex, as)) {
        return Option_1.none;
    }
    else {
        return Option_1.some(new Zipper(Array_1.take(focusIndex, as), as[focusIndex], Array_1.drop(focusIndex + 1, as)));
    }
};
/**
 * @function
 * @since 1.9.0
 */
exports.fromNonEmptyArray = function (nea) {
    return new Zipper(Array_1.empty, nea.head, nea.tail);
};
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Zipper(Array_1.empty, a, Array_1.empty);
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var reduce = function (fa, b, f) {
    return fa.reduce(b, f);
};
var foldMap = function (M) { return function (fa, f) {
    var lefts = fa.lefts.reduce(function (acc, a) { return M.concat(acc, f(a)); }, M.empty);
    var rights = fa.rights.reduce(function (acc, a) { return M.concat(acc, f(a)); }, M.empty);
    return M.concat(M.concat(lefts, f(fa.focus)), rights);
}; };
var foldr = function (fa, b, f) {
    var rights = fa.rights.reduceRight(function (acc, a) { return f(a, acc); }, b);
    var focus = f(fa.focus, rights);
    return fa.lefts.reduceRight(function (acc, a) { return f(a, acc); }, focus);
};
function traverse(F) {
    var traverseF = Array_1.array.traverse(F);
    return function (ta, f) {
        return F.ap(F.ap(F.map(traverseF(ta.lefts, f), function (lefts) { return function (focus) { return function (rights) { return new Zipper(lefts, focus, rights); }; }; }), f(ta.focus)), traverseF(ta.rights, f));
    };
}
function sequence(F) {
    var sequenceF = Array_1.array.sequence(F);
    return function (ta) {
        return F.ap(F.ap(F.map(sequenceF(ta.lefts), function (lefts) { return function (focus) { return function (rights) { return new Zipper(lefts, focus, rights); }; }; }), ta.focus), sequenceF(ta.rights));
    };
}
var extract = function (fa) {
    return fa.focus;
};
var extend = function (fa, f) {
    var lefts = fa.lefts.map(function (a, i) {
        return f(new Zipper(Array_1.take(i, fa.lefts), a, Array_1.snoc(Array_1.drop(i + 1, fa.lefts), fa.focus).concat(fa.rights)));
    });
    var rights = fa.rights.map(function (a, i) {
        return f(new Zipper(Array_1.snoc(fa.lefts, fa.focus).concat(Array_1.take(i, fa.rights)), a, Array_1.drop(i + 1, fa.rights)));
    });
    return new Zipper(lefts, f(fa), rights);
};
/**
 * @function
 * @since 1.9.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) { return new Zipper(x.lefts.concat(y.lefts), S.concat(x.focus, y.focus), x.rights.concat(y.rights)); }
    };
};
/**
 * @function
 * @since 1.9.0
 */
exports.getMonoid = function (M) {
    return __assign({}, exports.getSemigroup(M), { empty: new Zipper(Array_1.empty, M.empty, Array_1.empty) });
};
/**
 * @instance
 * @since 1.9.0
 */
exports.zipper = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    extend: extend,
    extract: extract,
    reduce: reduce,
    foldMap: foldMap,
    foldr: foldr,
    traverse: traverse,
    sequence: sequence
};
